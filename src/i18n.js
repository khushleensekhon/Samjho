export const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
  { code: 'hi', label: 'हिंदी' },
];

const S = {
  tagline: {
    en: 'Understand any official paper',
    hi: 'कोई भी सरकारी या ज़रूरी कागज़ समझें',
    pa: 'ਕੋਈ ਵੀ ਸਰਕਾਰੀ ਜਾਂ ਜ਼ਰੂਰੀ ਕਾਗਜ਼ ਸਮਝੋ',
  },
  heroTitle: {
    en: 'Got a bill, letter or notice you don’t understand?',
    hi: 'कोई बिल, चिट्ठी या नोटिस समझ नहीं आ रहा?',
    pa: 'ਕੋਈ ਬਿੱਲ, ਚਿੱਠੀ ਜਾਂ ਨੋਟਿਸ ਸਮਝ ਨਹੀਂ ਆ ਰਿਹਾ?',
  },
  heroSub: {
    en: 'Take a photo. Samjho tells you what it is, what to do and by when.',
    hi: 'फोटो खींचिए। समझो बताएगा यह क्या है, क्या करना है और कब तक।',
    pa: 'ਫੋਟੋ ਖਿੱਚੋ। ਸਮਝੋ ਦੱਸੇਗਾ ਇਹ ਕੀ ਹੈ, ਕੀ ਕਰਨਾ ਹੈ ਅਤੇ ਕਦੋਂ ਤੱਕ।',
  },
  uploadPhoto: { en: 'Upload a picture', hi: 'फोटो अपलोड करें', pa: 'ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ' },
  takePhoto: { en: 'Take a photo', hi: 'फोटो खींचें', pa: 'ਫੋਟੋ ਖਿੱਚੋ' },
  choosePhoto: { en: 'Choose from gallery', hi: 'गैलरी से चुनें', pa: 'ਗੈਲਰੀ ਵਿੱਚੋਂ ਚੁਣੋ' },
  tips: {
    en: 'Tip: lay the paper flat, in good light, and fit the whole page in the photo.',
    hi: 'सलाह: कागज़ सीधा रखें, अच्छी रोशनी में, और पूरा पन्ना फोटो में आए।',
    pa: 'ਸਲਾਹ: ਕਾਗਜ਼ ਸਿੱਧਾ ਰੱਖੋ, ਚੰਗੀ ਰੋਸ਼ਨੀ ਵਿੱਚ, ਅਤੇ ਪੂਰਾ ਪੰਨਾ ਫੋਟੋ ਵਿੱਚ ਆਵੇ।',
  },
  trySample: { en: 'Try an example', hi: 'उदाहरण देखें', pa: 'ਉਦਾਹਰਣ ਵੇਖੋ' },
  sampleNote: {
    en: 'Sample papers with made-up details',
    hi: 'नकली जानकारी वाले नमूना कागज़',
    pa: 'ਨਕਲੀ ਜਾਣਕਾਰੀ ਵਾਲੇ ਨਮੂਨਾ ਕਾਗਜ਼',
  },
  demoMode: {
    en: 'This is the demo version, so it can only show the examples below. Reading your own pictures works on the full version.',
    hi: 'डेमो वर्ज़न: नीचे दिए उदाहरण आज़माएं। अपनी फोटो पढ़ना पूरे वर्ज़न में चलता है।',
    pa: 'ਡੈਮੋ ਵਰਜ਼ਨ: ਹੇਠਾਂ ਦਿੱਤੇ ਉਦਾਹਰਣ ਵੇਖੋ। ਆਪਣੀ ਫੋਟੋ ਪੜ੍ਹਨਾ ਪੂਰੇ ਵਰਜ਼ਨ ਵਿੱਚ ਚੱਲਦਾ ਹੈ।',
  },
  myPapers: { en: 'My papers', hi: 'मेरे कागज़', pa: 'ਮੇਰੇ ਕਾਗਜ਼' },
  noPapers: {
    en: 'Papers you check will be saved here with their deadlines.',
    hi: 'जो कागज़ आप जांचेंगे, वे अपनी आखिरी तारीख के साथ यहां दिखेंगे।',
    pa: 'ਜੋ ਕਾਗਜ਼ ਤੁਸੀਂ ਜਾਂਚੋਗੇ, ਉਹ ਆਪਣੀ ਆਖ਼ਰੀ ਤਾਰੀਖ ਨਾਲ ਇੱਥੇ ਦਿਸਣਗੇ।',
  },
  reading: { en: 'Reading your paper…', hi: 'आपका कागज़ पढ़ रहे हैं…', pa: 'ਤੁਹਾਡਾ ਕਾਗਜ਼ ਪੜ੍ਹ ਰਹੇ ਹਾਂ…' },
  readingSub: { en: 'This takes a few seconds', hi: 'इसमें कुछ सेकंड लगेंगे', pa: 'ਇਸ ਵਿੱਚ ਕੁਝ ਸਕਿੰਟ ਲੱਗਣਗੇ' },
  errorTitle: { en: 'Could not read this', hi: 'यह पढ़ नहीं पाए', pa: 'ਇਹ ਪੜ੍ਹ ਨਹੀਂ ਸਕੇ' },
  errorBody: {
    en: 'Please check your internet and try again. If it keeps failing, ask someone you trust to read it.',
    hi: 'इंटरनेट जांचें और फिर कोशिश करें। बार-बार न हो तो किसी भरोसेमंद व्यक्ति से पढ़वाएं।',
    pa: 'ਇੰਟਰਨੈੱਟ ਜਾਂਚੋ ਅਤੇ ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ। ਵਾਰ-ਵਾਰ ਨਾ ਹੋਵੇ ਤਾਂ ਕਿਸੇ ਭਰੋਸੇਯੋਗ ਬੰਦੇ ਤੋਂ ਪੜ੍ਹਵਾਓ।',
  },
  tooBig: {
    en: 'This file is too large. Please take a photo instead.',
    hi: 'यह फ़ाइल बहुत बड़ी है। कृपया फोटो खींचें।',
    pa: 'ਇਹ ਫ਼ਾਈਲ ਬਹੁਤ ਵੱਡੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਫੋਟੋ ਖਿੱਚੋ।',
  },
  tryAgain: { en: 'Try again', hi: 'फिर कोशिश करें', pa: 'ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ' },
  back: { en: 'Back', hi: 'वापस', pa: 'ਵਾਪਸ' },
  whatIsIt: { en: 'What is this?', hi: 'यह क्या है?', pa: 'ਇਹ ਕੀ ਹੈ?' },
  whatToDo: { en: 'What do I need to do?', hi: 'मुझे क्या करना है?', pa: 'ਮੈਨੂੰ ਕੀ ਕਰਨਾ ਹੈ?' },
  nothingToDo: {
    en: 'Nothing urgent. You can keep this paper safely.',
    hi: 'कुछ ज़रूरी नहीं। यह कागज़ संभाल कर रख लें।',
    pa: 'ਕੁਝ ਜ਼ਰੂਰੀ ਨਹੀਂ। ਇਹ ਕਾਗਜ਼ ਸੰਭਾਲ ਕੇ ਰੱਖ ਲਓ।',
  },
  amount: { en: 'Amount', hi: 'रकम', pa: 'ਰਕਮ' },
  byWhen: { en: 'By when', hi: 'कब तक', pa: 'ਕਦੋਂ ਤੱਕ' },
  daysLeft: {
    en: (n) => (n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : n < 0 ? `${-n} days ago` : `${n} days left`),
    hi: (n) => (n === 0 ? 'आज' : n === 1 ? 'कल' : n < 0 ? `${-n} दिन पहले निकल गई` : `${n} दिन बाकी`),
    pa: (n) => (n === 0 ? 'ਅੱਜ' : n === 1 ? 'ਕੱਲ੍ਹ' : n < 0 ? `${-n} ਦਿਨ ਪਹਿਲਾਂ ਲੰਘ ਗਈ` : `${n} ਦਿਨ ਬਾਕੀ`),
  },
  ifMissed: { en: 'If you miss it', hi: 'चूक गए तो', pa: 'ਖੁੰਝ ਗਏ ਤਾਂ' },
  scamHigh: { en: 'Warning: this looks like a scam', hi: 'सावधान: यह ठगी लगती है', pa: 'ਸਾਵਧਾਨ: ਇਹ ਠੱਗੀ ਲੱਗਦੀ ਹੈ' },
  scamMedium: { en: 'Be careful with this', hi: 'इसमें सावधानी रखें', pa: 'ਇਸ ਵਿੱਚ ਸਾਵਧਾਨੀ ਰੱਖੋ' },
  scamAdvice: {
    en: 'Do not pay, click links, or share OTP or PIN. If money was taken, call 1930 (cyber crime helpline).',
    hi: 'पैसे न भेजें, लिंक न खोलें, OTP या PIN न बताएं। पैसे कट गए हों तो 1930 (साइबर क्राइम हेल्पलाइन) पर कॉल करें।',
    pa: 'ਪੈਸੇ ਨਾ ਭੇਜੋ, ਲਿੰਕ ਨਾ ਖੋਲ੍ਹੋ, OTP ਜਾਂ PIN ਨਾ ਦੱਸੋ। ਪੈਸੇ ਕੱਟੇ ਗਏ ਹੋਣ ਤਾਂ 1930 (ਸਾਈਬਰ ਕ੍ਰਾਈਮ ਹੈਲਪਲਾਈਨ) ਤੇ ਕਾਲ ਕਰੋ।',
  },
  details: { en: 'Important details', hi: 'ज़रूरी जानकारी', pa: 'ਜ਼ਰੂਰੀ ਜਾਣਕਾਰੀ' },
  listen: { en: 'Listen', hi: 'सुनें', pa: 'ਸੁਣੋ' },
  stop: { en: 'Stop', hi: 'रोकें', pa: 'ਰੋਕੋ' },
  remind: { en: 'Remind me', hi: 'मुझे याद दिलाएं', pa: 'ਮੈਨੂੰ ਯਾਦ ਕਰਵਾਓ' },
  askFamily: { en: 'Ask family on WhatsApp', hi: 'परिवार से WhatsApp पर पूछें', pa: 'ਪਰਿਵਾਰ ਤੋਂ WhatsApp ਤੇ ਪੁੱਛੋ' },
  shareIntro: {
    en: 'Can you check this paper for me? Samjho says:',
    hi: 'क्या आप यह कागज़ देख लेंगे? समझो कह रहा है:',
    pa: 'ਕੀ ਤੁਸੀਂ ਇਹ ਕਾਗਜ਼ ਵੇਖ ਲਓਗੇ? ਸਮਝੋ ਕਹਿ ਰਿਹਾ ਹੈ:',
  },
  lowConfidence: {
    en: 'Samjho is not fully sure about this paper. Please ask someone you trust to check it.',
    hi: 'समझो को इस कागज़ के बारे में पूरा यकीन नहीं है। किसी भरोसेमंद व्यक्ति से जांच करवाएं।',
    pa: 'ਸਮਝੋ ਨੂੰ ਇਸ ਕਾਗਜ਼ ਬਾਰੇ ਪੂਰਾ ਯਕੀਨ ਨਹੀਂ ਹੈ। ਕਿਸੇ ਭਰੋਸੇਯੋਗ ਬੰਦੇ ਤੋਂ ਜਾਂਚ ਕਰਵਾਓ।',
  },
  unclear: { en: 'Could not read clearly', hi: 'साफ़ नहीं पढ़ पाए', pa: 'ਸਾਫ਼ ਨਹੀਂ ਪੜ੍ਹ ਸਕੇ' },
  wasHelpful: { en: 'Was this correct?', hi: 'क्या यह सही था?', pa: 'ਕੀ ਇਹ ਸਹੀ ਸੀ?' },
  yes: { en: 'Yes', hi: 'हां', pa: 'ਹਾਂ' },
  no: { en: 'No', hi: 'नहीं', pa: 'ਨਹੀਂ' },
  thanks: { en: 'Thank you!', hi: 'धन्यवाद!', pa: 'ਧੰਨਵਾਦ!' },
  checkAnother: { en: 'Check another paper', hi: 'दूसरा कागज़ जांचें', pa: 'ਹੋਰ ਕਾਗਜ਼ ਜਾਂਚੋ' },
  disclaimer: {
    en: 'Samjho can make mistakes. It is not legal, medical or financial advice. For important matters, confirm with the office or a trusted person.',
    hi: 'समझो से गलती हो सकती है। यह कानूनी, मेडिकल या पैसों की सलाह नहीं है। ज़रूरी मामलों में दफ़्तर या भरोसेमंद व्यक्ति से पक्का करें।',
    pa: 'ਸਮਝੋ ਤੋਂ ਗਲਤੀ ਹੋ ਸਕਦੀ ਹੈ। ਇਹ ਕਾਨੂੰਨੀ, ਮੈਡੀਕਲ ਜਾਂ ਪੈਸਿਆਂ ਦੀ ਸਲਾਹ ਨਹੀਂ ਹੈ। ਜ਼ਰੂਰੀ ਮਾਮਲਿਆਂ ਵਿੱਚ ਦਫ਼ਤਰ ਜਾਂ ਭਰੋਸੇਯੋਗ ਬੰਦੇ ਤੋਂ ਪੱਕਾ ਕਰੋ।',
  },
  privacy: {
    en: 'Your photo is not saved. Only the explanation is kept on this phone.',
    hi: 'आपकी फोटो सेव नहीं होती। सिर्फ़ जानकारी इसी फ़ोन में रहती है।',
    pa: 'ਤੁਹਾਡੀ ਫੋਟੋ ਸੇਵ ਨਹੀਂ ਹੁੰਦੀ। ਸਿਰਫ਼ ਜਾਣਕਾਰੀ ਇਸੇ ਫ਼ੋਨ ਵਿੱਚ ਰਹਿੰਦੀ ਹੈ।',
  },
  remove: { en: 'Remove', hi: 'हटाएं', pa: 'ਹਟਾਓ' },
  example: { en: 'Example', hi: 'उदाहरण', pa: 'ਉਦਾਹਰਣ' },
  research: { en: 'For researchers', hi: 'शोध के लिए', pa: 'ਖੋਜ ਲਈ' },
  notReadable: { en: 'Please take the photo again', hi: 'कृपया फिर से फोटो खींचें', pa: 'ਕਿਰਪਾ ਕਰਕੇ ਫਿਰ ਫੋਟੋ ਖਿੱਚੋ' },
};

export function t(key, lang, ...args) {
  const entry = S[key];
  if (!entry) return key;
  const v = entry[lang] ?? entry.en;
  return typeof v === 'function' ? v(...args) : v;
}

// Month names written out, because many phone browsers lack Punjabi month data
// and would show "2026 M11 18".
const MONTHS = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  hi: ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'],
  pa: ['ਜਨਵਰੀ', 'ਫ਼ਰਵਰੀ', 'ਮਾਰਚ', 'ਅਪ੍ਰੈਲ', 'ਮਈ', 'ਜੂਨ', 'ਜੁਲਾਈ', 'ਅਗਸਤ', 'ਸਤੰਬਰ', 'ਅਕਤੂਬਰ', 'ਨਵੰਬਰ', 'ਦਸੰਬਰ'],
};
export function formatDate(iso, lang) {
  const [y, m, d] = iso.split('-').map(Number);
  const names = MONTHS[lang] || MONTHS.en;
  return names[m - 1] ? `${d} ${names[m - 1]} ${y}` : iso;
}
export const rupees = (n) => '₹' + Number(n).toLocaleString('en-IN');
