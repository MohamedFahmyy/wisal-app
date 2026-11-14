import React from 'react';
import { ArrowUpLeft, Sparkles, Heart } from '../utils/icons';
import { PersonalizedGreeting } from '../components/invitation/PersonalizedGreeting';
import { CountdownSection } from '../components/invitation/CountdownSection';
import { VenueSection } from '../components/invitation/VenueSection';
import { DayTimeline } from '../components/invitation/DayTimeline';
import { RSVPSection } from '../components/invitation/RSVPSection';
import { ClosingBlessing } from '../components/invitation/ClosingBlessing';

export default function ProvenceTemplate({ invitation, hooks }) {
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
    <div className={`template-shell template-provence ${isOpened ? 'is-opened' : 'is-closed'}`}>
      {/* French Provence Shuttered Window Scene */}
      <section className="provence-window-scene">
        <div className="provence-window-frame">
          <div className="window-arch-top">
            <span className="lavender-sprig">🪻</span>
            <span className="window-title">VILLA DE PROVENCE</span>
            <span className="lavender-sprig">🪻</span>
          </div>

          <div className="window-perspective-box">
            {/* Left Shutter */}
            <div className={`window-shutter shutter-left ${isOpened ? 'shutter-open-left' : ''}`}>
              <div className="shutter-louvers">
                <span /><span /><span /><span />
              </div>
            </div>

            {/* Right Shutter */}
            <div className={`window-shutter shutter-right ${isOpened ? 'shutter-open-right' : ''}`}>
              <div className="shutter-louvers">
                <span /><span /><span /><span />
              </div>
            </div>

            {/* Scenery Behind Window */}
            <div className="window-landscape-view">
              <div className="sunset-gradient" />
              <div className="lavender-field-silhouette">🪻 🪻 🪻 🪻 🪻</div>
            </div>

            {!isOpened && (
              <div className="window-action-overlay" onClick={handleOpen}>
                <button className="btn-open-window">
                  <Sparkles size={14} />
                  <span>{t.touchWindowToOpen}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Revealed Provence Card Deck */}
      <section className={`invitation-card-deck ${isOpened ? 'show-deck' : 'hide-deck'}`}>
        <article className="provence-card-deck">
          <div className="provence-crest">
            <span>🪻 ❦ 🪻</span>
          </div>

          <span className="formal-kicker">{t.togetherWithFamilies}</span>

          <h1 className="provence-main-names">
            <span>{firstPerson}</span>
            <i className="provence-ampersand">{relation}</i>
            <span>{secondPerson}</span>
          </h1>

          <p className="provence-event-title">{eventTitle}</p>
          <p className="provence-subtitle">{eventSubtitle}</p>

          <PersonalizedGreeting guestName={guestName} t={t} language={language} />

          <div className="provence-divider">
            <span />
            <span className="lavender-bullet">✿</span>
            <span />
          </div>

          <div className="provence-date-pod">
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
