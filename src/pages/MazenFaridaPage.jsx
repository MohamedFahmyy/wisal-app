import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { saveGuestResponse } from '../utils/guestStorage';
import '../styles/mazen-farida.css';

// Converts standard western numbers to Eastern Arabic numerals (١، ٢، ٣...)
function toArabicDigits(num) {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).padStart(2, '0').replace(/[0-9]/g, (w) => arabicDigits[+w]);
}

// Scratch-To-Reveal Card Component
function ScratchCard({ value, label, isMonth = false }) {
  const canvasRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const isDrawing = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1), 3);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Render metallic gold gradient cover
    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0, '#fff9e8');
    grad.addColorStop(0.3, '#f9eac8');
    grad.addColorStop(0.65, '#efd29b');
    grad.addColorStop(1, '#d4a765');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw subtle luster lines
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    for (let x = -rect.height; x < rect.width + rect.height; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + rect.height, rect.height);
      ctx.stroke();
    }
    ctx.restore();
  }, [isRevealed]);

  const handlePointerDown = (e) => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    isDrawing.current = true;
    const rect = canvas.getBoundingClientRect();
    lastPoint.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerMove = (e) => {
    if (!isDrawing.current || isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const currentPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 32;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();
    ctx.restore();

    lastPoint.current = currentPoint;

    // Check how much is scratched
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      let clearPixels = 0;
      const totalPixels = data.length / 4;
      const sampleStep = 32; // sampling for smooth 60fps performance
      let sampled = 0;

      for (let i = 3; i < data.length; i += 4 * sampleStep) {
        sampled++;
        if (data[i] === 0) clearPixels++;
      }

      if (clearPixels / sampled > 0.35) {
        setIsRevealed(true);
      }
    } catch {
      // Ignored if cross-origin or canvas read error
    }
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
  };

  return (
    <div className="mf-scratch-card-col">
      <div className={`mf-scratch-card ${isRevealed ? 'is-revealed' : ''}`}>
        <span className={`mf-scratch-value ${isMonth ? 'is-month' : ''}`}>
          {value}
        </span>
        {!isRevealed && (
          <canvas
            ref={canvasRef}
            className="mf-scratch-canvas"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
        )}
      </div>
      <span className="mf-scratch-label">{label}</span>
    </div>
  );
}

// Arabic Ornamental Divider
function ArabicDivider() {
  return (
    <div className="mf-divider" aria-hidden="true">
      <span className="mf-divider-line" />
      <span className="mf-divider-dot" />
      <div className="mf-divider-diamond-box">
        <span className="mf-divider-diamond-outer" />
        <span className="mf-divider-diamond-inner" />
      </div>
      <span className="mf-divider-dot" />
      <span className="mf-divider-line right" />
    </div>
  );
}

export default function MazenFaridaPage() {
  const [searchParams] = useSearchParams();
  const guestName = searchParams.get('to');
  const wishDirect = searchParams.get('wish') === '1';

  // Intro & Audio State
  const [isIntroOpening, setIsIntroOpening] = useState(false);
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  // Audio & Video Refs
  const audioRef = useRef(null);
  const introVideoRef = useRef(null);
  const timelineTrackRef = useRef(null);
  const flowerRunnerRef = useRef(null);

  // Countdown State for 14 Jan 2027 19:00 Cairo Time
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // RSVP Form State
  const [attendance, setAttendance] = useState('attending');
  const [guestCount, setGuestCount] = useState(1);
  const [rsvpName, setRsvpName] = useState(guestName || '');
  const [rsvpMsg, setRsvpMsg] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [sealBursts, setSealBursts] = useState([]);

  useEffect(() => {
    if (guestName) {
      setRsvpName(guestName);
    }
  }, [guestName]);

  // Set Page Title
  useEffect(() => {
    document.title = 'عقد قران و حفل زفاف مازن & فريدة | وِصال';
  }, []);

  // Initialize Audio Element
  useEffect(() => {
    const audio = new Audio('/audio/pearl.mp3');
    audio.loop = true;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Countdown timer logic
  useEffect(() => {
    const targetDate = new Date('2027-01-14T19:00:00+02:00').getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll Bound Flower Runner Calculation
  useEffect(() => {
    if (!isIntroOpen) return;

    let rafId = 0;
    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const timeline = timelineTrackRef.current;
        const runner = flowerRunnerRef.current;
        if (!timeline || !runner) return;

        const rect = timeline.getBoundingClientRect();
        const vh = window.innerHeight || 700;
        const startGuide = vh * 0.68;
        const endGuide = vh * 0.32;
        const travelWindow = rect.height + startGuide - endGuide;

        let progress = (startGuide - rect.top) / travelWindow;
        progress = Math.max(0, Math.min(1, progress));
        const y = progress * (rect.height - 20);

        runner.style.transform = `translate3d(0, ${y}px, 0)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isIntroOpen]);

  // Open Invitation Sequence
  const handleOpenInvitation = () => {
    if (isIntroOpen || isIntroOpening) return;

    setIsIntroOpening(true);

    // Start background audio directly within user touch event
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlayingMusic(true))
        .catch(() => setIsPlayingMusic(false));
    }

    // Play intro video from start
    if (introVideoRef.current) {
      try {
        introVideoRef.current.currentTime = 0;
      } catch (e) {}
      introVideoRef.current.play().catch(() => {});
    }

    // Smooth reveal of stage after ~4 seconds of envelope opening animation
    setTimeout(() => {
      setIsIntroOpen(true);

      // Handle table card direct wish
      if (wishDirect) {
        setTimeout(() => {
          const rsvpSection = document.getElementById('rsvp');
          if (rsvpSection) {
            rsvpSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 500);
      } else {
        // Start smooth auto-scroll down the page
        setTimeout(() => {
          setIsAutoScrolling(true);
        }, 2200);
      }
    }, 4000);
  };

  // Toggle Background Audio
  const handleToggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlayingMusic(true))
        .catch(() => setIsPlayingMusic(false));
    }
  };

  // Auto-Scroll Feature
  useEffect(() => {
    if (!isAutoScrolling) return;

    let carry = 0;
    let lastTime = 0;
    let rafId = null;
    const speed = 36; // px per second

    const userCancel = () => {
      setIsAutoScrolling(false);
    };

    window.addEventListener('wheel', userCancel, { passive: true });
    window.addEventListener('touchstart', userCancel, { passive: true });
    window.addEventListener('keydown', userCancel, { passive: true });

    const scrollFrame = (now) => {
      if (!lastTime) lastTime = now;
      const dt = Math.min(now - lastTime, 100);
      lastTime = now;

      carry += (speed * dt) / 1000;
      const step = Math.floor(carry);
      if (step >= 1) {
        carry -= step;
        window.scrollBy({ top: step, behavior: 'auto' });
      }

      const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 4;
      if (atBottom) {
        setIsAutoScrolling(false);
        return;
      }

      rafId = requestAnimationFrame(scrollFrame);
    };

    rafId = requestAnimationFrame(scrollFrame);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('wheel', userCancel);
      window.removeEventListener('touchstart', userCancel);
      window.removeEventListener('keydown', userCancel);
    };
  }, [isAutoScrolling]);

  // RSVP Submission Handler with Particle Burst
  const handleRSVPSubmit = (e) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;

    try {
      // Persist to local guest storage adapter with strict error handling
      saveGuestResponse({
        name: rsvpName.trim(),
        attending: attendance === 'attending' ? 'yes' : 'no',
        guests: attendance === 'attending' ? guestCount : 0,
        message: rsvpMsg.trim(),
        invitationId: 'inv_mazen_farida',
        slug: 'mazen-farida'
      });

      // Trigger golden particles burst
      const bursts = [];
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const distance = 55 + Math.random() * 35;
        bursts.push({
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
        });
      }
      setSealBursts(bursts);

      setTimeout(() => {
        setRsvpSubmitted(true);
        setSealBursts([]);
      }, 600);
    } catch (err) {
      console.error('[RSVP MazenFarida] Failed to save response:', err);
    }
  };

  return (
    <div className="mf-page-container">
      {/* 1. Fullscreen Opening Screen with Video & Wax Seal */}
      <div className={`mf-intro-overlay ${isIntroOpening ? 'is-opening' : ''} ${isIntroOpen ? 'is-opened' : ''}`}>
        <video
          ref={introVideoRef}
          className="mf-intro-video"
          src="/farha/mf-intro.mp4"
          poster="/farha/mf-intro-poster.jpg"
          muted
          playsInline
          preload="auto"
        />
        <button
          type="button"
          className="mf-intro-trigger"
          onClick={handleOpenInvitation}
          aria-label="اضغط لفتح الدعوة"
        >
          <div className="mf-intro-wax-seal">
            <span>و</span>
          </div>
          <span className="mf-intro-label">اضغط لفتح الدعوة 🤍</span>
        </button>
      </div>

      {/* 2. Main Invitation Stage */}
      <main className="mf-stage">
        {/* Quick link banner to Mohamed & Salma */}
        <div style={{
          textAlign: 'center',
          padding: '8px 16px',
          background: 'rgba(255, 248, 235, 0.95)',
          borderBottom: '1px solid #ebcfab',
          fontSize: '13px',
          zIndex: 50,
          position: 'relative'
        }}>
          <Link to="/mohamed-salma" style={{ color: '#8a6229', textDecoration: 'none', fontWeight: 'bold' }}>
            💍 دعوة خطوبة محمد & سلمى (30 نوفمبر 2026) — اضغط هنا للعرض ⟵
          </Link>
        </div>

        {/* Hero Video & Typography */}
        <section className="mf-hero-video-wrap">
          <video
            className="mf-hero-video"
            src="/farha/couple.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="mf-hero-typography">
            <h1 className="mf-hero-names">
              مازن <span className="mf-amp">و</span> فريدة
            </h1>
            <p className="mf-hero-title">عقد قران و حفل زفاف</p>
            <p className="mf-hero-datetime">
              14 يناير 2027
              <br />
              الساعة 7:00 مساءً
            </p>
          </div>
        </section>

        <ArabicDivider />

        {/* 3. Scratch-To-Reveal Date Cards */}
        <section className="mf-scratch-section">
          <h2 className="mf-scratch-title">التاريخ</h2>
          <p className="mf-scratch-subtitle">
            <span>✦</span> امسح لإظهار التاريخ <span>✦</span>
          </p>

          <div className="mf-scratch-grid">
            <ScratchCard value="14" label="اليوم" />
            <ScratchCard value="يناير" label="الشهر" isMonth={true} />
            <ScratchCard value="2027" label="السنة" />
          </div>
        </section>

        <ArabicDivider />

        {/* 4. Interactive Timeline with Rotating Flower Runner */}
        <section className="mf-timeline-section">
          <div className="mf-timeline-header">
            <h2 className="mf-timeline-title">الجدول الزمني للزفاف</h2>
          </div>

          <div ref={timelineTrackRef} className="mf-timeline-track-wrap">
            <div className="mf-timeline-line" />
            <div className="mf-timeline-diamond-cap top" />
            <div className="mf-timeline-diamond-cap bottom" />

            {/* Rotating Flower Moving with Scroll */}
            <div ref={flowerRunnerRef} className="mf-flower-runner">
              <div className="mf-flower-graphic">
                <span className="mf-flower-petal" />
                <span className="mf-flower-petal" />
                <span className="mf-flower-petal" />
                <span className="mf-flower-petal" />
                <span className="mf-flower-petal" />
                <span className="mf-flower-petal" />
                <span className="mf-flower-petal" />
                <span className="mf-flower-petal" />
                <span className="mf-flower-center" />
              </div>
            </div>

            {/* Event Stops */}
            <div className="mf-timeline-stop alt-left">
              <div className="mf-timeline-side-content">
                <h3 className="mf-timeline-time">6:45 مساءً</h3>
                <p className="mf-timeline-desc">وصول الضيوف</p>
              </div>
              <div />
              <div className="mf-timeline-side-img">
                <img
                  src="/farha/WhatsApp_Image_2026-09-08_at_4.01.35_AM-removebg-preview.webp"
                  alt="وصول الضيوف"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="mf-timeline-stop alt-right">
              <div className="mf-timeline-side-img">
                <img
                  src="/farha/WhatsApp_Image_2026-09-08_at_4.52.06_PM-removebg-preview.webp"
                  alt="دخول العروس"
                  loading="lazy"
                />
              </div>
              <div />
              <div className="mf-timeline-side-content">
                <h3 className="mf-timeline-time">7:30 مساءً</h3>
                <p className="mf-timeline-desc">دخول العروس</p>
              </div>
            </div>

            <div className="mf-timeline-stop alt-left">
              <div className="mf-timeline-side-content">
                <h3 className="mf-timeline-time">8:00 مساءً</h3>
                <p className="mf-timeline-desc">كتب الكتاب</p>
              </div>
              <div />
              <div className="mf-timeline-side-img">
                <img
                  src="/farha/WhatsApp_Image_2026-09-08_at_4.55.24_PM-removebg-preview.webp"
                  alt="كتب الكتاب"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="mf-timeline-stop alt-right">
              <div className="mf-timeline-side-img">
                <img
                  src="/farha/WhatsApp_Image_2026-09-08_at_5.00.17_PM-removebg-preview.webp"
                  alt="افتتاح البوفيه"
                  loading="lazy"
                />
              </div>
              <div />
              <div className="mf-timeline-side-content">
                <h3 className="mf-timeline-time">8:30 مساءً</h3>
                <p className="mf-timeline-desc">افتتاح البوفيه</p>
              </div>
            </div>

            <div className="mf-timeline-stop alt-left">
              <div className="mf-timeline-side-content">
                <h3 className="mf-timeline-time">9:00 مساءً</h3>
                <p className="mf-timeline-desc">الحفله والاحتفال</p>
              </div>
              <div />
              <div className="mf-timeline-side-img">
                <img
                  src="/farha/WhatsApp_Image_2026-09-08_at_5.03.51_PM-removebg-preview.webp"
                  alt="الحفله"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        <ArabicDivider />

        {/* 5. Live Countdown Timer */}
        <section className="mf-countdown-section">
          <h2 className="mf-countdown-title">العد التنازلي</h2>
          <p className="mf-countdown-sub">حتى نلتقي في يومنا المميز</p>

          <div className="mf-countdown-grid">
            <div className="mf-countdown-box">
              <span className="mf-countdown-num">{toArabicDigits(timeLeft.days)}</span>
              <span className="mf-countdown-unit">يوم</span>
            </div>
            <div className="mf-countdown-box">
              <span className="mf-countdown-num">{toArabicDigits(timeLeft.hours)}</span>
              <span className="mf-countdown-unit">ساعة</span>
            </div>
            <div className="mf-countdown-box">
              <span className="mf-countdown-num">{toArabicDigits(timeLeft.minutes)}</span>
              <span className="mf-countdown-unit">دقيقة</span>
            </div>
            <div className="mf-countdown-box">
              <span className="mf-countdown-num">{toArabicDigits(timeLeft.seconds)}</span>
              <span className="mf-countdown-unit">ثانية</span>
            </div>
          </div>
        </section>

        <ArabicDivider />

        {/* 6. Venue & Google Map */}
        <section className="mf-venue-section">
          <h2 className="mf-venue-title">مكان الاحتفال</h2>
          <h3 className="mf-venue-hall">قاعة الياسمين</h3>
          <p className="mf-venue-address">كورنيش النيل — القاهرة</p>

          <div className="mf-venue-map-card">
            <iframe
              src="https://www.google.com/maps?q=%D9%83%D9%88%D8%B1%D9%86%D9%8A%D8%B4+%D8%A7%D9%84%D9%86%D9%8A%D9%84+%D8%A7%D9%84%D9%82%D8%A7%D9%87%D8%B1%D8%A9&output=embed"
              title="موقع قاعة الياسمين"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>

          <a
            href="https://www.google.com/maps/search/?api=1&query=%D9%83%D9%88%D8%B1%D9%86%D9%8A%D8%B4+%D8%A7%D9%84%D9%86%D9%8A%D9%84+%D8%A7%D9%84%D9%82%D8%A7%D9%87%D8%B1%D8%A9"
            target="_blank"
            rel="noopener noreferrer"
            className="mf-venue-btn"
          >
            الوصول للقاعة عبر خرائط Google
          </a>
        </section>

        <ArabicDivider />

        {/* 7. Ceremonial Arch Envelope RSVP */}
        <section id="rsvp" className="mf-rsvp-section">
          <div className="mf-rsvp-card">
            <div className="mf-rsvp-arch-crest" aria-hidden="true">
              <svg width="120" height="38" viewBox="0 0 120 40" fill="none">
                <path d="M60 6l5 9-5 9-5-9z" fill="#b58a4a" />
                <path
                  d="M60 15c-14-10-30-10-44-2 12 1 22 4 30 10M60 15c14-10 30-10 44-2-12 1-22 4-30 10"
                  stroke="#b58a4a"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="13" r="1.8" fill="#b58a4a" />
                <circle cx="108" cy="13" r="1.8" fill="#b58a4a" />
              </svg>
            </div>

            <h2 className="mf-rsvp-title">هل ستشرفوننا؟</h2>
            <p className="mf-rsvp-sub">يسعدنا تأكيد حضوركم قبل الموعد بأسبوع</p>

            {rsvpSubmitted ? (
              <div className="mf-rsvp-success">
                شكراً لكم — تم تسجيل ردكم بكل سرور 🤍
              </div>
            ) : (
              <form className="mf-rsvp-form" onSubmit={handleRSVPSubmit}>
                <label className="mf-input-line">
                  <input
                    type="text"
                    required
                    maxLength={100}
                    placeholder="اسمك الكريم"
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                  />
                </label>

                <div className="mf-choice-grid">
                  <label
                    className={`mf-choice-card ${attendance === 'attending' ? 'is-active' : ''}`}
                    onClick={() => setAttendance('attending')}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="attending"
                      checked={attendance === 'attending'}
                      onChange={() => setAttendance('attending')}
                    />
                    <b>سأحضر بكل سرور</b>
                  </label>

                  <label
                    className={`mf-choice-card ${attendance === 'declined' ? 'is-active' : ''}`}
                    onClick={() => setAttendance('declined')}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="declined"
                      checked={attendance === 'declined'}
                      onChange={() => setAttendance('declined')}
                    />
                    <b>أعتذر عن الحضور</b>
                  </label>
                </div>

                <div className={`mf-counter-row ${attendance === 'declined' ? 'is-collapsed' : ''}`}>
                  <span>عدد الحضور</span>
                  <div className="mf-stepper">
                    <button
                      type="button"
                      className="mf-step-btn"
                      onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
                    >
                      +
                    </button>
                    <span className="mf-counter-val">{guestCount}</span>
                    <button
                      type="button"
                      className="mf-step-btn"
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                    >
                      −
                    </button>
                  </div>
                </div>

                <label>
                  <textarea
                    className="mf-note-input"
                    rows="3"
                    maxLength={500}
                    placeholder="كلمة أو تهنئة للعروسين..."
                    value={rsvpMsg}
                    onChange={(e) => setRsvpMsg(e.target.value)}
                  />
                </label>

                <div className="mf-seal-submit-wrap">
                  <button type="submit" className="mf-seal-btn" title="اضغط لتأكيد الرد">
                    <svg className="mf-seal-svg" viewBox="0 0 100 100">
                      <defs>
                        <radialGradient id="mfG" cx="38%" cy="32%" r="75%">
                          <stop offset="0" stopColor="#f1d9a0" />
                          <stop offset="0.45" stopColor="#c79a52" />
                          <stop offset="1" stopColor="#8a6128" />
                        </radialGradient>
                      </defs>
                      <path
                        d="M50 3c6 0 8 5 13 6s10-2 14 2 1 9 4 13 9 5 10 11-4 8-4 15 5 9 4 15-7 6-10 11-1 10-5 13-9 1-13 3-7 8-13 8-8-5-13-6-10 2-14-2-1-9-4-13-9-5-10-11 4-8 4-15-5-9-4-15 7-6 10-11 1-10 5-13 9-1 13-3 7-8 13-8z"
                        fill="url(#mfG)"
                      />
                      <circle cx="50" cy="50" r="31" fill="none" stroke="#fbe9bf" strokeOpacity="0.55" strokeWidth="1.3" />
                    </svg>
                    <span className="mf-seal-text">إرسال</span>
                  </button>

                  {/* Spark Particles Burst */}
                  {sealBursts.map((b) => (
                    <span
                      key={b.id}
                      className="mf-seal-burst"
                      style={{ '--x': `${b.x}px`, '--y': `${b.y}px` }}
                    />
                  ))}
                  <small style={{ color: '#a08a6c', fontSize: '13px' }}>
                    اضغط على الختم لتأكيد ردك
                  </small>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* 8. Ending Blessing & Signature */}
        <section
          className="mf-ending-section"
          style={{ backgroundImage: 'url("/farha/B20D1599-6455-4B98-8EE9-8A5FB2ADE06F-crop.webp")' }}
        >
          <div className="mf-ending-overlay" />
          <div className="mf-ending-inner">
            <h2 className="mf-ending-title">شكرًا لمشاركتكم فرحتنا</h2>
            <p className="mf-ending-msg">
              وجودكم معنا ودعواتكم الطيبة هما أجمل هدية لنا، ومشاركتكم يومنا تجعل فرحتنا أجمل وأكمل.
              نسعد بأن تجمعنا بكم هذه اللحظة الجميلة، ونرجو أن يبقى هذا اليوم ذكرى دافئة في قلوبنا جميعًا.
            </p>
            <p className="mf-ending-final">ننتظركم بكل حب</p>
            <h3 className="mf-ending-names">مازن و فريدة</h3>
          </div>
        </section>

        {/* Brand Footer */}
        <footer className="mf-brand-footer">
          صُممت هذه الدعوة الفاخرة عبر منصة <Link to="/">وِصال — WISAL</Link>
        </footer>
      </main>

      {/* Floating Action Controls */}
      <div className="mf-floating-bar">
        {/* Auto-Scroll Toggle */}
        <button
          type="button"
          className="mf-float-btn"
          onClick={() => setIsAutoScrolling(!isAutoScrolling)}
          title={isAutoScrolling ? 'إيقاف التمرير التلقائي' : 'تشغيل التمرير التلقائي'}
        >
          {isAutoScrolling ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Background Music Toggle */}
        <button
          type="button"
          className={`mf-float-btn ${isPlayingMusic ? 'is-active' : ''}`}
          onClick={handleToggleMusic}
          title={isPlayingMusic ? 'كتم الموسيقى' : 'تشغيل الموسيقى'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
