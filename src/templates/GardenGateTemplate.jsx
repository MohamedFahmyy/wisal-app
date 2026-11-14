import React from 'react';
import { ArrowUpLeft, Sparkles, Heart } from '../utils/icons';
import { PersonalizedGreeting } from '../components/invitation/PersonalizedGreeting';
import { CountdownSection } from '../components/invitation/CountdownSection';
import { VenueSection } from '../components/invitation/VenueSection';
import { DayTimeline } from '../components/invitation/DayTimeline';
import { RSVPSection } from '../components/invitation/RSVPSection';
import { ClosingBlessing } from '../components/invitation/ClosingBlessing';

export default function GardenGateTemplate({ invitation, hooks }) {
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
    <div className={`template-shell template-garden ${isOpened ? 'is-opened' : 'is-closed'}`}>
      {/* 3D Garden Gates Opening Scene */}
      <section className="garden-gate-hero">
        <div className="garden-ivy-frame">
          <div className="floral-garland-top">
            <span>🌸</span>
            <span>🌿</span>
            <span>🌹</span>
            <span>🌿</span>
            <span>🌸</span>
          </div>

          <div className="gate-perspective-container">
            {/* Left Gate Wing */}
            <div className={`gate-wing gate-left ${isOpened ? 'wing-open' : ''}`}>
              <div className="gate-ironwork">
                <div className="iron-arch" />
                <div className="iron-scrollwork">❀</div>
                <div className="iron-spindles" />
              </div>
            </div>

            {/* Right Gate Wing */}
            <div className={`gate-wing gate-right ${isOpened ? 'wing-open' : ''}`}>
              <div className="gate-ironwork">
                <div className="iron-arch" />
                <div className="iron-scrollwork">❀</div>
                <div className="iron-spindles" />
              </div>
            </div>

            {/* Central Latch / Prompt */}
            {!isOpened && (
              <div className="gate-latch-action" onClick={handleOpen}>
                <div className="gate-lock-medallion">
                  <span className="latch-icon">❧</span>
                  <span className="latch-monogram">{firstPerson?.[0]}&{secondPerson?.[0]}</span>
                </div>
                <button className="btn-open-gate">
                  <Sparkles size={14} />
                  <span>{t.touchGateToOpen}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Revealed Garden Pavilion Invitation Deck */}
      <section className={`invitation-card-deck ${isOpened ? 'show-deck' : 'hide-deck'}`}>
        <article className="garden-pavilion-card">
          <div className="botanical-header-crest">
            <span className="leaf-wreath">🌿 ❦ 🌿</span>
          </div>

          <span className="formal-kicker">{t.togetherWithFamilies}</span>

          <h1 className="garden-main-names">
            <span>{firstPerson}</span>
            <i className="garden-ampersand">{relation}</i>
            <span>{secondPerson}</span>
          </h1>

          <p className="garden-event-title">{eventTitle}</p>
          <p className="garden-subtitle">{eventSubtitle}</p>

          <PersonalizedGreeting guestName={guestName} t={t} language={language} />

          <div className="garden-divider">
            <span />
            <span className="flower-bullet">✿</span>
            <span />
          </div>

          <div className="garden-date-box">
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
