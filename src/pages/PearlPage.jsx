import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { saveGuestResponse } from '../utils/guestStorage';
import { startAutoScroll } from '../utils/autoScroll';
import '../styles/pearl.css';

// SVG Vector math helpers for embossed florals
function P(n) {
  return Math.round(n * 10) / 10;
}

function flower(x, y, r, k = 8) {
  let o = '', i, a;
  for (i = 0; i < k; i++) {
    a = (360 / k) * i;
    o += `<ellipse class="f" cx="${P(x)}" cy="${P(y - r * 0.55)}" rx="${P(r * 0.34)}" ry="${P(r * 0.58)}" transform="rotate(${a} ${P(x)} ${P(y)})"/>`;
  }
  for (i = 0; i < 5; i++) {
    a = 72 * i + 36;
    o += `<ellipse class="f" cx="${P(x)}" cy="${P(y - r * 0.3)}" rx="${P(r * 0.22)}" ry="${P(r * 0.34)}" transform="rotate(${a} ${P(x)} ${P(y)})"/>`;
  }
  o += `<circle class="f" cx="${P(x)}" cy="${P(y)}" r="${P(r * 0.22)}"/>`;
  for (i = 0; i < 9; i++) {
    a = ((Math.PI * 2) / 9) * i;
    o += `<circle class="f" cx="${P(x + Math.cos(a) * r * 0.13)}" cy="${P(y + Math.sin(a) * r * 0.13)}" r="${P(r * 0.045)}"/>`;
  }
  return o;
}

function bud(x, y, r) {
  let o = '', i, a;
  for (i = 0; i < 5; i++) {
    a = 72 * i;
    o += `<ellipse class="f" cx="${P(x)}" cy="${P(y - r * 0.5)}" rx="${P(r * 0.4)}" ry="${P(r * 0.55)}" transform="rotate(${a} ${P(x)} ${P(y)})"/>`;
  }
  return o + `<circle class="f" cx="${P(x)}" cy="${P(y)}" r="${P(r * 0.2)}"/>`;
}

function leaf(x, y, ang, len) {
  const w = len * 0.32;
  return `<path class="f" transform="translate(${P(x)} ${P(y)}) rotate(${P(ang)})" d="M0 0Q${P(len / 2)} ${P(-w)} ${P(len)} 0Q${P(len / 2)} ${P(w)} 0 0Z"/>`;
}

function sprig(x0, y0, x1, y1, c, n, size) {
  const mx = (x0 + x1) / 2 - (y1 - y0) * c;
  const my = (y0 + y1) / 2 + (x1 - x0) * c;
  let o = `<path class="s" d="M${P(x0)} ${P(y0)}Q${P(mx)} ${P(my)} ${P(x1)} ${P(y1)}"/>`;
  let i, t, px, py, dx, dy, ang;
  for (i = 1; i <= n; i++) {
    t = i / (n + 1);
    px = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * mx + t * t * x1;
    py = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * my + t * t * y1;
    dx = 2 * (1 - t) * (mx - x0) + 2 * t * (x1 - mx);
    dy = 2 * (1 - t) * (my - y0) + 2 * t * (y1 - my);
    ang = (Math.atan2(dy, dx) * 180) / Math.PI;
    o += leaf(px, py, ang + (i % 2 ? -48 : 48), size * (1 - t * 0.35));
  }
  return o + bud(x1, y1, size * 0.45);
}

function mirror(g, w) {
  return g + `<g transform="translate(${w} 0) scale(-1 1)">` + g + '</g>';
}

const MOTIF = {
  bouquet: () => {
    const h = sprig(180, 120, 40, 40, 0.18, 5, 22) +
              sprig(180, 125, 30, 150, -0.12, 4, 20) +
              sprig(175, 140, 110, 215, 0.1, 3, 18) +
              sprig(180, 110, 120, 10, -0.2, 3, 16) +
              flower(105, 80, 20, 6) +
              flower(70, 140, 14, 6);
    return mirror(h, 360) + flower(180, 118, 46, 10);
  },
  'bouquet-low': () => {
    const h = sprig(180, 130, 40, 170, -0.15, 5, 20) +
              sprig(180, 120, 50, 70, 0.18, 4, 18) +
              sprig(178, 110, 140, 20, -0.15, 3, 16) +
              flower(110, 105, 18, 6);
    return mirror(h, 360) + flower(180, 125, 38, 9);
  },
  vine: () => {
    let o = '<path class="s" d="M40 410C10 330 70 270 40 200S10 70 40 10"/>';
    for (let i = 0; i < 9; i++) {
      const y = 380 - i * 42;
      const x = 40 + Math.sin(i * 1.3) * 16;
      o += leaf(x, y, i % 2 ? -150 : -30, 26 - i);
      if (i % 3 === 1) o += bud(x + (i % 2 ? -16 : 16), y - 14, 11);
    }
    return o + flower(40, 215, 16, 6) + flower(42, 40, 12, 6);
  }
};

function generateWaxblob() {
  let d = '';
  const n = 64;
  for (let i = 0; i <= n; i++) {
    const a = (Math.PI * 2 * i) / n;
    const r = 86 + 4 * Math.sin(a * 7) + 2.5 * Math.sin(a * 13 + 1) + 1.5 * Math.cos(a * 5);
    d += (i ? 'L' : 'M') + P(Math.cos(a) * r) + ' ' + P(Math.sin(a) * r);
  }
  return d + 'Z';
}

export default function PearlPage() {
  const [searchParams] = useSearchParams();
  const guestParam = searchParams.get('to') || searchParams.get('name') || '';
  const initialLang = searchParams.get('lang') === 'en' ? 'en' : 'ar';

  const [lang, setLang] = useState(initialLang);
  const isArabic = lang === 'ar';

  const [isOpen, setIsOpen] = useState(false);
  const [isVeilHidden, setIsVeilHidden] = useState(false);

  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Live Countdown (18 February 2027, 19:00 Cairo time)
  const targetDate = useRef(new Date('2027-02-18T19:00:00+02:00').getTime());
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  // Scratch card state
  const scratchCanvasRef = useRef(null);
  const [isScratchDone, setIsScratchDone] = useState(false);
  const [revealedMessage, setRevealedMessage] = useState('');
  const scratchMovesRef = useRef(0);
  const isPointerDownRef = useRef(false);

  // Flakes Canvas Ref
  const goldCanvasRef = useRef(null);
  const flakesRef = useRef([]);
  const rafIdRef = useRef(null);

  // RSVP state
  const [formData, setFormData] = useState({
    guestName: guestParam,
    attending: 'yes',
    guestCount: 2,
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [thanksMsg, setThanksMsg] = useState('');

  // Wax blob path memoized
  const waxblobPath = useRef(generateWaxblob()).current;
  const bouquetSvg = useRef(MOTIF.bouquet()).current;
  const bouquetLowSvg = useRef(MOTIF['bouquet-low']()).current;
  const vineSvg = useRef(MOTIF.vine()).current;

  // Document Title update
  useEffect(() => {
    document.title = isArabic
      ? 'يوسف وليلى — عقد قران وحفل زفاف | وِصال'
      : 'Youssef & Laila — Katb el-Ketab & Wedding | Wisal';
  }, [isArabic]);

  // Live Countdown Timer
  useEffect(() => {
    const updateCountdown = () => {
      const diff = Math.max(0, targetDate.current - Date.now()) / 1000;
      setTimeLeft({
        d: Math.floor(diff / 86400),
        h: Math.floor((diff % 86400) / 3600),
        m: Math.floor((diff % 3600) / 60),
        s: Math.floor(diff % 60)
      });
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Music visibility & toggle handler
  const toggleMusic = useCallback((on) => {
    const au = audioRef.current;
    if (!au) return;
    if (on) {
      au.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      au.pause();
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      const au = audioRef.current;
      if (!au) return;
      if (document.hidden && isPlaying) {
        au.pause();
      } else if (!document.hidden && isPlaying) {
        au.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isPlaying]);

  // Gold Flakes Explosion
  const burstFlakes = useCallback((cx, cy) => {
    const canvas = goldCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = (canvas.width = window.innerWidth * dpr);
    const h = (canvas.height = window.innerHeight * dpr);

    const GOLD = ['#d4af37', '#f3d27a', '#b8944f', '#fff1c1', '#e8c766'];
    const flakes = [];

    for (let i = 0; i < 160; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = (2 + Math.random() * 9) * dpr;
      flakes.push({
        x: cx * dpr,
        y: cy * dpr,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - 3 * dpr,
        r: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.4,
        s: (2 + Math.random() * 4) * dpr,
        c: GOLD[i % 5],
        star: i % 7 === 0,
        life: 1,
        fade: 0.004 + Math.random() * 0.006,
        calm: false
      });
    }

    for (let i = 0; i < 70; i++) {
      flakes.push({
        x: Math.random() * w,
        y: -Math.random() * h * 0.6,
        vx: (Math.random() - 0.5) * dpr,
        vy: (1 + Math.random() * 2) * dpr,
        r: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.2,
        s: (2 + Math.random() * 3) * dpr,
        c: GOLD[i % 5],
        star: i % 5 === 0,
        life: 1,
        fade: 0.003 + Math.random() * 0.003,
        calm: true
      });
    }

    flakesRef.current = flakes;

    const sparkle = (f, a) => {
      const s = f.s * 2.2;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(0, 0, s, 0);
      ctx.quadraticCurveTo(0, 0, 0, s);
      ctx.quadraticCurveTo(0, 0, -s, 0);
      ctx.quadraticCurveTo(0, 0, 0, -s);
      ctx.fillStyle = `rgba(255,246,214,${a})`;
      ctx.fill();
    };

    const step = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;
      const activeFlakes = flakesRef.current;

      for (let i = 0; i < activeFlakes.length; i++) {
        const f = activeFlakes[i];
        if (f.life <= 0) continue;
        alive++;

        if (f.calm) {
          f.x += f.vx + Math.sin(f.y / 40) * 0.6;
          f.y += f.vy;
        } else {
          f.vx *= 0.975;
          f.vy = f.vy * 0.975 + 0.16 * dpr;
          f.x += f.vx;
          f.y += f.vy;
        }

        f.r += f.vr;
        f.life -= f.fade;
        const a = Math.max(0, Math.min(1, f.life * 1.6));

        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.r);
        if (f.star) {
          sparkle(f, a * (0.6 + 0.4 * Math.sin(f.r * 6)));
        } else {
          ctx.scale(1, Math.abs(Math.cos(f.r * 3)) + 0.15);
          ctx.globalAlpha = a;
          ctx.fillStyle = f.c;
          ctx.fillRect(-f.s, -f.s * 0.45, f.s * 2, f.s * 0.9);
        }
        ctx.restore();
      }

      if (alive > 0) {
        rafIdRef.current = requestAnimationFrame(step);
      } else {
        rafIdRef.current = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(step);
  }, []);

  // Handle Envelope Open
  const handleOpenEnvelope = (e) => {
    if (isOpen) return;
    const targetElem = e.currentTarget.querySelector('.seal') || e.currentTarget;
    const rect = targetElem.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      burstFlakes(cx, cy);
    }

    setIsOpen(true);
    toggleMusic(true);
    startAutoScroll(1400);

    setTimeout(() => {
      setIsVeilHidden(true);
    }, 2600);
  };

  // Scratch Foil Card Canvas Logic
  const drawFoil = useCallback(() => {
    const cv = scratchCanvasRef.current;
    if (!cv || isScratchDone || !cv.offsetWidth) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = (cv.width = cv.offsetWidth * dpr);
    const h = (cv.height = cv.offsetHeight * dpr);

    ctx.globalCompositeOperation = 'source-over';
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#b8944f');
    g.addColorStop(0.45, '#f3e2b0');
    g.addColorStop(0.55, '#d9bb72');
    g.addColorStop(1, '#a07c38');

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.22})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
    }

    ctx.fillStyle = 'rgba(95,70,25,0.85)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${24 * dpr}px ${isArabic ? '"Aref Ruqaa"' : '"Cormorant Garamond"'}, serif`;
    ctx.fillText(isArabic ? 'امسح هنا' : 'scratch here', w / 2, h / 2);
  }, [isScratchDone, isArabic]);

  useEffect(() => {
    drawFoil();
    if (document.fonts) {
      document.fonts.ready.then(drawFoil);
    }
    window.addEventListener('resize', drawFoil);
    return () => window.removeEventListener('resize', drawFoil);
  }, [drawFoil]);

  const finishScratch = useCallback(() => {
    if (isScratchDone) return;
    setIsScratchDone(true);
    const cv = scratchCanvasRef.current;
    if (cv) {
      cv.style.transition = 'opacity 0.6s ease';
      cv.style.opacity = '0';
    }
    setRevealedMessage(
      isArabic
        ? 'اتسجل عندك؟ الخميس ١٨ فبراير ٢٠٢٧ 🤍'
        : 'Saved the date? Thursday, 18 February 2027 🤍'
    );
  }, [isScratchDone, isArabic]);

  const checkScratchPercentage = useCallback(() => {
    const cv = scratchCanvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    try {
      const imgData = ctx.getImageData(0, 0, cv.width, cv.height).data;
      let clear = 0;
      let n = 0;
      for (let i = 3; i < imgData.length; i += 64) {
        n++;
        if (imgData[i] < 20) clear++;
      }
      if (clear / n > 0.42) {
        finishScratch();
      }
    } catch {
      // Ignored for safety
    }
  }, [finishScratch]);

  const scratchAtPoint = useCallback((clientX, clientY) => {
    const cv = scratchCanvasRef.current;
    if (!cv || isScratchDone) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const r = cv.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const x = (clientX - r.left) * dpr;
    const y = (clientY - r.top) * dpr;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 26 * dpr, 0, Math.PI * 2);
    ctx.fill();

    scratchMovesRef.current++;
    if (scratchMovesRef.current % 10 === 0) {
      checkScratchPercentage();
    }
  }, [isScratchDone, checkScratchPercentage]);

  const handlePointerDown = (e) => {
    isPointerDownRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    scratchAtPoint(e.clientX, e.clientY);
  };

  const handlePointerMove = (e) => {
    if (isPointerDownRef.current) {
      scratchAtPoint(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
    checkScratchPercentage();
  };

  // Language switch
  const toggleLanguage = () => {
    const nextLang = lang === 'ar' ? 'en' : 'ar';
    setLang(nextLang);
    if (isScratchDone) {
      setRevealedMessage(
        nextLang === 'ar'
          ? 'اتسجل عندك؟ الخميس ١٨ فبراير ٢٠٢٧ 🤍'
          : 'Saved the date? Thursday, 18 February 2027 🤍'
      );
    }
  };

  // RSVP Submit Handler
  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    const trimmedName = formData.guestName.trim();
    if (!trimmedName) return;

    const isYes = formData.attending === 'yes';
    saveGuestResponse('inv_pearl', {
      name: trimmedName,
      status: isYes ? 'confirmed' : 'declined',
      guestsCount: isYes ? parseInt(formData.guestCount, 10) : 0,
      notes: formData.message.trim()
    });

    const msg = isArabic
      ? (isYes
          ? `${trimmedName}، مستنيينك يوم ١٨ فبراير. اتسجل حضور ${formData.guestCount} فرد.`
          : `${trimmedName}، هتوحشنا، وشكرًا على تهنئتك.`)
      : (isYes
          ? `${trimmedName}, see you on 18 February. Party of ${formData.guestCount}.`
          : `${trimmedName}, you will be missed. Thank you for your wishes.`);

    setThanksMsg(msg);
    setIsSubmitted(true);
  };

  const guestDisplay = guestParam || (isArabic ? 'ضيفنا العزيز' : 'our dear guest');

  return (
    <div
      className={`pearl-wrapper ${isOpen ? 'opened' : ''}`}
      dir={isArabic ? 'rtl' : 'ltr'}
      lang={lang}
    >
      {/* Background Audio */}
      <audio
        ref={audioRef}
        src="/audio/pearl.mp3"
        loop
        preload="auto"
        playsInline
      />

      {/* Gold Confetti Canvas */}
      <canvas id="gold" ref={goldCanvasRef} aria-hidden="true" />

      {/* Initial Envelope Screen */}
      {!isVeilHidden && (
        <button
          className="env"
          id="veil"
          onClick={handleOpenEnvelope}
          aria-label={isArabic ? 'افتح الدعوة' : 'Open the invitation'}
        >
          <span className="card">
            {/* Embossed Vine Borders */}
            <svg
              className="emb side r"
              viewBox="0 0 80 420"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: vineSvg }}
            />
            <svg
              className="emb side l"
              viewBox="0 0 80 420"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: vineSvg }}
            />

            {/* Bottom Flap with Low Bouquet */}
            <span className="flapwrap bot">
              <span className="flap" />
              <svg
                className="emb"
                viewBox="0 0 360 200"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: bouquetLowSvg }}
              />
            </span>

            {/* Top Flap with High Bouquet */}
            <span className="flapwrap top">
              <span className="flap" />
              <svg
                className="emb"
                viewBox="0 0 360 230"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: bouquetSvg }}
              />
            </span>

            {/* Wax Seal with Gold Shimmer Bismillah */}
            <span className="seal">
              <svg viewBox="-100 -100 200 200" aria-hidden="true">
                <defs>
                  <radialGradient id="wax-grad" cx="40%" cy="35%" r="75%">
                    <stop offset="0" stopColor="#fbf7ee" />
                    <stop offset="0.6" stopColor="#ece3d1" />
                    <stop offset="1" stopColor="#d6c8ad" />
                  </radialGradient>
                </defs>
                <path d={waxblobPath} fill="url(#wax-grad)" />
                <circle r="62" fill="none" stroke="rgba(150,125,80,.35)" strokeWidth="2" />
                <circle r="66" fill="none" stroke="rgba(255,255,255,.8)" strokeWidth="1.2" />
              </svg>
              <span className="bis">
                <span>بِسْمِ اللَّهِ</span>
                <span>الرَّحْمَٰنِ الرَّحِيمِ</span>
              </span>
            </span>

            {/* Tap Prompt & Guest Greeting */}
            <span className="tap">
              <small>
                <span className="ar">دعوة خاصة إلى </span>
                <span className="en">An invitation for </span>
                <b id="guest">{guestDisplay}</b>
              </small>
              <b>
                <span className="ar">اضغط لفتح الدعوة</span>
                <span className="en">Tap to open</span>
              </b>
            </span>

            {/* Twinkling Stars */}
            <svg
              className="twinkle"
              style={{ right: '12%', bottom: '9%' }}
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 0C13 8 16 11 24 12 16 13 13 16 12 24 11 16 8 13 0 12 8 11 11 8 12 0Z"
              />
            </svg>
            <svg
              className="twinkle"
              style={{ left: '14%', top: '30%', animationDelay: '1.1s', width: 16, height: 16 }}
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 0C13 8 16 11 24 12 16 13 13 16 12 24 11 16 8 13 0 12 8 11 11 8 12 0Z"
              />
            </svg>
            <svg
              className="twinkle"
              style={{ right: '22%', top: '14%', animationDelay: '2.2s', width: 14, height: 14 }}
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 0C13 8 16 11 24 12 16 13 13 16 12 24 11 16 8 13 0 12 8 11 11 8 12 0Z"
              />
            </svg>
          </span>
        </button>
      )}

      {/* Top Floating Controls */}
      <div className="dock">
        <button
          id="music"
          type="button"
          onClick={() => toggleMusic(!isPlaying)}
          className={isPlaying ? 'active' : ''}
          aria-label={isPlaying ? 'Mute Music' : 'Play Music'}
          aria-pressed={isPlaying}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </button>
        <button
          id="lang"
          type="button"
          onClick={toggleLanguage}
          aria-label="Change language"
        >
          <span className="ar">EN</span>
          <span className="en">ع</span>
        </button>
      </div>

      {/* Main Invitation Page */}
      <main className="page">
        {/* Hero Section */}
        <section className="hero reveal">
          <div className="ph">
            <img src="/img/wedding/cover.jpg" alt="Youssef and Laila" />
          </div>
          <p className="eyebrow">
            <span className="ar">عقد قران وحفل زفاف</span>
            <span className="en">Katb el-Ketab &amp; Wedding</span>
          </p>
          <h1 className="names">
            <span className="ar">يوسف</span>
            <span className="en">Youssef</span>
            <i>&amp;</i>
            <span className="ar">ليلى</span>
            <span className="en">Laila</span>
          </h1>
          <p className="lead">
            <span className="ar">
              بسم الله وعلى بركة الله، يتشرف أهل العروسين بدعوتكم لحضور عقد القران وحفل الزفاف.
            </span>
            <span className="en">
              In the name of God and with His blessing, both families are honoured to invite you to the katb el-ketab and wedding.
            </span>
          </p>
        </section>

        {/* Scratch-To-Reveal Date Section */}
        <section className="card reveal">
          <h2>
            <span className="ar">امتى؟</span>
            <span className="en">When?</span>
          </h2>
          <p className="hint">
            <span className="ar">امسح الدايرة بصباعك عشان تعرف الميعاد</span>
            <span className="en">Scratch the circle to reveal the date</span>
          </p>
          <div className="scratch" id="scratchbox">
            <div className="under">
              <small>
                <span className="ar">الخميس</span>
                <span className="en">Thursday</span>
              </small>
              <b>18</b>
              <span>
                <span className="ar">فبراير ٢٠٢٧</span>
                <span className="en">February 2027</span>
              </span>
              <small>
                <span className="ar">الساعة ٧ مساءً</span>
                <span className="en">7 in the evening</span>
              </small>
            </div>
            <canvas
              id="scratch"
              ref={scratchCanvasRef}
              aria-label="Scratch to reveal the date"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onDoubleClick={finishScratch}
            />
          </div>
          <p className="revealed" id="revealed">
            {revealedMessage}
          </p>
        </section>

        {/* Schedule Section */}
        <section className="card reveal">
          <h2>
            <span className="ar">تفاصيل اليوم</span>
            <span className="en">The day</span>
          </h2>
          <ul className="day">
            <li>
              <time>7:00</time>
              <span>
                <span className="ar">استقبال المدعوين</span>
                <span className="en">Guests arrive</span>
              </span>
            </li>
            <li>
              <time>7:45</time>
              <span>
                <span className="ar">دخلة العروسين</span>
                <span className="en">The couple's entrance</span>
              </span>
            </li>
            <li>
              <time>8:15</time>
              <span>
                <span className="ar">كتب الكتاب</span>
                <span className="en">Katb el-ketab</span>
              </span>
            </li>
            <li>
              <time>9:00</time>
              <span>
                <span className="ar">العشا</span>
                <span className="en">Dinner</span>
              </span>
            </li>
            <li>
              <time>9:30</time>
              <span>
                <span className="ar">الحفلة</span>
                <span className="en">The party</span>
              </span>
            </li>
          </ul>
        </section>

        {/* Live Countdown Section */}
        <section className="card reveal">
          <h2>
            <span className="ar">فاضل على اليوم</span>
            <span className="en">Counting down</span>
          </h2>
          <div className="count" id="count" aria-live="polite">
            <div>
              <b data-k="d">{timeLeft.d}</b>
              <span className="en">DAYS</span>
              <span className="ar">يوم</span>
            </div>
            <div>
              <b data-k="h">{timeLeft.h}</b>
              <span className="en">HOURS</span>
              <span className="ar">ساعة</span>
            </div>
            <div>
              <b data-k="m">{timeLeft.m}</b>
              <span className="en">MIN</span>
              <span className="ar">دقيقة</span>
            </div>
            <div>
              <b data-k="s">{timeLeft.s}</b>
              <span className="en">SEC</span>
              <span className="ar">ثانية</span>
            </div>
          </div>
        </section>

        {/* Venue Section */}
        <section className="card reveal">
          <h2>
            <span className="ar">المكان</span>
            <span className="en">Where</span>
          </h2>
          <p className="venue">
            <span className="ar">قاعة الياقوت</span>
            <span className="en">Al Yaqout Hall</span>
          </p>
          <p className="addr">
            <span className="ar">مصر الجديدة، القاهرة</span>
            <span className="en">Heliopolis, Cairo</span>
          </p>
          <div className="btns">
            <a
              className="btn solid"
              href="https://maps.google.com/?q=Heliopolis+Cairo"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="ar">افتح اللوكيشن</span>
              <span className="en">Open in Maps</span>
            </a>
            <a
              className="btn"
              href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Laila%20%26%20Youssef%20%C2%B7%20Katb%20el-Ketab%20%26%20Wedding&dates=20270218T170000Z%2F20270218T220000Z&location=Al%20Yaqout%20Hall%2C%20Heliopolis%2C%20Cairo"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="ar">أضف للتقويم</span>
              <span className="en">Add to calendar</span>
            </a>
          </div>
        </section>

        {/* RSVP Section */}
        <section className="card reveal" id="rsvp">
          <h2>
            <span className="ar">هتشاركنا الفرحة؟</span>
            <span className="en">Will you celebrate with us?</span>
          </h2>
          {!isSubmitted ? (
            <form id="rsvp-form" onSubmit={handleRsvpSubmit} noValidate>
              <label className="f" htmlFor="w-name">
                <span className="ar">الاسم الكريم</span>
                <span className="en">Your name</span>
                <input
                  id="w-name"
                  name="guestname"
                  type="text"
                  autoComplete="name"
                  value={formData.guestName}
                  onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                  required
                />
              </label>

              <div className="choice">
                <input
                  type="radio"
                  name="go"
                  id="w-yes"
                  value="yes"
                  checked={formData.attending === 'yes'}
                  onChange={() => setFormData({ ...formData, attending: 'yes' })}
                />
                <label htmlFor="w-yes">
                  <span className="ar">حاضر إن شاء الله</span>
                  <span className="en">I'll be there</span>
                </label>

                <input
                  type="radio"
                  name="go"
                  id="w-no"
                  value="no"
                  checked={formData.attending === 'no'}
                  onChange={() => setFormData({ ...formData, attending: 'no' })}
                />
                <label htmlFor="w-no">
                  <span className="ar">بعتذر</span>
                  <span className="en">Sending apologies</span>
                </label>
              </div>

              {formData.attending === 'yes' && (
                <label className="f" htmlFor="w-count" id="count-wrap">
                  <span className="ar">عدد الأفراد</span>
                  <span className="en">Number of guests</span>
                  <select
                    id="w-count"
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) })}
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>
                </label>
              )}

              <label className="f" htmlFor="w-msg">
                <span className="ar">رسالة تهنئة للعروسين</span>
                <span className="en">A congratulation for the couple</span>
                <textarea
                  id="w-msg"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={isArabic ? 'اكتب كلمتك الطيبة هنا...' : 'Write your warm wishes here...'}
                />
              </label>

              <button className="btn solid" type="submit" style={{ justifyContent: 'center' }}>
                <span className="ar">ابعت</span>
                <span className="en">Send</span>
              </button>
            </form>
          ) : (
            <div className="thanks" id="thanks">
              <p className="big">
                <span className="ar">وصلتنا 🤍</span>
                <span className="en">Received 🤍</span>
              </p>
              <p id="thanks-msg">{thanksMsg}</p>
            </div>
          )}
        </section>

        {/* Closing Section */}
        <section className="closing reveal">
          <p>
            <span className="ar">
              وجودكم معانا هو اللي هيكمل فرحتنا. شكرًا من قلبنا إنكم جزء من يومنا.
            </span>
            <span className="en">
              Having you with us is what will make our day complete. Thank you, from our hearts.
            </span>
          </p>
          <div className="sig">
            <span className="ar">يوسف وليلى</span>
            <span className="en">Youssef &amp; Laila</span>
          </div>
        </section>

        <p className="sign">
          <span className="ar">
            دي دعوة ديمو من <Link to="/">وِصال</Link>. التاريخ والمكان للعرض فقط.
          </span>
          <span className="en">
            A demo invitation by <Link to="/">Wisal</Link>. Date and venue are for display only.
          </span>
        </p>
      </main>

      {/* Floating Order Button */}
      <a className="made" href="/#packages">
        <span className="ar">عايز دعوة زي دي؟ اطلبها من وِصال</span>
        <span className="en">Want one like this? Get it from Wisal</span>
      </a>
    </div>
  );
}
