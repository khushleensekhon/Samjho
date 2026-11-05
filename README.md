# Samjho (ਸਮਝੋ · समझो)

**Point your phone at any official paper. Know what it means and what to do.**

Samjho reads a photo of a bill, bank letter, government notice, school notice or SMS, and explains it in simple **Punjabi, Hindi or English**: what it is, what you need to do, how much, by when, and whether it looks like a scam. It can read the answer aloud, add a reminder, and send it to a family member on WhatsApp.

**Try it:** [khushleensekhon.github.io/Samjho](https://khushleensekhon.github.io/Samjho/) (demo with example papers)

## The problem

In many Indian families, one person reads the paperwork for everyone else. Parents and grandparents receive bills, bank letters and notices written in formal English. They often can't tell:

- what the paper is, or whether it matters,
- whether they need to pay, how much, and by when,
- whether it is a real notice or a scam.

So papers wait until a son or daughter comes home, deadlines get missed, and scam messages get believed. **Translation apps translate words. Samjho explains what the paper means for you and what to do next.**

## What it does

| | |
| --- | --- |
| 📷 **Photo in, plain answer out** | One photo, one screen: *What is this? What do I need to do? Amount. By when. What happens if I miss it.* |
| 🗣️ **Your language, read aloud** | Punjabi, Hindi or English, written for people new to paperwork. A *Listen* button reads it out. |
| ⚠️ **Scam check on every paper** | Flags OTP or PIN requests, fake KYC threats, suspicious links and advance fees, explains why, and points to the 1930 cyber crime helpline. |
| ⏰ **Never miss a deadline** | One tap adds a reminder two days before. *My papers* lists upcoming deadlines. |
| 💬 **Ask family** | Sends the photo and summary to a family member on WhatsApp. |
| 🤔 **Honest when unsure** | Shows low confidence and unreadable parts, and tells the user to ask a trusted person rather than guessing. |

## How it works

```
Phone camera ──► resize to 1800px JPEG in the browser
             ──► /api/explain (Vercel function, holds the API key)
             ──► Gemini (multimodal) with a structured JSON schema
             ──► validated result ──► UI, voice, reminder, WhatsApp share
```

- **Frontend:** React + Vite, mobile-first, large type and buttons.
- **AI:** Gemini reads the image and returns structured output (`category`, `amount`, `deadline`, `scam_risk`, `scam_reasons`, `confidence` and more) defined in [`lib/explain.js`](lib/explain.js). The server validates every field, so odd model output cannot break the app.
- **Safety:** account, card, Aadhaar and phone numbers are masked to the last 4 digits; legal and medical papers always tell the user to confirm with someone.
- **Privacy:** photos are processed in memory and never stored. Saved papers and usage stats stay on the phone (local storage).
- **Resilience:** if a Gemini model name is retired, the server falls back to the next available model.

## Measuring quality

- [`eval/`](eval/) contains a script that runs Samjho over a labelled set of real household documents and reports accuracy for document type, amount, deadline and scam detection, plus missed scams and false alarms. See [`eval/README.md`](eval/README.md).
- Users can mark each answer as correct or not, and a **For researchers** screen shows usage metrics from test sessions with CSV export.

## Run it yourself

```bash
npm install
cp .env.example .env        # add a free key from https://aistudio.google.com/apikey
npm test                    # unit tests
npm run dev                 # UI only (example papers)
npx vercel dev              # UI + AI functions locally
```

## Deploy

- **Vercel (full app with AI):** import this repo at vercel.com/new and add the `GEMINI_API_KEY` environment variable. No other settings are needed.
- **GitHub Pages (demo with example papers):** `npm run deploy:pages`

## Project structure

```
src/App.jsx              home, upload flow, saved papers
src/screens/Result.jsx   the explanation screen
src/screens/Research.jsx usage metrics for user testing
src/samples.js           example papers (fictional organisations and people)
src/dates.js             deadlines and reminders (unit tested)
lib/explain.js           Gemini prompt, response schema, validation
api/explain.js           Vercel serverless function
eval/                    accuracy evaluation on real documents
tests/                   node:test unit tests
```

## Limitations and next steps

- Handwritten papers and very poor photos are hard to read; the app asks for a retake.
- Gurmukhi speech depends on the phone's voices; it falls back to Hindi voice if needed.
- Next: multi-page documents, a WhatsApp bot (no app install), and more languages.

---

Samjho is an independent student project and is not affiliated with any bank, utility or government body. It can make mistakes and is not legal, medical or financial advice.

Built by [Khushleen Kaur Sekhon](https://www.linkedin.com/in/khushleensekhon/).
