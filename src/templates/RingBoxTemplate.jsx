import React from 'react';
import { ArrowUpLeft, Sparkles, Heart } from '../utils/icons';
import { PersonalizedGreeting } from '../components/invitation/PersonalizedGreeting';
import { CountdownSection } from '../components/invitation/CountdownSection';
import { VenueSection } from '../components/invitation/VenueSection';
import { DayTimeline } from '../components/invitation/DayTimeline';
import { RSVPSection } from '../components/invitation/RSVPSection';
import { ClosingBlessing } from '../components/invitation/ClosingBlessing';

export default function RingBoxTemplate({ invitation, hooks }) {
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
    <div className={`template-shell template-ring ${isOpened ? 'is-opened' : 'is-closed'}`}>
      {/* 3D Velvet Jewelry Ring Box Scene */}
      <section className="ring-box-scene">
        <div className="jewelry-box-perspective">
          <div className={`velvet-ring-box ${isOpened ? 'box-opened' : ''}`}>
            {/* Box Lid */}
            <div className="box-lid">
              <div className="lid-top-cushion">
                <span className="lid-monogram">♡</span>
              </div>
              <div className="lid-gold-clasp" />
            </div>

            {/* Box Interior Cushion & Ring */}
            <div className="box-base">
              <div className="box-velvet-cushion">
                <div className="diamond-ring-display">
                  <div className="ring-sparkle-halo" />
                  <div className="ring-solitaire-gem">💎</div>
                  <div className="ring-gold-band" />
                </div>
              </div>
            </div>

            {!isOpened && (
              <div className="box-action-overlay" onClick={handleOpen}>
                <button className="btn-open-ring-box">
                  <Sparkles size={14} />
                  <span>{t.touchBoxToOpen}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Revealed Engagement Card Deck */}
      <section className={`invitation-card-deck ${isOpened ? 'show-deck' : 'hide-deck'}`}>
        <article className="engagement-card-deck">
          <div className="ring-header-flourish">
            <span>💍</span>
          </div>

          <span className="formal-kicker">{t.togetherWithFamilies}</span>

          <h1 className="ring-main-names">
            <span>{firstPerson}</span>
            <i className="ring-ampersand">{relation}</i>
            <span>{secondPerson}</span>
          </h1>

          <p className="ring-event-title">{eventTitle}</p>
          <p className="ring-subtitle">{eventSubtitle}</p>

          <PersonalizedGreeting guestName={guestName} t={t} language={language} />

          <div className="ring-divider">
            <span />
            <span className="ring-symbol">♡</span>
            <span />
          </div>

          <div className="ring-date-pod">
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
