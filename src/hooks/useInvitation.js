import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { globalAudio } from '../utils/audio';
import { translations } from '../utils/localization';

export function useInvitation(invitation) {
  const [searchParams] = useSearchParams();
  const [isOpened, setIsOpened] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [language, setLanguage] = useState(invitation?.language || 'ar');
  const [copiedToast, setCopiedToast] = useState(false);

  // Personalized guest parameter (e.g. ?to=Ahmed or ?guest=سارة)
  const guestName = searchParams.get('to') || searchParams.get('guest') || searchParams.get('name') || '';

  // Current translation dictionary
  const t = translations[language] || translations.ar;

  // Sync HTML direction with current language
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    return () => {
      // Restore default Arabic on unmount
      document.documentElement.lang = 'ar';
      document.documentElement.dir = 'rtl';
    };
  }, [language]);

  // Direct table wish link handling (?wish=1 or #rsvp)
  useEffect(() => {
    if (searchParams.get('wish') === '1' || (typeof window !== 'undefined' && window.location.hash === '#rsvp')) {
      setIsOpened(true);
      setTimeout(() => {
        const el = document.getElementById('rsvp');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 700);
    }
  }, [searchParams]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      globalAudio.stop();
    };
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleOpen = () => {
    setIsOpened(true);
    // If music is enabled in invitation settings and not yet playing, start gentle ambient melody
    if (invitation?.settings?.showMusic && !isPlayingMusic) {
      globalAudio.toggle(invitation.media?.music, (playing) => {
        setIsPlayingMusic(playing);
      });
    }
  };

  const toggleMusic = () => {
    globalAudio.toggle(invitation?.media?.music, (playing) => {
      setIsPlayingMusic(playing);
    });
  };

  const copyShareLink = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 3000);
      });
    }
  };

  return {
    isOpened,
    setIsOpened,
    handleOpen,
    isPlayingMusic,
    toggleMusic,
    language,
    setLanguage,
    toggleLanguage,
    guestName,
    t,
    copiedToast,
    copyShareLink
  };
}
