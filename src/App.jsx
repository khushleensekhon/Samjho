import { useEffect, useRef, useState } from 'react';
import { LANGS, t, formatDate, rupees } from './i18n.js';
import { getSamples } from './samples.js';
import { aiAvailable, explain } from './api.js';
import { prepareFile } from './image.js';
import { daysUntil } from './dates.js';
import { getPref, setPref, getPapers, savePaper, removePaper, track } from './store.js';
import { stopSpeaking } from './speech.js';
import Result from './screens/Result.jsx';
import Research from './screens/Research.jsx';

export default function App() {
  const [lang, setLang] = useState(() => getPref('lang', 'pa'));
  const [ai, setAi] = useState(null); // null = checking
  const [view, setView] = useState({ name: 'home' });
  const [papers, setPapers] = useState(getPapers);
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);
  const samples = getSamples();

  useEffect(() => { track('session_start'); aiAvailable().then(setAi); }, []);
  useEffect(() => { setPref('lang', lang); document.documentElement.lang = lang; }, [lang]);

  const goHome = () => { stopSpeaking(); setPapers(getPapers()); setView({ name: 'home' }); };

  async function onFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    let prepared;
    try {
      prepared = await prepareFile(file);
    } catch (err) {
      setView({ name: 'error', message: err.message === 'too_big' ? t('tooBig', lang) : t('errorBody', lang) });
      return;
    }
    setView({ name: 'loading', preview: prepared.preview });
    const started = Date.now();
    try {
      const result = await explain({ ...prepared, lang });
      const entry = { id: 'p' + started, savedAt: new Date().toISOString(), lang, result };
      if (result.readable) savePaper(entry);
      track('explained', {
        sample: false, lang, category: result.category, scam: result.scam_risk, confidence: result.confidence,
        deadline: !!result.deadline, amount: result.amount != null, ms: Date.now() - started,
      });
      setView({ name: 'result', entry, preview: prepared.preview, blob: prepared.blob });
    } catch {
      track('explain_failed', { ms: Date.now() - started });
      setView({ name: 'error', message: t('errorBody', lang) });
    }
  }

  function openSample(s) {
    track('explained', { sample: true, id: s.id, lang });
    setView({ name: 'result', sample: s });
  }

  if (view.name === 'research') return <Research onBack={goHome} />;

  if (view.name === 'result') {
    const entry = view.sample
      ? { id: view.sample.id, lang, result: view.sample.result(lang), sample: true }
      : view.entry;
    return (
      <Result
        entry={entry}
        preview={view.sample ? view.sample.image : view.preview}
        blob={view.blob}
        onBack={goHome}
      />
    );
  }

  if (view.name === 'loading') {
    return (
      <main className="screen center-screen">
        {view.preview && <img className="loading-preview" src={view.preview} alt="" />}
        <div className="spinner" aria-hidden />
        <h1 className="loading-title" aria-live="polite">{t('reading', lang)}</h1>
        <p className="muted">{t('readingSub', lang)}</p>
      </main>
    );
  }

  if (view.name === 'error') {
    return (
      <main className="screen center-screen">
        <div className="error-mark" aria-hidden>!</div>
        <h1>{t('errorTitle', lang)}</h1>
        <p className="muted">{view.message}</p>
        <button className="btn primary block" onClick={goHome}>{t('tryAgain', lang)}</button>
      </main>
    );
  }

  const upcoming = [...papers].sort((a, b) => {
    const da = a.result.deadline ? daysUntil(a.result.deadline) : 9999;
    const db = b.result.deadline ? daysUntil(b.result.deadline) : 9999;
    return (da < 0 ? 9000 + da : da) - (db < 0 ? 9000 + db : db);
  });

  return (
    <main className="screen home">
      <header className="top">
        <div className="brand">
          <span className="logo" aria-hidden>स</span>
          <div>
            <div className="brand-name">Samjho</div>
            <div className="brand-tag">{t('tagline', lang)}</div>
          </div>
        </div>
        <div className="lang-switch" role="group" aria-label="Language">
          {LANGS.map((l) => (
            <button key={l.code} className={l.code === lang ? 'active' : ''} aria-pressed={l.code === lang}
              onClick={() => { setLang(l.code); track('lang_change', { lang: l.code }); }}>
              {l.label}
            </button>
          ))}
        </div>
      </header>

      <section className="hero">
        <h1>{t('heroTitle', lang)}</h1>
        <p>{t('heroSub', lang)}</p>
        {ai === false && <p className="demo-note">{t('demoMode', lang)}</p>}
        {ai !== false && (
          <>
            <button className="btn primary block big" disabled={ai === null} onClick={() => cameraRef.current?.click()}>
              <span aria-hidden>📷</span> {t('takePhoto', lang)}
            </button>
            <button className="btn secondary block" disabled={ai === null} onClick={() => galleryRef.current?.click()}>
              <span aria-hidden>🖼️</span> {t('choosePhoto', lang)}
            </button>
            <p className="tip">{t('tips', lang)}</p>
          </>
        )}
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" hidden onChange={onFile} />
        <input ref={galleryRef} type="file" accept="image/*,application/pdf" hidden onChange={onFile} />
      </section>

      <section>
        <h2 className="section-title">{t('trySample', lang)}</h2>
        <p className="small muted">{t('sampleNote', lang)}</p>
        <div className="samples">
          {samples.map((s) => (
            <button key={s.id} className="sample" onClick={() => openSample(s)}>
              <img src={s.image} alt="" />
              <span>{s.title[lang]}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">{t('myPapers', lang)}</h2>
        {upcoming.length === 0 ? (
          <p className="small muted">{t('noPapers', lang)}</p>
        ) : (
          <ul className="papers">
            {upcoming.map((p) => {
              const r = p.result;
              const d = r.deadline ? daysUntil(r.deadline) : null;
              return (
                <li key={p.id}>
                  <button className="paper" onClick={() => setView({ name: 'result', entry: p })}>
                    <span className={'paper-flag ' + (r.scam_risk === 'high' ? 'danger' : d !== null && d <= 3 ? 'soon' : '')} aria-hidden />
                    <span className="paper-main">
                      <span className="paper-title">{r.doc_type}</span>
                      <span className="paper-sub">
                        {r.amount != null && rupees(r.amount)}
                        {r.amount != null && r.deadline && ' · '}
                        {r.deadline && `${formatDate(r.deadline, lang)} (${t('daysLeft', lang, d)})`}
                      </span>
                    </span>
                  </button>
                  <button className="paper-remove" aria-label={t('remove', lang)}
                    onClick={() => { removePaper(p.id); setPapers(getPapers()); }}>×</button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <footer className="foot">
        <p className="small muted">🔒 {t('privacy', lang)}</p>
        <button className="link" onClick={() => setView({ name: 'research' })}>{t('research', lang)}</button>
      </footer>
    </main>
  );
}
