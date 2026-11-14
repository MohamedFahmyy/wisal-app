import React from 'react';
import { ArrowUpLeft, Sparkles, Heart } from '../utils/icons';
import { PersonalizedGreeting } from '../components/invitation/PersonalizedGreeting';
import { CountdownSection } from '../components/invitation/CountdownSection';
import { VenueSection } from '../components/invitation/VenueSection';
import { DayTimeline } from '../components/invitation/DayTimeline';
import { RSVPSection } from '../components/invitation/RSVPSection';
import { ClosingBlessing } from '../components/invitation/ClosingBlessing';

export default function BirthdayGiftTemplate({ invitation, hooks }) {
  const { isOpened, handleOpen, language, guestName, t } = hooks;
  const isArabic = language === 'ar';

  const firstPerson = isArabic ? invitation.people.firstPerson : (invitation.people.firstPersonEn || invitation.people.firstPerson);
  const eventTitle = isArabic ? invitation.event.title : (invitation.event.titleEn || invitation.event.title);
  const eventSubtitle = isArabic ? invitation.event.subtitle : (invitation.event.subtitleEn || invitation.event.subtitle);
  const dateLabel = isArabic ? invitation.event.dateFormatted : (invitation.event.dateFormattedEn || invitation.event.dateFormatted);
  const timeLabel = isArabic ? invitation.event.timeFormatted : (invitation.event.timeFormattedEn || invitation.event.timeFormatted);

  return (
    <div className={`template-shell template-birthday ${isOpened ? 'is-opened' : 'is-closed'}`}>
      {/* Confetti Particles on Open */}
      <div className={`confetti-shower ${isOpened ? 'is-active' : ''}`} aria-hidden="true">
        <span className="confetti c1">🎉</span>
        <span className="confetti c2">✨</span>
        <span className="confetti c3">🎈</span>
        <span className="confetti c4">🎊</span>
        <span className="confetti c5">✨</span>
        <span className="confetti c6">🥳</span>
      </div>

      {/* Birthday Surprise Gift Box Scene */}
      <section className="gift-box-scene">
        <div className="gift-box-perspective">
          <div className={`festive-gift-box ${isOpened ? 'gift-opened' : ''}`}>
            {/* Box Lid with Bow */}
            <div className="gift-lid">
              <div className="gift-ribbon-bow">🎀</div>
              <div className="gift-lid-lip" />
            </div>

            {/* Box Base */}
            <div className="gift-base">
              <div className="gift-ribbon-cross-v" />
              <div className="gift-ribbon-cross-h" />
              <div className="gift-monogram">
                <span>{firstPerson}</span>
              </div>
            </div>

            {!isOpened && (
              <div className="gift-action-overlay" onClick={handleOpen}>
                <button className="btn-open-gift">
                  <Sparkles size={14} />
                  <span>{t.touchBoxToOpen}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Revealed Birthday Party Card Deck */}
      <section className={`invitation-card-deck ${isOpened ? 'show-deck' : 'hide-deck'}`}>
        <article className="birthday-card-deck">
          <div className="birthday-header-emoji">
            <span>🎂 ✨ 🎈</span>
          </div>

          <span className="birthday-kicker">LET'S CELEBRATE</span>

          <h1 className="birthday-main-name">
            {firstPerson}
          </h1>

          <p className="birthday-event-title">{eventTitle}</p>
          <p className="birthday-subtitle">{eventSubtitle}</p>

          <PersonalizedGreeting guestName={guestName} t={t} language={language} />

          <div className="birthday-divider">
            <span />
            <span className="party-bullet">✦</span>
            <span />
          </div>

          <div className="birthday-date-pod">
            <span className="save-date-label">{t.saveTheDate}</span>
            <h3 className="formal-highlighted-date">{dateLabel}</h3>
            <span className="formal-time-label">{timeLabel}</span>
          </div>

          {invitation.settings.showCountdown && (
            <CountdownSection
              eventDate={invitation.event.date}
              eventTime={invitation.event.time}
              timezone={invitation.event.timezone}
              t={t}
            />
          )}

          {invitation.settings.showLocation && (
            <VenueSection venue={invitation.venue} t={t} language={language} />
          )}

          <DayTimeline schedule={invitation.event.schedule} t={t} language={language} />

          {invitation.settings.showRSVP && (
            <RSVPSection guestName={guestName} t={t} language={language} />
          )}

          <ClosingBlessing
            t={t}
            firstPerson={firstPerson}
            secondPerson=""
            relation=""
          />
        </article>
      </section>
    </div>
  );
}
