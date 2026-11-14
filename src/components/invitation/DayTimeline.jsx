import React from 'react';
import { Clock } from '../../utils/icons';

export function DayTimeline({ schedule, t, language }) {
  if (!schedule || schedule.length === 0) return null;
  const isArabic = language === 'ar';

  return (
    <div className="invitation-timeline-block">
      <div className="timeline-header">
        <Clock size={16} />
        <span className="timeline-eyebrow">{t.theSchedule}</span>
      </div>

      <div className="timeline-list">
        {schedule.map((item, index) => {
          const time = isArabic ? item.time : (item.timeEn || item.time);
          const title = isArabic ? item.title : (item.titleEn || item.title);

          return (
            <div className="timeline-item" key={index}>
              <div className="timeline-time">
                <span>{time}</span>
              </div>
              <div className="timeline-dot-wrap">
                <div className="timeline-dot" />
                {index < schedule.length - 1 && <div className="timeline-line" />}
              </div>
              <div className="timeline-details">
                <h4 className="timeline-event-title">{title}</h4>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
