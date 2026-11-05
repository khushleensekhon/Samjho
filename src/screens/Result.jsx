import { useEffect, useState } from 'react';
import { t, formatDate, rupees } from '../i18n.js';
import { daysUntil, googleCalendarUrl, icsFile } from '../dates.js';
import { speak, stopSpeaking, canSpeak } from '../speech.js';
import { track } from '../store.js';

export default function Result({ entry, preview, blob, onBack }) {
  const { result: r, lang } = entry;
  const [speaking, setSpeaking] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [zoom, setZoom] = useState(false);
  const days = r.deadline ? daysUntil(r.deadline) : null;
  const scam = r.scam_risk === 'high' || r.scam_risk === 'medium';
  const meta = { sample: !!entry.sample, category: r.category };

  useEffect(() => () => stopSpeaking(), []);

  function toggleSpeak() {
    if (speaking) { stopSpeaking(); setSpeaking(false); return; }
    track('listen', meta);
    setSpeaking(true);
    speak(r.speak_text, lang, () => setSpeaking(false));
  }

  const reminderTitle = `${r.action || r.doc_type}${r.amount != null ? ` (${rupees(r.amount)})` : ''}`;
  const reminderDetails = `${r.doc_type}\n${r.summary}\n${t('byWhen', lang)}: ${r.deadline ? formatDate(r.deadline, lang) : ''}\n— Samjho`;

  function downloadIcs() {
    track('reminder', { ...meta, kind: 'ics' });
    const file = new Blob([icsFile({ title: reminderTitle, details: reminderDetails, deadline: r.deadline })], { type: 'text/calendar' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = 'samjho-reminder.ics';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function share() {
    track('share', meta);
    const lines = [
      t('shareIntro', lang),
      '',
      `📄 ${r.doc_type}`,
      r.summary,
      r.action_needed && r.action ? `✅ ${r.action}` : null,
      r.amount != null ? `💰 ${rupees(r.amount)}` : null,
      r.deadline ? `📅 ${formatDate(r.deadline, lang)}` : null,
      scam ? `⚠️ ${t(r.scam_risk === 'high' ? 'scamHigh' : 'scamMedium', lang)}` : null,
    ].filter((x) => x !== null);
    const text = lines.join('\n');
    try {
      if (blob && navigator.canShare) {
        const file = new File([blob], 'paper.jpg', { type: 'image/jpeg' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], text });
          return;
        }
      }
    } catch (e) {
      if (e?.name === 'AbortError') return;
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  }

  function giveFeedback(correct) {
    setFeedback(correct);
    track('feedback', { ...meta, correct, scam: r.scam_risk, confidence: r.confidence });
  }

  if (!r.readable) {
    return (
      <main className="screen center-screen">
        <div className="error-mark" aria-hidden>!</div>
        <h1>{t('notReadable', lang)}</h1>
        <p className="muted">{r.summary}</p>
        <p className="tip">{t('tips', lang)}</p>
        <button className="btn primary block" onClick={onBack}>{t('tryAgain', lang)}</button>
      </main>
    );
  }

  return (
    <main className="screen result">
      <div className="header">
        <button className="back" onClick={onBack} aria-label={t('back', lang)}>←</button>
        <span className="header-title">{entry.sample ? t('example', lang) : r.issuer || ''}</span>
      </div>

      {scam && (
        <section className={'scam ' + r.scam_risk} role="alert">
          <h2>⚠️ {t(r.scam_risk === 'high' ? 'scamHigh' : 'scamMedium', lang)}</h2>
          <ul>{r.scam_reasons.map((s, i) => <li key={i}>{s}</li>)}</ul>
          <p className="scam-advice">{t('scamAdvice', lang)}</p>
        </section>
      )}

      <section className="card">
        <div className="card-head">
          {preview && (
            <button className="thumb" onClick={() => setZoom(true)} aria-label="Open photo">
              <img src={preview} alt="" />
            </button>
          )}
          <div>
            <div className="label">{t('whatIsIt', lang)}</div>
            <h1 className="doc-type">{r.doc_type}</h1>
          </div>
        </div>
        <p className="summary">{r.summary}</p>
        {canSpeak() && (
          <button className={'btn listen block' + (speaking ? ' on' : '')} onClick={toggleSpeak}>
            {speaking ? '⏹ ' + t('stop', lang) : '🔊 ' + t('listen', lang)}
          </button>
        )}
      </section>

      <section className={'card action' + (r.action_needed ? '' : ' calm')}>
        <div className="label">{t('whatToDo', lang)}</div>
        <p className="action-text">{r.action_needed && r.action ? r.action : t('nothingToDo', lang)}</p>
        {(r.amount != null || r.deadline) && (
          <div className="facts">
            {r.amount != null && (
              <div className="fact">
                <div className="label">{t('amount', lang)}</div>
                <div className="fact-value">{rupees(r.amount)}</div>
              </div>
            )}
            {r.deadline && (
              <div className={'fact' + (days !== null && days <= 3 ? ' urgent' : '')}>
                <div className="label">{t('byWhen', lang)}</div>
                <div className="fact-value">{formatDate(r.deadline, lang)}</div>
                <div className="fact-sub">{t('daysLeft', lang, days)}</div>
              </div>
            )}
          </div>
        )}
        {r.consequence && <p className="consequence"><strong>{t('ifMissed', lang)}:</strong> {r.consequence}</p>}
        {r.deadline && days >= 0 && (
          <div className="remind-row">
            <a className="btn secondary block" href={googleCalendarUrl({ title: reminderTitle, details: reminderDetails, deadline: r.deadline })}
              target="_blank" rel="noopener noreferrer" onClick={() => track('reminder', { ...meta, kind: 'google' })}>
              ⏰ {t('remind', lang)}
            </a>
            <button className="link small" onClick={downloadIcs}>.ics</button>
          </div>
        )}
      </section>

      {r.confidence === 'low' && <p className="notice">🤔 {t('lowConfidence', lang)}</p>}
      {r.unclear && <p className="notice"><strong>{t('unclear', lang)}:</strong> {r.unclear}</p>}

      <button className="btn whatsapp block" onClick={share}>💬 {t('askFamily', lang)}</button>

      {r.key_details.length > 0 && (
        <section className="card">
          <div className="label">{t('details', lang)}</div>
          <dl className="details">
            {r.key_details.map((d, i) => (
              <div key={i}><dt>{d.label}</dt><dd>{d.value}</dd></div>
            ))}
          </dl>
        </section>
      )}

      <section className="feedback">
        {feedback === null ? (
          <>
            <span>{t('wasHelpful', lang)}</span>
            <button className="btn secondary small-btn" onClick={() => giveFeedback(true)}>👍 {t('yes', lang)}</button>
            <button className="btn secondary small-btn" onClick={() => giveFeedback(false)}>👎 {t('no', lang)}</button>
          </>
        ) : (
          <span>{t('thanks', lang)}</span>
        )}
      </section>

      <p className="disclaimer">{t('disclaimer', lang)}</p>
      <button className="btn primary block" onClick={onBack}>{t('checkAnother', lang)}</button>

      {zoom && preview && (
        <div className="zoom" role="dialog" aria-modal="true" onClick={() => setZoom(false)}>
          <img src={preview} alt="" />
        </div>
      )}
    </main>
  );
}
