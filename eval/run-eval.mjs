#!/usr/bin/env node
// Measure how accurate Samjho is on real documents.
//
// 1. Put photos in eval/docs/ (blur names, account numbers, Aadhaar first).
// 2. Fill eval/labels.csv: what a careful human reads on each paper.
// 3. Run: GEMINI_API_KEY=... npm run eval
//
// Prints accuracy for document type, amount, deadline and scam detection,
// and writes every prediction to eval/results-<date>.csv for error analysis.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { explainDocument } from '../lib/explain.js';
import { parseCSV, scoreRow, aggregate } from './score.js';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

// Load .env without extra dependencies.
const envPath = join(root, '.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const labelsPath = process.argv[2] || join(here, 'labels.csv');
const docsDir = process.argv[3] || join(here, 'docs');
const lang = process.env.EVAL_LANG || 'en';
const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.pdf': 'application/pdf' };

const labels = parseCSV(readFileSync(labelsPath, 'utf8')).filter((r) => r.file && !r.file.startsWith('#'));
if (!labels.length) {
  console.error(`No rows in ${labelsPath}. Add one row per document (see eval/README.md).`);
  process.exit(1);
}

const scores = [];
const out = [['file', 'expected_category', 'got_category', 'expected_amount', 'got_amount', 'expected_deadline', 'got_deadline', 'expected_scam', 'got_scam_risk', 'confidence', 'ms', 'error']];

for (const [i, label] of labels.entries()) {
  const path = join(docsDir, label.file);
  const mimeType = MIME[extname(path).toLowerCase()];
  process.stdout.write(`[${i + 1}/${labels.length}] ${label.file} … `);
  if (!existsSync(path) || !mimeType) {
    console.log('skipped (file missing or unsupported type)');
    continue;
  }
  const started = Date.now();
  try {
    const result = await explainDocument({
      base64: readFileSync(path).toString('base64'), mimeType, lang, today: label.today || undefined,
    });
    const s = scoreRow(label, result);
    scores.push(s);
    const marks = ['category', 'amount', 'deadline', 'scam'].map((k) => `${k}:${s[k] === null ? '-' : s[k] ? '✓' : '✗'}`).join(' ');
    console.log(marks);
    out.push([label.file, label.category, result.category, label.amount, result.amount ?? '', label.deadline, result.deadline ?? '', label.scam, result.scam_risk, result.confidence, Date.now() - started, '']);
  } catch (e) {
    console.log('ERROR', e.message);
    out.push([label.file, label.category, '', label.amount, '', label.deadline, '', label.scam, '', '', Date.now() - started, e.message]);
  }
}

const a = aggregate(scores);
const pct = (x) => (x ? `${Math.round((x.correct / x.total) * 100)}%  (${x.correct}/${x.total})` : 'n/a');
console.log('\n=== Samjho evaluation ===');
console.log(`Documents scored : ${scores.length}`);
console.log(`Document type    : ${pct(a.category)}`);
console.log(`Amount           : ${pct(a.amount)}`);
console.log(`Deadline         : ${pct(a.deadline)}`);
console.log(`Scam (overall)   : ${pct(a.scam)}`);
console.log(`Scams caught     : ${pct(a.scamRecall)}`);
console.log(`False alarms     : ${a.falseAlarms}`);

const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const file = join(here, `results-${new Date().toISOString().slice(0, 10)}.csv`);
writeFileSync(file, out.map((r) => r.map(esc).join(',')).join('\n'));
console.log(`\nDetailed results: ${file}`);
