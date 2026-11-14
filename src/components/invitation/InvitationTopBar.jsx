import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  Volume2,
  VolumeX,
  CalendarDays,
  Share2,
  Globe
} from '../../utils/icons';
import { generateICS } from '../../utils/calendar';

export function InvitationTopBar({
  invitation,
  isPlayingMusic,
  onToggleMusic,
  language,
  onToggleLanguage,
  onShare,
  t
}) {
  const isArabic = language === 'ar';

  return (
    <aside className="invitation-topbar" aria-label="أدوات الدعوة">
      <div className="topbar-container">
        <Link to="/demos" className="topbar-back-btn" title={t.backToGallery}>
          {isArabic ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          <span>{t.backToGallery}</span>
        </Link>

        <div className="topbar-controls">
          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="topbar-btn lang-btn"
            title="تبديل اللغة / Toggle Language"
          >
            <Globe size={15} />
            <span>{t.toggleLanguage}</span>
          </button>

          {/* Music Toggle */}
          {invitation?.settings?.showMusic && (
            <button
              onClick={onToggleMusic}
              className={`topbar-btn music-btn ${isPlayingMusic ? 'is-playing' : ''}`}
              title={isPlayingMusic ? t.soundOn : t.soundOff}
            >
              {isPlayingMusic ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span className="sound-text">{isPlayingMusic ? t.soundOn : t.soundOff}</span>
              {isPlayingMusic && (
                <span className="audio-bars">
                  <i />
                  <i />
                  <i />
                </span>
              )}
            </button>
          )}

          {/* Calendar Download */}
          {invitation?.settings?.showCalendar && (
            <button
              onClick={() => generateICS(invitation)}
              className="topbar-btn cal-btn"
              title={t.addToCalendar}
            >
              <CalendarDays size={16} />
              <span className="btn-label-desktop">{t.addToCalendar}</span>
            </button>
          )}

          {/* Share Invitation */}
          <button onClick={onShare} className="topbar-btn share-btn" title={t.shareInvitation}>
            <Share2 size={16} />
            <span className="btn-label-desktop">{t.shareInvitation}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
