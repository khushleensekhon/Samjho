// Example papers with made-up organisations and people, so anyone can try
// Samjho without uploading a real document. Dates are relative to today so
// the examples never go stale; the picture and the explanation always match.
import { todayISO } from './dates.js';

function shift(days, now = new Date()) {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + days);
  return todayISO(d);
}
const printed = (iso) => {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function svgDoc(lines, { stripe = '#1d4e89', height = 1100 } = {}) {
  const rows = lines
    .map(([y, text, opts = {}]) => {
      const size = opts.size || 26;
      const weight = opts.bold ? 700 : 400;
      const anchor = opts.right ? 'end' : opts.center ? 'middle' : 'start';
      const x = opts.right ? 740 : opts.center ? 400 : opts.x || 60;
      const fill = opts.color || '#1b1b1b';
      return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" fill="${fill}">${esc(text)}</text>`;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 ${height}" font-family="Arial, Helvetica, sans-serif">
<rect width="800" height="${height}" fill="#fdfcf7"/><rect width="800" height="14" fill="${stripe}"/>
${rows}
<text x="400" y="${height / 2}" font-size="120" font-weight="700" fill="#c0392b" fill-opacity="0.08" text-anchor="middle" transform="rotate(-30 400 ${height / 2})">SAMPLE</text>
</svg>`;
}

function smsDoc(sender, body, time) {
  const wrap = [];
  let line = '';
  for (const w of body.split(' ')) {
    if ((line + ' ' + w).length > 38) { wrap.push(line); line = w; } else line = line ? line + ' ' + w : w;
  }
  wrap.push(line);
  const bubbleH = 40 + wrap.length * 36;
  const texts = wrap.map((l, i) => `<text x="70" y="${250 + i * 36}" font-size="27" fill="#1b1b1b">${esc(l)}</text>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 ${300 + bubbleH}" font-family="Arial, Helvetica, sans-serif">
<rect width="800" height="${300 + bubbleH}" fill="#eef1f5"/>
<rect width="800" height="120" fill="#ffffff"/>
<circle cx="80" cy="60" r="34" fill="#9aa5b1"/><text x="80" y="70" font-size="28" text-anchor="middle" fill="#fff">✉</text>
<text x="135" y="55" font-size="30" font-weight="700" fill="#1b1b1b">${esc(sender)}</text>
<text x="135" y="90" font-size="22" fill="#5d6576">Text message · ${esc(time)}</text>
<rect x="40" y="200" width="700" height="${bubbleH}" rx="26" fill="#ffffff"/>
${texts}
<text x="400" y="${(300 + bubbleH) / 2 + 40}" font-size="110" font-weight="700" fill="#c0392b" fill-opacity="0.08" text-anchor="middle" transform="rotate(-25 400 ${(300 + bubbleH) / 2})">SAMPLE</text>
</svg>`;
}

const svgUrl = (svg) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

export function getSamples(now = new Date()) {
  const billDate = shift(-5, now);
  const due = shift(13, now);
  const ptm = shift(9, now);
  const feeDue = shift(20, now);

  const bill = {
    id: 'sample-bill',
    title: { en: 'Electricity bill', hi: 'बिजली का बिल', pa: 'ਬਿਜਲੀ ਦਾ ਬਿੱਲ' },
    image: svgUrl(svgDoc([
      [70, 'SHIVALIK POWER DISTRIBUTION LTD', { bold: true, size: 30, color: '#1d4e89' }],
      [105, 'Electricity Bill cum Notice', { size: 22, color: '#5d6576' }],
      [170, 'Consumer Name:', { bold: true }], [170, 'HARJIT KAUR', { right: true }],
      [215, 'Account No:', { bold: true }], [215, '3002 1145 4821', { right: true }],
      [260, 'Address:', { bold: true }], [260, 'Ward 7, Near Gurdwara, Nabha', { right: true }],
      [305, 'Bill Date:', { bold: true }], [305, printed(billDate), { right: true }],
      [350, 'Tariff:', { bold: true }], [350, 'DS (Domestic Supply)', { right: true }],
      [420, 'Units Consumed (2 months)', {}], [420, '312', { right: true }],
      [465, 'Energy Charges', {}], [465, '2,028.00', { right: true }],
      [510, 'Fixed Charges', {}], [510, '180.00', { right: true }],
      [555, 'Electricity Duty & Taxes', {}], [555, '132.00', { right: true }],
      [640, 'AMOUNT PAYABLE BY DUE DATE', { bold: true, size: 28 }], [640, 'Rs. 2,340', { bold: true, size: 30, right: true }],
      [690, 'DUE DATE', { bold: true, size: 28 }], [690, printed(due), { bold: true, size: 30, right: true, color: '#c0392b' }],
      [740, 'Amount payable after due date', {}], [740, 'Rs. 2,390', { right: true }],
      [820, 'Supply is liable to be disconnected if the bill is not', { size: 21, color: '#5d6576' }],
      [850, 'paid within 15 days after the due date.', { size: 21, color: '#5d6576' }],
      [910, 'Pay at any cash counter, UPI or the official website.', { size: 21, color: '#5d6576' }],
    ])),
    result: (lang) => ({
      readable: true,
      category: 'bill',
      doc_type: { en: 'Electricity bill', hi: 'बिजली का बिल', pa: 'ਬਿਜਲੀ ਦਾ ਬਿੱਲ' }[lang],
      issuer: 'Shivalik Power Distribution Ltd',
      summary: {
        en: 'This is your electricity bill for the last two months. You used 312 units of electricity. You need to pay ₹2,340.',
        hi: 'यह पिछले दो महीने का आपका बिजली का बिल है। आपने 312 यूनिट बिजली इस्तेमाल की। आपको ₹2,340 भरने हैं।',
        pa: 'ਇਹ ਪਿਛਲੇ ਦੋ ਮਹੀਨਿਆਂ ਦਾ ਤੁਹਾਡਾ ਬਿਜਲੀ ਦਾ ਬਿੱਲ ਹੈ। ਤੁਸੀਂ 312 ਯੂਨਿਟ ਬਿਜਲੀ ਵਰਤੀ। ਤੁਹਾਨੂੰ ₹2,340 ਭਰਨੇ ਹਨ।',
      }[lang],
      action_needed: true,
      action: { en: 'Pay the bill', hi: 'बिल भरें', pa: 'ਬਿੱਲ ਭਰੋ' }[lang],
      amount: 2340,
      deadline: due,
      consequence: {
        en: 'You will have to pay ₹50 extra (₹2,390). If still unpaid 15 days later, your electricity can be cut.',
        hi: '₹50 ज़्यादा (₹2,390) देने होंगे। 15 दिन बाद भी नहीं भरा तो बिजली कट सकती है।',
        pa: '₹50 ਵੱਧ (₹2,390) ਦੇਣੇ ਪੈਣਗੇ। 15 ਦਿਨਾਂ ਬਾਅਦ ਵੀ ਨਾ ਭਰਿਆ ਤਾਂ ਬਿਜਲੀ ਕੱਟੀ ਜਾ ਸਕਦੀ ਹੈ।',
      }[lang],
      scam_risk: 'none',
      scam_reasons: [],
      key_details: [
        { label: { en: 'Name', hi: 'नाम', pa: 'ਨਾਂ' }[lang], value: 'Harjit Kaur' },
        { label: { en: 'Account no.', hi: 'खाता नंबर', pa: 'ਖਾਤਾ ਨੰਬਰ' }[lang], value: 'XXXX4821' },
        { label: { en: 'Units used', hi: 'यूनिट', pa: 'ਯੂਨਿਟ' }[lang], value: '312' },
      ],
      confidence: 'high',
      unclear: null,
      speak_text: {
        en: 'This is your electricity bill. You need to pay 2,340 rupees within 13 days. If you pay late, you will pay 50 rupees extra.',
        hi: 'यह आपका बिजली का बिल है। आपको 13 दिन के अंदर 2,340 रुपये भरने हैं। देर से भरने पर 50 रुपये ज़्यादा लगेंगे।',
        pa: 'ਇਹ ਤੁਹਾਡਾ ਬਿਜਲੀ ਦਾ ਬਿੱਲ ਹੈ। ਤੁਹਾਨੂੰ 13 ਦਿਨਾਂ ਦੇ ਅੰਦਰ 2,340 ਰੁਪਏ ਭਰਨੇ ਹਨ। ਦੇਰ ਨਾਲ ਭਰਨ ਤੇ 50 ਰੁਪਏ ਵੱਧ ਲੱਗਣਗੇ।',
      }[lang],
    }),
  };

  const scam = {
    id: 'sample-sms',
    title: { en: 'Bank KYC message', hi: 'बैंक KYC मैसेज', pa: 'ਬੈਂਕ KYC ਮੈਸੇਜ' },
    image: svgUrl(smsDoc(
      'VM-BNKALRT',
      'Dear Customer, your bank account KYC has expired and your account will be BLOCKED today. Update KYC now: http://kyc-update-help.xyz and share the OTP sent to you with our officer to stop blocking.',
      '10:42 AM',
    )),
    result: (lang) => ({
      readable: true,
      category: 'message',
      doc_type: { en: 'SMS about bank KYC', hi: 'बैंक KYC के बारे में SMS', pa: 'ਬੈਂਕ KYC ਬਾਰੇ SMS' }[lang],
      issuer: 'VM-BNKALRT',
      summary: {
        en: 'This message says your bank account will be blocked today unless you click a link and share an OTP. This is a common scam to steal money from your account.',
        hi: 'यह मैसेज कहता है कि लिंक खोलकर OTP नहीं बताया तो आज खाता बंद हो जाएगा। यह खाते से पैसे चुराने की आम ठगी है।',
        pa: 'ਇਹ ਮੈਸੇਜ ਕਹਿੰਦਾ ਹੈ ਕਿ ਲਿੰਕ ਖੋਲ੍ਹ ਕੇ OTP ਨਾ ਦੱਸਿਆ ਤਾਂ ਅੱਜ ਖਾਤਾ ਬੰਦ ਹੋ ਜਾਵੇਗਾ। ਇਹ ਖਾਤੇ ਵਿੱਚੋਂ ਪੈਸੇ ਚੋਰੀ ਕਰਨ ਦੀ ਆਮ ਠੱਗੀ ਹੈ।',
      }[lang],
      action_needed: true,
      action: {
        en: 'Do not click the link and do not share any OTP. Delete this message. If worried, visit your bank branch.',
        hi: 'लिंक न खोलें और कोई OTP न बताएं। यह मैसेज मिटा दें। चिंता हो तो अपनी बैंक शाखा जाएं।',
        pa: 'ਲਿੰਕ ਨਾ ਖੋਲ੍ਹੋ ਅਤੇ ਕੋਈ OTP ਨਾ ਦੱਸੋ। ਇਹ ਮੈਸੇਜ ਮਿਟਾ ਦਿਓ। ਚਿੰਤਾ ਹੋਵੇ ਤਾਂ ਆਪਣੀ ਬੈਂਕ ਸ਼ਾਖਾ ਜਾਓ।',
      }[lang],
      amount: null,
      deadline: null,
      consequence: null,
      scam_risk: 'high',
      scam_reasons: {
        en: ['It asks you to share an OTP. Banks never ask for your OTP.', 'It threatens to block your account today to make you panic.', 'The link is not a real bank website.'],
        hi: ['यह OTP मांग रहा है। बैंक कभी OTP नहीं मांगता।', 'आज खाता बंद करने की धमकी देकर डराया जा रहा है।', 'यह लिंक असली बैंक की वेबसाइट नहीं है।'],
        pa: ['ਇਹ OTP ਮੰਗ ਰਿਹਾ ਹੈ। ਬੈਂਕ ਕਦੇ OTP ਨਹੀਂ ਮੰਗਦਾ।', 'ਅੱਜ ਖਾਤਾ ਬੰਦ ਕਰਨ ਦੀ ਧਮਕੀ ਦੇ ਕੇ ਡਰਾਇਆ ਜਾ ਰਿਹਾ ਹੈ।', 'ਇਹ ਲਿੰਕ ਅਸਲੀ ਬੈਂਕ ਦੀ ਵੈੱਬਸਾਈਟ ਨਹੀਂ ਹੈ।'],
      }[lang],
      key_details: [
        { label: { en: 'Sender', hi: 'भेजने वाला', pa: 'ਭੇਜਣ ਵਾਲਾ' }[lang], value: 'VM-BNKALRT' },
        { label: { en: 'Link', hi: 'लिंक', pa: 'ਲਿੰਕ' }[lang], value: 'kyc-update-help.xyz' },
      ],
      confidence: 'high',
      unclear: null,
      speak_text: {
        en: 'Be careful. This message is a scam. Do not click the link and never share your OTP. Your bank will never ask for it.',
        hi: 'सावधान रहें। यह मैसेज ठगी है। लिंक न खोलें और OTP कभी न बताएं। बैंक कभी OTP नहीं मांगता।',
        pa: 'ਸਾਵਧਾਨ ਰਹੋ। ਇਹ ਮੈਸੇਜ ਠੱਗੀ ਹੈ। ਲਿੰਕ ਨਾ ਖੋਲ੍ਹੋ ਅਤੇ OTP ਕਦੇ ਨਾ ਦੱਸੋ। ਬੈਂਕ ਕਦੇ OTP ਨਹੀਂ ਮੰਗਦਾ।',
      }[lang],
    }),
  };

  const school = {
    id: 'sample-school',
    title: { en: 'School notice', hi: 'स्कूल का नोटिस', pa: 'ਸਕੂਲ ਦਾ ਨੋਟਿਸ' },
    image: svgUrl(svgDoc([
      [75, 'SUNRISE PUBLIC SCHOOL', { bold: true, size: 34, center: true, color: '#2e6b30' }],
      [110, 'Rajpura Road, Patiala', { size: 22, center: true, color: '#5d6576' }],
      [185, `Date: ${printed(shift(-2, now))}`, { right: true, size: 22 }],
      [230, 'NOTICE TO PARENTS', { bold: true, size: 30, center: true }],
      [300, 'Dear Parents,', {}],
      [350, `1. The Parent-Teacher Meeting (PTM) for Classes 1 to 8`, {}],
      [385, `    will be held on ${printed(ptm)} from 10:00 AM to 1:00 PM.`, {}],
      [420, '    Please collect your ward\'s report card.', {}],
      [480, `2. Term-II tuition fee of Rs. 3,500 must be deposited`, {}],
      [515, `    on or before ${printed(feeDue)}.`, {}],
      [550, '    A late fee of Rs. 100 will be charged after that.', {}],
      [610, '3. Fee can be paid at the school office (9 AM - 2 PM)', {}],
      [645, '    or through the school fee portal.', {}],
      [740, 'Principal', { bold: true, right: true }],
      [775, 'Sunrise Public School', { right: true, size: 22 }],
    ], { stripe: '#2e6b30' })),
    result: (lang) => ({
      readable: true,
      category: 'school',
      doc_type: { en: 'School notice for parents', hi: 'माता-पिता के लिए स्कूल का नोटिस', pa: 'ਮਾਪਿਆਂ ਲਈ ਸਕੂਲ ਦਾ ਨੋਟਿਸ' }[lang],
      issuer: 'Sunrise Public School',
      summary: {
        en: 'The school is telling parents two things. There is a parent-teacher meeting where you get the report card, and the term fee of ₹3,500 must be paid.',
        hi: 'स्कूल माता-पिता को दो बातें बता रहा है। एक पेरेंट-टीचर मीटिंग है जिसमें रिपोर्ट कार्ड मिलेगा, और ₹3,500 की फीस भरनी है।',
        pa: 'ਸਕੂਲ ਮਾਪਿਆਂ ਨੂੰ ਦੋ ਗੱਲਾਂ ਦੱਸ ਰਿਹਾ ਹੈ। ਇੱਕ ਮਾਪੇ-ਅਧਿਆਪਕ ਮੀਟਿੰਗ ਹੈ ਜਿਸ ਵਿੱਚ ਰਿਪੋਰਟ ਕਾਰਡ ਮਿਲੇਗਾ, ਅਤੇ ₹3,500 ਦੀ ਫੀਸ ਭਰਨੀ ਹੈ।',
      }[lang],
      action_needed: true,
      action: {
        en: 'Pay the term fee, and go to the parent-teacher meeting.',
        hi: 'फीस भरें, और पेरेंट-टीचर मीटिंग में जाएं।',
        pa: 'ਫੀਸ ਭਰੋ, ਅਤੇ ਮਾਪੇ-ਅਧਿਆਪਕ ਮੀਟਿੰਗ ਵਿੱਚ ਜਾਓ।',
      }[lang],
      amount: 3500,
      deadline: feeDue,
      consequence: { en: '₹100 late fee.', hi: '₹100 लेट फीस लगेगी।', pa: '₹100 ਲੇਟ ਫੀਸ ਲੱਗੇਗੀ।' }[lang],
      scam_risk: 'none',
      scam_reasons: [],
      key_details: [
        { label: { en: 'Meeting', hi: 'मीटिंग', pa: 'ਮੀਟਿੰਗ' }[lang], value: `${printed(ptm)}, 10 AM – 1 PM` },
        { label: { en: 'Where to pay', hi: 'कहां भरें', pa: 'ਕਿੱਥੇ ਭਰੋ' }[lang], value: { en: 'School office (9 AM – 2 PM) or fee portal', hi: 'स्कूल दफ़्तर (सुबह 9 – दोपहर 2) या फीस पोर्टल', pa: 'ਸਕੂਲ ਦਫ਼ਤਰ (ਸਵੇਰੇ 9 – ਦੁਪਹਿਰ 2) ਜਾਂ ਫੀਸ ਪੋਰਟਲ' }[lang] },
      ],
      confidence: 'high',
      unclear: null,
      speak_text: {
        en: 'This is a notice from the school. Pay the fee of 3,500 rupees within 20 days, or there is a 100 rupee late fee. Also, the parent-teacher meeting is in 9 days, at 10 in the morning.',
        hi: 'यह स्कूल का नोटिस है। 20 दिन के अंदर 3,500 रुपये फीस भरें, नहीं तो 100 रुपये लेट फीस लगेगी। और 9 दिन बाद सुबह 10 बजे पेरेंट-टीचर मीटिंग है।',
        pa: 'ਇਹ ਸਕੂਲ ਦਾ ਨੋਟਿਸ ਹੈ। 20 ਦਿਨਾਂ ਦੇ ਅੰਦਰ 3,500 ਰੁਪਏ ਫੀਸ ਭਰੋ, ਨਹੀਂ ਤਾਂ 100 ਰੁਪਏ ਲੇਟ ਫੀਸ ਲੱਗੇਗੀ। ਅਤੇ 9 ਦਿਨਾਂ ਬਾਅਦ ਸਵੇਰੇ 10 ਵਜੇ ਮਾਪੇ-ਅਧਿਆਪਕ ਮੀਟਿੰਗ ਹੈ।',
      }[lang],
    }),
  };

  return [bill, scam, school];
}
