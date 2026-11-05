import { todayISO } from './dates.js';

let healthPromise;
export function aiAvailable() {
  healthPromise ??= fetch('./api/health')
    .then((r) => (r.ok ? r.json() : { ai: false }))
    .then((j) => !!j.ai)
    .catch(() => false);
  return healthPromise;
}

export async function explain({ base64, mimeType, lang }) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 60000);
  try {
    const res = await fetch('./api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64, mimeType, lang, today: todayISO() }),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}
