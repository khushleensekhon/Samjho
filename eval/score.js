// Scoring for the evaluation set. Kept separate so it can be unit tested.

export function parseCSV(text) {
  const rows = [];
  let row = [], cell = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') inQ = false;
      else cell += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some((x) => x.trim() !== '')) rows.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell);
  if (row.some((x) => x.trim() !== '')) rows.push(row);
  const [head, ...body] = rows;
  const keys = head.map((h) => h.trim().toLowerCase());
  return body.map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? '').trim()])));
}

const blank = (v) => v === undefined || v === null || v === '' || v === '-';
const yes = (v) => /^(y|yes|true|1|scam)$/i.test(String(v).trim());

// Compare one model result with one human label row.
export function scoreRow(label, result) {
  const expectedAmount = blank(label.amount) ? null : Number(String(label.amount).replace(/[^\d.]/g, ''));
  const expectedDeadline = blank(label.deadline) ? null : label.deadline;
  const predictedScam = result.scam_risk === 'high' || result.scam_risk === 'medium';
  return {
    category: blank(label.category) ? null : label.category === result.category,
    amount: expectedAmount === result.amount,
    deadline: expectedDeadline === result.deadline,
    scam: yes(label.scam) === predictedScam,
    scamExpected: yes(label.scam),
    scamPredicted: predictedScam,
  };
}

export function aggregate(scores) {
  const acc = (key) => {
    const vals = scores.map((s) => s[key]).filter((v) => v !== null);
    return vals.length ? { correct: vals.filter(Boolean).length, total: vals.length } : null;
  };
  const tp = scores.filter((s) => s.scamExpected && s.scamPredicted).length;
  const fn = scores.filter((s) => s.scamExpected && !s.scamPredicted).length;
  const fp = scores.filter((s) => !s.scamExpected && s.scamPredicted).length;
  return {
    category: acc('category'),
    amount: acc('amount'),
    deadline: acc('deadline'),
    scam: acc('scam'),
    scamRecall: tp + fn ? { correct: tp, total: tp + fn } : null,
    falseAlarms: fp,
  };
}
