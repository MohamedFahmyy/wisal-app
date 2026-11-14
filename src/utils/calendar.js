import { getEventEpochMs } from '../hooks/useCountdown.js';

/**
 * Calendar utility for generating downloadable .ics iCalendar files
 * with accurate timezone conversion and standard RFC 5545 compliance.
 */
export function createICSContent(invitation) {
  if (!invitation) return '';
  const eventTime = invitation.event?.time || '19:00';
  const eventDate = invitation.event?.date || '2026-11-30';
  const timezone = invitation.event?.timezone || 'Africa/Cairo';

  const startMs = getEventEpochMs(eventDate, eventTime, timezone);
  const startDate = new Date(startMs || Date.now());
  const durationHours = 4;
  const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);

  const formatICSDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };

  const startFormatted = formatICSDate(startDate);
  const endFormatted = formatICSDate(endDate);
  const nowFormatted = formatICSDate(new Date());

  const p = invitation.people || {};
  const first = p.firstPerson || '';
  const second = p.secondPerson ? ` & ${p.secondPerson}` : '';
  const title = `${first}${second} - ${invitation.event?.title || 'Celebration'}`;
  const location = `${invitation.venue?.name || ''}, ${invitation.venue?.address || ''}`;
  const description = `${invitation.event?.description || 'يسعدنا ويشرفنا حضوركم ومشاركتنا أجمل اللحظات'}\\n\\nالموقع على خرائط جوجل: ${invitation.venue?.mapUrl || ''}`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wisal Digital Invitations//NONSGML v1.0//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:wisal-${invitation.slug}-${startDate.getTime()}@wisal.app`,
    `DTSTAMP:${nowFormatted}`,
    `DTSTART:${startFormatted}`,
    `DTEND:${endFormatted}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

export function generateICS(invitation) {
  if (!invitation || typeof window === 'undefined') return;
  const icsContent = createICSContent(invitation);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${invitation.slug || 'invitation'}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(link.href);
}
