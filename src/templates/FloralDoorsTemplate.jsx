import React from 'react';
import { ArrowUpLeft, Sparkles, Heart } from '../utils/icons';
import { PersonalizedGreeting } from '../components/invitation/PersonalizedGreeting';
import { CountdownSection } from '../components/invitation/CountdownSection';
import { VenueSection } from '../components/invitation/VenueSection';
import { DayTimeline } from '../components/invitation/DayTimeline';
import { RSVPSection } from '../components/invitation/RSVPSection';
import { ClosingBlessing } from '../components/invitation/ClosingBlessing';

export default function FloralDoorsTemplate({ invitation, hooks }) {
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
    <div className={`template-shell template-doors ${isOpened ? 'is-opened' : 'is-closed'}`}>
      {/* Grand Palace Double Doors Opening Scene */}
      <section className="floral-doors-scene">
        <div className="doors-arch-frame">
          <div className="arch-garland-wreath">
            <span>🌸</span>
            <span>🌿</span>
            <span>🌺</span>
            <span>🌿</span>
            <span>🌸</span>
          </div>

          <div className="double-doors-container">
            {/* Left Door */}
            <div className={`palace-door door-left ${isOpened ? 'door-swing-left' : ''}`}>
              <div className="door-panel-carving">
                <div className="brass-knocker-handle">🦁</div>
              </div>
            </div>

            {/* Right Door */}
            <div className={`palace-door door-right ${isOpened ? 'door-swing-right' : ''}`}>
              <div className="door-panel-carving">
                <div className="brass-knocker-handle">🦁</div>
              </div>
            </div>

            {!isOpened && (
              <div className="doors-action-overlay" onClick={handleOpen}>
                <div className="doors-crest-seal">
                  <span>W</span>
                </div>
                <button className="btn-open-doors">
                  <Sparkles size={14} />
                  <span>{t.touchGateToOpen}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Revealed Grand Ballroom Card Deck */}
      <section className={`invitation-card-deck ${isOpened ? 'show-deck' : 'hide-deck'}`}>
        <article className="doors-card-deck">
          <div className="doors-card-crown">
            <span>🏛️ ❦ 🏛️</span>
          </div>

          <span className="formal-kicker">{t.togetherWithFamilies}</span>

          <h1 className="doors-main-names">
            <span>{firstPerson}</span>
            <i className="doors-ampersand">{relation}</i>
            <span>{secondPerson}</span>
          </h1>

          <p className="doors-event-title">{eventTitle}</p>
          <p className="doors-subtitle">{eventSubtitle}</p>

          <PersonalizedGreeting guestName={guestName} t={t} language={language} />

          <div className="doors-divider">
            <span />
            <span className="doors-bullet">⚜</span>
            <span />
          </div>

          <div className="doors-date-pod">
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
