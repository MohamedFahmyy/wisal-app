import React from 'react';
import { ArrowUpLeft, Sparkles, Heart } from '../utils/icons';
import { PersonalizedGreeting } from '../components/invitation/PersonalizedGreeting';
import { CountdownSection } from '../components/invitation/CountdownSection';
import { VenueSection } from '../components/invitation/VenueSection';
import { DayTimeline } from '../components/invitation/DayTimeline';
import { RSVPSection } from '../components/invitation/RSVPSection';
import { ClosingBlessing } from '../components/invitation/ClosingBlessing';

export default function ElegantLetterTemplate({ invitation, hooks }) {
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
    <div className={`template-shell template-letter ${isOpened ? 'is-opened' : 'is-closed'}`}>
      {/* Vintage Calligraphy Airmail Letter Opening Scene */}
      <section className="letter-hero-scene">
        <div className="vintage-envelope-wrap">
          <div className={`vintage-envelope ${isOpened ? 'letter-extracted' : ''}`}>
            {/* Postal Stamp & Postmark */}
            <div className="airmail-postmark">
              <span className="postage-stamp">💌</span>
              <div className="postmark-circle">CAIRO • 2027</div>
            </div>

            <div className="envelope-handwritten-addressee">
              <span>Pour notre cher invité</span>
              <b>{guestName || (isArabic ? 'ضيوفنا الأعزاء' : 'Our Beloved Guests')}</b>
            </div>

            {!isOpened && (
              <div className="letter-action-overlay" onClick={handleOpen}>
                <button className="btn-read-letter">
                  <Sparkles size={14} />
                  <span>{t.touchToRead}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Revealed Unfolded Parchment Stationery */}
      <section className={`invitation-card-deck ${isOpened ? 'show-deck' : 'hide-deck'}`}>
        <article className="parchment-letter-deck">
          <div className="parchment-crease top-crease" />
          <div className="parchment-crease bottom-crease" />

          <div className="letter-script-header">
            <span className="cursive-tag">A Love Letter to Remember</span>
          </div>

          <span className="formal-kicker">{t.togetherWithFamilies}</span>

          <h1 className="letter-main-names">
            <span>{firstPerson}</span>
            <i className="letter-ampersand">{relation}</i>
            <span>{secondPerson}</span>
          </h1>

          <p className="letter-event-title">{eventTitle}</p>
          <p className="letter-subtitle">{eventSubtitle}</p>

          <PersonalizedGreeting guestName={guestName} t={t} language={language} />

          <div className="letter-divider">
            <span />
            <span className="quill-icon">✒</span>
            <span />
          </div>

          <div className="letter-date-pod">
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
