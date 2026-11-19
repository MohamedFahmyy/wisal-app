import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { saveGuestResponse } from '../utils/guestStorage';
import { startAutoScroll } from '../utils/autoScroll';
import '../styles/rosearch.css';

// Converts western digits to Eastern Arabic digits
function toArabicDigits(num, pad = false) {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let s = String(num);
  if (pad && s.length < 2) s = '0' + s;
  return s.replace(/[0-9]/g, (w) => arabicDigits[+w]);
}

const PROGRAM_MILESTONES = [
  {
    time: '٧:٠٠ مساءً',
    title: 'استقبال الضيوف',
    img: '/img/rosearch/arch-pink-roses.webp'
  },
  {
    time: '٧:٣٠ مساءً',
    title: 'كتب الكتاب',
    img: '/img/rosearch/ring-diamond-sketch.webp'
  },
  {
    time: '٨:٣٠ مساءً',
    title: 'دخول العروسين',
    img: '/img/rosearch/couple-blush.webp'
  },
  {
    time: '٩:٠٠ مساءً',
    title: 'الرقصة الأولى',
    img: '/img/rosearch/gate-pink-roses.webp'
  },
  {
    time: '٩:٣٠ مساءً',
    title: 'العشاء',
    img: '/img/rosearch/corner-blush-roses.webp'
  },
  {
    time: '١٠:٣٠ مساءً',
    title: 'تقطيع التورتة',
    img: '/img/rosearch/cake-ivory-flowers.webp'
  }
];

export default function RoseArchPage() {
  const [searchParams] = useSearchParams();
  const guestNameParam = searchParams.get('to') || searchParams.get('name') || '';

  // Cover & Opening State
  const [isOpen, setIsOpen] = useState(false);
  const [isCoverGone, setIsCoverGone] = useState(false);
  const [isHeroOn, setIsHeroOn] = useState(false);

  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // RSVP Form State
  const [guestCount, setGuestCount] = useState(1);
  const [formData, setFormData] = useState({
    name: guestNameParam,
    attending: 'yes',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  // Live Countdown State (Saturday, 8 May 2027, 19:00 Cairo Time)
  const targetDate = useRef(new Date('2027-05-08T19:00:00+02:00').getTime());
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Floating Petals
  const spawnPetals = useCallback(() => {
    const colors = ['#d9cdea', '#c4b3dd', '#efe8f6', '#e8dcc4'];
    for (let i = 0; i < 26; i++) {
      const petal = document.createElement('i');
      petal.className = 'rosearch-petal';
      petal.style.left = `${Math.random() * 100}vw`;
      petal.style.background = colors[i % 4];
      petal.style.setProperty('--t', `${4 + Math.random() * 4}s`);
      petal.style.setProperty('--x', `${Math.random() * 120 - 60}px`);
      petal.style.setProperty('--r', `${Math.random() * 720 - 360}deg`);
      petal.style.animationDelay = `${Math.random() * 1.6}s`;
      document.body.appendChild(petal);
      setTimeout(() => {
        if (petal.parentNode) petal.parentNode.removeChild(petal);
      }, 10000);
    }
  }, []);

  // Title
  useEffect(() => {
    document.title = 'يحيى و ليلى · حفل زفاف | وِصال';
  }, []);

  // Countdown Interval
  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, targetDate.current - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Intersection Observer for scroll reveal
  useEffect(() => {
    if (!isOpen) return;

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

    const elements = document.querySelectorAll('.rosearch-rv');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [isOpen]);

  // Audio Play / Pause Handler
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // Open Invitation Handler
  const handleOpenInvitation = () => {
    if (isOpen) return;
    setIsOpen(true);

    // Audio Start
    if (audioRef.current) {
      audioRef.current.volume = 0.7;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }

    // Petals burst
    spawnPetals();

    setTimeout(() => {
      setIsHeroOn(true);
    }, 1000);

    setTimeout(() => {
      setIsCoverGone(true);
    }, 1700);

    // Smooth auto-scroll down the invitation showcase
    startAutoScroll({
      delay: 3500,
      speed: 46,
      stopAt: '#rsvp'
    });
  };

  // RSVP Submit Handler
  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('يرجى كتابة الاسم الكريم للمتابعة');
      return;
    }
    setFormError('');

    saveGuestResponse({
      name: formData.name.trim(),
      attending: formData.attending,
      guests: formData.attending === 'yes' ? guestCount : 0,
      message: formData.message.trim(),
      invitationId: 'inv_rosearch',
      slug: 'rosearch'
    });

    setIsSubmitted(true);
    spawnPetals();
  };

  // Google Calendar URL
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    'حفل زفاف يحيى و ليلى 🌹'
  )}&dates=20270508T170000Z/20270508T220000Z&details=${encodeURIComponent(
    'يسعدنا ويشرفنا حضوركم ومشاركتنا فرحتنا بحديقة الورد بالمعادي.'
  )}&location=${encodeURIComponent('حديقة الورد، المعادي، القاهرة')}`;

  return (
    <div className="rosearch-container">
      {/* Background Audio */}
      <audio ref={audioRef} src="/audio/veil.mp3" loop preload="auto" />

      {/* 1. Opening Cover Screen Modal */}
      {!isCoverGone && (
        <div
          className={`rosearch-intro ${isOpen ? 'go' : ''}`}
          onClick={handleOpenInvitation}
          role="button"
          tabIndex={0}
          aria-label="اضغط لفتح الدعوة"
        >
          <div className="rosearch-cv">
            {/* Sparkles */}
            <span className="rosearch-spk" style={{ top: '15%', left: '16%', '--d': '3.2s' }}>
              ✦
            </span>
            <span className="rosearch-spk" style={{ top: '12%', right: '14%', '--d': '2.8s', '--dl': '1s' }}>
              ✦
            </span>
            <span className="rosearch-spk" style={{ bottom: '26%', right: '12%', '--d': '3.5s', '--dl': '0.5s' }}>
              ✦
            </span>

            <p className="intro-quote" style={{ margin: 0, font: '400 28px "Aref Ruqaa", serif', color: '#7A4E55' }}>
              على عتبة الحلم…
            </p>

            {/* Wreath Woven Image */}
            <div className="wreath-wrap">
              <img src="/img/rosearch/arch-pink-roses.webp" alt="Rose Arch" />
              <div className="wreath-inner">
                <p className="type">دعوة زفاف</p>
                <div className="initials">ل &amp; ي</div>
                <p className="date-dot">٨ . ٥ . ٢٠٢٧</p>
              </div>
            </div>

            <p className="couple-tag">ليلى &amp; يحيى</p>

            {/* Breathing Button */}
            <div className="tap-action">
              <button type="button" className="obtn" aria-label="افتح الدعوة">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7A4E55" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="2.2" />
                  <path d="M12 9.8c-1.6-3.2 1.6-5.8 0-7 -1.6 1.2 1.6 3.8 0 7M12 14.2c1.6 3.2-1.6 5.8 0 7 1.6-1.2-1.6-3.8 0-7M9.8 12c-3.2 1.6-5.8-1.6-7 0 1.2 1.6 3.8-1.6 7 0M14.2 12c3.2-1.6 5.8 1.6 7 0-1.2-1.6-3.8 1.6-7 0" />
                </svg>
              </button>
              <p>اضغط لفتح الدعوة</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Invitation Canvas */}
      <main className="rosearch-wrap">
        {/* Hero Section */}
        <section className={`rosearch-hero ${isHeroOn ? 'on' : ''}`} id="hero">
          <div className="poem">
            <p className="poem-line-1">وراء كل باب حكاية،</p>
            <p className="poem-line-2">وحكايتنا بدأت من هنا…</p>
            <p className="poem-line-3">افتحوا الباب وشاركونا الفرحة.</p>
          </div>

          <div className="couple-names">
            <h1 className="name-g">يحيى</h1>
            <span className="amp">&amp;</span>
            <h1 className="name-b">ليلى</h1>
          </div>

          <p className="date-badge">٨ مايو ٢٠٢٧</p>

          <div className="gate-illustration">
            <img src="/img/rosearch/gate-pink-roses.webp" alt="بوابة حديقة الورد" />
          </div>
        </section>

        {/* Countdown Section */}
        <section className="rosearch-section">
          <h2 className="rosearch-h rosearch-rv in">باقي على فرحتنا</h2>
          <div className="rosearch-divider rosearch-rv in">
            <svg viewBox="0 0 24 22" fill="currentColor">
              <path d="M12 21C5 15.5 1 12 1 7a5.5 5.5 0 0 1 11-1.6A5.5 5.5 0 0 1 23 7c0 5-4 8.5-11 14z" />
            </svg>
          </div>

          <div className="rosearch-cd rosearch-rv in">
            <div>
              <b>{toArabicDigits(timeLeft.days)}</b>
              <small>يوم</small>
            </div>
            <div>
              <b>{toArabicDigits(timeLeft.hours)}</b>
              <small>ساعة</small>
            </div>
            <div>
              <b>{toArabicDigits(timeLeft.minutes)}</b>
              <small>دقيقة</small>
            </div>
            <div>
              <b>{toArabicDigits(timeLeft.seconds)}</b>
              <small>ثانية</small>
            </div>
          </div>
        </section>

        {/* Programme Section (Zig-Zag Milestones) */}
        <section className="rosearch-section" style={{ paddingInline: 12 }}>
          <h2 className="rosearch-h rosearch-rv in">برنامج الحفل</h2>
          <p className="rosearch-sub rosearch-rv in">السبت ٨ مايو ٢٠٢٧</p>
          <div className="rosearch-divider rosearch-rv in">
            <svg viewBox="0 0 24 22" fill="currentColor">
              <path d="M12 21C5 15.5 1 12 1 7a5.5 5.5 0 0 1 11-1.6A5.5 5.5 0 0 1 23 7c0 5-4 8.5-11 14z" />
            </svg>
          </div>

          <div className="rosearch-zz">
            {PROGRAM_MILESTONES.map((item, idx) => (
              <div key={idx} className="rosearch-zr rosearch-rv in">
                <div className="zp">
                  <img src={item.img} alt={item.title} loading="lazy" />
                </div>
                <div className="zt">
                  <b>{item.time}</b>
                  <span>{item.title}</span>
                </div>
                <i className="mk" />
              </div>
            ))}
          </div>

          <p className="rosearch-end-tag rosearch-rv in">مستنيينكم بكل الحب 🤍</p>
        </section>

        {/* Venue Section with Stylized Map */}
        <section className="rosearch-section" id="venue">
          <h2 className="rosearch-h rosearch-rv in">هنستناكم هنا</h2>
          <div className="rosearch-divider rosearch-rv in">
            <svg viewBox="0 0 24 22" fill="currentColor">
              <path d="M12 21C5 15.5 1 12 1 7a5.5 5.5 0 0 1 11-1.6A5.5 5.5 0 0 1 23 7c0 5-4 8.5-11 14z" />
            </svg>
          </div>

          {/* Architectural Drawn Vector Map */}
          <div className="rosearch-map rosearch-rv in">
            <svg viewBox="0 0 310 210" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <rect width="310" height="210" fill="#f5ebea" />
              <path d="M-10,150 C60,120 90,170 160,140 S260,90 330,120" fill="none" stroke="#D9E3E8" strokeWidth="18" />
              <ellipse cx="70" cy="60" rx="46" ry="28" fill="#DCE6D6" />
              <ellipse cx="250" cy="185" rx="50" ry="26" fill="#DCE6D6" />
              <g stroke="#fff" strokeWidth="9" strokeLinecap="round" fill="none">
                <path d="M0,95 H310" />
                <path d="M120,0 V210" />
                <path d="M220,0 C210,70 240,120 230,210" />
                <path d="M0,30 L120,95" />
              </g>
              <g stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.9">
                <path d="M30,0 V95" />
                <path d="M160,95 V210" />
                <path d="M260,0 V95" />
                <path d="M120,170 H310" />
              </g>
              <path
                d="M60,200 C90,170 110,150 120,120 S170,100 200,78"
                fill="none"
                stroke="#C2A267"
                strokeWidth="2.4"
                strokeDasharray="2 6"
                strokeLinecap="round"
              />
              <circle cx="60" cy="200" r="5" fill="#C2A267" />
              <path d="M200,82 c-10,-12 -18,-20 -18,-30 a18,18 0 0 1 36,0 c0,10 -8,18 -18,30z" fill="#7A4E55" />
              <path d="M200,61 C196,57 192,55 192,51 a4,4 0 0 1 8,-1 a4,4 0 0 1 8,1 c0,4 -4,6 -8,10z" fill="#fff" />
            </svg>
          </div>

          <div className="rosearch-venue-meta rosearch-rv in">
            <h3 className="hall">حديقة الورد</h3>
            <p className="addr">المعادي، القاهرة</p>
            <p className="when-txt">السبت ٨ مايو ٢٠٢٧ · ٧:٠٠ مساءً</p>
          </div>

          <div className="rosearch-vbtns rosearch-rv in">
            <a
              className="rosearch-vb solid"
              href="https://maps.google.com/?q=Maadi+Cairo+Egypt"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                <path d="m3 11 18-8-8 18-2-8z" />
              </svg>
              الوصول للقاعة
            </a>
            <a
              className="rosearch-vb"
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              أضف للتقويم
            </a>
          </div>

          <img
            className="rosearch-botimg rosearch-rv in"
            src="/img/rosearch/corner-blush-roses.webp"
            alt=""
          />
        </section>

        {/* RSVP Message Letter Section */}
        <section className="rosearch-section" id="rsvp">
          <div className="rosearch-paper rosearch-rv in">
            {!isSubmitted ? (
              <form onSubmit={handleRsvpSubmit}>
                <h3>إلى العروسين…</h3>
                <p className="salut">ألف مبروك، وربنا يتمم بخير…</p>

                <textarea
                  className="lined"
                  rows={3}
                  maxLength={600}
                  placeholder="اكتب رسالتك للعروسين هنا…"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />

                <div className="rosearch-radios">
                  <label className={formData.attending === 'yes' ? 'is-selected' : ''}>
                    <input
                      type="radio"
                      name="att"
                      value="yes"
                      checked={formData.attending === 'yes'}
                      onChange={() => setFormData({ ...formData, attending: 'yes' })}
                    />
                    جاي بإذن الله 🤍
                  </label>
                  <label className={formData.attending === 'no' ? 'is-selected' : ''}>
                    <input
                      type="radio"
                      name="att"
                      value="no"
                      checked={formData.attending === 'no'}
                      onChange={() => setFormData({ ...formData, attending: 'no' })}
                    />
                    مش هقدر
                  </label>
                </div>

                <div className="rosearch-sig">
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#9e7f85', marginBottom: '4px' }}>
                      التوقيع
                    </label>
                    <input
                      type="text"
                      maxLength={80}
                      placeholder="اسمك الكريم"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  {formData.attending === 'yes' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', color: '#9e7f85', marginBottom: '4px' }}>
                        العدد
                      </label>
                      <div className="rosearch-stp">
                        <button
                          type="button"
                          onClick={() => setGuestCount((prev) => Math.max(1, prev - 1))}
                          aria-label="تقليل العدد"
                        >
                          −
                        </button>
                        <output>{toArabicDigits(guestCount)}</output>
                        <button
                          type="button"
                          onClick={() => setGuestCount((prev) => Math.min(8, prev + 1))}
                          aria-label="زيادة العدد"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {formError && (
                  <p style={{ color: '#a3253a', fontSize: '13px', marginTop: '10px' }}>
                    {formError}
                  </p>
                )}

                <button className="rosearch-send" type="submit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                    <path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" />
                  </svg>
                  حط رسالتك في الظرف
                </button>
              </form>
            ) : (
              <div className="rosearch-ok">
                <div className="chk">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                </div>
                <h3>{formData.attending === 'yes' ? 'اتسجل حضورك بنجاح' : 'وصلنا اعتذارك'}</h3>
                <p className="sub">
                  {formData.attending === 'yes'
                    ? `شكرًا يا ${formData.name}… فرحتنا تكمل بيك!`
                    : `شكرًا يا ${formData.name}… سنفتقدك بكل تأكيد.`}
                </p>

                <div className="sum">
                  <div className="r">
                    <div className="ci">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18">
                        <circle cx="12" cy="8" r="3.6" />
                        <path d="M5 20c1.2-3.6 4-5 7-5s5.8 1.4 7 5" />
                      </svg>
                    </div>
                    <div>
                      <b style={{ fontSize: '16px', color: '#7A4E55' }}>{formData.name}</b>
                      <small style={{ fontSize: '12px', color: '#9e7f85' }}>
                        {formData.attending === 'yes'
                          ? `${toArabicDigits(guestCount)} ${guestCount > 1 ? 'أفراد' : 'فرد'}`
                          : 'معتذر عن الحضور'}
                      </small>
                    </div>
                  </div>

                  <div className="r">
                    <div className="ci">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18">
                        <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
                        <path d="M3.5 9.5h17M8 3v4M16 3v4" />
                      </svg>
                    </div>
                    <div>
                      <b style={{ fontSize: '16px', color: '#7A4E55' }}>السبت ٨ مايو ٢٠٢٧</b>
                      <small style={{ fontSize: '12px', color: '#9e7f85' }}>٧:٠٠ مساءً</small>
                    </div>
                  </div>

                  <div className="r">
                    <div className="ci">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18">
                        <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
                        <circle cx="12" cy="9.5" r="2.5" />
                      </svg>
                    </div>
                    <div>
                      <b style={{ fontSize: '16px', color: '#7A4E55' }}>حديقة الورد</b>
                      <small style={{ fontSize: '12px', color: '#9e7f85' }}>المعادي، القاهرة</small>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Dua & Blessings Section */}
        <section className="rosearch-dua rosearch-section" id="dua">
          <img
            className="dw rosearch-rv in"
            src="/img/rosearch/corner-blush-roses.webp"
            alt=""
            loading="lazy"
          />
          <p className="de rosearch-rv in">من القلب</p>
          <h2 className="rosearch-h rosearch-rv in">رسالة ودعاء</h2>

          <p className="dm rosearch-rv in">
            لكل حد كان سبب في فرحتنا،
            <br />
            ولكل دعوة طلعت من قلب بيحبنا…
            <br />
            شكرًا إنكم جزء من حكايتنا.
          </p>

          <div className="dq rosearch-rv in">
            <span className="qm">❝</span>
            <p>
              بارك الله لكما، وبارك عليكما،
              <br />
              وجمع بينكما في خير
            </p>
            <span className="qs">
              اللهم اجعل بيتهما عامرًا بالمودة والرحمة،
              <br />
              واجعل أيامهما كلها فرح وسكينة
            </span>
          </div>

          <p className="dt rosearch-rv in">آمين يا رب 🤍</p>
          <div className="nm rosearch-rv in">يحيى و ليلى</div>
        </section>

        {/* Footer */}
        <footer className="rosearch-footer">
          صُممت بحب في <Link to="/">وِصال</Link>
        </footer>
      </main>

      {/* Floating Music Button */}
      {isOpen && (
        <button
          type="button"
          className="rosearch-mus"
          onClick={toggleAudio}
          aria-label={isPlaying ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M11 5 6 9H3v6h3l5 4z" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M11 5 6 9H3v6h3l5 4z" />
              <path d="m16 9 5 6M21 9l-5 6" />
            </svg>
          )}
        </button>
      )}

      {/* Floating WhatsApp CTA */}
      {isOpen && (
        <a
          className="rosearch-dock-order"
          href="https://wa.me/201112194828?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%20%D9%88%D9%8F%D8%B5%D8%A7%D9%84%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%AA%D8%B5%D9%85%D9%8A%D9%85%20%D8%AF%D8%B9%D9%88%D8%A9%20%D8%B2%D9%81%D8%A7%D9%81%20%D8%A8%D9%86%D9%81%D8%B3%20%D9%82%D8%A7%D9%84%D8%A8%20Rose%20Arch%20%D8%A7%D9%84%D8%B1%D9%88%D9%85%D8%A7%D9%86%D8%B3%D9%8A"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>صمم دعوتك مع وِصال</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
          </svg>
        </a>
      )}
    </div>
  );
}
