// Date helpers for deadlines and reminders. Pure functions, unit tested.

export function todayISO(now = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

export function daysUntil(iso, now = new Date()) {
  const [y, m, d] = iso.split('-').map(Number);
  const target = Date.UTC(y, m - 1, d);
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - today) / 86400000);
}

function shift(iso, days) {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

// Remind two days before the deadline, or today if that has already passed.
export function reminderDate(deadline, now = new Date()) {
  const twoBefore = shift(deadline, -2);
  return daysUntil(twoBefore, now) < 0 ? todayISO(now) : twoBefore;
}

export function googleCalendarUrl({ title, details, deadline, now = new Date() }) {
  const day = reminderDate(deadline, now).replace(/-/g, '');
  const next = shift(reminderDate(deadline, now), 1).replace(/-/g, '');
  const q = new URLSearchParams({ action: 'TEMPLATE', text: title, dates: `${day}/${next}`, details });
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}

export function icsFile({ title, details, deadline, now = new Date() }) {
  const day = reminderDate(deadline, now).replace(/-/g, '');
  const next = shift(reminderDate(deadline, now), 1).replace(/-/g, '');
  const esc = (s) => String(s).replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Samjho//EN', 'BEGIN:VEVENT',
    `UID:${stamp}-${Math.random().toString(36).slice(2)}@samjho`, `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${day}`, `DTEND;VALUE=DATE:${next}`,
    `SUMMARY:${esc(title)}`, `DESCRIPTION:${esc(details)}`,
    'BEGIN:VALARM', 'TRIGGER:PT9H', 'ACTION:DISPLAY', `DESCRIPTION:${esc(title)}`, 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
}
