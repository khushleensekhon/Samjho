// Everything stays on the phone (localStorage). Photos are never stored.
const PAPERS = 'samjho.papers.v1';
const EVENTS = 'samjho.events.v1';

function read(key, fallback) {
  try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch { return fallback; }
}
function write(key, v) {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* storage unavailable */ }
}

export const getPref = (k, d) => read('samjho.' + k, d);
export const setPref = (k, v) => write('samjho.' + k, v);

export function savePaper(entry) {
  const list = read(PAPERS, []).filter((p) => p.id !== entry.id);
  list.unshift(entry);
  write(PAPERS, list.slice(0, 50));
}
export const getPapers = () => read(PAPERS, []);
export const removePaper = (id) => write(PAPERS, read(PAPERS, []).filter((p) => p.id !== id));

// Usage log for user-testing sessions.
export function track(type, data = {}) {
  const ev = read(EVENTS, []);
  ev.push({ t: new Date().toISOString(), type, ...data });
  write(EVENTS, ev.slice(-5000));
}
export const allEvents = () => read(EVENTS, []);
export const clearEvents = () => write(EVENTS, []);

export function summary() {
  const ev = allEvents();
  const n = (type, f = () => true) => ev.filter((e) => e.type === type && f(e)).length;
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : null);
  const real = (e) => !e.sample;
  const ok = n('feedback', (e) => e.correct && real(e));
  const bad = n('feedback', (e) => !e.correct && real(e));
  return {
    sessions: n('session_start'),
    papers: n('explained', real),
    samples: n('explained', (e) => e.sample),
    failures: n('explain_failed'),
    scams: n('explained', (e) => real(e) && (e.scam === 'high' || e.scam === 'medium')),
    withDeadline: n('explained', (e) => real(e) && e.deadline),
    listened: n('listen'),
    reminders: n('reminder'),
    shared: n('share'),
    feedbackYes: ok,
    feedbackNo: bad,
    correctRate: pct(ok, ok + bad),
  };
}

export function toCSV() {
  const ev = allEvents();
  const keys = [...new Set(ev.flatMap((e) => Object.keys(e)))];
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return [keys.join(','), ...ev.map((e) => keys.map((k) => esc(e[k])).join(','))].join('\n');
}
