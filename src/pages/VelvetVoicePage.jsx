import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { saveGuestResponse } from '../utils/guestStorage';
import '../styles/velvet-voice.css';

export default function VelvetVoicePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const guestParam = searchParams.get('to') || searchParams.get('name') || '';
  const initialLang = searchParams.get('lang') === 'en' ? 'en' : 'ar';

  const [lang, setLang] = useState(initialLang);
  const isArabic = lang === 'ar';

  // Opening & Envelope State
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const flapRef = useRef(null);
  const dustRef = useRef(null);

  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Active page index (0 to 5)
  // 0: names, 1: verse, 2: countdown, 3: story, 4: location, 5: rsvp
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 6;
  const touchStartY = useRef(0);
  const isNavigating = useRef(false);

  // Live Countdown (Friday, 15 January 2027 at 18:00 Cairo time UTC+2)
  const targetDate = useRef(new Date('2027-01-15T18:00:00+02:00').getTime());
  const [timeLeft, setTimeLeft] = useState({ d: '00', h: '00', m: '00', s: '00' });

  // RSVP Form State
  const [guestName, setGuestName] = useState(guestParam);
  const [attending, setAttending] = useState(null); // 'yes' or 'no'
  const [message, setMessage] = useState('');
  const [rsvpError, setRsvpError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRsvpSent, setIsRsvpSent] = useState(false);

  // Velvet Voice Note State (#vx)
  const [voiceState, setVoiceState] = useState('idle'); // 'idle', 'recording', 'review', 'sent'
  const [voiceName, setVoiceName] = useState(guestParam);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [toastOn, setToastOn] = useState(false);
  const toastTimeoutRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordIntervalRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setToastOn(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToastOn(false), 3200);
  }, []);

  const toggleLanguage = () => {
    const newLang = isArabic ? 'en' : 'ar';
    setLang(newLang);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('lang', newLang);
    setSearchParams(newParams, { replace: true });
  };

  // Convert digits to Arabic if Arabic language
  const toArDigits = (val) => {
    if (!isArabic) return String(val);
    return String(val).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
  };

  // Live Countdown effect
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

  // Check saved RSVP
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mithaq_rsvp_inv_velvet_voice');
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

  // Initialize 3D Flap Strips & Dust particles on mount
  useEffect(() => {
    if (!flapRef.current || !dustRef.current) return;

    // Dust particles
    dustRef.current.innerHTML = '';
    for (let i = 0; i < 18; i++) {
      const d = document.createElement('i');
      d.style.cssText =
        `left:${(Math.random() * 100).toFixed(1)}%;--s:${(3 + Math.random() * 5).toFixed(1)}px;--t:${(11 + Math.random() * 9).toFixed(1)}s;` +
        `--dl:${(-Math.random() * 18).toFixed(1)}s;--x:${(Math.random() * 120 - 60).toFixed(0)}px;--o:${(0.35 + Math.random() * 0.5).toFixed(2)}`;
      dustRef.current.appendChild(d);
    }

    // 5-segment 3D Flap
    const N = 5;
    const FH = 245.48;
    const SH = FH / N;
    flapRef.current.innerHTML = '';
    let link = flapRef.current;

    for (let i = 0; i < N; i++) {
      const st = document.createElement('div');
      st.className = 'strip';
      st.style.top = (i ? SH : 0) + 'px';
      st.style.height = SH + 2 + 'px';
      const pos = `0 ${-i * SH}px`;
      st.innerHTML =
        `<b style="background-image:url(/templates/velvet-voice/env-flap.webp);background-position:${pos}"><s></s></b>` +
        `<b class="bk" style="background-image:url(/templates/velvet-voice/env-flap-back.webp);background-position:${pos}"><s></s></b>`;
      link.appendChild(st);
      link = st;
    }
  }, []);

  // Open Invitation
  const openInvitation = () => {
    if (isOpen || isOpening) return;
    setIsOpening(true);

    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }

    // Trigger flap 3D animation
    const flap = flapRef.current;
    if (flap) {
      const strips = flap.querySelectorAll('.strip');
      strips.forEach((s, idx) => {
        s.style.transition = `transform 0.85s cubic-bezier(.22,.61,.36,1) ${idx * 0.08}s`;
        s.style.transform = 'rotateX(180deg)';
      });
    }

    setTimeout(() => {
      setIsOpen(true);
      setIsOpening(false);
    }, 1200);
  };

  // Page Navigation Handlers
  const goToPage = useCallback((index) => {
    if (isNavigating.current || index === currentPage || index < 0 || index >= totalPages) return;
    isNavigating.current = true;
    setCurrentPage(index);
    setTimeout(() => {
      isNavigating.current = false;
    }, 600);
  }, [currentPage, totalPages]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  // Handle Touch Swipe & Wheel
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (!isOpen) return;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diffY) > 45) {
      if (diffY > 0) nextPage();
      else prevPage();
    }
  };

  const handleWheel = (e) => {
    if (!isOpen) return;
    if (Math.abs(e.deltaY) > 35) {
      if (e.deltaY > 0) nextPage();
      else prevPage();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) {
        if (e.key === 'Enter' || e.key === ' ') {
          openInvitation();
        }
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') {
        nextPage();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        prevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, nextPage, prevPage]);

  // Audio Toggle
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  // RSVP Form Submit
  const handleRsvpSubmit = (e) => {
    if (e) e.preventDefault();
    if (!guestName.trim()) {
      setRsvpError(isArabic ? 'يرجى كتابة الاسم الكريم' : 'Please enter your name');
      return;
    }
    if (!attending) {
      setRsvpError(isArabic ? 'يرجى تحديد إمكانية الحضور' : 'Please choose attending or declining');
      return;
    }

    setIsSubmitting(true);
    setRsvpError('');

    try {
      const responseData = {
        name: guestName.trim(),
        attending: attending === 'yes',
        message: message.trim(),
        submittedAt: new Date().toISOString()
      };

      saveGuestResponse('inv_velvet_voice', responseData);
      localStorage.setItem('mithaq_guest_name', guestName.trim());
      localStorage.setItem('mithaq_rsvp_inv_velvet_voice', JSON.stringify(responseData));

      setIsRsvpSent(true);
      showToast(isArabic ? 'تم تأكيد حضورك بنجاح 🤍' : 'Your RSVP has been saved 🤍');
    } catch (err) {
      setRsvpError(isArabic ? 'حدث خطأ أثناء الإرسال، حاول مرة أخرى' : 'Failed to submit, please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Voice Recording Visualizer & Recorder Logic
  const startVoiceRecording = async () => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      showToast(isArabic ? 'التسجيل الصوتي غير مدعوم في هذا المتصفح' : 'Voice recording not supported in this browser');
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
        setAudioUrl(url);
        setVoiceState('review');
        clearInterval(recordIntervalRef.current);
        cancelAnimationFrame(animFrameRef.current);
      };

      mr.start();
      setVoiceState('recording');
      setRecordSeconds(0);
      recordIntervalRef.current = setInterval(() => {
        setRecordSeconds((s) => {
          if (s >= 60) {
            stopVoiceRecording();
            return 60;
          }
          return s + 1;
        });
      }, 1000);

      // Waveform draw
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const drawWave = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#b49a6a';
          const bars = 16;
          for (let i = 0; i < bars; i++) {
            const h = 4 + Math.random() * 24;
            ctx.fillRect(i * 12 + 6, (canvas.height - h) / 2, 6, h);
          }
          animFrameRef.current = requestAnimationFrame(drawWave);
        };
        drawWave();
      }
    } catch (_) {
      showToast(isArabic ? 'يرجى السماح باستخدام المايكروفون' : 'Please allow microphone access');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const resetVoiceRecording = () => {
    setVoiceState('idle');
    setAudioUrl(null);
    setRecordSeconds(0);
    clearInterval(recordIntervalRef.current);
    cancelAnimationFrame(animFrameRef.current);
  };

  const sendVoiceNote = () => {
    if (!voiceName.trim()) {
      showToast(isArabic ? 'يرجى كتابة اسمك أولاً' : 'Please write your name first');
      return;
    }
    showToast(isArabic ? 'تم إرسال تهنئتك الصوتية بنجاح 🤍' : 'Voice wish sent successfully 🤍');
    resetVoiceRecording();
  };

  // Google Calendar URL
  const calTitle = isArabic ? 'حفل زفاف يوسف وأميرة' : 'Yusuf & Amira Wedding';
  const calDesc = isArabic ? 'حفل زفاف يوسف وأميرة في قاعة روز جاردن' : 'Wedding celebration of Yusuf & Amira at Rose Garden Hall';
  const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calTitle)}&dates=20270115T160000Z/20270115T220000Z&details=${encodeURIComponent(calDesc)}&location=${encodeURIComponent('Rose Garden Hall, New Cairo, Egypt')}`;

  return (
    <div
      className="velvet-voice-wrapper"
      dir={isArabic ? 'rtl' : 'ltr'}
      lang={lang}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Background Audio */}
      <audio
        ref={audioRef}
        id="invitation-audio"
        src="/audio/velvet-voice.mp3"
        loop
        preload="auto"
        playsInline
      />

      {/* Floating Topbar */}
      <header className="vv-topbar">
        <Link to="/" className="vv-brand" aria-label="Wisal Home">
          <span>وصال</span>
        </Link>
        <button
          type="button"
          onClick={toggleLanguage}
          className="vv-lang-btn"
          aria-label="Toggle Language"
        >
          {isArabic ? 'English' : 'عربي'}
        </button>
      </header>

      {/* Backdrop velvet blur */}
      <div className="backdrop"></div>

      {/* Stage Container */}
      <main className="stage" id="stage">
        {/* Main Card Viewport */}
        <div className="cv" id="cv">
          <div className="card" id="card">
            {/* 1 · الأسماء والتاريخ (Page 0) */}
            <section
              className={`sec ${currentPage === 0 ? 'active in' : ''} ${currentPage > 0 ? 'leave-up' : ''}`}
              id="vv-names"
              data-wda-page="names"
            >
              <div className="pg p-names">
                <div className="pgi">
                  <h1 className="nm rv l" style={{ '--d': 0.6 }}>
                    {isArabic ? 'يوسف' : 'Yusuf'}
                  </h1>
                  <span className="amp rv f" style={{ '--d': 1.8 }}>
                    {isArabic ? 'و' : '&'}
                  </span>
                  <h1 className="nm rv r" style={{ '--d': 1.0 }}>
                    {isArabic ? 'أميرة' : 'Amira'}
                  </h1>
                  <i className="orn rv dv" style={{ '--d': 2.8 }}><b></b></i>
                  <div className="date rv" style={{ '--d': 3.4 }}>
                    <span className="dw">
                      {isArabic ? 'الجمعة' : 'Friday'}
                    </span>
                    <span className="dd">
                      <b>{toArDigits('15')}</b>
                      <small>{isArabic ? 'يناير ٢٠٢٧' : 'January 2027'}</small>
                    </span>
                    <span className="dt">
                      {isArabic ? '٦:٠٠ مساءً' : '6:00 PM'}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* 2 · الآية الكريمة (Page 1) */}
            <section
              className={`sec ${currentPage === 1 ? 'active in' : ''} ${currentPage > 1 ? 'leave-up' : ''}`}
              id="vv-verse"
              data-wda-page="verse"
            >
              <div className="pg p-verse">
                <div className="pgi">
                  <p className="bsm rv">
                    {isArabic ? 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ' : 'In the Name of Allah, Most Gracious, Most Merciful'}
                  </p>
                  <i className="orn rv dv" style={{ '--d': 1.0 }}><b></b></i>
                  <p className="ayah rv" style={{ '--d': 1.8 }}>
                    {isArabic ? (
                      <>
                        <span>وَمِنْ ءَايَٰتِهِۦٓ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَٰجًا لِّتَسْكُنُوٓا۟ إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِى ذَٰلِكَ لَءَايَٰتٍ لِّقَوْمٍ يَتَفَكَّرُونَ</span>
                        {' '}<span className="ae">۝٢١</span>
                      </>
                    ) : (
                      <span>“And among His signs is that He created for you spouses from among yourselves, that you may find tranquility in them; and He placed between you affection and mercy.”</span>
                    )}
                  </p>
                  <i className="orn rv dv" style={{ '--d': 3.0 }}><b></b></i>
                  <p className="sura rv" style={{ '--d': 3.5 }}>
                    {isArabic ? 'سورة الروم' : 'Surah Ar-Rum · 30:21'}
                  </p>
                </div>
              </div>
            </section>

            {/* 3 · العد التنازلي (Page 2) */}
            <section
              className={`sec ${currentPage === 2 ? 'active in' : ''} ${currentPage > 2 ? 'leave-up' : ''}`}
              id="vv-countdown"
              data-wda-page="countdown"
            >
              <div className="pg p-cd">
                <div className="pgi">
                  <p className="kick rv">
                    {isArabic ? 'يتبقّى على ليلة العمر' : 'Counting down to the night of a lifetime'}
                  </p>
                  <h2 className="ttl rv" style={{ '--d': 0.8 }}>
                    {isArabic ? 'على موعدٍ مع الفرح' : 'Save the Date'}
                  </h2>
                  <i className="orn rv dv" style={{ '--d': 1.5 }}><b></b></i>
                  <div className="cd rv z" style={{ '--d': 2.1 }} aria-label="العد التنازلي">
                    <div className="cu" data-unit="d">
                      <div className="fr"><div className="num">{toArDigits(timeLeft.d)}</div></div>
                      <div className="lab">{isArabic ? 'يوم' : 'Days'}</div>
                    </div>
                    <div className="cu" data-unit="h">
                      <div className="fr"><div className="num">{toArDigits(timeLeft.h)}</div></div>
                      <div className="lab">{isArabic ? 'ساعة' : 'Hours'}</div>
                    </div>
                    <div className="cu" data-unit="m">
                      <div className="fr"><div className="num">{toArDigits(timeLeft.m)}</div></div>
                      <div className="lab">{isArabic ? 'دقيقة' : 'Minutes'}</div>
                    </div>
                    <div className="cu" data-unit="s">
                      <div className="fr"><div className="num">{toArDigits(timeLeft.s)}</div></div>
                      <div className="lab">{isArabic ? 'ثانية' : 'Seconds'}</div>
                    </div>
                  </div>
                  <div className="cal rv" style={{ '--d': 2.7 }}>
                    <a className="cal-btn" href={calUrl} target="_blank" rel="noopener noreferrer">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="3" y="5" width="18" height="16" rx="2" />
                        <path d="M8 3v4M16 3v4M3 10h18" />
                      </svg>
                      <span>{isArabic ? 'أضف للتقويم' : 'Add to calendar'}</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* 4 · الحكاية والأهل (Page 3) */}
            <section
              className={`sec ${currentPage === 3 ? 'active in' : ''} ${currentPage > 3 ? 'leave-up' : ''}`}
              id="vv-story"
              data-wda-page="story"
            >
              <div className="pg p-story">
                <div className="pgi">
                  <h2 className="ttl rv">
                    {isArabic ? 'بداية حكايتنا' : 'Our Story Begins'}
                  </h2>
                  <p className="para rv" style={{ '--d': 0.8 }}>
                    {isArabic
                      ? 'هذه ليلتنا، تكتمل بها فرحتنا. سعادتنا لن تكتمل إلا بوجودكم معنا — لنحتفل سوياً ونشهد بداية حياة جديدة يملؤها الحب والوفاء بدعوات أحبتنا.'
                      : 'This is our night, filled with joy and warmth. Our happiness will only be complete with you there — to celebrate together and witness the start of a new life, wrapped in love.'}
                  </p>
                  <i className="orn rv dv" style={{ '--d': 1.6 }}><b></b></i>
                  <div className="fams rv" style={{ '--d': 2.2 }}>
                    <p className="fam-intro">
                      {isArabic ? 'بمباركة الأهل الكرام' : 'With the blessing of their families'}
                    </p>
                    <div className="fam-row">
                      <span className="fn">{isArabic ? 'عائلة إبراهيم' : 'The Ibrahim Family'}</span>
                      <span className="fa">{isArabic ? 'و' : '&'}</span>
                      <span className="fn">{isArabic ? 'عائلة خيري' : 'The Khairy Family'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 5 · مكان الحفل (Page 4) */}
            <section
              className={`sec ${currentPage === 4 ? 'active in' : ''} ${currentPage > 4 ? 'leave-up' : ''}`}
              id="vv-location"
              data-wda-page="location"
            >
              <div className="pg p-loc">
                <div className="pgi">
                  <h2 className="ttl rv">{isArabic ? 'قاعة الاحتفال' : 'The Venue'}</h2>
                  <p className="para hall rv" style={{ '--d': 0.6 }}>
                    {isArabic ? 'قاعة روز جاردن' : 'Rose Garden Hall'}
                  </p>
                  <p className="para city rv" style={{ '--d': 0.9 }}>
                    {isArabic ? 'القاهرة الجديدة، مصر' : 'New Cairo, Egypt'}
                  </p>
                  <div className="map rv z" style={{ '--d': 1.3 }}>
                    <iframe
                      src="https://www.google.com/maps?q=Cairo&hl=en&output=embed"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Wedding venue location"
                    />
                  </div>
                  <div className="acts rv" style={{ '--d': 1.7 }}>
                    <a
                      className="btn loc"
                      href="https://www.google.com/maps/search/?api=1&query=Cairo"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 21s-7-6.3-7-11.5A7 7 0 0 1 19 9.5C19 14.7 12 21 12 21z" />
                        <circle cx="12" cy="9.5" r="2.5" />
                      </svg>
                      <span>{isArabic ? 'الاتجاهات في خرائط جوجل' : 'Get directions in Google Maps'}</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* 6 · تأكيد الحضور (Page 5) */}
            <section
              className={`sec ${currentPage === 5 ? 'active in' : ''}`}
              id="vv-rsvp"
              data-wda-page="rsvp"
            >
              <div className="pg p-rsvp" id="mithaq-rsvp">
                {!isRsvpSent ? (
                  <div className="pgi">
                    <h2 className="ttl rv">{isArabic ? 'تأكيد الحضور' : 'RSVP'}</h2>
                    <p className="para rv" style={{ '--d': 0.6 }}>
                      {isArabic ? 'يسعدنا تأكيد حضوركم لمشاركتنا ليلة العمر.' : 'We would be honored by your presence.'}
                    </p>
                    <form className="rsvp rv" style={{ '--d': 1.2 }} onSubmit={handleRsvpSubmit} noValidate>
                      <label className="fld">
                        <input
                          name="name"
                          type="text"
                          value={guestName}
                          onChange={(e) => {
                            setGuestName(e.target.value);
                            setRsvpError('');
                          }}
                          placeholder={isArabic ? 'الاسم الكريم' : 'Your full name'}
                          maxLength={60}
                          required
                        />
                      </label>
                      <div className="seg" role="radiogroup" aria-label="الحضور">
                        <button
                          type="button"
                          role="radio"
                          aria-checked={attending === 'yes'}
                          className={`choice-btn ${attending === 'yes' ? 'selected' : ''}`}
                          onClick={() => {
                            setAttending('yes');
                            setRsvpError('');
                          }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12.5l4.5 4.5L19 7.5" />
                          </svg>
                          <span>{isArabic ? 'سأحضر بإذن الله' : 'Joyfully accept'}</span>
                        </button>

                        <button
                          type="button"
                          role="radio"
                          aria-checked={attending === 'no'}
                          className={`choice-btn ${attending === 'no' ? 'selected' : ''}`}
                          onClick={() => {
                            setAttending('no');
                            setRsvpError('');
                          }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                            <path d="M7 7l10 10M17 7 7 17" />
                          </svg>
                          <span>{isArabic ? 'أعتذر عن الحضور' : 'Regretfully decline'}</span>
                        </button>
                      </div>

                      <label className="fld wg-field">
                        <textarea
                          id="mrsvp-note"
                          name="message"
                          rows={3}
                          maxLength={200}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder={isArabic ? 'اكتب تهنئتك أو رسالتك للعروسين (اختياري)' : 'A message for the couple (optional)'}
                        />
                      </label>

                      {rsvpError && <p className="err" aria-live="polite">{rsvpError}</p>}

                      <button className="btn submit" type="submit" disabled={isSubmitting}>
                        <span>{isSubmitting ? (isArabic ? 'جارِ الإرسال...' : 'Sending...') : (isArabic ? 'إرسال' : 'Send')}</span>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.6 3.6 3 12l17.6 8.4L20.6 14 8 12l12.6-2z" />
                        </svg>
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="done" aria-live="polite">
                    <svg className="ok" viewBox="0 0 52 52">
                      <circle cx="26" cy="26" r="24" />
                      <path d="M15 27l7.5 7.5L37.5 19" />
                    </svg>
                    <h3 className="ttl sm">{isArabic ? 'تم استلام ردكم بنجاح' : 'Response received'}</h3>
                    <p className="para sm">
                      {attending === 'yes'
                        ? (isArabic ? `شكرًا يا ${guestName} — مستنيينك تنوّر ليلتنا 🤍` : `Thank you, ${guestName} — we cannot wait to see you 🤍`)
                        : (isArabic ? `شكرًا يا ${guestName} — كنت نتمنى وجودك وهتكون في قلوبنا يومها 🤍` : `Thank you, ${guestName} — you will be in our hearts 🤍`)}
                    </p>
                    <button className="btn ghost again" type="button" onClick={() => setIsRsvpSent(false)}>
                      <span>{isArabic ? 'تعديل الرد' : 'Change my reply'}</span>
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Velvet Voice Note Interactive Bar (#vx) */}
        {isOpen && (
          <div className={`vx ${voiceState}`} id="vx">
            <div className="cap">
              <b>{isArabic ? 'سجّل فويس للتهنئة' : 'Record a voice wish'}</b>
              <small><span>{isArabic ? 'اضغط وتحدّث' : 'Tap to speak'}</span></small>
            </div>
            <div className={`vtoast ${toastOn ? 'on' : ''}`} id="vtoast" aria-live="polite">
              <span>{toastMsg}</span>
            </div>
            <div className="vpanel" id="vpanel">
              {voiceState === 'review' && (
                <button className="ic del" id="vdel" type="button" aria-label="حذف" onClick={resetVoiceRecording}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.5 7h15M9.5 7V5h5v2M7 7l.8 12h8.4L17 7" />
                  </svg>
                </button>
              )}

              {voiceState === 'review' && audioUrl && (
                <audio src={audioUrl} controls className="v-audio-preview" />
              )}

              {voiceState === 'recording' && (
                <canvas ref={canvasRef} id="vwave" width={200} height={36}></canvas>
              )}

              {voiceState === 'recording' && (
                <span className="t" id="vtime">
                  {Math.floor(recordSeconds / 60)}:{String(recordSeconds % 60).padStart(2, '0')}
                </span>
              )}

              {voiceState === 'review' && (
                <input
                  className="vname"
                  id="vname"
                  type="text"
                  value={voiceName}
                  onChange={(e) => setVoiceName(e.target.value)}
                  placeholder={isArabic ? 'اكتب اسمك ليعرف العروسان صاحب التهنئة' : 'Your name for the couple'}
                  maxLength={60}
                />
              )}

              {voiceState === 'recording' ? (
                <button className="ic stop" id="vstop" type="button" aria-label="إيقاف" onClick={stopVoiceRecording}>
                  <svg viewBox="0 0 24 24" fill="currentColor"><rect x="7" y="7" width="10" height="10" rx="2" /></svg>
                </button>
              ) : voiceState === 'review' ? (
                <button className="ic send" id="vsend" type="button" aria-label="إرسال" onClick={sendVoiceNote}>
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2z" /></svg>
                </button>
              ) : (
                <button
                  className="vbtn"
                  id="vbtn"
                  type="button"
                  aria-label="تسجيل صوتي"
                  onClick={startVoiceRecording}
                >
                  <span className="rg idle"></span>
                  <svg className="i-mic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="3" width="6" height="11.5" rx="3" />
                    <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Page navigation dots and arrows indicator */}
        {isOpen && (
          <div className="vv-page-dots">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`dot ${currentPage === idx ? 'active' : ''}`}
                onClick={() => goToPage(idx)}
                aria-label={`Go to page ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* ============ غلاف الظرف الافتتاحي (Cover Screen) ============ */}
        {!isOpen && (
          <div
            className={`intro ${isOpening ? 'opening' : ''}`}
            id="coverScreen"
            role="button"
            tabIndex={0}
            aria-label="اضغط على الختم لفتح الدعوة"
            onClick={openInvitation}
          >
            <div className="env">
              <div className="backdrop2"></div>
              <div className="sharp"></div>
              <div className="dust" id="dust" ref={dustRef}></div>
              <div className="grp">
                <div className="lift"></div>
                <div className="inside"></div>
                <div className="clip"><div className="fly"></div></div>
                <div className="front"></div>
                <div className="fshade"></div>
                <div className="flapx" id="flap" ref={flapRef}></div>
                <div className="seal" data-elem-id="vv51">
                  <img src="/templates/velvet-voice/seal.webp" alt="Wax seal" />
                  <i className="hi"></i>
                </div>
              </div>
              <div className="tap">
                <span className="pill">
                  <i></i>
                  <span>{isArabic ? 'اضغط على الختم' : 'Tap the seal'}</span>
                  <i></i>
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Audio Play / Pause Button */}
      {isOpen && (
        <button
          type="button"
          className={`fab on ${isPlaying ? 'playing' : ''}`}
          id="audioBtn"
          aria-label="Audio player"
          onClick={toggleAudio}
        >
          <span className="bars">
            <i /><i /><i />
          </span>
        </button>
      )}
    </div>
  );
}
