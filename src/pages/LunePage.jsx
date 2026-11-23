import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useParams, useLocation, Link } from 'react-router-dom';
import { saveGuestResponse } from '../utils/guestStorage';
import { submitRsvp } from '../utils/api';
import { startAutoScroll } from '../utils/autoScroll';
import { getInvitationBySlug } from '../data/invitations';
import '../styles/lune.css';

// Converts standard western numbers to Eastern Arabic numerals
function toArabicDigits(num) {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/[0-9]/g, (w) => arabicDigits[+w]);
}

export default function LunePage({ invitation: propInvitation }) {
  const [searchParams] = useSearchParams();
  const { slug: paramSlug } = useParams();
  const location = useLocation();

  // Resolve active invitation
  const pathSlug = location.pathname.split('/').filter(Boolean).pop();
  const effectiveSlug = paramSlug || pathSlug;
  const invitation = propInvitation || (effectiveSlug ? getInvitationBySlug(effectiveSlug) : null) || getInvitationBySlug('lune');

  const guestNameParam = searchParams.get('to') || searchParams.get('name') || '';
  const initialLang = searchParams.get('lang') === 'en' ? 'en' : 'ar';

  const groomAr = invitation?.people?.firstPerson || 'يوسف';
  const brideAr = invitation?.people?.secondPerson || 'ليلى';
  const groomEn = invitation?.people?.firstPersonEn || 'Youssef';
  const brideEn = invitation?.people?.secondPersonEn || 'Laila';
  const groomInit = (groomEn?.[0] || 'Y').toUpperCase();
  const brideInit = (brideEn?.[0] || 'L').toUpperCase();
  const invitationId = invitation?.id || 'inv_lune';
  const invitationSlug = invitation?.slug || 'lune';
  const audioSrc = invitation?.media?.music || '/audio/veil.mp3';

  // Language & Direction State
  const [lang, setLang] = useState(initialLang);
  const isArabic = lang === 'ar';

  // Gate Opening State
  const [isOpen, setIsOpen] = useState(false);
  const [isGateHidden, setIsGateHidden] = useState(false);

  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Countdown State: 21 August 2027, 20:00 (UTC+3 Egypt Summer Time)
  const targetDate = useRef(new Date('2027-08-21T20:00:00+03:00').getTime());
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // RSVP Form State
  const [formData, setFormData] = useState({
    name: guestNameParam,
    attending: 'yes',
    guestCount: 2,
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [thanksMsg, setThanksMsg] = useState('');
  const [formError, setFormError] = useState('');

  // Canvas Petals Ref
  const canvasRef = useRef(null);

  // Dynamic Document Title
  useEffect(() => {
    document.title = isArabic
      ? `${groomAr} و${brideAr} — تحت نور القمر، ندعوكم لفرحنا | وِصال`
      : `${groomEn} & ${brideEn} — Under the Moonlight | Wisal`;
  }, [isArabic, groomAr, brideAr, groomEn, brideEn]);

  // Live Countdown Timer
  useEffect(() => {
    const updateCountdown = () => {
      const diff = Math.max(0, targetDate.current - Date.now()) / 1000;
      setTimeLeft({
        days: Math.floor(diff / 86400),
        hours: Math.floor((diff % 86400) / 3600),
        minutes: Math.floor((diff % 3600) / 60),
        seconds: Math.floor(diff % 60)
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Falling Petals Animation on Gate Opening
  const startPetals = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = (canvas.width = window.innerWidth * dpr);
    const h = (canvas.height = window.innerHeight * dpr);

    const PETALS = ['255,255,255', '214,224,245', '236,222,190'];
    const petals = [];

    for (let i = 0; i < 50; i++) {
      petals.push({
        x: Math.random() * w,
        y: -Math.random() * h * 0.9,
        vy: (0.7 + Math.random() * 1.3) * dpr,
        sw: Math.random() * Math.PI * 2,
        r: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.04,
        s: (5 + Math.random() * 6) * dpr,
        c: PETALS[i % PETALS.length]
      });
    }

    let rafId = null;
    const step = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        if (p.y > canvas.height + 40) continue;
        alive++;
        p.sw += 0.02;
        p.y += p.vy;
        p.x += Math.sin(p.sw) * 0.8 * dpr;
        p.r += p.vr;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.sin(p.sw)));
        ctx.beginPath();
        ctx.ellipse(0, 0, p.s, p.s * 0.62, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c}, 0.95)`;
        ctx.shadowColor = 'rgba(80, 60, 40, 0.25)';
        ctx.shadowBlur = 3 * dpr;
        ctx.fill();
        ctx.restore();
      }

      if (alive > 0) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Intersection Observer for Scroll Reveals
  useEffect(() => {
    if (!isOpen) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('lune-out');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px' }
    );

    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.lune-reveal');
      elements.forEach((el) => observer.observe(el));
    }, 1500);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [isOpen]);

  // Audio Play / Pause Handler
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  // Open Invitation Handler
  const handleOpenGate = () => {
    if (isOpen) return;
    setIsOpen(true);

    // Audio Start
    if (audioRef.current) {
      audioRef.current.volume = 0.75;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }

    // Petals Shower
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTimeout(() => {
        startPetals();
      }, 900);
    }

    // Hide gate from DOM after door opening animation finishes
    setTimeout(() => {
      setIsGateHidden(true);
    }, 3000);

    // Smooth auto-scroll down the invitation showcase
    startAutoScroll({
      delay: 3500,
      speed: 46,
      stopAt: '#rsvp'
    });
  };

  // Language Toggle
  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  // RSVP Form Submission Handler
  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError(isArabic ? 'يرجى كتابة الاسم الكريم' : 'Please enter your name');
      return;
    }
    setFormError('');

    setIsSubmitting(true);
    const isYes = formData.attending === 'yes';
    const guestName = formData.name.trim();
    const guestCount = isYes ? Number(formData.guestCount) : 1;

    try {
      // 1. Submit to real backend API
      await submitRsvp({
        invitationId,
        name: guestName,
        attending: isYes ? 'yes' : 'no',
        guests: isYes ? Number(formData.guestCount) : 1,
        message: formData.message.trim()
      });

      // 2. Silent local storage backup
      try {
        saveGuestResponse({
          name: guestName,
          attending: isYes ? 'yes' : 'no',
          guests: isYes ? Number(formData.guestCount) : 0,
          message: formData.message.trim(),
          invitationId,
          slug: invitationSlug
        });
      } catch (localErr) {}

      const msg = isArabic
        ? isYes
          ? `${guestName}، مستنيينك يوم ٢١ أغسطس. اتسجل حضور ${Number(formData.guestCount)} فرد 🤍.`
          : `${guestName}، هتوحشنا، وشكرًا على كلامك الحلو 🤍.`
        : isYes
          ? `${guestName}, see you on 21 August. Party of ${Number(formData.guestCount)} 🤍.`
          : `${guestName}, you will be missed. Thank you for your kind words 🤍.`;

      setThanksMsg(msg);
      setIsSubmitted(true);
    } catch (err) {
      console.error('[RSVP Lune] Error:', err);
      setFormError(err.message || (isArabic ? 'تعذر إرسال الرد، يرجى المحاولة مرة أخرى.' : 'Submission failed, please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lune-container" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Background Audio */}
      <audio ref={audioRef} src={audioSrc} loop preload="auto" playsInline />

      {/* Floating Action Dock (Music & Language Toggle) */}
      <aside className="lune-dock" aria-label="Controls">
        <button
          type="button"
          className={`lune-btn-music ${isPlaying ? 'is-playing' : ''}`}
          onClick={toggleAudio}
          aria-label={isPlaying ? 'كتم الموسيقى' : 'تشغيل الموسيقى'}
          aria-pressed={isPlaying}
          title={isArabic ? (isPlaying ? 'كتم الموسيقى' : 'تشغيل الموسيقى') : (isPlaying ? 'Mute' : 'Play')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </button>

        <button
          type="button"
          className="lune-btn-lang"
          onClick={toggleLanguage}
          aria-label="تبديل اللغة / Change Language"
          title={isArabic ? 'English' : 'عربي'}
        >
          <span>{isArabic ? 'EN' : 'ع'}</span>
        </button>
      </aside>

      {/* Falling Petals Canvas */}
      <canvas id="lune-petals" ref={canvasRef} aria-hidden="true" />

      {/* 1. Fullscreen Opening Screen (3D Opening Doors) */}
      {!isGateHidden && (
        <button
          type="button"
          className={`lune-gate ${isOpen ? 'is-opened' : ''}`}
          onClick={handleOpenGate}
          aria-label={isArabic ? 'اضغط لفتح الدعوة' : 'Open the invitation'}
        >
          <span className="lune-stage">
            <span className="lune-scene" />
            <span className="lune-glow" />

            {/* Double Opening Doors */}
            <span className="lune-half l">
              <i />
            </span>
            <span className="lune-half r">
              <i />
            </span>

            {/* Invitation Header Top */}
            <span className="lune-top">
              <small>{isArabic ? 'دعوة خاصة إلى' : 'An invitation for'}</small>
              <b>{guestNameParam || (isArabic ? 'ضيفنا العزيز' : 'Our dear guest')}</b>
            </span>

            {/* Tap to Open CTA & Breathing Pulse */}
            <span className="lune-ring" />
            <span className="lune-cta">
              <span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M9 11V6a3 3 0 0 1 6 0v8" />
                  <path d="M15 10.5a2 2 0 0 1 4 0V15a6 6 0 0 1-6 6h-1a6 6 0 0 1-5.2-3L5 15a1.6 1.6 0 0 1 2.7-1.7L9 15" />
                </svg>
                <span>{isArabic ? 'اضغط علشان الباب يتفتح' : 'Tap to open the doors'}</span>
              </span>
            </span>
          </span>
        </button>
      )}

      {/* 2. Main Invitation Column */}
      <main className="lune-page">
        {/* Hero Section */}
        <section className="lune-hero">
          <span className="lune-bgimg" aria-hidden="true" />

          <div className="lune-in lune-wrap">
            <p className="lune-eyebrow">
              {isArabic ? 'تحت نور القمر، ندعوكم لفرحنا' : 'Under the moonlight, join us as we wed'}
            </p>

            <h1 className="lune-names">
              {isArabic ? (
                <>
                  <span className="ar">{groomAr}</span>
                  <i>&amp;</i>
                  <span className="ar">{brideAr}</span>
                </>
              ) : (
                <>
                  <span className="en">{groomEn}</span>
                  <i>&amp;</i>
                  <span className="en">{brideEn}</span>
                </>
              )}
            </h1>

            <p className="lune-when">{isArabic ? '٢١ أغسطس ٢٠٢٧' : '21.08.2027'}</p>
            <span className="lune-scroll" aria-hidden="true" />
          </div>
        </section>

        {/* Date Section */}
        <section className="lune-wrap lune-reveal lune-out" style={{ paddingTop: '12px' }}>
          <div className="lune-date">
            <span>{isArabic ? 'السبت' : 'Sat'}</span>
            <b>21</b>
            <span>{isArabic ? 'أغسطس' : 'AUG 2027'}</span>
          </div>
          <p>{isArabic ? 'ليلة البدر، ٨:٠٠ مساءً' : 'On the night of the full moon, 8:00 PM'}</p>
          <svg className="lune-rule" viewBox="0 0 120 14" aria-hidden="true">
            <path d="M0 7H48M72 7H120" stroke="currentColor" strokeWidth=".8" />
            <path d="M60 1L66 7 60 13 54 7Z" fill="none" stroke="currentColor" strokeWidth=".8" />
          </svg>
        </section>

        {/* Countdown Section */}
        <section className="lune-wrap lune-reveal lune-out" style={{ paddingTop: 0 }}>
          <h2>{isArabic ? 'لحد اليوم الكبير' : 'Until the big day'}</h2>
          <p className="lune-kicker">{isArabic ? 'العد التنازلي' : 'Countdown'}</p>
          <div className="lune-count" aria-live="polite">
            <div>
              <b>{isArabic ? toArabicDigits(timeLeft.days) : timeLeft.days}</b>
              <span>{isArabic ? 'يوم' : 'DAYS'}</span>
            </div>
            <div>
              <b>{isArabic ? toArabicDigits(timeLeft.hours) : timeLeft.hours}</b>
              <span>{isArabic ? 'ساعة' : 'HOURS'}</span>
            </div>
            <div>
              <b>{isArabic ? toArabicDigits(timeLeft.minutes) : timeLeft.minutes}</b>
              <span>{isArabic ? 'دقيقة' : 'MIN'}</span>
            </div>
            <div>
              <b>{isArabic ? toArabicDigits(timeLeft.seconds) : timeLeft.seconds}</b>
              <span>{isArabic ? 'ثانية' : 'SEC'}</span>
            </div>
          </div>
        </section>

        {/* Welcome / Story Section */}
        <section className="lune-wrap lune-tint lune-reveal lune-out">
          <h2>{isArabic ? 'أهلاً بيكم' : 'Welcome'}</h2>
          <p className="lune-lead">
            {isArabic
              ? 'على تراس فوق البحر وتحت ضوء القمر، هنرقص أول رقصة في حياتنا سوا. وجودكم هيكمّل الليلة.'
              : 'On a terrace above the sea, under the full moon, we will share our first dance. Your presence would make the night complete.'}
          </p>
        </section>

        {/* Venue Section with Map */}
        <section className="lune-reveal lune-out">
          <h2 className="lune-wrap">{isArabic ? 'المكان' : 'The venue'}</h2>
          <p className="lune-kicker">{isArabic ? 'مستنيينكم هنا' : 'Where we celebrate'}</p>

          <iframe
            className="lune-map"
            title="Moonlight Terrace Map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://maps.google.com/maps?q=New%20Alamein&z=14&output=embed"
          />

          <div className="lune-wrap">
            <p className="lune-venue">{isArabic ? 'تراس القمر' : 'Moonlight Terrace'}</p>
            <p className="lune-addr">{isArabic ? 'العلمين الجديدة، الساحل الشمالي' : 'New Alamein, North Coast'}</p>

            <div className="lune-btns">
              <a
                className="lune-btn solid"
                href="https://maps.google.com/?q=New+Alamein"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                <span>{isArabic ? 'الاتجاهات' : 'Get directions'}</span>
              </a>

              <a
                className="lune-btn"
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${groomEn} & ${brideEn} · Wedding`)}&dates=20270821T170000Z%2F20270821T220000Z&location=${encodeURIComponent(isArabic ? 'تراس القمر، العلمين الجديدة، الساحل الشمالي' : 'Moonlight Terrace, New Alamein, North Coast')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3.5" y="5" width="17" height="15.5" rx="1" />
                  <path d="M3.5 10h17M8 3v4M16 3v4" />
                </svg>
                <span>{isArabic ? 'أضف للتقويم' : 'Add to calendar'}</span>
              </a>
            </div>
          </div>
        </section>

        {/* Wedding Timeline (The Day) */}
        <section className="lune-day lune-reveal lune-out">
          <div className="lune-wrap" style={{ position: 'relative' }}>
            <h2>{isArabic ? 'برنامج اليوم' : 'The day'}</h2>
            <p className="lune-kicker">{isArabic ? 'بالساعة' : 'Hour by hour'}</p>
            <ol>
              <li>
                <time>20:00</time>
                <span>{isArabic ? 'الاستقبال على التراس' : 'Welcome on the terrace'}</span>
              </li>
              <li>
                <time>20:45</time>
                <span>{isArabic ? 'دخلة العروسين' : 'Grand entrance'}</span>
              </li>
              <li>
                <time>21:15</time>
                <span>{isArabic ? 'أول رقصة تحت القمر' : 'First dance under the moon'}</span>
              </li>
              <li>
                <time>22:00</time>
                <span>{isArabic ? 'العشا والحفلة' : 'Dinner & party'}</span>
              </li>
            </ol>
          </div>
        </section>

        {/* RSVP Section */}
        <section className="lune-wrap lune-reveal lune-out" id="rsvp">
          <h2>{isArabic ? 'هتشاركنا الفرحة؟' : 'Kindly reply'}</h2>
          <p className="lune-kicker">{isArabic ? 'تأكيد الحضور' : 'RSVP'}</p>

          {!isSubmitted ? (
            <form className="lune-form" onSubmit={handleRsvpSubmit} noValidate>
              <label className="lune-label" htmlFor="lune-name">
                <span>{isArabic ? 'الاسم' : 'Your name'}</span>
                <input
                  id="lune-name"
                  type="text"
                  name="guestname"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={isArabic ? 'اكتب اسمك الكريم' : 'Enter your full name'}
                  autoComplete="name"
                  required
                />
              </label>

              {formError && (
                <p style={{ color: '#ff8a8a', fontSize: '13px', margin: 0, textAlign: 'center' }}>
                  {formError}
                </p>
              )}

              <div className="lune-choice">
                <input
                  type="radio"
                  name="attending"
                  id="lune-yes"
                  value="yes"
                  checked={formData.attending === 'yes'}
                  onChange={() => setFormData({ ...formData, attending: 'yes' })}
                />
                <label htmlFor="lune-yes">{isArabic ? 'حاضر إن شاء الله' : 'Joyfully accept'}</label>

                <input
                  type="radio"
                  name="attending"
                  id="lune-no"
                  value="no"
                  checked={formData.attending === 'no'}
                  onChange={() => setFormData({ ...formData, attending: 'no' })}
                />
                <label htmlFor="lune-no">{isArabic ? 'بعتذر' : 'Regretfully decline'}</label>
              </div>

              {formData.attending === 'yes' && (
                <label className="lune-label" htmlFor="lune-count">
                  <span>{isArabic ? 'عدد الأفراد' : 'Number of guests'}</span>
                  <select
                    id="lune-count"
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) })}
                  >
                    <option value={1}>{isArabic ? 'فرد واحد (1)' : '1 Guest'}</option>
                    <option value={2}>{isArabic ? 'فردان (2)' : '2 Guests'}</option>
                    <option value={3}>{isArabic ? '3 أفراد' : '3 Guests'}</option>
                    <option value={4}>{isArabic ? '4 أفراد' : '4 Guests'}</option>
                  </select>
                </label>
              )}

              <label className="lune-label" htmlFor="lune-msg">
                <span>{isArabic ? 'كلمة للعروسين' : 'A note for the couple'}</span>
                <textarea
                  id="lune-msg"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={isArabic ? 'اكتب تهنئتك الجميلة للعروسين…' : 'Share your warm wishes…'}
                />
              </label>

              <button className="lune-btn solid" type="submit">
                <span>{isArabic ? 'ابعت' : 'Send reply'}</span>
              </button>
            </form>
          ) : (
            <div className="lune-thanks">
              <p className="big">{isArabic ? 'وصلتنا، شكرًا 🤍' : 'Thank you 🤍'}</p>
              <p style={{ color: 'var(--lune-muted)', fontSize: '15px', lineHeight: 1.6 }}>{thanksMsg}</p>
            </div>
          )}
        </section>

        {/* Closing Section & Monogram */}
        <section className="lune-wrap lune-closing lune-tint lune-reveal lune-out">
          <div className="lune-mono">
            {groomInit}<span style={{ fontSize: '24px', margin: '0 2px', color: 'var(--lune-accent)' }}>&amp;</span>{brideInit}
          </div>
          <p>
            {isArabic
              ? 'وجودكم معانا هو اللي هيكمل فرحتنا.'
              : 'Your presence is the greatest gift of all.'}
          </p>
          <div className="lune-sig">{isArabic ? `${groomAr} و${brideAr}` : `${groomEn} & ${brideEn}`}</div>
        </section>

        {/* Footer Brand Credit */}
        <div className="lune-wrap" style={{ paddingTop: '26px' }}>
          <p className="lune-sign">
            {isArabic ? (
              <>
                صُممت هذه الدعوة الفاخرة عبر منصة <Link to="/">وِصال — WISAL</Link>
              </>
            ) : (
              <>
                Designed with <Link to="/">Wisal — Digital Invitations</Link>
              </>
            )}
          </p>
        </div>
      </main>

      {/* Floating CTA Pill */}
      {isOpen && (
        <a
          className="lune-made"
          href="https://wa.me/201112194828?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D9%88%D9%90%D8%B5%D8%A7%D9%84%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%B7%D9%84%D8%A8%20%D8%AF%D8%B9%D9%88%D8%A9%20%D8%A5%D9%84%D9%83%D8%AA%D8%B1%D9%88%D9%86%D9%8A%D8%A9%20%D8%A8%D8%AA%D8%B5%D9%85%D9%8A%D9%85%20Lune%20(%D9%84%D9%8A%D9%84%D8%A9%20%D8%A7%D9%84%D9%82%D9%85%D8%B1)"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>{isArabic ? 'عايز دعوة زي دي؟ اطلبها من Wisal' : 'Want an invitation like this? Order from Wisal'}</span>
        </a>
      )}
    </div>
  );
}
