import React from 'react';
import { ArrowUpLeft, Sparkles, Heart } from '../utils/icons';
import { PersonalizedGreeting } from '../components/invitation/PersonalizedGreeting';
import { CountdownSection } from '../components/invitation/CountdownSection';
import { VenueSection } from '../components/invitation/VenueSection';
import { DayTimeline } from '../components/invitation/DayTimeline';
import { RSVPSection } from '../components/invitation/RSVPSection';
import { ClosingBlessing } from '../components/invitation/ClosingBlessing';

export default function RoseArchTemplate({ invitation, hooks }) {
  const { isOpened, handleOpen, language, guestName, t } = hooks;
  const isArabic = language === 'ar';

  const firstPerson = isArabic ? invitation.people.firstPerson : (invitation.people.firstPersonEn || invitation.people.firstPerson);
  const secondPerson = isArabic ? invitation.people.secondPerson : (invitation.people.secondPersonEn || invitation.people.secondPerson);
  const relation = invitation.people.relation || '&';
  const eventTitle = isArabic ? invitation.event.title : (invitation.event.titleEn || invitation.event.title);
  const eventSubtitle = isArabic ? invitation.event.subtitle : (invitation.event.subtitleEn || invitation.event.subtitle);
  const dateLabel = isArabic ? invitation.event.dateFormatted : (invitation.event.dateFormattedEn || invitation.event.dateFormatted);
  const timeLabel = isArabic ? invitation.event.timeFormatted : (invitation.event.timeFormattedEn || invitation.event.timeFormatted);

  return (
    <div className={`template-shell template-rose ${isOpened ? 'is-opened' : 'is-closed'}`}>
      {/* Floating Rose Petals Animation Background */}
      <div className="floating-petals-field" aria-hidden="true">
        <span className="petal p1">🌸</span>
        <span className="petal p2">💮</span>
        <span className="petal p3">🌸</span>
        <span className="petal p4">🌺</span>
        <span className="petal p5">🌸</span>
        <span className="petal p6">💮</span>
      </div>

      {/* Romantic Rose Arch Opening Scene */}
      <section className="rose-arch-scene">
        <div className="rose-arch-structure">
          <div className="floral-arch-crown">
            <span className="arch-flower af1">🌹</span>
            <span className="arch-flower af2">🌸</span>
            <span className="arch-flower af3">🌹</span>
            <span className="arch-flower af4">🌸</span>
            <span className="arch-flower af5">🌹</span>
          </div>

          <div className="arch-veil-wrap">
            <div className={`arch-curtain curtain-left ${isOpened ? 'curtain-drawn' : ''}`} />
            <div className={`arch-curtain curtain-right ${isOpened ? 'curtain-drawn' : ''}`} />

            {!isOpened && (
              <div className="arch-unveil-action" onClick={handleOpen}>
                <div className="ribbon-bow-seal">
                  <span className="bow-art">🎀</span>
                  <span className="ribbon-text">{firstPerson} & {secondPerson}</span>
                </div>
                <button className="btn-unveil-arch">
                  <Sparkles size={14} />
                  <span>{t.touchToOpen}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Revealed Rose Card Deck */}
      <section className={`invitation-card-deck ${isOpened ? 'show-deck' : 'hide-deck'}`}>
        <article className="rose-card-body">
          <div className="rose-card-top-ornament">
            <span>❦</span>
          </div>

          <span className="formal-kicker">{t.togetherWithFamilies}</span>

          <h1 className="rose-main-names">
            <span>{firstPerson}</span>
            <i className="rose-ampersand">{relation}</i>
            <span>{secondPerson}</span>
          </h1>

          <p className="rose-event-title">{eventTitle}</p>
          <p className="rose-subtitle">{eventSubtitle}</p>

          <PersonalizedGreeting guestName={guestName} t={t} language={language} />

          <div className="rose-divider">
            <span />
            <span className="rose-glyph">♡</span>
            <span />
          </div>

          <div className="rose-date-pod">
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
            secondPerson={secondPerson}
            relation={relation}
          />
        </article>
      </section>
    </div>
  );
}
