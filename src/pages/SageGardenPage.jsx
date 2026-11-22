import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { saveGuestResponse } from '../utils/guestStorage';
import '../styles/sage-garden.css';

export default function SageGardenPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const guestParam = searchParams.get('to') || searchParams.get('name') || '';
  const initialLang = searchParams.get('lang') === 'en' ? 'en' : 'ar';

  const [lang, setLang] = useState(initialLang);
  const isArabic = lang === 'ar';

  // Cover & Opening Animation
  const [isOpen, setIsOpen] = useState(false);
  const [isCollagePlaying, setIsCollagePlaying] = useState(false);
  const [isCoverGone, setIsCoverGone] = useState(false);
  const [burstParticles, setBurstParticles] = useState([]);

  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Live Countdown (Friday, 15 January 2027 at 18:00 Cairo time UTC+2)
  const targetDate = useRef(new Date('2027-01-15T18:00:00+02:00').getTime());
  const [timeLeft, setTimeLeft] = useState({ d: '00', h: '00', m: '00', s: '00' });

  // RSVP Form State
  const [guestName, setGuestName] = useState(guestParam);
  const [attending, setAttending] = useState(null); // 'yes' or 'no'
  const [note, setNote] = useState('');
  const [rsvpError, setRsvpError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRsvpSent, setIsRsvpSent] = useState(false);

  // Toast State
  const [toastMsg, setToastMsg] = useState('');
  const [isToastOn, setIsToastOn] = useState(false);
  const toastTimerRef = useRef(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordTimerRef = useRef(null);
  const [voiceName, setVoiceName] = useState(guestParam);

  // Guest photo upload state
  const [photoName, setPhotoName] = useState(guestParam);
  const [photoProgress, setPhotoProgress] = useState(0);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [photoMessage, setPhotoMessage] = useState('');
  const fileInputRef = useRef(null);

  // Dress code palette
  const dressSwatches = [
    { color: '#7c8a6a', label: isArabic ? 'أخضر مريمي' : 'Soft Sage' },
    { color: '#c9d0bb', label: isArabic ? 'مريمي فاتح' : 'Light Sage' },
    { color: '#d8c39a', label: isArabic ? 'شامبين' : 'Champagne' },
    { color: '#f8f4ec', label: isArabic ? 'أوف وايت' : 'Ivory' },
    { color: '#454f39', label: isArabic ? 'زيتوني داكن' : 'Dark Olive' }
  ];

  // Helper for Toast
  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setIsToastOn(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setIsToastOn(false), 3200);
  }, []);

  // Sync lang with URL
  const toggleLanguage = () => {
    const newLang = isArabic ? 'en' : 'ar';
    setLang(newLang);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('lang', newLang);
    setSearchParams(newParams, { replace: true });
  };

  // Countdown Calculation
  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, targetDate.current - now);
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        d: String(d).padStart(2, '0'),
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0')
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check previous RSVP from storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mithaq_rsvp_inv_sage_garden');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) {
          setGuestName(parsed.name);
          setAttending(parsed.attending ? 'yes' : 'no');
          setIsRsvpSent(true);
        }
      }
    } catch (_) {}
  }, []);

  // SVG Lace Generation
  const laceSvgRef = useRef(null);
  useEffect(() => {
    if (!laceSvgRef.current) return;
    const rx = 168;
    const ry = 208;
    const R = (v) => v.toFixed(1);
    let holes = '';
    let relief = '';
    let scallops = '';

    const ring = (k, n, off, f) => {
      for (let i = 0; i < n; i += 1) {
        const t = ((i + off) / n) * Math.PI * 2;
        const x = rx * k * Math.cos(t);
        const y = ry * k * Math.sin(t);
        const a = (Math.atan2(ry * Math.cos(t), -rx * Math.sin(t)) * 180) / Math.PI;
        f(x, y, a);
      }
    };

    ring(1, 70, 0, (x, y) => {
      scallops += `<circle cx="${R(x)}" cy="${R(y)}" r="9.5"/>`;
    });
    ring(0.985, 70, 0.5, (x, y) => {
      holes += `<circle cx="${R(x)}" cy="${R(y)}" r="2.6"/>`;
    });
    ring(0.9, 48, 0, (x, y, a) => {
      holes += `<ellipse cx="${R(x)}" cy="${R(y)}" rx="9" ry="5" transform="rotate(${R(a + 90)} ${R(x)} ${R(y)})"/>`;
      relief += `<ellipse cx="${R(x)}" cy="${R(y)}" rx="12" ry="7.5" transform="rotate(${R(a + 90)} ${R(x)} ${R(y)})"/>`;
    });
    ring(0.9, 48, 0.5, (x, y) => {
      holes += `<circle cx="${R(x)}" cy="${R(y)}" r="3"/>`;
    });
    ring(0.815, 40, 0.25, (x, y, a) => {
      holes += `<path d="M0 -7 L5 0 L0 7 L-5 0Z" transform="translate(${R(x)} ${R(y)}) rotate(${R(a)})"/>`;
    });
    ring(0.755, 64, 0, (x, y) => {
      holes += `<circle cx="${R(x)}" cy="${R(y)}" r="2.4"/>`;
    });
    ring(0.715, 110, 0, (x, y) => {
      holes += `<circle cx="${R(x)}" cy="${R(y)}" r="1.1"/>`;
    });

    laceSvgRef.current.innerHTML =
      `<defs><mask id="sgLaceMask" maskUnits="userSpaceOnUse" x="-200" y="-240" width="400" height="480"><ellipse rx="${rx}" ry="${ry}" fill="#fff"/><g fill="#fff">${scallops}</g><g fill="#000">${holes}</g></mask></defs>` +
      '<rect x="-200" y="-240" width="400" height="480" fill="#fdfcf8" mask="url(#sgLaceMask)"/>' +
      `<g fill="none" stroke="#e7e2d6" stroke-width="1">${relief}</g>` +
      `<ellipse rx="${R(rx * 0.69)}" ry="${R(ry * 0.69)}" fill="none" stroke="#e4ded1" stroke-width="1.4"/><ellipse rx="${R(rx * 0.665)}" ry="${R(ry * 0.665)}" fill="#fefdfb"/>`;
  }, []);

  // Sprig drawing
  const sprigRef = useRef(null);
  useEffect(() => {
    if (!sprigRef.current) return;
    const svg = sprigRef.current;
    svg.setAttribute('viewBox', '0 0 160 220');
    const stem = 'M20 210 C 50 160, 70 120, 90 80 S 120 25, 138 8';
    svg.innerHTML = `<path class="stem" d="${stem}" style="--len:320"/>`;
    const p = svg.querySelector('.stem');
    if (!p) return;
    const len = p.getTotalLength();
    let out = svg.innerHTML;
    for (let i = 1; i <= 11; i += 1) {
      const pt = p.getPointAtLength((len * i) / 12);
      const side = i % 2 ? 1 : -1;
      const ang = (i * 13 % 30) - 15 + (side > 0 ? -50 : 50);
      const rx = 12 + ((i * 7) % 6);
      out += `<ellipse class="leaf" cx="${pt.x + rx * 0.9 * side}" cy="${pt.y}" rx="${rx}" ry="${rx * 0.48}" transform="rotate(${ang} ${pt.x} ${pt.y})" style="transition-delay:${0.35 + i * 0.13}s;--o:${0.55 + (i % 3) * 0.15}"/>`;
    }
    svg.innerHTML = out;
  }, []);

  // IntersectionObserver for scroll reveal
  useEffect(() => {
    if (!isCoverGone) return;
    const elements = document.querySelectorAll('.sage-garden-wrapper .reveal, .sage-garden-wrapper .sprig');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isCoverGone]);

  // Floating Petals Generator
  const spawnPetals = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let n = 0;
    const id = setInterval(() => {
      if (++n > 26) {
        clearInterval(id);
        return;
      }
      const el = document.createElement('i');
      el.className = 'petal';
      const stage = document.getElementById('stage');
      const r = stage ? stage.getBoundingClientRect() : { left: 0, width: window.innerWidth };
      el.style.left = `${r.left + Math.random() * r.width}px`;
      el.style.setProperty('--dx', `${(Math.random() - 0.5) * 160}px`);
      el.style.setProperty('--rot', `${Math.random() * 720}deg`);
      el.style.animationDuration = `${7 + Math.random() * 6}s`;
      el.style.background = Math.random() > 0.7 ? '#d8c39a' : '#c9d0bb';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 14000);
    }, 650);
  }, []);

  // Audio Playback
  const toggleAudio = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, [isPlaying]);

  // Open Invitation
  const openInvitation = () => {
    if (isOpen) return;
    setIsOpen(true);

    // Burst Particles
    const particles = Array.from({ length: 16 }, (_, i) => {
      const a = (i / 16) * Math.PI * 2;
      const r = 90 + Math.random() * 90;
      return {
        x: Math.cos(a) * r,
        y: Math.sin(a) * r,
        rot: Math.random() * 360,
        bg: i % 3 ? '#c9d0bb' : '#d8c39a'
      };
    });
    setBurstParticles(particles);

    // Audio Playback
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }

    // Schedule Collage Assembly
    setTimeout(() => {
      setIsCollagePlaying(true);
    }, 400);

    // Fade and Remove Cover
    setTimeout(() => {
      setIsCoverGone(true);
      spawnPetals();
    }, 1300);
  };

  // Collage Click Navigation
  const handleScrollTo = (targetId) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // RSVP Submission
  const handleRsvpSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!guestName.trim()) {
      setRsvpError(isArabic ? 'يرجى كتابة اسمك' : 'Please enter your name');
      return;
    }
    if (!attending) {
      setRsvpError(isArabic ? 'يرجى تحديد حضورك' : 'Please choose accept or decline');
      return;
    }

    setIsSubmitting(true);
    setRsvpError('');

    try {
      const responseData = {
        name: guestName.trim(),
        attending: attending === 'yes',
        notes: note.trim(),
        submittedAt: new Date().toISOString()
      };

      saveGuestResponse('inv_sage_garden', responseData);
      localStorage.setItem('mithaq_guest_name', guestName.trim());
      localStorage.setItem('mithaq_rsvp_inv_sage_garden', JSON.stringify(responseData));

      setIsRsvpSent(true);
      showToast(isArabic ? 'تم تأكيد حضورك بنجاح 🤍' : 'Your RSVP has been received 🤍');
    } catch (err) {
      setRsvpError(isArabic ? 'حدث خطأ أثناء الإرسال، يرجى المحاولة ثانية' : 'Submission failed, please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Voice recording simulation / handling
  const startRecording = async () => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      showToast(isArabic ? 'المتصفح لا يدعم التسجيل الصوتي' : 'Voice recording not supported on this browser');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size) audioChunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlobUrl(url);
        setHasRecording(true);
        setIsRecording(false);
        clearInterval(recordTimerRef.current);
      };

      mr.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      recordTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 60) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (_) {
      showToast(isArabic ? 'يرجى السماح بالمايكروفون للتسجيل' : 'Please allow microphone access');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const resetRecording = () => {
    setHasRecording(false);
    setIsRecording(false);
    setAudioBlobUrl(null);
    setRecordingSeconds(0);
    clearInterval(recordTimerRef.current);
  };

  const sendVoiceWish = () => {
    if (!voiceName.trim()) {
      showToast(isArabic ? 'يرجى كتابة اسمك أولاً' : 'Please write your name first');
      return;
    }
    showToast(isArabic ? 'تم إرسال تهنئتك الصوتية بنجاح 🤍' : 'Your voice wish was sent to the couple 🤍');
    resetRecording();
  };

  // Guest Photos Upload Handler
  const handlePhotoSelect = (e) => {
    const files = e.target.files;
    if (!files || !files.length) return;
    if (!photoName.trim()) {
      showToast(isArabic ? 'يرجى كتابة اسمك أولاً' : 'Please write your name first');
      return;
    }

    setIsPhotoUploading(true);
    setPhotoProgress(10);
    const interval = setInterval(() => {
      setPhotoProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsPhotoUploading(false);
          setPhotoMessage(isArabic ? 'تم رفع صورك بنجاح للعروسين 🤍' : 'Your photos were sent to the couple 🤍');
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  // Calendar Link
  const calendarTitle = isArabic ? 'زفاف يوسف وأميرة' : 'Yusuf & Amira Wedding';
  const calendarDesc = isArabic ? 'حفل زفاف يوسف وأميرة في قاعة روز جاردن' : 'Wedding ceremony of Yusuf & Amira at Rose Garden Hall';
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarTitle)}&dates=20270115T160000Z/20270115T220000Z&details=${encodeURIComponent(calendarDesc)}&location=${encodeURIComponent('Rose Garden Hall, New Cairo, Egypt')}`;

  return (
    <div className="sage-garden-wrapper" dir={isArabic ? 'rtl' : 'ltr'} lang={lang}>
      {/* Background Audio */}
      <audio
        ref={audioRef}
        id="invitation-audio"
        src="/audio/sage-garden.mp3"
        loop
        preload="none"
        playsInline
      />

      {/* Top Floating Bar for Language Toggle & Home link */}
      <header className="sg-topbar">
        <Link to="/" className="sg-brand" aria-label="Wisal Home">
          <span>وصال</span>
        </Link>
        <button
          type="button"
          onClick={toggleLanguage}
          className="sg-lang-btn"
          aria-label="Switch Language"
        >
          {isArabic ? 'English' : 'عربي'}
        </button>
      </header>

      {/* ============ غلاف الظرف الافتتاحي ============ */}
      {!isCoverGone && (
        <div className={`cover ${isOpen ? 'opening' : ''}`} id="coverScreen">
          <div className="env-wrap">
            <img className="env-img" src="/templates/sage-garden/envelope-cream.webp" alt="Envelope" />
            <div className="env-card">
              <div className="cover-eyebrow">
                {isArabic ? 'دعوة زفاف' : 'You are invited'}
              </div>
              <div className="cover-names">
                {isArabic ? 'يوسف & أميرة' : 'Yusuf & Amira'}
              </div>
              <div className="cover-date">
                {isArabic ? '15 يناير 2027' : '15 January 2027'}
              </div>
            </div>
            <div
              className="seal"
              id="seal"
              role="button"
              tabIndex={0}
              aria-label="Open"
              onClick={openInvitation}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openInvitation();
                }
              }}
            >
              <img src="/templates/sage-garden/seal-heart.webp" alt="Wax Seal" />
              <span className="seal-tip">
                {isArabic ? 'اضغط على الختم للفتح' : 'Tap the seal to open'}
              </span>
            </div>
            <div className="burst" id="burst">
              {burstParticles.map((p, idx) => (
                <span
                  key={idx}
                  style={{
                    '--x': `${p.x}px`,
                    '--y': `${p.y}px`,
                    '--r': `${p.rot}deg`,
                    background: p.bg
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============ المحتوى الرئيسي للكولاج ============ */}
      <main className="stage paper-bg" id="stage">
        <div className={`collage ${isCollagePlaying ? 'play' : ''}`} id="collage">
          {/* خلفية السماء الجبلية */}
          <svg className="pc bg" style={{ '--x': 0, '--y': 0, '--w': 736, '--h': 1308, '--d': '0s', '--fs': 1.08 }} viewBox="0 0 736 1308" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="sgSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f1f2ee" />
                <stop offset=".55" stopColor="#e2e5de" />
                <stop offset="1" stopColor="#d2d7cc" />
              </linearGradient>
              <linearGradient id="sgMist" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset=".5" stopColor="#fff" stopOpacity=".55" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <filter id="sgSoft"><feGaussianBlur stdDeviation="6" /></filter>
              <filter id="sgGrain">
                <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch" />
                <feColorMatrix values="0 0 0 0 .3 0 0 0 0 .3 0 0 0 0 .25 0 0 0 .12 0" />
              </filter>
            </defs>
            <rect width="736" height="1308" fill="url(#sgSky)" />
            <path filter="url(#sgSoft)" fill="#d6dad2" d="M0 420 L70 330 L130 370 L220 250 L300 330 L380 280 L470 210 L560 300 L640 240 L736 310 V860 H0Z" />
            <path filter="url(#sgSoft)" fill="#c9cec3" opacity=".85" d="M0 560 L110 470 L200 520 L320 430 L430 500 L540 440 L640 500 L736 450 V900 H0Z" />
            <rect y="380" width="736" height="300" fill="url(#sgMist)" />
            <path fill="#aab296" d="M0 770 C140 720 270 760 400 735 S620 700 736 725 V1308 H0Z" />
            <path fill="#8b9576" d="M0 860 C120 820 250 858 380 836 S600 792 736 820 V1308 H0Z" />
            <path fill="#6f7a5b" d="M0 990 C160 950 300 1000 460 972 S650 925 736 952 V1308 H0Z" />
            <path fill="#5a6447" d="M0 1130 C200 1092 380 1150 560 1112 S700 1094 736 1102 V1308 H0Z" />
            <path fill="#4a5339" d="M0 1240 C180 1215 400 1262 736 1222 V1308 H0Z" />
            <rect width="736" height="1308" filter="url(#sgGrain)" />
          </svg>

          {/* الظرف العلوي المطوي */}
          <svg className="pc env-top" style={{ '--x': 92, '--y': -30, '--w': 330, '--h': 250, '--r': '-14deg', '--fx': '-60px', '--fy': '-90px', '--fr': '-12deg', '--d': '.15s' }} viewBox="0 0 330 250" aria-hidden="true">
            <polygon points="10,112 165,8 320,112" fill="#e3dccd" stroke="#cfc7b6" strokeWidth="1" />
            <rect x="10" y="112" width="310" height="134" fill="#d8d0bf" />
            <polygon points="10,112 150,190 10,246" fill="#cfc6b3" />
            <polygon points="320,112 180,190 320,246" fill="#d2c9b7" />
            <polygon points="10,246 165,160 320,246" fill="#e0d8c8" />
          </svg>

          {/* شريط الصور الثلاثي الفينتاج */}
          <div className="pc strip" style={{ '--x': 205, '--y': 22, '--w': 134, '--h': 330, '--r': '-17deg', '--fx': '-40px', '--fy': '-160px', '--fr': '-14deg', '--d': '.32s' }}>
            <img src="/templates/sage-garden/p-strip-1.webp" alt="Couple memory 1" />
            <img src="/templates/sage-garden/p-strip-2.webp" alt="Couple memory 2" />
            <img src="/templates/sage-garden/p-strip-3.webp" alt="Couple memory 3" />
          </div>

          {/* نبات الأنثوريوم المتمايل علوي */}
          <img
            className="pc sway"
            src="/templates/sage-garden/c-anthurium-left.webp"
            alt=""
            aria-hidden="true"
            style={{ '--x': 318, '--y': -34, '--w': 160, '--h': 104, '--r': '166deg', '--fy': '-90px', '--fr': '30deg', '--d': '1.2s', '--o': '85% 70%' }}
          />

          {/* كارت التاريخ - قابل للضغط -> ينزل للعداد */}
          <div
            className="pc date-card tap"
            data-go="countdown"
            onClick={() => handleScrollTo('countdownSec')}
            style={{ '--x': 400, '--y': 85, '--w': 280, '--h': 360, '--r': '3.5deg', '--fx': '120px', '--fy': '-80px', '--fr': '14deg', '--d': '.25s' }}
          >
            <svg className="frame" viewBox="0 0 236 316" preserveAspectRatio="none" aria-hidden="true">
              <path d="M14 0H222A14 14 0 0 0 236 14V302A14 14 0 0 0 222 316H14A14 14 0 0 0 0 302V14A14 14 0 0 0 14 0Z" fill="none" stroke="#6a5a52" strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="dc-in">
              <span className="dd fit1">15</span>
              <span className="mm fit1">{isArabic ? 'يناير' : 'JANUARY'}</span>
              <span className="yy fit1">2027</span>
            </div>
          </div>

          {/* مفرش الدانتيل مع أسماء العروسين */}
          <div className="pc lace" style={{ '--x': 58, '--y': 358, '--w': 360, '--h': 440, '--r': '-2deg', '--fs': 0.55, '--fr': '-10deg', '--d': '.05s' }}>
            <svg id="laceSvg" ref={laceSvgRef} viewBox="-180 -220 360 440" aria-hidden="true"></svg>
            <div className="lace-in">
              <div className="li-top">{isArabic ? <>دعوة<br />زفاف</> : <>Wedding<br />invitation</>}</div>
              <div className="ln">
                <span className="nm fit1">{isArabic ? 'يوسف' : 'Yusuf'}</span>
                <span className="amp">{isArabic ? 'و' : '&'}</span>
                <span className="nm fit1">{isArabic ? 'أميرة' : 'Amira'}</span>
              </div>
            </div>
          </div>

          {/* باقة الورد اليسرى المتمايلة */}
          <img
            className="pc sway"
            src="/templates/sage-garden/c-bouquet-left.webp"
            alt=""
            aria-hidden="true"
            style={{ '--x': 18, '--y': 232, '--w': 194, '--h': 288, '--fx': '-120px', '--fr': '-14deg', '--fs': 0.8, '--d': '1s', '--o': '60% 95%' }}
          />

          {/* كارت النفل الأخضر - ينزل للمكان */}
          <div
            className="pc clover tap"
            data-go="venue"
            onClick={() => handleScrollTo('venue')}
            style={{ '--x': 342, '--y': 392, '--w': 230, '--h': 220, '--r': '8deg', '--fs': 0.3, '--fr': '-40deg', '--d': '.55s' }}
          >
            <svg viewBox="0 0 230 220" aria-hidden="true">
              <g fill="#8e9670">
                <circle cx="74" cy="70" r="64" />
                <circle cx="156" cy="66" r="64" />
                <circle cx="70" cy="150" r="64" />
                <circle cx="158" cy="150" r="64" />
              </g>
              <g fill="#9aa27c">
                <circle cx="74" cy="70" r="58" />
                <circle cx="156" cy="66" r="58" />
                <circle cx="70" cy="150" r="58" />
                <circle cx="158" cy="150" r="58" />
              </g>
              <circle cx="115" cy="110" r="44" fill="#9aa27c" />
              <g fill="none" stroke="#757d59" strokeWidth="1.2">
                <circle cx="74" cy="70" r="52" />
                <circle cx="156" cy="66" r="52" />
                <circle cx="70" cy="150" r="52" />
                <circle cx="158" cy="150" r="52" />
              </g>
            </svg>
            <div className="c-in">
              <span className="c-top">{isArabic ? 'قاعة' : 'Banquet hall'}</span>
              <span className="c-hall">{isArabic ? 'روز جاردن' : 'Rose Garden'}</span>
              <span className="c-sm">{isArabic ? 'القاهرة الجديدة' : 'New Cairo'}</span>
            </div>
          </div>

          {/* كارت التفاصيل بتأثير الورق الممزق - ينزل للبرنامج */}
          <div
            className="pc details tap"
            data-go="schedule"
            onClick={() => handleScrollTo('schedule')}
            style={{ '--x': 392, '--y': 826, '--w': 258, '--h': 428, '--r': '-2deg', '--fx': '140px', '--fy': '60px', '--fr': '10deg', '--d': '.6s' }}
          >
            <svg className="torn" viewBox="0 0 230 350" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <filter id="sgTear" x="-5%" y="-5%" width="110%" height="110%">
                  <feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="3" seed="4" />
                  <feDisplacementMap in="SourceGraphic" scale="7" />
                </filter>
              </defs>
              <rect x="6" y="6" width="218" height="338" fill="#f7f3ea" filter="url(#sgTear)" />
            </svg>
            <div className="det-in">
              <span className="d-sm">{isArabic ? 'اضغط للتفاصيل' : 'Tap to view'}</span>
              <span className="d-big fit1">{isArabic ? 'تفاصيل' : 'Wedding'}</span>
              <span className="d-scr fit1">{isArabic ? 'الفرح' : 'details'}</span>
            </div>
          </div>

          {/* بولارويد المكان - ينزل للمكان */}
          <figure
            className="pc pola-c tap"
            data-go="venue"
            onClick={() => handleScrollTo('venue')}
            style={{ '--x': 400, '--y': 575, '--w': 210, '--h': 262, '--r': '6deg', '--fx': '160px', '--fr': '18deg', '--d': '.72s' }}
          >
            <img src="/templates/sage-garden/p-venue.webp" alt="Wedding Venue" />
            <figcaption>{isArabic ? 'المكان' : 'Location'}</figcaption>
          </figure>

          {/* باقة الورد اليمنى المتمايلة */}
          <img
            className="pc sway"
            src="/templates/sage-garden/c-bouquet-right.webp"
            alt=""
            aria-hidden="true"
            style={{ '--x': 525, '--y': 420, '--w': 197, '--h': 302, '--fx': '120px', '--fr': '12deg', '--fs': 0.8, '--d': '1.1s', '--o': '45% 30%' }}
          />

          {/* صينية التقديم الفينتاج الكبيرة */}
          <img
            className="pc"
            src="/templates/sage-garden/c-tray.webp"
            alt=""
            aria-hidden="true"
            style={{ '--x': 38, '--y': 745, '--w': 358, '--h': 353, '--r': '28deg', '--fx': '-160px', '--fy': '40px', '--fr': '-40deg', '--d': '.38s' }}
          />

          {/* ظرف RSVP الصغير - ينزل لقسم الحضور */}
          <div
            className="pc envelope tap"
            data-go="rsvp"
            onClick={() => handleScrollTo('rsvp')}
            style={{ '--x': 89, '--y': 812, '--w': 300, '--h': 206, '--r': '-6deg', '--fx': '-120px', '--fy': '-60px', '--fr': '-18deg', '--d': '.62s' }}
          >
            <svg viewBox="0 0 300 206" aria-hidden="true">
              <defs>
                <filter id="sgEnvGrain" x="0" y="0" width="100%" height="100%">
                  <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="7" result="n" />
                  <feColorMatrix in="n" values="0 0 0 0 .45 0 0 0 0 .4 0 0 0 0 .32 0 0 0 .16 0" />
                  <feComposite in2="SourceGraphic" operator="in" />
                </filter>
                <filter id="sgFlapShadow" x="-10%" y="-10%" width="120%" height="140%">
                  <feDropShadow dx="0" dy="2.5" stdDeviation="2.2" floodColor="#5a4c38" floodOpacity=".22" />
                </filter>
                <linearGradient id="sgEnvBody" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#ece5d7" />
                  <stop offset="1" stopColor="#e2d9c7" />
                </linearGradient>
                <linearGradient id="sgEnvFlap" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#f3eee4" />
                  <stop offset="1" stopColor="#e9e1d2" />
                </linearGradient>
                <clipPath id="sgEnvClip">
                  <rect width="300" height="206" rx="4" />
                </clipPath>
              </defs>
              <g clipPath="url(#sgEnvClip)">
                <rect width="300" height="206" fill="url(#sgEnvBody)" />
                <path d="M0 0 L136 114 Q150 124 164 114 L300 0 V206 H0Z" fill="#ddd3c0" />
                <path d="M0 206 L128 104 Q150 88 172 104 L300 206Z" fill="#e8e0d0" />
                <path d="M0 0 L120 108 L0 206Z" fill="#e3dac8" />
                <path d="M300 0 L180 108 L300 206Z" fill="#e0d7c4" />
                <path d="M0 206 L128 104 Q150 88 172 104 L300 206" fill="none" stroke="#cfc4ae" strokeWidth=".8" />
                <path d="M0 0 H300 L166 122 Q150 135 134 122 Z" fill="url(#sgEnvFlap)" filter="url(#sgFlapShadow)" />
                <path d="M0 .6 H300" stroke="#fffaf0" strokeWidth="1.2" />
                <rect width="300" height="206" fill="#fff" filter="url(#sgEnvGrain)" />
              </g>
              <rect x=".5" y=".5" width="299" height="205" rx="4" fill="none" stroke="#d3c8b3" strokeWidth="1" />
            </svg>
            <img className="env-seal" src="/templates/sage-garden/seal-heart.webp" alt="" />
            <span className="rsvp-s">{isArabic ? 'أكّد حضورك' : 'RSVP'}</span>
            <span className="rsvp-tap">{isArabic ? 'اضغط للفتح' : 'Tap to open'}</span>
          </div>

          {/* زهرة أنثوريوم سفلية متمايلة */}
          <img
            className="pc sway"
            src="/templates/sage-garden/c-anthurium-left.webp"
            alt=""
            aria-hidden="true"
            style={{ '--x': 28, '--y': 738, '--w': 160, '--h': 104, '--fx': '-90px', '--fr': '-30deg', '--d': '1.15s', '--o': '90% 40%' }}
          />

          {/* بولارويد حكايتنا - ينزل لقسم الذكريات */}
          <figure
            className="pc pola-c story-pola tap"
            data-go="extras"
            onClick={() => handleScrollTo('extras')}
            style={{ '--x': 96, '--y': 1018, '--w': 206, '--h': 240, '--r': '-10deg', '--fx': '-80px', '--fy': '160px', '--fr': '-14deg', '--d': '.85s' }}
          >
            <img src="/templates/sage-garden/p-story.webp" alt="Story memory" />
            <figcaption>
              <span className="scr">{isArabic ? 'حكايتنا' : 'Our'}</span>
              {!isArabic && <span> story</span>}
            </figcaption>
          </figure>

          {/* باقة الورد السفلية */}
          <img
            className="pc sway"
            src="/templates/sage-garden/c-flowers-bottom.webp"
            alt=""
            aria-hidden="true"
            style={{ '--x': 272, '--y': 1025, '--w': 138, '--h': 230, '--fy': '120px', '--fs': 0.7, '--d': '1.05s', '--o': '50% 100%' }}
          />

          {/* طبق الخواتم العائم */}
          <img
            className="pc rings"
            src="/templates/sage-garden/c-rings-plate.webp"
            alt=""
            aria-hidden="true"
            style={{ '--x': 470, '--y': 1108, '--w': 167, '--h': 164, '--fx': '200px', '--fr': '220deg', '--d': '1.25s' }}
          />
        </div>
      </main>

      {/* ============ العد التنازلي ============ */}
      <section className="count-sec" id="countdownSec" data-section="countdown">
        <div className="countdown">
          <div className="cd">
            <span className="cn">{timeLeft.d}</span>
            <span className="cl">{isArabic ? 'يوم' : 'Days'}</span>
          </div>
          <div className="cd">
            <span className="cn">{timeLeft.h}</span>
            <span className="cl">{isArabic ? 'ساعة' : 'Hours'}</span>
          </div>
          <div className="cd">
            <span className="cn">{timeLeft.m}</span>
            <span className="cl">{isArabic ? 'دقيقة' : 'Minutes'}</span>
          </div>
          <div className="cd">
            <span className="cn">{timeLeft.s}</span>
            <span className="cl">{isArabic ? 'ثانية' : 'Seconds'}</span>
          </div>
        </div>
        <div className="cal-add">
          <a className="btn btn-ghost" id="addCal" href={calendarUrl} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M8 3v4M16 3v4M3 10h18" />
            </svg>
            <span>{isArabic ? 'أضف للتقويم' : 'Add to calendar'}</span>
          </a>
        </div>
      </section>

      {/* ============ برنامج اليوم ============ */}
      <section id="schedule" className="paper-bg" data-section="timeline">
        <div className="eyebrow reveal">{isArabic ? 'يوم الفرح' : 'The day'}</div>
        <div className="h-script reveal d1">{isArabic ? 'برنامج اليوم' : 'Order of the day'}</div>
        <div className="timeline">
          <div className="tl reveal">
            <span className="t">{isArabic ? '6:00 م' : '6:00 PM'}</span>
            <span className="ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="14" r="5" />
                <circle cx="15" cy="14" r="5" />
                <path d="M10 5l2-2 2 2" />
              </svg>
            </span>
            <span className="n">{isArabic ? 'كتب الكتاب والترحيب' : 'Ceremony'}</span>
          </div>

          <div className="tl reveal d1">
            <span className="t">{isArabic ? '7:00 م' : '7:00 PM'}</span>
            <span className="ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3h12l-1 6a5 5 0 0 1-10 0L6 3zM12 14v6M8 21h8" />
              </svg>
            </span>
            <span className="n">{isArabic ? 'الاستقبال والمقبلات' : 'Cocktails'}</span>
          </div>

          <div className="tl reveal d2">
            <span className="t">{isArabic ? '8:00 م' : '8:00 PM'}</span>
            <span className="ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 3v7a2 2 0 0 0 4 0V3M6 10v11M16 3c-2 2-2 6 0 8v10" />
              </svg>
            </span>
            <span className="n">{isArabic ? 'العشاء الملكي' : 'Dinner'}</span>
          </div>

          <div className="tl reveal d3">
            <span className="t">{isArabic ? '9:30 م' : '9:30 PM'}</span>
            <span className="ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l11-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="17" cy="16" r="3" />
              </svg>
            </span>
            <span className="n">{isArabic ? 'الحفلة والرقصة الأولى' : 'First dance & party'}</span>
          </div>
        </div>
      </section>

      {/* ============ المكان ============ */}
      <section className="venue-sec" id="venue" data-section="venue">
        <div className="eyebrow reveal">{isArabic ? 'المكان' : 'Where'}</div>
        <div className="h-script reveal d1">{isArabic ? 'مكان الحفل' : 'The venue'}</div>
        <div className="venue-name reveal">{isArabic ? 'قاعة روز جاردن' : 'Rose Garden Hall'}</div>
        <div className="venue-addr reveal d1">{isArabic ? 'القاهرة الجديدة، مصر' : 'New Cairo, Egypt'}</div>
        <div className="map-card reveal d2">
          <iframe
            id="sgMap"
            src="https://www.google.com/maps?q=Cairo&hl=en&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Venue location map"
          />
        </div>
        <div className="venue-btns reveal d3">
          <a
            className="btn btn-sage"
            id="mapBtn"
            href="https://www.google.com/maps/search/?api=1&query=Cairo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M12 21s-7-6.3-7-11.5A7 7 0 0 1 19 9.5C19 14.7 12 21 12 21z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
            <span>{isArabic ? 'افتح الخريطة' : 'Get directions'}</span>
          </a>
        </div>
      </section>

      {/* ============ الزي ============ */}
      <section className="dress" id="dress" data-section="dressCode">
        <div className="eyebrow reveal">{isArabic ? 'الزي' : 'Dress code'}</div>
        <div className="h-script reveal d1">{isArabic ? 'ألوان الحديقة' : 'Garden formal'}</div>
        <div className="pal-wrap reveal d2">
          <div className="swatches" id="swatches">
            {dressSwatches.map((swatch, i) => (
              <span
                key={i}
                className="swatch-item"
                style={{ backgroundColor: swatch.color }}
                title={swatch.label}
              />
            ))}
          </div>
        </div>
        <p className="lead reveal d3">
          {isArabic
            ? 'درجات الأخضر الهادي والأوف وايت والشامبين — وحذاء مريح للاحتفال على العشب.'
            : 'Soft sage, ivory and champagne tones — and comfortable shoes for dancing on the grass.'}
        </p>
      </section>

      {/* ============ تأكيد الحضور (RSVP) ============ */}
      <section className="rsvp" id="rsvp" data-section="rsvp">
        <svg
          ref={sprigRef}
          className="sprig"
          style={{ width: '140px', left: '-26px', bottom: '20px', color: '#c7d0b4', transform: 'rotate(20deg)' }}
        />
        <div className="eyebrow reveal">{isArabic ? 'نتشرف بردكم' : 'Kindly reply'}</div>
        <div className="h-script reveal d1">{isArabic ? 'هتكونوا معانا؟' : 'Will you join us?'}</div>
        <div className={`rsvp-card reveal d2 ${isRsvpSent ? 'sent' : ''}`} id="mithaq-rsvp">
          {!isRsvpSent ? (
            <form id="rsvpForm" onSubmit={handleRsvpSubmit} noValidate>
              <h3>{isArabic ? 'تأكيد الحضور' : 'RSVP'}</h3>
              <div className="by">{isArabic ? 'نرجو الرد في أقرب وقت' : 'Please reply at your earliest convenience'}</div>

              <div className="field">
                <span className="lab">{isArabic ? 'الاسم' : 'Your name'}</span>
                <input
                  id="rName"
                  name="name"
                  type="text"
                  value={guestName}
                  onChange={(e) => {
                    setGuestName(e.target.value);
                    setRsvpError('');
                  }}
                  placeholder={isArabic ? 'اسمك بالكامل' : 'Your full name'}
                  maxLength={80}
                  required
                />
              </div>

              <div className="field">
                <span className="lab">{isArabic ? 'هتحضر؟' : 'Will you attend?'}</span>
                <div className="choice" role="radiogroup">
                  <div
                    role="radio"
                    tabIndex={0}
                    aria-checked={attending === 'yes'}
                    className={`radio-pill ${attending === 'yes' ? 'selected' : ''}`}
                    onClick={() => {
                      setAttending('yes');
                      setRsvpError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setAttending('yes');
                        setRsvpError('');
                      }
                    }}
                  >
                    {isArabic ? 'أكيد حاضر' : 'Joyfully accept'}
                  </div>

                  <div
                    role="radio"
                    tabIndex={0}
                    aria-checked={attending === 'no'}
                    className={`radio-pill ${attending === 'no' ? 'selected' : ''}`}
                    onClick={() => {
                      setAttending('no');
                      setRsvpError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setAttending('no');
                        setRsvpError('');
                      }
                    }}
                  >
                    {isArabic ? 'معتذر للأسف' : 'Regretfully decline'}
                  </div>
                </div>
              </div>

              <div className="field" id="noteField">
                <span className="lab">{isArabic ? 'رسالة للعروسين' : 'A message for the couple'}</span>
                <textarea
                  id="rNote"
                  rows={2}
                  maxLength={200}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={isArabic ? 'اختياري' : 'Optional'}
                />
              </div>

              <button
                type="submit"
                className={`btn btn-sage ${isSubmitting ? 'busy' : ''}`}
                id="rSend"
                disabled={isSubmitting}
              >
                <span>{isArabic ? 'ابعت الرد' : 'Send reply'}</span>
              </button>

              {rsvpError && <div className="r-err" id="rErr" aria-live="polite">{rsvpError}</div>}
            </form>
          ) : (
            <div className="rsvp-done">
              <img src="/templates/sage-garden/seal-sprig.webp" alt="Wax seal" />
              <p id="rThanks">
                {attending === 'yes'
                  ? (isArabic
                      ? `شكرًا يا ${guestName.trim().split(' ')[0] || ''} — مستنيينك تنوّر فرحتنا 🤍`
                      : `Thank you, ${guestName.trim().split(' ')[0] || ''} — we can’t wait to celebrate with you 🤍`)
                  : (isArabic
                      ? `شكرًا يا ${guestName.trim().split(' ')[0] || ''} — هتوحشنا، وهتكون في قلوبنا يومها 🤍`
                      : `Thank you, ${guestName.trim().split(' ')[0] || ''} — you’ll be in our hearts that day 🤍`)}
              </p>
              <div
                className="again"
                role="button"
                tabIndex={0}
                id="rAgain"
                onClick={() => setIsRsvpSent(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsRsvpSent(false);
                  }
                }}
              >
                <span>{isArabic ? 'غيّر ردّي' : 'Change my reply'}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============ تهنئة صوتية + صور الضيوف ============ */}
      <section className="extras" id="extras">
        <div className="eyebrow reveal">{isArabic ? 'سيبولنا ذكرى حلوة' : 'Leave us a little love'}</div>
        <div className="h-script reveal d1">{isArabic ? 'تهاني وذكريات' : 'Wishes & memories'}</div>

        {/* كارت التهنئة الصوتية */}
        <div className="ex-card reveal d2" id="voiceCard" data-section="voice">
          <div className="ex-head">
            <span className="ex-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <rect x="9" y="3" width="6" height="11" rx="3" />
                <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
              </svg>
            </span>
            <div>
              <h4>{isArabic ? 'سجّل تهنئة بصوتك' : 'Record a voice wish'}</h4>
              <p>{isArabic ? 'لحد دقيقة — العروسين هيحتفظوا بيها' : 'Up to one minute — the couple will treasure it'}</p>
            </div>
          </div>
          <div className={`rec ${isRecording ? 'on' : ''} ${hasRecording ? 'review' : ''}`} id="rec">
            <div
              className="rec-btn"
              id="recBtn"
              role="button"
              tabIndex={0}
              aria-label="record"
              onClick={isRecording ? stopRecording : startRecording}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="9" y="3" width="6" height="11" rx="3" />
                <path d="M5 11a7 7 0 0 0 14 0M12 18v3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <div className="wave" id="wave">
              {Array.from({ length: 26 }, (_, i) => (
                <i key={i} style={{ height: isRecording ? `${6 + (i % 5) * 5}px` : '6px' }} />
              ))}
            </div>
            <div className="rec-time">
              {!isRecording && !hasRecording && (
                <span id="recHint">{isArabic ? 'اضغط عشان تبدأ التسجيل' : 'Tap to start recording'}</span>
              )}
              {isRecording && (
                <span id="recClock">
                  {isArabic ? 'بيسجّل' : 'Recording'} · {Math.floor(recordingSeconds / 60)}:{String(recordingSeconds % 60).padStart(2, '0')}
                </span>
              )}
              {hasRecording && (
                <span id="recClock">
                  {Math.floor(recordingSeconds / 60)}:{String(recordingSeconds % 60).padStart(2, '0')}
                </span>
              )}
            </div>
            {hasRecording && (
              <div className="rec-out">
                {audioBlobUrl && <audio id="recAudio" src={audioBlobUrl} controls playsInline />}
                <div className="field">
                  <input
                    id="vName"
                    type="text"
                    value={voiceName}
                    onChange={(e) => setVoiceName(e.target.value)}
                    placeholder={isArabic ? 'اسمك عشان العروسين يعرفوا مين بعتها' : 'Your name, so the couple knows who sent it'}
                    maxLength={60}
                  />
                </div>
                <div className="rec-actions">
                  <div className="btn btn-ghost" role="button" tabIndex={0} id="recAgain" onClick={resetRecording}>
                    <span>{isArabic ? 'سجّل تاني' : 'Record again'}</span>
                  </div>
                  <div className="btn btn-sage" role="button" tabIndex={0} id="recSend" onClick={sendVoiceWish}>
                    <span>{isArabic ? 'ابعت' : 'Send'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* كارت صور الضيوف */}
        <div className="ex-card reveal d3" id="photosCard" data-section="guestPhotos">
          <div className="ex-head">
            <span className="ex-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <rect x="3" y="5" width="18" height="15" rx="3" />
                <circle cx="12" cy="12.5" r="3.5" />
                <path d="M8 5l1.5-2h5L16 5" />
              </svg>
            </span>
            <div>
              <h4>{isArabic ? 'شاركونا صوركم' : 'Share your photos'}</h4>
              <p>{isArabic ? 'ارفعوا اللحظات اللي صوّرتوها يوم الفرح' : 'Upload the moments you capture on the day'}</p>
            </div>
          </div>

          <div className="field">
            <input
              id="pName"
              type="text"
              value={photoName}
              onChange={(e) => setPhotoName(e.target.value)}
              placeholder={isArabic ? 'اسمك' : 'Your name'}
              maxLength={60}
            />
          </div>

          <div
            className="drop"
            id="drop"
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 16V4M7 9l5-5 5 5" />
              <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
            </svg>
            <span className="d-t">{isArabic ? 'اختار الصور' : 'Choose photos'}</span>
            <span className="d-h">{isArabic ? 'JPG · PNG — براحتك في العدد' : 'JPG · PNG — as many as you like'}</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            id="photoIn"
            accept="image/*"
            multiple
            hidden
            onChange={handlePhotoSelect}
          />

          {isPhotoUploading && (
            <div className="prog" id="pProg">
              <span style={{ width: `${photoProgress}%` }} />
            </div>
          )}

          {photoMessage && (
            <div className="p-msg" id="pMsg" aria-live="polite">
              {photoMessage}
            </div>
          )}

          <div className="p-note">
            {isArabic
              ? 'صوركم بتوصل للعروسين بس — محدش غيرهم يقدر يشوفها.'
              : 'Your photos go privately to the couple — only they can see them.'}
          </div>
        </div>
      </section>

      {/* ============ الختام ============ */}
      <section className="closing" data-section="closing">
        <img className="plate reveal" src="/templates/sage-garden/c-rings-plate.webp" alt="Wedding rings on plate" />
        <div className="h-script reveal d1">
          {isArabic ? 'مستنيينكم تحتفلوا معانا' : 'We can’t wait to celebrate with you'}
        </div>
        <div className="c-names reveal d2">
          <span className="nm fit1">{isArabic ? 'يوسف' : 'Yusuf'}</span>
          <span className="amp">{isArabic ? 'و' : '&'}</span>
          <span className="nm fit1">{isArabic ? 'أميرة' : 'Amira'}</span>
        </div>
        <div className="foot reveal d3">
          <span>{isArabic ? '15 يناير 2027' : '15 January 2027'}</span>
        </div>
      </section>

      {/* Floating Audio Play / Pause Button */}
      {isCoverGone && (
        <div
          className={`fab on ${isPlaying ? 'playing' : ''}`}
          id="audioBtn"
          role="button"
          tabIndex={0}
          aria-label="music"
          onClick={toggleAudio}
        >
          <span className="bars">
            <i /><i /><i />
          </span>
        </div>
      )}

      {/* Toast Feedback Popup */}
      <div className={`toast ${isToastOn ? 'on' : ''}`} id="toast">
        {toastMsg}
      </div>
    </div>
  );
}
