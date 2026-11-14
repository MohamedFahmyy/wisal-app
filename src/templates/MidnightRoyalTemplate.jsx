import React from 'react';
import { ArrowUpLeft, Sparkles, Heart } from '../utils/icons';
import { PersonalizedGreeting } from '../components/invitation/PersonalizedGreeting';
import { CountdownSection } from '../components/invitation/CountdownSection';
import { VenueSection } from '../components/invitation/VenueSection';
import { DayTimeline } from '../components/invitation/DayTimeline';
import { RSVPSection } from '../components/invitation/RSVPSection';
import { ClosingBlessing } from '../components/invitation/ClosingBlessing';

export default function MidnightRoyalTemplate({ invitation, hooks }) {
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
    <div className={`template-shell template-midnight ${isOpened ? 'is-opened' : 'is-closed'}`}>
      {/* Royal Constellation Background */}
      <div className="midnight-stars-field" aria-hidden="true">
        <span className="star s1">✧</span>
        <span className="star s2">✦</span>
        <span className="star s3">·</span>
        <span className="star s4">✧</span>
        <span className="star s5">✦</span>
        <span className="star s6">·</span>
        <span className="star s7">✧</span>
      </div>

      {/* Celestial Royal Seal Opening Scene */}
      <section className="midnight-hero-scene">
        <div className="royal-crest-frame">
          <div className="celestial-monogram-circle">
            <div className="orbit-track" />
            <div className="royal-moon">☾</div>
            <div className="crest-names">
              <span>{firstPerson}</span>
              <i>✧</i>
              <span>{secondPerson}</span>
            </div>
          </div>

          {!isOpened && (
            <div className="royal-open-action" onClick={handleOpen}>
              <div className="royal-gold-seal">
                <span className="seal-emblem">♛</span>
                <span className="seal-tagline">ROYAL GALA</span>
              </div>
              <button className="btn-royal-open">
                <Sparkles size={14} />
                <span>{t.touchToOpen}</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Revealed Royal Midnight Velvet Card */}
      <section className={`invitation-card-deck ${isOpened ? 'show-deck' : 'hide-deck'}`}>
        <article className="midnight-card-deck">
          <div className="midnight-card-crest">
            <span className="crown-ornament">♛</span>
          </div>

          <span className="formal-kicker gold-foil">{t.togetherWithFamilies}</span>

          <h1 className="midnight-main-names gold-foil">
            <span>{firstPerson}</span>
            <i className="royal-ampersand">{relation}</i>
            <span>{secondPerson}</span>
          </h1>

          <p className="midnight-event-title gold-foil">{eventTitle}</p>
          <p className="midnight-subtitle">{eventSubtitle}</p>

          <PersonalizedGreeting guestName={guestName} t={t} language={language} />

          <div className="midnight-divider">
            <span />
            <span className="star-bullet">✦</span>
            <span />
          </div>

          <div className="midnight-date-pod">
            <span className="save-date-label">{t.saveTheDate}</span>
            <h3 className="formal-highlighted-date gold-foil">{dateLabel}</h3>
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
