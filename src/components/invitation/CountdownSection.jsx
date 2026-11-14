import React from 'react';
import { useCountdown } from '../../hooks/useCountdown';
import { CalendarDays, Sparkles } from '../../utils/icons';

export function CountdownSection({ eventDate, eventTime, timezone, t }) {
  const { days, hours, minutes, seconds, isPassed } = useCountdown(eventDate, eventTime, timezone);

  const units = [
    { label: t.days, value: days },
    { label: t.hours, value: hours },
    { label: t.minutes, value: minutes },
    { label: t.seconds, value: seconds }
  ];

  return (
    <div className="invitation-countdown-block">
      <div className="countdown-header">
        <Sparkles size={14} className="countdown-sparkle" />
        <span className="countdown-kicker">
          {isPassed ? t.eventPassed : t.countdownUntil}
        </span>
      </div>

      <div className="countdown-grid">
        {units.map((unit, idx) => (
          <div className="countdown-card" key={idx}>
            <div className="countdown-digit-wrap">
              <span className="countdown-digit">
                {unit.value.toString().padStart(2, '0')}
              </span>
            </div>
            <span className="countdown-label">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
