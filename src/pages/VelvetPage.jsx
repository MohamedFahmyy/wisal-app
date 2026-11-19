import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { saveGuestResponse, getGuestResponsesByInvitation } from '../utils/guestStorage';
import '../styles/velvet.css';

// Converts western digits to Eastern Arabic digits
function toArabicDigits(num, pad = false) {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let s = String(num);
  if (pad && s.length < 2) s = '0' + s;
  return s.replace(/[0-9]/g, (w) => arabicDigits[+w]);
}

const GALLERY_IMAGES = [
  '/img/velvet/p1.webp',
  '/img/velvet/p2.webp',
  '/img/velvet/p3.webp',
  '/img/velvet/p4.webp',
  '/img/velvet/p5.webp'
];

const INITIAL_WISHES = [
  {
    name: 'م. أحمد خالد',
    message: 'ألف مليون مبروك يا عبدالرحمن ويا آية! ربنا يتمملكم على ألف خير ويسعد أيامكم كلها ❤️💍',
    createdAt: '2026-11-18T14:30:00.000Z'
  },
  {
    name: 'نوران الشاذلي',
    message: 'بارك الله لكما وبارك عليكما وجمع بينكما في خير.. أجمل عروسين في الدنيا 🤍✨',
    createdAt: '2026-11-18T16:15:00.000Z'
  },
  {
    name: 'عائلة د. طارق محمود',
    message: 'فرحتنا بيكم متتوصفش، ربنا يرزقكم السعادة والهناء وراحة البال دائماً وأبداً 🎉🌹',
    createdAt: '2026-11-18T18:00:00.000Z'
  }
];

export default function VelvetPage() {
  const [searchParams] = useSearchParams();
  const guestNameParam = searchParams.get('to') || searchParams.get('name') || '';

  // Cover & Opening State
  const [isOpen, setIsOpen] = useState(false);
  const [isCoverGone, setIsCoverGone] = useState(false);
  const [isHeroOn, setIsHeroOn] = useState(false);

  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Gallery 3D Cover-Flow State
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // RSVP Form State
  const [formData, setFormData] = useState({
    name: guestNameParam,
    attending: 'yes',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [wishes, setWishes] = useState([]);
  const [visibleWishesCount, setVisibleWishesCount] = useState(5);

  // Live Countdown State (Sunday, 20 Dec 2026, 20:00 Cairo Time)
  const targetDate = useRef(new Date('2026-12-20T20:00:00+02:00').getTime());
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Floating Petals
  const spawnPetals = useCallback(() => {
    const colors = ['#7a1a2b', '#a8454f', '#f1e2d3', '#c9a265'];
    for (let i = 0; i < 28; i++) {
      const petal = document.createElement('i');
      petal.className = 'velvet-petal';
      petal.style.left = `${Math.random() * 100}vw`;
      petal.style.background = colors[i % 4];
      petal.style.setProperty('--t', `${4 + Math.random() * 4}s`);
      petal.style.setProperty('--x', `${Math.random() * 120 - 60}px`);
      petal.style.setProperty('--r', `${Math.random() * 720 - 360}deg`);
      petal.style.animationDelay = `${Math.random() * 1.4}s`;
      document.body.appendChild(petal);
      setTimeout(() => {
        if (petal.parentNode) petal.parentNode.removeChild(petal);
      }, 9000);
    }
  }, []);

  // Title and Initial Wishes Load
  useEffect(() => {
    document.title = 'خطوبة عبدالرحمن و آية 💍 | وِصال';
    
    // Load local stored wishes
    const stored = getGuestResponsesByInvitation('inv_velvet');
    if (stored && stored.length > 0) {
      setWishes([...stored, ...INITIAL_WISHES]);
    } else {
      setWishes(INITIAL_WISHES);
    }
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

  // Intersection Observer for .velvet-rv scroll reveal
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

    const elements = document.querySelectorAll('.velvet-rv');
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
      audioRef.current.volume = 0.75;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }

    // Petals burst
    spawnPetals();

    // Trigger animations
    setTimeout(() => {
      setIsCoverGone(true);
      setIsHeroOn(true);
    }, 700);

    // Auto-scroll after 4.5s towards RSVP if user doesn't interact
    let userScrolled = false;
    const cancelAutoScroll = () => {
      userScrolled = true;
      window.removeEventListener('touchstart', cancelAutoScroll);
      window.removeEventListener('wheel', cancelAutoScroll);
      window.removeEventListener('keydown', cancelAutoScroll);
      window.removeEventListener('mousedown', cancelAutoScroll);
    };

    window.addEventListener('touchstart', cancelAutoScroll, { passive: true });
    window.addEventListener('wheel', cancelAutoScroll, { passive: true });
    window.addEventListener('keydown', cancelAutoScroll, { passive: true });
    window.addEventListener('mousedown', cancelAutoScroll, { passive: true });

    setTimeout(() => {
      if (userScrolled) return;
      const rsvpEl = document.getElementById('rsvp');
      if (rsvpEl) {
        rsvpEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 4500);
  };

  // Gallery Touch Gestures
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swipe left -> next
        setActiveSlide((prev) => (prev + 1) % GALLERY_IMAGES.length);
      } else {
        // Swipe right -> prev
        setActiveSlide((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
      }
    }
  };

  // Quick Greeting Chips
  const handleAddChip = (text) => {
    setFormData((prev) => ({
      ...prev,
      message: prev.message ? `${prev.message} ${text}` : text
    }));
  };

  // RSVP Submit Handler
  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('يرجى كتابة الاسم الكريم للمتابعة');
      return;
    }
    setFormError('');

    const newResponse = saveGuestResponse({
      name: formData.name.trim(),
      attending: formData.attending,
      guests: formData.attending === 'yes' ? 1 : 0,
      message: formData.message.trim(),
      invitationId: 'inv_velvet',
      slug: 'velvet'
    });

    setIsSubmitted(true);
    spawnPetals();

    if (formData.message.trim()) {
      setWishes((prev) => [
        {
          name: formData.name.trim(),
          message: formData.message.trim(),
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);
    }
  };

  // Add to Calendar Link
  const calendarEvent = {
    title: 'حفل خطوبة عبدالرحمن و آية 💍',
    description: 'يسعدنا ويشرفنا حضوركم ومشاركتنا فرحتنا بليلة العمر بقاعة الياسمين بمصر الجديدة.',
    location: 'قاعة الياسمين، مصر الجديدة، القاهرة',
    startDate: '20261220T180000Z', // 20:00 Cairo is 18:00 UTC
    endDate: '20261220T220000Z'
  };

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    calendarEvent.title
  )}&dates=${calendarEvent.startDate}/${calendarEvent.endDate}&details=${encodeURIComponent(
    calendarEvent.description
  )}&location=${encodeURIComponent(calendarEvent.location)}`;

  return (
    <div className="velvet-container">
      {/* Background Floating Gold Dust Particles */}
      <div className="velvet-dust" aria-hidden="true">
        {Array.from({ length: 26 }).map((_, i) => (
          <i
            key={i}
            style={{
              left: `${((i * 37) % 97) + 1}%`,
              top: `${20 + ((i * 23) % 75)}%`,
              '--s': `${2 + (i % 4)}px`,
              '--t': `${5 + (i % 6)}s`,
              '--d': `-${i * 0.4}s`
            }}
          />
        ))}
      </div>

      {/* Background Audio */}
      <audio ref={audioRef} src="/audio/envelope.mp3" loop preload="auto" />

      {/* 1. Opening Cover Screen Modal */}
      {!isCoverGone && (
        <div className={`velvet-cover ${isOpen ? 'go' : ''}`}>
          <div className="velvet-ccard">
            <div className="frame" />
            <div className="velvet-roses tr">
              <img src="/img/velvet/flowers.webp" alt="" />
            </div>
            <div className="velvet-roses bl">
              <img src="/img/velvet/flowers.webp" alt="" />
            </div>
            <div className="velvet-medal">
              <svg viewBox="0 0 24 22" fill="currentColor">
                <path d="M12 21C5 15.5 1 12 1 7a5.5 5.5 0 0 1 11-1.6A5.5 5.5 0 0 1 23 7c0 5-4 8.5-11 14z" />
              </svg>
            </div>
            <p className="ey">حفل خطوبة</p>
            <div className="nm">
              <span className="lat">Abdelrahman</span>
              <span className="amp">&</span>
              <span className="lat">Aya</span>
            </div>
            <div className="velvet-orn">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 0L13 10L10 20L7 10Z" />
              </svg>
            </div>
            <p className="dt">الأحد ٢٠ ديسمبر ٢٠٢٦</p>
            <p className="inv">يتشرفون بدعوتكم</p>
            <button className="velvet-open-btn" onClick={handleOpenInvitation} type="button">
              افتح الدعوة
            </button>
          </div>
        </div>
      )}

      {/* 2. Main Invitation Canvas */}
      <main className="velvet-page">
        {/* Hero Section: Polaroid Envelope */}
        <section className={`velvet-hero velvet-section ${isHeroOn ? 'on' : ''}`} id="hero">
          <p className="std velvet-rv in">SAVE THE DATE</p>

          <div className="velvet-env">
            <div className="back" />
            <div className="photo">
              <img src="/img/velvet/cover.webp" alt="عبدالرحمن و آية" />
            </div>
            <div className="front">
              <svg viewBox="0 0 340 210" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#7a1a2b" />
                    <stop offset="1" stopColor="#4a0f1a" />
                  </linearGradient>
                  <pattern id="dm" width="18" height="18" patternUnits="userSpaceOnUse">
                    <path d="M9 2l3 7-3 7-3-7z" fill="rgba(255,255,255,.035)" />
                  </pattern>
                </defs>
                <path d="M0 0 L170 120 L340 0 L340 210 L0 210 Z" fill="url(#eg)" />
                <path d="M0 0 L170 120 L340 0 L340 210 L0 210 Z" fill="url(#dm)" />
                <path d="M0 210 L150 105 M340 210 L190 105" stroke="rgba(0,0,0,.18)" strokeWidth="1.2" />
                <path d="M0 0 L170 120 L340 0" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="1.2" />
              </svg>
            </div>
            <div className="wax">
              <img src="/img/velvet/seal.webp" alt="Wax Seal" />
            </div>
            <div className="velvet-roses">
              <img src="/img/velvet/flowers.webp" alt="" />
            </div>
            <div className="velvet-roses r2">
              <img src="/img/velvet/flowers.webp" alt="" />
            </div>
          </div>

          <div className="names velvet-rv in">
            <span className="lat">Abdelrahman</span>
            <span className="amp">&</span>
            <span className="lat">Aya</span>
          </div>
          <p className="ln velvet-rv in">بكل الحب، ندعوكم لمشاركتنا فرحتنا</p>
        </section>

        {/* Wine Date Card */}
        <section className="velvet-section">
          <div className="velvet-wine velvet-rv in">
            <div className="velvet-roses">
              <img src="/img/velvet/flowers.webp" alt="" />
            </div>
            <p className="ey">حفل خطوبة</p>
            <div className="nm">
              <span className="lat">Abdelrahman</span>
              <span className="amp">&</span>
              <span className="lat">Aya</span>
            </div>
            <div className="velvet-orn">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 0L13 10L10 20L7 10Z" />
              </svg>
            </div>
            <div className="velvet-when">
              <div className="side">
                <span>٨:٠٠ مساءً</span>
                <span>الأحد</span>
              </div>
              <div className="day">٢٠</div>
              <div className="side">
                <span>ديسمبر</span>
                <span>٢٠٢٦</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3D Cover-Flow Gallery */}
        <section className="velvet-section" style={{ paddingInline: 0 }}>
          <h2 className="velvet-gal-h velvet-rv in">صورنا</h2>
          <div
            className="velvet-flow velvet-rv in"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {GALLERY_IMAGES.map((src, idx) => {
              const offset = idx - activeSlide;
              let style = {};

              if (offset === 0) {
                style = {
                  transform: 'translateX(0px) translateZ(0px) rotateY(0deg)',
                  zIndex: 10,
                  opacity: 1,
                  filter: 'none'
                };
              } else if (offset > 0) {
                style = {
                  transform: `translateX(${offset * 75}px) translateZ(-${Math.abs(offset) * 110}px) rotateY(-40deg)`,
                  zIndex: 10 - Math.abs(offset),
                  opacity: Math.max(0.3, 1 - Math.abs(offset) * 0.35),
                  filter: 'brightness(0.7)'
                };
              } else {
                style = {
                  transform: `translateX(${offset * 75}px) translateZ(-${Math.abs(offset) * 110}px) rotateY(40deg)`,
                  zIndex: 10 - Math.abs(offset),
                  opacity: Math.max(0.3, 1 - Math.abs(offset) * 0.35),
                  filter: 'brightness(0.7)'
                };
              }

              return (
                <div
                  key={idx}
                  className="it"
                  style={style}
                  onClick={() => setActiveSlide(idx)}
                >
                  <img src={src} alt={`صورة ${idx + 1}`} />
                </div>
              );
            })}
          </div>

          <div className="velvet-dots velvet-rv in">
            {GALLERY_IMAGES.map((_, idx) => (
              <i
                key={idx}
                className={idx === activeSlide ? 'on' : ''}
                onClick={() => setActiveSlide(idx)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
        </section>

        {/* Countdown & Calendar Section */}
        <section className="velvet-section">
          <div className="velvet-wine velvet-rv in" style={{ textAlign: 'center' }}>
            <p className="ey">باقي على فرحتنا</p>

            <div className="velvet-cd">
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

            {/* December 2026 Interactive Calendar */}
            <div className="velvet-cal">
              <h4>ديسمبر ٢٠٢٦</h4>
              <div className="g">
                <span className="w">أحد</span>
                <span className="w">إثنين</span>
                <span className="w">ثلاثاء</span>
                <span className="w">أربعاء</span>
                <span className="w">خميس</span>
                <span className="w">جمعة</span>
                <span className="w">سبت</span>

                {/* Empty cells for Dec 1 (starts on Tuesday -> Sun, Mon empty) */}
                <span />
                <span />

                {/* Dec 1 through Dec 31 */}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                  const isEventDay = day === 20;
                  return (
                    <span key={day} className={isEventDay ? 'hit' : ''}>
                      {toArabicDigits(day)}
                    </span>
                  );
                })}
              </div>
            </div>

            <a
              className="velvet-btn gold"
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              أضف للتقويم
            </a>
          </div>
        </section>

        {/* Venue Section */}
        <section className="velvet-venue velvet-section">
          <h3 className="velvet-rv in">قاعة الياسمين</h3>
          <p className="ad velvet-rv in">مصر الجديدة، القاهرة</p>

          <div className="velvet-map velvet-rv in">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110502.61185043685!2d31.2584644!3d30.0913904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145815dcc3e4e599%3A0x6d01877c59b6331b!2sHeliopolis%2C%20Al%20Matariyyah%2C%20Cairo%20Governorate!5e0!3m2!1sen!2seg!4v1700000000000!5m2!1sen!2seg"
              loading="lazy"
              title="خريطة القاعة"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="btns velvet-rv in">
            <a
              className="velvet-btn wine-b"
              href="https://www.google.com/maps/search/?api=1&query=Heliopolis+Cairo+Egypt"
              target="_blank"
              rel="noopener noreferrer"
            >
              الاتجاهات عبر خرائط Google
            </a>
          </div>
        </section>

        {/* RSVP & Wishes Wall Section */}
        <section className="velvet-section">
          <div className="velvet-rs velvet-rv in" id="rsvp">
            <h3>شاركونا فرحتنا</h3>
            <p className="sub">أكّد حضورك واكتبلنا تهنئة، وهتظهر هنا لكل المعازيم</p>

            {!isSubmitted ? (
              <form onSubmit={handleRsvpSubmit}>
                <input
                  type="text"
                  maxLength={60}
                  placeholder="اسمك الكريم"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />

                <div className="velvet-ch">
                  <label className={formData.attending === 'yes' ? 'is-selected' : ''}>
                    <input
                      type="radio"
                      name="att"
                      value="yes"
                      checked={formData.attending === 'yes'}
                      onChange={() => setFormData({ ...formData, attending: 'yes' })}
                    />
                    هحضر بإذن الله
                  </label>
                  <label className={formData.attending === 'no' ? 'is-selected' : ''}>
                    <input
                      type="radio"
                      name="att"
                      value="no"
                      checked={formData.attending === 'no'}
                      onChange={() => setFormData({ ...formData, attending: 'no' })}
                    />
                    معتذر عن الحضور
                  </label>
                </div>

                <div className="velvet-chips">
                  <button type="button" onClick={() => handleAddChip('ألف مبروك 🤍')}>
                    ألف مبروك 🤍
                  </button>
                  <button type="button" onClick={() => handleAddChip('ربنا يتمم بخير ✨')}>
                    ربنا يتمم بخير ✨
                  </button>
                  <button type="button" onClick={() => handleAddChip('بالرفاء والبنين 💍')}>
                    بالرفاء والبنين 💍
                  </button>
                </div>

                <textarea
                  rows={3}
                  maxLength={400}
                  placeholder="اكتب تهنئتك للعروسين..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />

                {formError && <p className="velvet-err">{formError}</p>}

                <button className="velvet-btn wine-b" type="submit">
                  تأكيد الرد
                </button>
              </form>
            ) : (
              <div className="velvet-ok on">
                <b>شكرًا لكم 🤍</b>
                <p className="sub">
                  {formData.attending === 'yes'
                    ? 'تم تسجيل حضوركم بنجاح، ونسعد برؤيتكم قريباً!'
                    : 'وصلتنا رسالتكم الكريمة، وسنفتقدكم بكل تأكيد.'}
                </p>
              </div>
            )}

            {/* Wishes Wall */}
            <div className="velvet-wall">
              {wishes.slice(0, visibleWishesCount).map((item, idx) => (
                <div key={idx} className="velvet-wish">
                  <b>{item.name}</b>
                  <p>{item.message}</p>
                </div>
              ))}

              {wishes.length > visibleWishesCount && (
                <button
                  type="button"
                  className="velvet-more"
                  onClick={() => setVisibleWishesCount((prev) => prev + 5)}
                >
                  عرض المزيد من التهاني ({wishes.length - visibleWishesCount})
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Ceremonial Closing Card */}
        <section className="velvet-fin velvet-section">
          <div className="velvet-fin-in velvet-rv in">
            <img className="velvet-fin-seal" src="/img/velvet/seal.webp" alt="" aria-hidden="true" />
            <img className="velvet-fin-fl a" src="/img/velvet/flowers.webp" alt="" aria-hidden="true" />
            <img className="velvet-fin-fl b" src="/img/velvet/flowers.webp" alt="" aria-hidden="true" />
            
            <p className="velvet-fin-t">Thank you for sharing our joy</p>
            <div className="velvet-fin-o" aria-hidden="true">
              <i />
              <b>◆</b>
              <i />
            </div>

            <p className="velvet-fin-v">
              وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا
              <br />
              لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
            </p>

            <p className="velvet-fin-e" dir="ltr">
              “And among His signs is that He created for you mates,
              <br />
              that you may find tranquility in them,
              <br />
              and He placed between you affection and mercy.”
            </p>

            <div className="velvet-fin-o" aria-hidden="true">
              <i />
              <b>◆</b>
              <i />
            </div>

            <p className="velvet-fin-w" dir="ltr">With love, we await you</p>
            <p className="velvet-fin-n" dir="ltr">
              <span>Abdelrahman</span>
              <i>&amp;</i>
              <span>Aya</span>
            </p>
          </div>
        </section>

        <footer className="velvet-footer">
          صُممت بحب في <Link to="/">وِصال</Link>
        </footer>
      </main>

      {/* Floating Music Toggle Button */}
      {isOpen && (
        <button
          type="button"
          className="velvet-mus"
          onClick={toggleAudio}
          aria-label={isPlaying ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 5 6 9H3v6h3l5 4z" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 5 6 9H3v6h3l5 4z" />
              <line x1="22" y1="9" x2="16" y2="15" />
              <line x1="16" y1="9" x2="22" y2="15" />
            </svg>
          )}
        </button>
      )}

      {/* Floating Order / Customize Pill */}
      {isOpen && (
        <a
          href="https://wa.me/201112194828?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%20%D9%88%D9%8F%D8%B5%D8%A7%D9%84%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%AA%D8%B5%D9%85%D9%8A%D9%85%20%D8%AF%D8%B9%D9%88%D8%A9%20%D8%A5%D9%84%D9%83%D8%AA%D8%B1%D9%88%D9%86%D9%8A%D8%A9%20%D8%A8%D9%86%D9%81%D8%B3%20%D9%81%D8%AE%D8%A7%D9%85%D8%A9%20%D9%82%D8%A7%D9%84%D8%A8%20Velvet"
          target="_blank"
          rel="noopener noreferrer"
          className="velvet-dock-order"
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
