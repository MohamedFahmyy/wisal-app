import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { saveGuestResponse } from '../utils/guestStorage';
import '../styles/mazen-farida.css';

// Converts standard western numbers to Eastern Arabic numerals (١، ٢، ٣...)
function toArabicDigits(num) {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).padStart(2, '0').replace(/[0-9]/g, (w) => arabicDigits[+w]);
}

// Scratch-To-Reveal Card Component with DPR Retina Support & Sparkle Reveal
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
    ctx.globalAlpha = 0.22;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    for (let x = -rect.height; x < rect.width + rect.height; x += 28) {
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
    ctx.lineWidth = 34;
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
      const sampleStep = 32;
      let sampled = 0;

      for (let i = 3; i < data.length; i += 4 * sampleStep) {
        sampled++;
        if (data[i] === 0) clearPixels++;
      }

      if (clearPixels / sampled > 0.35) {
        setIsRevealed(true);
      }
    } catch {
      // Ignored if canvas read error
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

export default function MohamedSalmaPage() {
  const [searchParams] = useSearchParams();
  const guestName = searchParams.get('to');
  const wishDirect = searchParams.get('wish') === '1';

  // Intro & Audio State
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [showMusicBadge, setShowMusicBadge] = useState(false);
  const [copiedLinkToast, setCopiedLinkToast] = useState(false);

  // Audio Refs — Loaded directly from downloaded requested track
  const audioRef = useRef(null);
  const introVideoRef = useRef(null);
  const timelineTrackRef = useRef(null);
  const flowerRunnerRef = useRef(null);

  // Countdown State for Engagement Date: 30 Nov 2026 19:00 Cairo Time (UTC+2)
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

  // Set Page Title & Social Meta Tags
  useEffect(() => {
    document.title = 'حفل خطوبه محمد وسلمى. | وِصال';
    const updateMeta = (selector, attr, value) => {
      let el = document.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    };
    updateMeta('meta[name="description"]', 'content', 'يسعدنا مشاركتكم فرحتنا.');
    updateMeta('meta[property="og:title"]', 'content', 'حفل خطوبه محمد وسلمى.');
    updateMeta('meta[property="og:description"]', 'content', 'يسعدنا مشاركتكم فرحتنا.');
    updateMeta('meta[property="og:image"]', 'content', 'https://wisal.app/images/og/mohamed-salma-engagement.png');
    updateMeta('meta[property="og:image:alt"]', 'content', 'حفل خطوبه محمد وسلمى.');
    updateMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    updateMeta('meta[name="twitter:title"]', 'content', 'حفل خطوبه محمد وسلمى.');
    updateMeta('meta[name="twitter:description"]', 'content', 'يسعدنا مشاركتكم فرحتنا.');
    updateMeta('meta[name="twitter:image"]', 'content', 'https://wisal.app/images/og/mohamed-salma-engagement.png');
  }, []);

  // Initialize Audio Element directly with the requested song: "زينة شباب العيلة" (starts at second 21)
  useEffect(() => {
    const audio = new Audio('/audio/zeina.webm');
    audio.loop = true;
    audio.preload = 'auto';

    const setStartOffset = () => {
      try {
        if (audio.currentTime < 21) {
          audio.currentTime = 21;
        }
      } catch (e) {}
    };

    audio.addEventListener('loadedmetadata', setStartOffset);
    audio.addEventListener('canplay', setStartOffset);
    audio.addEventListener('timeupdate', () => {
      // Loop smoothly back from second 21
      if (audio.currentTime < 20.5 && !audio.paused && audio.duration > 25) {
        audio.currentTime = 21;
      }
    });

    audio.addEventListener('play', () => setIsPlayingMusic(true));
    audio.addEventListener('pause', () => setIsPlayingMusic(false));

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Countdown timer logic targeting Monday, 30 November 2026 at 19:00 Cairo Time (UTC+2)
  useEffect(() => {
    const targetDate = new Date('2026-11-30T19:00:00+02:00').getTime();

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

  // Scroll Bound Flower / Ring Runner Calculation
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

  // Open Invitation Sequence — Triggered by direct user click
  const handleOpenInvitation = () => {
    if (isIntroOpen) return;

    // Start requested track: "زينة شباب العيلة" starting at 21 seconds
    if (audioRef.current) {
      try {
        if (audioRef.current.currentTime < 21) {
          audioRef.current.currentTime = 21;
        }
      } catch (e) {}
      audioRef.current.play()
        .then(() => {
          setIsPlayingMusic(true);
          setShowMusicBadge(true);
          setTimeout(() => setShowMusicBadge(false), 5000);
        })
        .catch((err) => {
          console.warn('[Audio Play] User interaction error:', err);
        });
    }

    // Play intro video if available
    if (introVideoRef.current) {
      introVideoRef.current.play().catch(() => {});
    }

    // Smooth reveal of invitation stage
    setTimeout(() => {
      setIsIntroOpen(true);

      // Handle table card direct wish (?wish=1#rsvp)
      if (wishDirect) {
        setTimeout(() => {
          const rsvpSection = document.getElementById('rsvp');
          if (rsvpSection) {
            rsvpSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 600);
      } else {
        // Automatically start gentle, continuous auto-scroll downwards
        setTimeout(() => {
          setIsAutoScrolling(true);
        }, 900);
      }
    }, 450);
  };

  // Toggle Background Music
  const handleToggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      try {
        if (audioRef.current.currentTime < 21) {
          audioRef.current.currentTime = 21;
        }
      } catch (e) {}
      audioRef.current.play()
        .then(() => {
          setIsPlayingMusic(true);
          setShowMusicBadge(true);
          setTimeout(() => setShowMusicBadge(false), 4000);
        })
        .catch((err) => console.warn('[Audio Toggle] Error:', err));
    }
  };

  // Auto-Scroll Feature
  useEffect(() => {
    if (!isAutoScrolling) return;

    let carry = 0;
    let lastTime = 0;
    let rafId = null;
    const speed = 38; // px per second
    const startTime = Date.now();

    const userCancel = () => {
      // Allow brief 450ms grace period so initial touch release doesn't cancel auto-scroll immediately
      if (Date.now() - startTime < 450) return;
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

  // RSVP Submission Handler with Gold Sparkle Particle Burst
  const handleRSVPSubmit = (e) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;

    try {
      saveGuestResponse({
        name: rsvpName.trim(),
        attending: attendance === 'attending' ? 'yes' : 'no',
        guests: attendance === 'attending' ? guestCount : 0,
        message: rsvpMsg.trim(),
        invitationId: 'inv_mohamed_salma',
        slug: 'mohamed-salma'
      });

      // Trigger golden particles burst around seal
      const bursts = [];
      for (let i = 0; i < 18; i++) {
        const angle = (i / 18) * Math.PI * 2;
        const distance = 55 + Math.random() * 40;
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
      console.error('[RSVP MohamedSalma] Failed to save response:', err);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLinkToast(true);
    setTimeout(() => setCopiedLinkToast(false), 3000);
  };

  return (
    <div className="mf-page-container">
      {/* 1. Fullscreen Opening Screen with Video & Hidden Click Trigger over "بسم الله" */}
      <div
        className={`mf-intro-overlay ${isIntroOpen ? 'is-opened' : ''}`}
        onClick={handleOpenInvitation}
      >
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
          aria-label="اضغط لفتح دعوة الخطوبة"
        >
          {/* Invisible interactive target sized to match the "بسم الله" calligraphy circular seal */}
          <div className="mf-intro-seal-invisible" />
          <span className="mf-intro-label">اضغط لفتح الدعوة 💍</span>
        </button>
      </div>

      {/* 2. Main Invitation Stage */}
      <main className="mf-stage">
        {/* Hero Video & Arabic Calligraphy Typography */}
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
            <div style={{
              display: 'inline-block',
              background: 'rgba(255, 248, 235, 0.88)',
              padding: '6px 20px',
              borderRadius: '50px',
              color: '#8a6229',
              fontSize: '15px',
              fontWeight: '600',
              marginBottom: '10px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.08)'
            }}>
              💍 حفل خطوبة مبارك
            </div>
            <h1 className="mf-hero-names">
              محمد <span className="mf-amp">و</span> سلمى
            </h1>
            <p className="mf-hero-title">يسعدنا ويشرفنا دعوتكم لحضور حفل خطوبتنا</p>
            <p className="mf-hero-datetime">
              الإثنين، 30 نوفمبر 2026
              <br />
              الساعة 7:00 مساءً
            </p>
          </div>
        </section>

        <ArabicDivider />

        {/* 3. Scratch-To-Reveal Date Cards (30 نوفمبر 2026) */}
        <section className="mf-scratch-section">
          <h2 className="mf-scratch-title">تاريخ الخطوبة</h2>
          <p className="mf-scratch-subtitle">
            <span>✦</span> امسح بإصبعك لإظهار تاريخ اليوم المميز <span>✦</span>
          </p>

          <div className="mf-scratch-grid">
            <ScratchCard value="30" label="اليوم" />
            <ScratchCard value="نوفمبر" label="الشهر" isMonth={true} />
            <ScratchCard value="2026" label="السنة" />
          </div>
        </section>

        <ArabicDivider />

        {/* 4. Interactive Engagement Timeline with Rotating Flower Runner */}
        <section className="mf-timeline-section">
          <div className="mf-timeline-header">
            <h2 className="mf-timeline-title">الجدول الزمني للخطوبة</h2>
            <p style={{ color: '#8d7b68', fontSize: '15px', marginTop: '6px' }}>
              محطات يومنا الجميل خطوة بخطوة
            </p>
          </div>

          <div ref={timelineTrackRef} className="mf-timeline-track-wrap">
            <div className="mf-timeline-line" />
            <div className="mf-timeline-diamond-cap top" />
            <div className="mf-timeline-diamond-cap bottom" />

            {/* Rotating Flower/Ring Moving along with scroll */}
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

            {/* Stop 1: وصول الضيوف والأهل */}
            <div className="mf-timeline-stop alt-left">
              <div className="mf-timeline-side-content">
                <h3 className="mf-timeline-time">6:30 مساءً</h3>
                <p className="mf-timeline-desc">وصول الضيوف والأهل الكرام</p>
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

            {/* Stop 2: تلبيس الدبل وتبادل الخواتم */}
            <div className="mf-timeline-stop alt-right">
              <div className="mf-timeline-side-img">
                <img
                  src="/farha/WhatsApp_Image_2026-09-08_at_4.52.06_PM-removebg-preview.webp"
                  alt="تلبيس الدبل"
                  loading="lazy"
                />
              </div>
              <div />
              <div className="mf-timeline-side-content">
                <h3 className="mf-timeline-time">7:30 مساءً</h3>
                <p className="mf-timeline-desc">تلبيس الدبل وتبادل الخواتم 💍</p>
              </div>
            </div>

            {/* Stop 3: جلسة التصوير التذكارية */}
            <div className="mf-timeline-stop alt-left">
              <div className="mf-timeline-side-content">
                <h3 className="mf-timeline-time">8:00 مساءً</h3>
                <p className="mf-timeline-desc">جلسة التصوير والذكريات الجميلة 📸</p>
              </div>
              <div />
              <div className="mf-timeline-side-img">
                <img
                  src="/farha/WhatsApp_Image_2026-09-08_at_4.55.24_PM-removebg-preview.webp"
                  alt="التصوير والذكريات"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Stop 4: تقطيع التورتة وبوفيه الحلويات */}
            <div className="mf-timeline-stop alt-right">
              <div className="mf-timeline-side-img">
                <img
                  src="/farha/WhatsApp_Image_2026-09-08_at_5.00.17_PM-removebg-preview.webp"
                  alt="تقطيع التورتة والبوفيه"
                  loading="lazy"
                />
              </div>
              <div />
              <div className="mf-timeline-side-content">
                <h3 className="mf-timeline-time">8:45 مساءً</h3>
                <p className="mf-timeline-desc">تقطيع تورتة الخطوبة وبوفيه العشاء 🎂</p>
              </div>
            </div>

            {/* Stop 5: الحفلة والاحتفال */}
            <div className="mf-timeline-stop alt-left">
              <div className="mf-timeline-side-content">
                <h3 className="mf-timeline-time">9:15 مساءً</h3>
                <p className="mf-timeline-desc">الحفلة والأغاني وفرحة العروسين 🎶</p>
              </div>
              <div />
              <div className="mf-timeline-side-img">
                <img
                  src="/farha/WhatsApp_Image_2026-09-08_at_5.03.51_PM-removebg-preview.webp"
                  alt="الحفلة والاحتفال"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        <ArabicDivider />

        {/* 5. Live Countdown Timer targeting 30 Nov 2026 */}
        <section className="mf-countdown-section">
          <h2 className="mf-countdown-title">العد التنازلي</h2>
          <p className="mf-countdown-sub">حتى نلتقي ونفرح معًا في يوم خطوبتنا 💍</p>

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

        {/* 6. Venue & Google Map — Joya */}
        <section className="mf-venue-section">
          <h2 className="mf-venue-title">مكان الاحتفال</h2>
          <h3 className="mf-venue-hall">قاعة Joya</h3>
          <p className="mf-venue-address">
            Joya
          </p>

          <div className="mf-venue-map-card">
            <iframe
              src="https://www.google.com/maps?q=30.094501,31.3441249&hl=ar&z=17&output=embed"
              title="موقع قاعة Joya"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>

          <a
            href="https://maps.app.goo.gl/V8zopCkLW2ua231J9"
            target="_blank"
            rel="noopener noreferrer"
            className="mf-venue-btn"
          >
            الوصول لموقع قاعة Joya عبر خرائط Google 📍
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

            <h2 className="mf-rsvp-title">هل ستشرفوننا بحضوركم؟</h2>
            <p className="mf-rsvp-sub">يسعد العروسين محمد وسلمى تأكيد حضوركم قبل الموعد بأسبوع</p>

            {rsvpSubmitted ? (
              <div className="mf-rsvp-success" style={{
                background: 'rgba(238, 248, 238, 0.95)',
                border: '1px solid #b8dfb8',
                borderRadius: '16px',
                padding: '24px',
                color: '#285828',
                fontSize: '18px',
                lineHeight: '1.8'
              }}>
                <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>🤍💍</span>
                <b>شكراً جزيلاً لكم!</b>
                <br />
                تم تسجيل ردكم ومشاركتكم بكل سرور وفرحة. ننتظر لقاءكم في يومنا السعيد!
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
                    <b>سأحضر بكل سرور 💍</b>
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
                    <b>أعتذر عن الحضور 🤍</b>
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
                    placeholder="كلمة أو تهنئة للعروسين محمد وسلمى..."
                    value={rsvpMsg}
                    onChange={(e) => setRsvpMsg(e.target.value)}
                  />
                </label>

                <div className="mf-seal-submit-wrap">
                  <button type="submit" className="mf-seal-btn" title="اضغط لتأكيد الرد بالختم الملكي">
                    <svg className="mf-seal-svg" viewBox="0 0 100 100">
                      <defs>
                        <radialGradient id="mfG_ms" cx="38%" cy="32%" r="75%">
                          <stop offset="0" stopColor="#f1d9a0" />
                          <stop offset="0.45" stopColor="#c79a52" />
                          <stop offset="1" stopColor="#8a6128" />
                        </radialGradient>
                      </defs>
                      <path
                        d="M50 3c6 0 8 5 13 6s10-2 14 2 1 9 4 13 9 5 10 11-4 8-4 15 5 9 4 15-7 6-10 11-1 10-5 13-9 1-13 3-7 8-13 8-8-5-13-6-10 2-14-2-1-9-4-13-9-5-10-11 4-8 4-15-5-9-4-15 7-6 10-11 1-10 5-13 9-1 13-3 7-8 13-8z"
                        fill="url(#mfG_ms)"
                      />
                      <circle cx="50" cy="50" r="31" fill="none" stroke="#fbe9bf" strokeOpacity="0.55" strokeWidth="1.3" />
                    </svg>
                    <span className="mf-seal-text">تأكيد الرد</span>
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
            <h2 className="mf-ending-title">شكرًا لمشاركتكم فرحة خطوبتنا</h2>
            <p className="mf-ending-msg">
              وجودكم معنا ودعواتكم الصادقة هما سر سعادتنا في هذه البداية الجديدة.
              فرحتنا لا تكتمل إلا بلقائكم ومشاركتكم أجمل اللحظات، ونسأل الله أن يديم بيننا الود والمحبة.
            </p>
            <p className="mf-ending-final">ننتظركم بكل حب 🤍</p>
            <h3 className="mf-ending-names">محمد و سلمى</h3>
          </div>
        </section>

        {/* Brand Footer */}
        <footer className="mf-brand-footer">
          صُممت هذه الدعوة الفاخرة عبر منصة <Link to="/">وِصال — WISAL</Link>
        </footer>
      </main>

      {/* Floating Bottom Bar (Matching User Screenshot: Music Left | Pill Center | Play Right) */}
      <div className="mf-floating-bar-dock">
        {/* Left: Music Toggle Button */}
        <button
          type="button"
          className={`mf-dock-circle-btn ${isPlayingMusic ? 'is-playing' : ''}`}
          onClick={handleToggleMusic}
          title={isPlayingMusic ? 'كتم الموسيقى' : 'تشغيل الموسيقى'}
          aria-label={isPlayingMusic ? 'كتم الموسيقى' : 'تشغيل الموسيقى'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        </button>

        {/* Center: Order Pill Button */}
        <a
          href="https://wa.me/201112194828?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D9%88%D9%90%D8%B5%D8%A7%D9%84%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%B7%D9%84%D8%A8%20%D8%AF%D8%B9%D9%88%D8%A9%20%D8%A5%D9%84%D9%83%D8%AA%D8%B1%D9%88%D9%86%D9%8A%D8%A9%20%D9%85%D8%AB%D9%84%20%D8%AF%D8%B9%D9%88%D8%A9%20%D9%85%D8%AD%D9%85%D8%AF%20%D9%88%D8%B3%D9%84%D9%85%D9%89"
          target="_blank"
          rel="noopener noreferrer"
          className="mf-dock-order-pill"
        >
          عايز دعوة زي دي؟ اطلبها من Wisal
        </a>

        {/* Right: Auto-Scroll Toggle Button */}
        <button
          type="button"
          className={`mf-dock-circle-btn ${isAutoScrolling ? 'is-active' : ''}`}
          onClick={() => setIsAutoScrolling(!isAutoScrolling)}
          title={isAutoScrolling ? 'إيقاف التمرير التلقائي' : 'تشغيل التمرير التلقائي'}
          aria-label={isAutoScrolling ? 'إيقاف التمرير التلقائي' : 'تشغيل التمرير التلقائي'}
        >
          {isAutoScrolling ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>

      {/* Floating Music Indicator Badge */}
      {showMusicBadge && (
        <div
          style={{
            position: 'fixed',
            bottom: 'calc(76px + env(safe-area-inset-bottom, 0px))',
            right: '18px',
            zIndex: 900,
            background: 'rgba(44, 38, 32, 0.92)',
            backdropFilter: 'blur(8px)',
            color: '#fff9ea',
            border: '1px solid rgba(212, 175, 55, 0.5)',
            padding: '8px 16px',
            borderRadius: '30px',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            animation: 'mfFadeInUp 0.3s ease-out'
          }}
        >
          <span>🎵 تشغيل الموسيقى</span>
        </div>
      )}

      {/* Link Copied Toast */}
      {copiedLinkToast && (
        <div
          style={{
            position: 'fixed',
            bottom: 'calc(76px + env(safe-area-inset-bottom, 0px))',
            right: '18px',
            zIndex: 900,
            background: '#285828',
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: '30px',
            fontSize: '13px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
          }}
        >
          ✓ تم نسخ رابط الدعوة بنجاح
        </div>
      )}
    </div>
  );
}
