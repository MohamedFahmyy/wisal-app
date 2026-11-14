import React from 'react';
import { ArrowUpLeft, Sparkles, Heart } from '../utils/icons';
import { PersonalizedGreeting } from '../components/invitation/PersonalizedGreeting';
import { CountdownSection } from '../components/invitation/CountdownSection';
import { VenueSection } from '../components/invitation/VenueSection';
import { DayTimeline } from '../components/invitation/DayTimeline';
import { RSVPSection } from '../components/invitation/RSVPSection';
import { ClosingBlessing } from '../components/invitation/ClosingBlessing';

export default function ClassicWaxTemplate({ invitation, hooks }) {
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
    <div className={`template-shell template-classic ${isOpened ? 'is-opened' : 'is-closed'}`}>
      {/* Interactive Envelope & Wax Opening Scene */}
      <section className="envelope-hero-scene">
        <div className="envelope-perspective-wrapper">
          <div className={`classic-envelope ${isOpened ? 'envelope-open' : ''}`}>
            {/* Envelope Flap with Wax Seal */}
            <div className="envelope-top-flap" />
            
            <div className="envelope-front-pocket">
              <div className="envelope-ribbon-silk" />
              <div className="envelope-gold-frame" />

              {!isOpened && (
                <div className="wax-seal-container" onClick={handleOpen}>
                  <div className="wax-seal-badge" title={t.touchToOpen}>
                    <span className="wax-seal-letter">و</span>
                    <div className="wax-seal-rim" />
                  </div>
                  <span className="wax-seal-prompt">
                    <Sparkles size={14} />
                    {t.touchToOpen}
                  </span>
                </div>
              )}
            </div>

            {/* Emerging Card Preview Inside Envelope */}
            <div className="envelope-emerging-card" onClick={!isOpened ? handleOpen : undefined}>
              <div className="emerging-card-border">
                <span className="emerging-eyebrow">{t.togetherWithFamilies}</span>
                <div className="emerging-monogram">
                  <span>{firstPerson?.[0]}</span>
                  <i>{relation}</i>
                  <span>{secondPerson?.[0]}</span>
                </div>
                <h2 className="emerging-names">
                  {firstPerson} {relation} {secondPerson}
                </h2>
                <div className="emerging-date">{dateLabel}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="envelope-ambient-glow" />
      </section>

      {/* Revealed Full Invitation Experience */}
      <section className={`invitation-card-deck ${isOpened ? 'show-deck' : 'hide-deck'}`}>
        <article className="formal-paper-card">
          <div className="card-filigree-top">❦</div>
          <span className="formal-kicker">{t.togetherWithFamilies}</span>

          <h1 className="formal-main-names">
            <span>{firstPerson}</span>
            <i className="formal-ampersand">{relation}</i>
            <span>{secondPerson}</span>
          </h1>

          <p className="formal-event-title">{eventTitle}</p>
          <p className="formal-subtitle">{eventSubtitle}</p>

          <PersonalizedGreeting guestName={guestName} t={t} language={language} />

          <div className="formal-divider-gold">
            <span />
            <i className="divider-diamond">✦</i>
            <span />
          </div>

          <div className="formal-date-badge">
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
