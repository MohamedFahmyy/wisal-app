import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { saveGuestResponse } from '../utils/guestStorage';
import { startAutoScroll } from '../utils/autoScroll';
import '../styles/veil.css';

export default function VeilPage() {
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

  // Live Countdown (24 June 2027, 18:45 Cairo time UTC+3)
  const targetDate = useRef(new Date('2027-06-24T18:45:00+03:00').getTime());
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  // Scratch card state
  const scratchCanvasRef = useRef(null);
  const [isScratchDone, setIsScratchDone] = useState(false);
  const [revealedMessage, setRevealedMessage] = useState('');
  const scratchMovesRef = useRef(0);
  const isPointerDownRef = useRef(false);

  // RSVP state
  const [formData, setFormData] = useState({
    guestName: guestParam,
    attending: 'yes',
    guestCount: 2,
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [thanksMsg, setThanksMsg] = useState('');

  // Dynamic Document Title
  useEffect(() => {
    document.title = isArabic
      ? 'عبدالرحمن وآية — عقد قران وحفل زفاف | وِصال'
      : 'Abdelrahman & Aya — Katb el-Ketab & Wedding | Wisal';
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

  // Music toggle handler
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

  // Handle Curtain Parting / Veil Open
  const handleOpenVeil = () => {
    if (isOpen) return;
    setIsOpen(true);
    toggleMusic(true);
    startAutoScroll(1400);

    setTimeout(() => {
      setIsVeilHidden(true);
    }, 1900);
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
    g.addColorStop(0, '#d8b9a5');
    g.addColorStop(0.45, '#f6e3d8');
    g.addColorStop(0.55, '#e8c9b6');
    g.addColorStop(1, '#c29a83');

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.22})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
    }

    ctx.fillStyle = 'rgba(157,93,85,0.85)';
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
        ? 'اتسجل عندك؟ الخميس ٢٤ يونيو ٢٠٢٧ 🤍'
        : 'Saved the date? Thursday, 24 June 2027 🤍'
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
          ? 'اتسجل عندك؟ الخميس ٢٤ يونيو ٢٠٢٧ 🤍'
          : 'Saved the date? Thursday, 24 June 2027 🤍'
      );
    }
  };

  // RSVP Submit Handler
  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    const trimmedName = formData.guestName.trim();
    if (!trimmedName) return;

    const isYes = formData.attending === 'yes';
    saveGuestResponse('inv_veil', {
      name: trimmedName,
      status: isYes ? 'confirmed' : 'declined',
      guestsCount: isYes ? parseInt(formData.guestCount, 10) : 0,
      notes: formData.message.trim()
    });

    const msg = isArabic
      ? (isYes
          ? `${trimmedName}، مستنيينك يوم ٢٤ يونيو. اتسجل حضور ${formData.guestCount} فرد.`
          : `${trimmedName}، هتوحشنا، وشكرًا على تهنئتك.`)
      : (isYes
          ? `${trimmedName}, see you on 24 June. Party of ${formData.guestCount}.`
          : `${trimmedName}, you will be missed. Thank you for your wishes.`);

    setThanksMsg(msg);
    setIsSubmitted(true);
  };

  const guestDisplay = guestParam || (isArabic ? 'ضيفنا العزيز' : 'our dear guest');

  return (
    <div
      className={`veil-wrapper ${isOpen ? 'opened' : ''}`}
      dir={isArabic ? 'rtl' : 'ltr'}
      lang={lang}
    >
      {/* Background Audio */}
      <audio
        ref={audioRef}
        src="/audio/veil.mp3"
        loop
        preload="auto"
        playsInline
      />

      {/* Initial Veil Screen (Parts on Tap) */}
      {!isVeilHidden && (
        <button
          className="veil"
          id="veil"
          onClick={handleOpenVeil}
          aria-label={isArabic ? 'افتح الدعوة' : 'Open the invitation'}
        >
          <span className="bg" style={{ backgroundImage: "url('/img/ivory/walk.jpg')" }} />
          <span className="half r"><span className="lace" /></span>
          <span className="half l"><span className="lace" /></span>
          <span className="inner">
            <small>
              <span className="ar">دعوة خاصة إلى</span>
              <span className="en">An invitation for</span>
            </small>
            <b id="guest">{guestDisplay}</b>
            <span className="names-mini">
              <span className="ar">عبدالرحمن وآية</span>
              <span className="en">A &amp; A</span>
            </span>
            <span className="tap">
              <span className="ar">اضغط لفتح الدعوة</span>
              <span className="en">Tap to open</span>
            </span>
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
            <img src="/img/ivory/walk.jpg" alt="Abdelrahman and Aya" />
          </div>
          <p className="eyebrow">
            <span className="ar">عقد قران وحفل زفاف</span>
            <span className="en">Katb el-Ketab &amp; Wedding</span>
          </p>
          <h1 className="names">
            <span className="ar">عبدالرحمن</span>
            <span className="en">Abdelrahman</span>
            <i>&amp;</i>
            <span className="ar">آية</span>
            <span className="en">Aya</span>
          </h1>
          <p className="lead">
            <span className="ar">بفرحة كبيرة، ندعوكم تشاركونا كتب كتابنا وفرحنا في يوم واحد.</span>
            <span className="en">With full hearts, we invite you to our katb el-ketab and wedding, on one day.</span>
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
              <b>24</b>
              <span>
                <span className="ar">يونيو ٢٠٢٧</span>
                <span className="en">June 2027</span>
              </span>
              <small>
                <span className="ar">من ٦:٤٥ مساءً</span>
                <span className="en">From 6:45 PM</span>
              </small>
            </div>
            <canvas
              id="scratch"
              ref={scratchCanvasRef}
              aria-label="Scratch to reveal the date"
              style={{ touchAction: 'none' }}
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

        {/* Horizontal Photo Strip */}
        <section className="reveal" aria-label="Photos">
          <div className="strip">
            <img src="/img/ivory/stairs.jpg" alt="Abdelrahman and Aya Stairs" loading="lazy" />
            <img src="/img/ivory/arcade.jpg" alt="Abdelrahman and Aya Arcade" loading="lazy" />
            <img src="/img/ivory/lift.jpg" alt="Abdelrahman and Aya Lift" loading="lazy" />
          </div>
        </section>

        {/* Schedule of the Day */}
        <section className="card reveal">
          <h2>
            <span className="ar">تفاصيل اليوم</span>
            <span className="en">The day</span>
          </h2>
          <ul className="day">
            <li>
              <time>6:45</time>
              <span>
                <span className="ar">استقبال المدعوين</span>
                <span className="en">Guests arrive</span>
              </span>
            </li>
            <li>
              <time>7:30</time>
              <span>
                <span className="ar">دخلة العروسة</span>
                <span className="en">The bride's entrance</span>
              </span>
            </li>
            <li>
              <time>8:00</time>
              <span>
                <span className="ar">كتب الكتاب</span>
                <span className="en">Katb el-ketab</span>
              </span>
            </li>
            <li>
              <time>8:30</time>
              <span>
                <span className="ar">البوفيه</span>
                <span className="en">Dinner buffet</span>
              </span>
            </li>
            <li>
              <time>9:00</time>
              <span>
                <span className="ar">الحفلة</span>
                <span className="en">The party</span>
              </span>
            </li>
          </ul>
        </section>

        {/* Countdown Timer */}
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
          <img className="venue-ph" src="/img/ivory/gazebo.jpg" alt="Villa Yasmine Gazebo" />
          <p className="venue">
            <span className="ar">فيلا الياسمين</span>
            <span className="en">Villa Yasmine</span>
          </p>
          <p className="addr">
            <span className="ar">الزمالك، القاهرة · الجنينة</span>
            <span className="en">Zamalek, Cairo · The garden</span>
          </p>
          <div className="btns">
            <a
              className="btn solid"
              href="https://maps.google.com/?q=Zamalek+Cairo"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="ar">افتح اللوكيشن</span>
              <span className="en">Open in Maps</span>
            </a>
            <a
              className="btn"
              href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Aya%20%26%20Abdelrahman%20%C2%B7%20Katb%20el-Ketab%20%26%20Wedding&dates=20270624T154500Z%2F20270624T204500Z&location=Villa%20Yasmine%2C%20Zamalek%2C%20Cairo%20%C2%B7%20The%20garden"
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
          <div className="ph">
            <img src="/img/ivory/lift.jpg" alt="Abdelrahman and Aya" />
          </div>
          <p>
            <span className="ar">
              وجودكم معانا هو اللي هيكمل فرحتنا. شكرًا من قلبنا إنكم جزء من يومنا.
            </span>
            <span className="en">
              Having you with us is what will make our day complete. Thank you, from our hearts.
            </span>
          </p>
          <div className="sig">
            <span className="ar">عبدالرحمن وآية</span>
            <span className="en">Abdelrahman &amp; Aya</span>
          </div>
        </section>

        <p className="credit">الصور: Randa Photography</p>
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
