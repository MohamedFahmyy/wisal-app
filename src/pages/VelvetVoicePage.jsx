import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { saveGuestResponse } from '../utils/guestStorage';
import { submitRsvp } from '../utils/api';
import '../styles/velvet-voice.css';

export default function VelvetVoicePage() {
  const [searchParams] = useSearchParams();
  const guestParam = searchParams.get('to') || searchParams.get('name') || '';

  // Opening & Envelope State
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [particles, setParticles] = useState([]);

  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Active section index (0 to 4)
  // 0: Hero, 1: Verse, 2: Family/Story, 3: Location, 4: RSVP & Voice
  const [activeSection, setActiveSection] = useState(0);
  const totalSections = 5;
  const touchStartY = useRef(0);
  const isNavigating = useRef(false);

  // RSVP Form State
  const [guestName, setGuestName] = useState(guestParam);
  const [attending, setAttending] = useState(null); // 'yes' or 'no'
  const [message, setMessage] = useState('');
  const [rsvpError, setRsvpError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRsvpSent, setIsRsvpSent] = useState(false);

  // Voice Note State
  const [voiceState, setVoiceState] = useState('idle'); // 'idle', 'recording', 'review'
  const [voiceName, setVoiceName] = useState(guestParam);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordIntervalRef = useRef(null);

  // Toast Notification
  const [toastMsg, setToastMsg] = useState('');
  const [toastOn, setToastOn] = useState(false);
  const toastTimeoutRef = useRef(null);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setToastOn(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToastOn(false), 3000);
  }, []);

  // Check saved RSVP on mount
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

  // Audio Toggle
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

  // Open Invitation Sequence
  const openInvitation = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);

    // Play Audio
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }

    // Spawn 24 floating petals and gold particles if motion allowed
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      const parts = Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: `${(Math.random() * 90 + 5).toFixed(1)}%`,
        top: `${(Math.random() * 40 + 20).toFixed(1)}%`,
        dx: `${(Math.random() * 140 - 70).toFixed(0)}px`,
        dy: `${(Math.random() * 320 + 120).toFixed(0)}px`,
        rot: `${(Math.random() * 540).toFixed(0)}deg`,
        size: `${(Math.random() * 8 + 6).toFixed(0)}px`,
        color: i % 2 === 0 ? '#b08a4e' : '#f7dc9f',
        duration: `${(Math.random() * 2 + 1.8).toFixed(1)}s`,
        delay: `${(Math.random() * 0.4).toFixed(2)}s`
      }));
      setParticles(parts);
    }

    // Transition to opened state after flap rotate finishes
    setTimeout(() => {
      setIsOpen(true);
      setIsOpening(false);
    }, 950);
  };

  // Section Navigation Handlers
  const goToSection = useCallback((index) => {
    if (isNavigating.current || index === activeSection || index < 0 || index >= totalSections) return;
    isNavigating.current = true;
    setActiveSection(index);
    setTimeout(() => {
      isNavigating.current = false;
    }, 500);
  }, [activeSection, totalSections]);

  const nextSection = useCallback(() => {
    if (activeSection < totalSections - 1) {
      goToSection(activeSection + 1);
    }
  }, [activeSection, totalSections, goToSection]);

  const prevSection = useCallback(() => {
    if (activeSection > 0) {
      goToSection(activeSection - 1);
    }
  }, [activeSection, goToSection]);

  // Touch Swipe Handlers (Vertical)
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    if (!isOpen) {
      if (Math.abs(diffY) > 25) openInvitation();
      return;
    }
    if (Math.abs(diffY) > 35) {
      if (diffY > 0) nextSection();
      else prevSection();
    }
  };

  // Mouse Wheel Handler
  const handleWheel = (e) => {
    if (!isOpen) {
      if (Math.abs(e.deltaY) > 15) openInvitation();
      return;
    }
    if (Math.abs(e.deltaY) > 20) {
      if (e.deltaY > 0) nextSection();
      else prevSection();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') openInvitation();
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        nextSection();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        prevSection();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, nextSection, prevSection]);

  // Share link handler
  const handleShare = async () => {
    const shareData = {
      title: 'دعوة زفاف يوسف وأميرة',
      text: 'يسعدنا مشاركتكم فرحتنا بحفل زفافنا 🤍',
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (_) {}
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('تم نسخ رابط الدعوة بنجاح 🤍');
      } catch (_) {
        showToast('رابط الدعوة: ' + window.location.href);
      }
    }
  };

  // RSVP Form Submit
  const handleRsvpSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!guestName.trim()) {
      setRsvpError('يرجى كتابة الاسم الكريم');
      return;
    }
    if (!attending) {
      setRsvpError('يرجى تحديد إمكانية الحضور');
      return;
    }

    setIsSubmitting(true);
    setRsvpError('');

    try {
      // 1. Submit to backend API
      await submitRsvp({
        invitationId: 'inv_velvet_voice',
        name: guestName.trim(),
        attending,
        guests: 1,
        message: message.trim()
      });

      // 2. Silent local storage backup
      const responseData = {
        name: guestName.trim(),
        attending: attending === 'yes',
        message: message.trim(),
        submittedAt: new Date().toISOString()
      };

      try {
        saveGuestResponse('inv_velvet_voice', responseData);
        localStorage.setItem('mithaq_guest_name', guestName.trim());
        localStorage.setItem('mithaq_rsvp_inv_velvet_voice', JSON.stringify(responseData));
      } catch (localErr) {}

      setIsRsvpSent(true);
      showToast('تم تأكيد حضورك بنجاح 🤍');
    } catch (err) {
      setRsvpError(err.message || 'حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Voice Recording Handlers
  const startVoiceRecording = async () => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      showToast('التسجيل الصوتي غير مدعوم في هذا المتصفح');
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
    } catch (_) {
      showToast('يرجى السماح باستخدام المايكروفون');
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
  };

  const sendVoiceWish = () => {
    if (!voiceName.trim()) {
      showToast('يرجى كتابة اسمك أولاً ليعرف العروسان صاحب التهنئة');
      return;
    }
    showToast('تم إرسال تهنئتك الصوتية بنجاح للعروسين 🤍');
    resetVoiceRecording();
  };

  return (
    <div
      className="velvet-voice-wrapper"
      dir="rtl"
      lang="ar"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Background Audio */}
      <audio
        ref={audioRef}
        id="velvet-voice-audio"
        src="/audio/velvet-voice.mp3"
        loop
        preload="none"
        playsInline
      />

      {/* Desktop side blur backdrop */}
      <div className="vv-backdrop" aria-hidden="true" />

      {/* Main Centered Stage (max-width: 405px) */}
      <main className="vv-stage" id="stage">
        {/* Subtle decorative texture */}
        <div className="vv-texture" aria-hidden="true" />

        {/* Fixed Header Chrome: Share (Left) & Music (Right) */}
        <header className="vv-header" aria-label="أدوات الدعوة">
          <button
            type="button"
            className="vv-share-btn"
            onClick={handleShare}
            aria-label="مشاركة الدعوة"
            title="مشاركة الدعوة"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>

          <button
            type="button"
            className={`vv-music-btn ${isPlaying ? 'playing' : ''}`}
            onClick={toggleAudio}
            aria-label={isPlaying ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}
            title={isPlaying ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}
          >
            <div className="eq-bars">
              <i /><i /><i />
            </div>
          </button>
        </header>

        {/* Toast Alert */}
        <div className={`vv-toast ${toastOn ? 'on' : ''}`} role="status">
          <span>{toastMsg}</span>
        </div>

        {/* Sections Viewport inside the Card */}
        <div className="vv-sections-viewport">
          <div className="vv-card-container">
            {/* Section 0: الهيرو */}
            <section
              className={`vv-sec ${activeSection === 0 ? 'active' : ''}`}
              id="vv-hero"
              aria-label="العروسان وموعد الزفاف"
            >
              <div className="vv-hero-names">
                <h1 className="vv-name">يوسف</h1>
                <span className="vv-amp">و</span>
                <h1 className="vv-name">أميرة</h1>
              </div>

              <div className="vv-orn">
                <span className="vv-orn-dot" />
              </div>

              <div className="vv-datetime-row">
                <div className="vv-dt-col">
                  <span>الجمعة</span>
                </div>
                <div className="vv-dt-col center">
                  <span className="vv-dt-daynum">١٥</span>
                  <span className="vv-dt-sub">يناير ٢٠٢٧</span>
                </div>
                <div className="vv-dt-col">
                  <span>٦:٠٠ مساءً</span>
                </div>
              </div>
            </section>

            {/* Section 1: الآية الكريمة */}
            <section
              className={`vv-sec vv-verse-sec ${activeSection === 1 ? 'active' : ''}`}
              id="vv-verse"
              aria-label="الآية الكريمة"
            >
              <p className="vv-bsm">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>

              <div className="vv-orn">
                <span className="vv-orn-dot" />
              </div>

              <p className="vv-ayah">
                وَمِنْ ءَايَٰتِهِۦٓ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَٰجًا لِّتَسْكُنُوٓا۟ إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِى ذَٰلِكَ لَءَايَٰتٍ لِّقَوْمٍ يَتَفَكَّرُونَ
                <span className="vv-ayah-end"> ۝٢١</span>
              </p>

              <p className="vv-sura">سورة الروم</p>
            </section>

            {/* Section 2: الأهل والحكاية */}
            <section
              className={`vv-sec ${activeSection === 2 ? 'active' : ''}`}
              id="vv-family"
              aria-label="الحكاية ومباركة الأهل"
            >
              <h2 className="vv-sec-title">بداية حكايتنا</h2>

              <p className="vv-story-para">
                هذه ليلتنا، تكتمل بها فرحتنا. سعادتنا لن تكتمل إلا بوجودكم معنا — لنحتفل سوياً ونشهد بداية حياة جديدة يملؤها الحب والوفاء بدعوات أحبتنا.
              </p>

              <p className="vv-fams-sub">بمباركة أهلهم الكرام</p>

              <div className="vv-fams-line">
                <span>عائلة إبراهيم</span>
                <span className="dot">•</span>
                <span>عائلة خيري</span>
              </div>

              <div className="vv-fathers-cards">
                <div className="vv-father-card">
                  <small>والد العريس</small>
                  <b>أ. إبراهيم</b>
                </div>
                <div className="vv-father-card">
                  <small>والد العروس</small>
                  <b>أ. خيري</b>
                </div>
              </div>

              <p className="vv-closing-line">ودامت دياركم عامرة بالأفراح والمسرات 🤍</p>
            </section>

            {/* Section 3: المكان */}
            <section
              className={`vv-sec ${activeSection === 3 ? 'active' : ''}`}
              id="vv-location"
              aria-label="مكان وقاعة الحفل"
            >
              <span className="vv-eyebrow">بانتظاركم في</span>
              <h2 className="vv-sec-title">مكان الحفل</h2>

              <div className="vv-map-box">
                <iframe
                  title="موقع قاعة روز جاردن على الخريطة"
                  src="https://maps.google.com/maps?q=Rose+Garden+Hall,+New+Cairo,+Egypt&t=&z=15&ie=UTF8&iwloc=B&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <h3 className="vv-venue-name">قاعة روز جاردن الملكية</h3>
              <p className="vv-venue-addr">التجمع الخامس، القاهرة الجديدة، مصر</p>

              <a
                className="vv-btn-pill"
                href="https://maps.google.com/?q=Rose+Garden+Hall,+New+Cairo,+Egypt"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21s-7-6.3-7-11.5A7 7 0 0 1 19 9.5C19 14.7 12 21 12 21z" />
                  <circle cx="12" cy="9.5" r="2.5" />
                </svg>
                <span>افتح الموقع على الخريطة</span>
              </a>
            </section>

            {/* Section 4: RSVP + الفويس (على نفس الصفحة) */}
            <section
              className={`vv-sec ${activeSection === 4 ? 'active' : ''}`}
              id="vv-rsvp"
              aria-label="تأكيد الحضور والتهنئة الصوتية"
            >
              {!isRsvpSent ? (
                <div className="vv-rsvp-box">
                  <h2 className="vv-sec-title">تأكيد الحضور</h2>
                  <p className="vv-eyebrow">يسعدنا تأكيد حضوركم لمشاركتنا ليلة العمر</p>

                  <form onSubmit={handleRsvpSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div className="vv-field">
                      <input
                        type="text"
                        name="guestName"
                        value={guestName}
                        onChange={(e) => {
                          setGuestName(e.target.value);
                          setRsvpError('');
                        }}
                        placeholder="الاسم الكريم"
                        maxLength={60}
                        required
                      />
                    </div>

                    <div className="vv-attendance-pills" role="radiogroup" aria-label="حالة الحضور">
                      <button
                        type="button"
                        role="radio"
                        aria-checked={attending === 'yes'}
                        className={`vv-attend-btn ${attending === 'yes' ? 'selected' : ''}`}
                        onClick={() => {
                          setAttending('yes');
                          setRsvpError('');
                        }}
                      >
                        <span>سأحضر بإذن الله</span>
                      </button>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={attending === 'no'}
                        className={`vv-attend-btn ${attending === 'no' ? 'selected' : ''}`}
                        onClick={() => {
                          setAttending('no');
                          setRsvpError('');
                        }}
                      >
                        <span>أعتذر عن الحضور</span>
                      </button>
                    </div>

                    <div className="vv-field">
                      <textarea
                        name="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="اكتب تهنئتك للعروسين (اختياري)"
                        maxLength={300}
                        rows={2}
                      />
                    </div>

                    {rsvpError && <p className="vv-rsvp-err">{rsvpError}</p>}

                    <button
                      type="submit"
                      className="vv-submit-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'جارِ الإرسال...' : 'إرسال'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="vv-rsvp-success">
                  <svg className="ok-icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <h3 className="vv-sec-title">تم استلام ردكم بنجاح</h3>
                  <p className="vv-eyebrow">
                    {attending === 'yes'
                      ? `شكرًا يا ${guestName} — مستنيينك تنوّر ليلتنا 🤍`
                      : `شكرًا يا ${guestName} — كنا نتمنى وجودك وهتكون في قلوبنا يومها 🤍`}
                  </p>
                  <button
                    type="button"
                    className="vv-btn-edit"
                    onClick={() => setIsRsvpSent(false)}
                  >
                    تعديل الرد
                  </button>
                </div>
              )}

              {/* قسم الفويس في أسفل نفس صفحة RSVP */}
              <div className="vv-voice-subcard">
                <span className="vv-voice-title">سجّل فويس للتهنئة</span>
                <span className="vv-voice-sub">اضغط وتحدّث</span>

                {voiceState !== 'review' ? (
                  <>
                    <button
                      type="button"
                      className={`vv-vmic-btn ${voiceState === 'recording' ? 'recording' : ''}`}
                      onClick={voiceState === 'recording' ? stopVoiceRecording : startVoiceRecording}
                      aria-label={voiceState === 'recording' ? 'إيقاف التسجيل' : 'بدء تسجيل صوتي'}
                    >
                      {voiceState === 'recording' ? (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <rect x="6" y="6" width="12" height="12" rx="2" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                          <line x1="12" y1="19" x2="12" y2="22" />
                        </svg>
                      )}
                    </button>
                    {voiceState === 'recording' && (
                      <span className="vv-voice-timer">
                        {Math.floor(recordSeconds / 60)}:{String(recordSeconds % 60).padStart(2, '0')}
                      </span>
                    )}
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: '100%' }}>
                    {audioUrl && <audio src={audioUrl} controls style={{ width: '100%', maxWidth: 240, height: 36 }} />}
                    <input
                      type="text"
                      value={voiceName}
                      onChange={(e) => setVoiceName(e.target.value)}
                      placeholder="اكتب اسمك للعروسين"
                      style={{
                        width: '100%',
                        maxWidth: 240,
                        height: 36,
                        padding: '0 12px',
                        borderRadius: 999,
                        border: '1px solid #b08a4e',
                        background: '#fffdf9',
                        color: '#5b2229',
                        fontFamily: 'Amiri',
                        fontSize: 15,
                        textAlign: 'center'
                      }}
                    />
                    <div className="vv-voice-actions">
                      <button type="button" className="vv-vact-btn" onClick={resetVoiceRecording}>
                        إلغاء
                      </button>
                      <button type="button" className="vv-vact-btn send" onClick={sendVoiceWish}>
                        إرسال التهنئة
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Lower third envelope frame across all sections */}
        <div className="vv-bottom-frame" aria-hidden="true">
          <svg className="vv-bottom-frame-svg" viewBox="0 0 405 90" preserveAspectRatio="none">
            <path d="M0,45 L202.5,0 L405,45 L405,90 L0,90 Z" fill="#3a0d14" />
            <path d="M0,45 L202.5,0 L405,45" fill="none" stroke="rgba(176,138,78,0.35)" strokeWidth="1.2" />
          </svg>
        </div>

        {/* Bottom Navigation Pill ("مرّر للأسفل ⌄") */}
        {isOpen && (
          <button
            type="button"
            className="vv-scroll-pill"
            onClick={activeSection < totalSections - 1 ? nextSection : () => goToSection(0)}
            aria-label={activeSection < totalSections - 1 ? 'الانتقال للقسم التالي' : 'العودة للبداية'}
          >
            <span>{activeSection < totalSections - 1 ? 'مرّر للأسفل' : 'العودة للبداية'}</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: activeSection < totalSections - 1 ? 'none' : 'rotate(180deg)'
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        )}

        {/* Opening Screen (Envelope & Gold Wax Seal) */}
        {!isOpen && (
          <div
            className={`vv-intro ${isOpening ? 'opening' : ''}`}
            onClick={openInvitation}
            role="button"
            tabIndex={0}
            aria-label="اضغط على الختم لفتح الدعوة"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openInvitation();
              }
            }}
          >
            <div className="vv-intro-env-wrap">
              {/* Envelope Body */}
              <div className="vv-env-body">
                {/* Flap that rotates open */}
                <div className="vv-env-flap">
                  <svg viewBox="0 0 350 140" preserveAspectRatio="none">
                    <polygon points="0,0 350,0 175,140" fill="#5b1d26" />
                    <polygon points="0,0 350,0 175,140" fill="none" stroke="rgba(176, 138, 78, 0.4)" strokeWidth="1.2" />
                  </svg>
                </div>

                {/* Pocket Front */}
                <div className="vv-env-pocket">
                  <svg viewBox="0 0 350 170" preserveAspectRatio="none">
                    <polygon points="0,170 350,170 350,60 175,140 0,60" fill="#4a151e" />
                    <polygon points="0,60 175,140 350,60" fill="none" stroke="rgba(176, 138, 78, 0.3)" strokeWidth="1" />
                  </svg>
                </div>

                {/* Gold Wax Seal */}
                <div className="vv-seal-btn" aria-hidden="true">
                  <svg className="vv-seal-heart" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
              </div>

              {/* Tap the seal capsule */}
              <div className="vv-tap-pill">
                <i />
                <span>اضغط على الختم</span>
                <i />
              </div>
            </div>

            {/* Falling Particles */}
            {particles.map((p) => (
              <span
                key={p.id}
                className="vv-particle"
                style={{
                  left: p.left,
                  top: p.top,
                  width: p.size,
                  height: p.size,
                  background: p.color,
                  '--dx': p.dx,
                  '--dy': p.dy,
                  '--rot': p.rot,
                  animationDuration: p.duration,
                  animationDelay: p.delay
                }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
