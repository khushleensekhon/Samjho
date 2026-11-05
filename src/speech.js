const LOCALES = { en: 'en-IN', hi: 'hi-IN', pa: 'pa-IN' };

export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

export function speak(text, lang, onEnd) {
  if (!canSpeak()) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const want = LOCALES[lang];
  // Punjabi voices are rare on phones; fall back to Hindi, then any Indian voice.
  const voice =
    voices.find((v) => v.lang === want) ||
    (lang === 'pa' && voices.find((v) => v.lang === 'hi-IN')) ||
    voices.find((v) => v.lang.endsWith('-IN'));
  if (voice) u.voice = voice;
  u.lang = voice?.lang || want;
  u.rate = 0.9;
  u.onend = onEnd;
  u.onerror = onEnd;
  window.speechSynthesis.speak(u);
}

export const stopSpeaking = () => canSpeak() && window.speechSynthesis.cancel();
