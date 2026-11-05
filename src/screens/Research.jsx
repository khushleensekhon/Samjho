import { useState } from 'react';
import { summary, toCSV, clearEvents } from '../store.js';

// English only: this screen is for the person running user-testing sessions.
export default function Research({ onBack }) {
  const [s, setS] = useState(summary);
  const fmt = (v) => (v === null ? '—' : v + '%');
  const rows = [
    ['Sessions', s.sessions],
    ['Real papers explained', s.papers],
    ['Examples opened', s.samples],
    ['Failed requests', s.failures],
    ['Scams flagged (real papers)', s.scams],
    ['Papers with a deadline', s.withDeadline],
    ['"Listen" used', s.listened],
    ['Reminders added', s.reminders],
    ['Shared with family', s.shared],
    ['User said correct', `${s.feedbackYes} / ${s.feedbackYes + s.feedbackNo} (${fmt(s.correctRate)})`],
  ];

  function download() {
    const blob = new Blob([toCSV()], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `samjho-events-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <main className="screen">
      <div className="header">
        <button className="back" onClick={onBack} aria-label="Back">←</button>
        <span className="header-title">User testing metrics</span>
      </div>
      <p className="small muted">
        Events recorded on this device only. Export the CSV after each test session, then reset before the next person.
      </p>
      <table className="metrics">
        <tbody>
          {rows.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}
        </tbody>
      </table>
      <div className="two-btn">
        <button className="btn primary" onClick={download}>Export CSV</button>
        <button className="btn secondary" onClick={() => { clearEvents(); setS(summary()); }}>Reset</button>
      </div>
    </main>
  );
}
