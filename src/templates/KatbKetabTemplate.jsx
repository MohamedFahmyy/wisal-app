import React from 'react';
import { ArrowUpLeft, Sparkles, Heart } from '../utils/icons';
import { PersonalizedGreeting } from '../components/invitation/PersonalizedGreeting';
import { CountdownSection } from '../components/invitation/CountdownSection';
import { VenueSection } from '../components/invitation/VenueSection';
import { DayTimeline } from '../components/invitation/DayTimeline';
import { RSVPSection } from '../components/invitation/RSVPSection';
import { ClosingBlessing } from '../components/invitation/ClosingBlessing';

export default function KatbKetabTemplate({ invitation, hooks }) {
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
    <div className={`template-shell template-katbketab ${isOpened ? 'is-opened' : 'is-closed'}`}>
      {/* Andalusian Islamic Arch Opening Scene */}
      <section className="katbketab-hero-scene">
        <div className="andalusian-arch-frame">
          <div className="mashrabiya-pattern-top">
            <span className="islamic-star">۞</span>
            <span className="bismillah-calligraphy">بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ</span>
            <span className="islamic-star">۞</span>
          </div>

          <div className="arch-heritage-doors">
            <div className={`heritage-door-panel door-left ${isOpened ? 'panel-open-left' : ''}`}>
              <div className="mashrabiya-lattice" />
              <div className="brass-knocker-ring">◎</div>
            </div>

            <div className={`heritage-door-panel door-right ${isOpened ? 'panel-open-right' : ''}`}>
              <div className="mashrabiya-lattice" />
              <div className="brass-knocker-ring">◎</div>
            </div>

            {!isOpened && (
              <div className="heritage-door-action" onClick={handleOpen}>
                <div className="fanoos-lantern">
                  <span className="fanoos-glow">🕯️</span>
                  <span className="lantern-art">🏮</span>
                </div>
                <button className="btn-open-heritage">
                  <Sparkles size={14} />
                  <span>{t.touchToOpen}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Revealed Islamic Marriage Contract Deck */}
      <section className={`invitation-card-deck ${isOpened ? 'show-deck' : 'hide-deck'}`}>
        <article className="katbketab-card-deck">
          <div className="calligraphy-banner">
            <p className="ayah-calligraphy">
              «وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»
            </p>
          </div>

          <div className="dua-blessing-kicker">
            <span>«بَارَكَ اللَّهُ لَهُمَا وَبَارَكَ عَلَيْهِمَا وَجَمَعَ بَيْنَهُمَا فِي خَيْرٍ»</span>
          </div>

          <h1 className="katbketab-main-names">
            <span>{firstPerson}</span>
            <i className="katbketab-ampersand">{relation}</i>
            <span>{secondPerson}</span>
          </h1>

          <p className="katbketab-event-title">{eventTitle}</p>
          <p className="katbketab-subtitle">{eventSubtitle}</p>

          <PersonalizedGreeting guestName={guestName} t={t} language={language} />

          <div className="katbketab-divider">
            <span />
            <span className="arabesque-star">۞</span>
            <span />
          </div>

          <div className="katbketab-date-pod">
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
