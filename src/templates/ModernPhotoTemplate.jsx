import React from 'react';
import { ArrowUpLeft, Sparkles, Heart, Camera } from '../utils/icons';
import { PersonalizedGreeting } from '../components/invitation/PersonalizedGreeting';
import { CountdownSection } from '../components/invitation/CountdownSection';
import { VenueSection } from '../components/invitation/VenueSection';
import { DayTimeline } from '../components/invitation/DayTimeline';
import { RSVPSection } from '../components/invitation/RSVPSection';
import { PhotoGallerySection } from '../components/invitation/PhotoGallerySection';
import { ClosingBlessing } from '../components/invitation/ClosingBlessing';

export default function ModernPhotoTemplate({ invitation, hooks }) {
  const { isOpened, handleOpen, language, guestName, t } = hooks;
  const isArabic = language === 'ar';

  const firstPerson = isArabic ? invitation.people.firstPerson : (invitation.people.firstPersonEn || invitation.people.firstPerson);
  const secondPerson = isArabic ? invitation.people.secondPerson : (invitation.people.secondPersonEn || invitation.people.secondPerson);
  const relation = invitation.people.relation || '';
  const eventTitle = isArabic ? invitation.event.title : (invitation.event.titleEn || invitation.event.title);
  const eventSubtitle = isArabic ? invitation.event.subtitle : (invitation.event.subtitleEn || invitation.event.subtitle);
  const dateLabel = isArabic ? invitation.event.dateFormatted : (invitation.event.dateFormattedEn || invitation.event.dateFormatted);
  const timeLabel = isArabic ? invitation.event.timeFormatted : (invitation.event.timeFormattedEn || invitation.event.timeFormatted);

  return (
    <div className={`template-shell template-modern ${isOpened ? 'is-opened' : 'is-closed'}`}>
      {/* Editorial Hero Photography with Glassmorphic Card */}
      <section className="modern-hero-scene">
        <div className="modern-cover-frame">
          <div
            className="modern-cover-img"
            style={{ backgroundImage: `url(${invitation.media.coverImage})` }}
          >
            <div className="modern-cover-scrim" />
          </div>

          <div className="modern-editorial-overlay">
            <span className="modern-category-tag">{invitation.categoryLabelEn || 'CELEBRATION'}</span>
            <h1 className="modern-headline">
              {firstPerson} {secondPerson ? `${relation} ${secondPerson}` : ''}
            </h1>
            <p className="modern-subhead">{eventTitle}</p>

            {!isOpened && (
              <div className="modern-action-wrap" onClick={handleOpen}>
                <button className="btn-modern-open">
                  <Sparkles size={16} />
                  <span>{t.touchToOpen}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Revealed Modern Editorial Content Deck */}
      <section className={`invitation-card-deck ${isOpened ? 'show-deck' : 'hide-deck'}`}>
        <article className="modern-card-deck">
          <span className="formal-kicker">{t.togetherWithFamilies}</span>

          <h2 className="modern-deck-names">
            <span>{firstPerson}</span>
            {secondPerson && <i className="modern-ampersand">{relation}</i>}
            {secondPerson && <span>{secondPerson}</span>}
          </h2>

          <p className="modern-event-title">{eventTitle}</p>
          <p className="modern-subtitle">{eventSubtitle}</p>

          <PersonalizedGreeting guestName={guestName} t={t} language={language} />

          <div className="modern-divider">
            <span />
            <span className="modern-bullet">✦</span>
            <span />
          </div>

          <div className="modern-date-pod">
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

          {/* Photo Gallery Grid */}
          <PhotoGallerySection
            gallery={invitation.media.gallery}
            title={eventTitle}
            language={language}
          />

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
