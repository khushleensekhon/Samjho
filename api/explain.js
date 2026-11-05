// Vercel serverless function. The Gemini key lives only on the server.
// Photos are processed in memory and never stored.
import { explainDocument } from '../lib/explain.js';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'];
const MAX_BASE64 = 4_000_000; // stays under Vercel's 4.5 MB request limit

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const { image, mimeType, lang, today } = body;

  if (typeof image !== 'string' || !image || image.length > MAX_BASE64)
    return res.status(400).json({ error: 'image_missing_or_too_large' });
  if (!ALLOWED.includes(mimeType)) return res.status(400).json({ error: 'unsupported_type' });
  const safeLang = ['en', 'hi', 'pa'].includes(lang) ? lang : 'en';
  const safeToday = /^\d{4}-\d{2}-\d{2}$/.test(today || '') ? today : undefined;

  try {
    const result = await explainDocument({ base64: image, mimeType, lang: safeLang, today: safeToday });
    return res.status(200).json(result);
  } catch (e) {
    console.error('explain failed:', e.message);
    return res.status(502).json({ error: 'ai_unavailable' });
  }
}
