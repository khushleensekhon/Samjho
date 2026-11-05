// Core of Samjho: send a photo of a document to Gemini and get back a
// structured, plain-language explanation. Shared by the Vercel function
// (api/explain.js) and the offline evaluation script (eval/run-eval.mjs).

export const CATEGORIES = [
  'bill', 'bank', 'government', 'school', 'medical', 'insurance', 'legal', 'message', 'other',
];
export const SCAM_LEVELS = ['none', 'low', 'medium', 'high'];

const LANG_NAMES = { en: 'simple English', hi: 'simple Hindi (Devanagari script)', pa: 'simple Punjabi (Gurmukhi script)' };

// Gemini structured-output schema (OpenAPI subset).
export const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    readable: { type: 'BOOLEAN', description: 'false if the image is not a document/message or is too blurry to read' },
    category: { type: 'STRING', enum: CATEGORIES },
    doc_type: { type: 'STRING', description: 'Short name, e.g. "Electricity bill"' },
    issuer: { type: 'STRING', nullable: true, description: 'Who sent it, as printed' },
    summary: { type: 'STRING', description: '2-3 short sentences: what this is and what it means for the reader' },
    action_needed: { type: 'BOOLEAN' },
    action: { type: 'STRING', nullable: true, description: 'One short instruction, e.g. "Pay the bill"' },
    amount: { type: 'NUMBER', nullable: true, description: 'Main amount to pay or receive, in rupees, digits only' },
    deadline: { type: 'STRING', nullable: true, description: 'YYYY-MM-DD of the main deadline' },
    consequence: { type: 'STRING', nullable: true, description: 'What happens if the deadline is missed' },
    scam_risk: { type: 'STRING', enum: SCAM_LEVELS },
    scam_reasons: { type: 'ARRAY', items: { type: 'STRING' } },
    key_details: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: { label: { type: 'STRING' }, value: { type: 'STRING' } },
        required: ['label', 'value'],
      },
    },
    confidence: { type: 'STRING', enum: ['high', 'medium', 'low'] },
    unclear: { type: 'STRING', nullable: true, description: 'Anything that could not be read or understood' },
    speak_text: { type: 'STRING', description: 'What to read aloud: 3-4 short spoken sentences' },
  },
  required: [
    'readable', 'category', 'doc_type', 'summary', 'action_needed', 'scam_risk',
    'scam_reasons', 'key_details', 'confidence', 'speak_text',
  ],
};

export function buildPrompt(lang, today) {
  return `You are Samjho, a patient helper for people in India who are new to official paperwork and digital services, often older parents or grandparents. They have photographed a document or message (a bill, bank letter, government notice, school notice, medical or insurance paper, legal paper, or an SMS/WhatsApp message).

Explain it so a person who has never studied this kind of paper understands exactly what it means for them and what to do.

Rules:
- Write every text field in ${LANG_NAMES[lang] || LANG_NAMES.en}. Keep numbers as digits. Short sentences, everyday words, no jargon. If you must use an English term printed on the paper (like "KYC" or "due date"), explain it.
- Today's date is ${today}. "deadline" is the single most important date by which the reader must act, as YYYY-MM-DD. If the paper shows only a day and month, pick the next such date after today.
- "amount" is the main amount the reader must pay (or will receive), in rupees as a number. Use the amount payable by the deadline, not the late amount.
- Only state what is printed or clearly implied. Never invent amounts, dates or names. If something is unclear, lower "confidence" and say what is unclear in "unclear".
- Privacy: in key_details, mask account, card, Aadhaar and phone numbers so only the last 4 digits show (e.g. XXXX1234).
- Scam check: set scam_risk to "high" if it asks for an OTP, PIN, password, card number, screen-sharing app, payment to "receive" money, an advance fee, or uses threats like immediate arrest or account blocking with a link to click. Real banks and government offices never ask for OTP or PIN. Give each reason as one simple sentence. If nothing is suspicious, use "none" and an empty list.
- key_details: up to 5 facts the reader may need (e.g. bill number, consumer name, meeting date). Use short labels.
- speak_text: what a caring family member would say out loud, in 3-4 short sentences: what it is, what to do, by when, and any warning.
- If the image is not a document or message, or is too blurry, set readable to false and say in summary what to do (e.g. take the photo again in good light).
- This is not legal or medical advice. For legal, medical or high-value matters, the action should include asking a trusted person or the office directly.`;
}

async function callModel({ model, key, base64, mimeType, lang, today, fetchImpl }) {
  const res = await fetchImpl(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [
            { inline_data: { mime_type: mimeType, data: base64 } },
            { text: buildPrompt(lang, today) },
          ],
        }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
        },
      }),
    },
  );
  if (!res.ok) {
    const err = new Error(`Gemini HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '';
  if (!text) throw new Error('Empty response from Gemini');
  return JSON.parse(text);
}

export async function explainDocument({
  base64, mimeType, lang = 'en', today = new Date().toISOString().slice(0, 10),
  key = process.env.GEMINI_API_KEY, model = process.env.GEMINI_MODEL, fetchImpl = fetch,
}) {
  if (!key) throw new Error('GEMINI_API_KEY is not set');
  // Try the configured model first, then stable fallbacks (model names get retired).
  const models = [...new Set([model, 'gemini-flash-latest', 'gemini-2.5-flash'].filter(Boolean))];
  let lastErr;
  for (const m of models) {
    try {
      return normalise(await callModel({ model: m, key, base64, mimeType, lang, today, fetchImpl }));
    } catch (e) {
      lastErr = e;
      if (e.status !== 404) break; // only fall through when the model name is unknown
    }
  }
  throw lastErr;
}

// Defensive clean-up so the UI never has to deal with odd model output.
export function normalise(r) {
  const str = (v) => (typeof v === 'string' && v.trim() ? v.trim() : null);
  const amount = typeof r.amount === 'number' && r.amount > 0 ? Math.round(r.amount * 100) / 100 : null;
  const deadline = /^\d{4}-\d{2}-\d{2}$/.test(r.deadline || '') ? r.deadline : null;
  return {
    readable: r.readable !== false,
    category: CATEGORIES.includes(r.category) ? r.category : 'other',
    doc_type: str(r.doc_type) || '',
    issuer: str(r.issuer),
    summary: str(r.summary) || '',
    action_needed: !!r.action_needed,
    action: str(r.action),
    amount,
    deadline,
    consequence: str(r.consequence),
    scam_risk: SCAM_LEVELS.includes(r.scam_risk) ? r.scam_risk : 'none',
    scam_reasons: Array.isArray(r.scam_reasons) ? r.scam_reasons.filter((x) => typeof x === 'string').slice(0, 5) : [],
    key_details: Array.isArray(r.key_details)
      ? r.key_details.filter((d) => d && d.label && d.value).slice(0, 5).map((d) => ({ label: String(d.label), value: String(d.value) }))
      : [],
    confidence: ['high', 'medium', 'low'].includes(r.confidence) ? r.confidence : 'medium',
    unclear: str(r.unclear),
    speak_text: str(r.speak_text) || str(r.summary) || '',
  };
}
