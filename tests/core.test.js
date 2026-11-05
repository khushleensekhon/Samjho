import { test } from 'node:test';
import assert from 'node:assert/strict';
import { daysUntil, reminderDate, googleCalendarUrl, icsFile, todayISO } from '../src/dates.js';
import { explainDocument, normalise, RESPONSE_SCHEMA } from '../lib/explain.js';
import { parseCSV, scoreRow, aggregate } from '../eval/score.js';
import { getSamples } from '../src/samples.js';

const NOW = new Date(2026, 10, 5); // 5 Nov 2026

test('daysUntil counts calendar days', () => {
  assert.equal(daysUntil('2026-11-05', NOW), 0);
  assert.equal(daysUntil('2026-11-18', NOW), 13);
  assert.equal(daysUntil('2026-11-01', NOW), -4);
  assert.equal(daysUntil('2027-01-01', NOW), 57);
});

test('reminder is two days before, never in the past', () => {
  assert.equal(reminderDate('2026-11-18', NOW), '2026-11-16');
  assert.equal(reminderDate('2026-11-06', NOW), todayISO(NOW));
});

test('calendar link and ics file contain the reminder date', () => {
  const url = googleCalendarUrl({ title: 'Pay bill', details: 'x', deadline: '2026-11-18', now: NOW });
  assert.match(url, /dates=20261116%2F20261117/);
  const ics = icsFile({ title: 'Pay bill; now', details: 'a,b', deadline: '2026-11-18', now: NOW });
  assert.match(ics, /DTSTART;VALUE=DATE:20261116/);
  assert.match(ics, /SUMMARY:Pay bill\\; now/);
});

test('normalise cleans odd model output', () => {
  const r = normalise({
    readable: true, category: 'weird', doc_type: ' Bill ', summary: 's', action_needed: 1,
    amount: -5, deadline: '18/11/2026', scam_risk: 'extreme', scam_reasons: ['a', 3],
    key_details: [{ label: 'A', value: 'B' }, { label: '', value: 'x' }], confidence: '??', speak_text: '',
  });
  assert.equal(r.category, 'other');
  assert.equal(r.doc_type, 'Bill');
  assert.equal(r.amount, null);
  assert.equal(r.deadline, null);
  assert.equal(r.scam_risk, 'none');
  assert.deepEqual(r.scam_reasons, ['a']);
  assert.equal(r.key_details.length, 1);
  assert.equal(r.confidence, 'medium');
  assert.equal(r.speak_text, 's');
});

function fakeGemini(responses) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, body: JSON.parse(init.body), headers: init.headers });
    const next = responses.shift();
    if (next.status) return { ok: false, status: next.status, json: async () => ({}) };
    return { ok: true, status: 200, json: async () => ({ candidates: [{ content: { parts: [{ text: JSON.stringify(next) }] } }] }) };
  };
  return { fetchImpl, calls };
}

const GOOD = {
  readable: true, category: 'bill', doc_type: 'Electricity bill', summary: 'Pay it.', action_needed: true,
  action: 'Pay', amount: 2340, deadline: '2026-11-18', scam_risk: 'none', scam_reasons: [], key_details: [],
  confidence: 'high', speak_text: 'Pay it.',
};

test('sends the image, prompt and schema to Gemini', async () => {
  const { fetchImpl, calls } = fakeGemini([GOOD]);
  const r = await explainDocument({ base64: 'QUJD', mimeType: 'image/jpeg', lang: 'pa', today: '2026-11-05', key: 'k', model: 'm1', fetchImpl });
  assert.equal(r.amount, 2340);
  const body = calls[0].body;
  assert.match(calls[0].url, /models\/m1:generateContent$/);
  assert.equal(calls[0].headers['x-goog-api-key'], 'k');
  assert.equal(body.contents[0].parts[0].inline_data.data, 'QUJD');
  assert.match(body.contents[0].parts[1].text, /Punjabi \(Gurmukhi/);
  assert.match(body.contents[0].parts[1].text, /2026-11-05/);
  assert.deepEqual(body.generationConfig.responseSchema, RESPONSE_SCHEMA);
});

test('falls back to the next model when one is retired (404)', async () => {
  const { fetchImpl, calls } = fakeGemini([{ status: 404 }, GOOD]);
  const r = await explainDocument({ base64: 'x', mimeType: 'image/png', key: 'k', model: 'old-model', fetchImpl });
  assert.equal(r.category, 'bill');
  assert.equal(calls.length, 2);
  assert.match(calls[1].url, /gemini-flash-latest/);
});

test('does not retry on other errors', async () => {
  const { fetchImpl, calls } = fakeGemini([{ status: 429 }, GOOD]);
  await assert.rejects(explainDocument({ base64: 'x', mimeType: 'image/png', key: 'k', fetchImpl }));
  assert.equal(calls.length, 1);
});

test('evaluation scoring', () => {
  const rows = parseCSV('file,category,amount,deadline,scam\n"a, b.jpg",bill,"2,340",2026-11-18,no\nb.png,message,,,yes\n');
  assert.equal(rows[0].file, 'a, b.jpg');
  const s1 = scoreRow(rows[0], { category: 'bill', amount: 2340, deadline: '2026-11-18', scam_risk: 'none' });
  const s2 = scoreRow(rows[1], { category: 'message', amount: null, deadline: null, scam_risk: 'low' });
  assert.deepEqual([s1.category, s1.amount, s1.deadline, s1.scam], [true, true, true, true]);
  assert.equal(s2.scam, false); // a real scam that was missed
  const a = aggregate([s1, s2]);
  assert.deepEqual(a.scam, { correct: 1, total: 2 });
  assert.deepEqual(a.scamRecall, { correct: 0, total: 1 });
  assert.equal(a.falseAlarms, 0);
});

test('sample results are complete in every language', () => {
  for (const s of getSamples(NOW)) {
    for (const lang of ['en', 'hi', 'pa']) {
      const r = s.result(lang);
      for (const k of ['doc_type', 'summary', 'speak_text']) assert.ok(r[k], `${s.id} ${lang} ${k}`);
      assert.ok(s.title[lang]);
      r.key_details.forEach((d) => assert.ok(d.label && d.value, `${s.id} ${lang} detail`));
    }
    assert.match(s.image, /^data:image\/svg\+xml/);
  }
});
