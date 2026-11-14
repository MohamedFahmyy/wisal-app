import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CalendarDays,
  MapPin,
  Music2,
  Volume2,
  VolumeX,
  Share2,
  CheckCircle2,
  Smartphone,
  ShieldCheck,
  ArrowUpLeft,
  Heart,
  FileDown
} from '../utils/icons';
import { globalAudio } from '../utils/audio';
import { generateICS } from '../utils/calendar';
import { CountdownSection } from '../components/invitation/CountdownSection';
import { translations } from '../utils/localization';

export default function FeaturesPage() {
  const [testPlaying, setTestPlaying] = useState(false);
  const [testGuest, setTestGuest] = useState('أحمد');
  const [testLang, setTestLang] = useState('ar');

  useEffect(() => {
    document.title = 'مميزات منصة وِصال — تفاصيل استثنائية';
    return () => globalAudio.stop();
  }, []);

  const toggleTestAudio = () => {
    globalAudio.toggle('', (playing) => {
      setTestPlaying(playing);
    });
  };

  const sampleInvite = {
    slug: 'demo-feature',
    people: { firstPerson: 'محمد', secondPerson: 'سلمى' },
    event: { title: 'حفل زفاف العمر', date: '2026-11-30', time: '19:00' },
    venue: { name: 'قاعة جويا', address: 'القاهرة، مصر', mapUrl: 'https://maps.google.com' }
  };

  return (
    <main className="features-page-main">
      {/* Page Header */}
      <section className="page-hero-header">
        <div className="page-hero-container">
          <div className="hero-eyebrow-pill">
            <Sparkles size={14} className="sparkle-gold" />
            <span>A THOUGHTFUL DIGITAL EXPERIENCE</span>
          </div>

          <h1 className="page-hero-title">
            تفاصيل استثنائية،
            <br />
            <em>لصنع ذكرى تدوم.</em>
          </h1>
          <p className="page-hero-description">
            كل عنصر في دعوات وِصال صُمم بعناية فائقة ليمزج بين فخامة بطاقات الطباعة الفاخرة
            وسهولة وسرعة التقنية الحديثة.
          </p>
        </div>
      </section>

      {/* Deep-Dive Interactive Features Showcase */}
      <section className="features-showcase-section">
        <div className="features-showcase-container">
          {/* Feature 1: Opening Animations */}
          <article className="feature-deep-card">
            <div className="feature-deep-content">
              <span className="feature-step-tag">01 • لحظة الانطباع الأول</span>
              <h2>حركات فتح ثلاثية الأبعاد فريدة</h2>
              <p>
                لا تشبه وِصال بطاقات الصور الثابتة. صممنا 12 آلية فتح مختلفة: من كسر ختم الشمع الملكي،
                إلى فتح بوابات القصر الحديدية المزخرفة، وفتح علبة المجوهرات المخملية، إلى فك أربطة الهدايا.
              </p>
              <ul className="feature-bullet-list">
                <li>حركة سلسة ومحسنة للأجهزة المحمولة بدون استهلاك للمعالج.</li>
                <li>تفاعل باللمس يشعر الضيف بالخصوصية والاهتمام.</li>
                <li>تصميم مختلف لكل مناسبة (زفاف، خطوبة، كتب كتاب، عيد ميلاد).</li>
              </ul>
              <Link to="/demos" className="btn-feature-try">
                <span>جرّب حركات الفتح في الديموز</span>
                <ArrowUpLeft size={16} />
              </Link>
            </div>
            <div className="feature-deep-visual visual-envelope">
              <div className="demo-wax-preview">
                <div className="demo-seal">و</div>
                <span>المس لفتح التجربة</span>
              </div>
            </div>
          </article>

          {/* Feature 2: Accurate Live Countdown */}
          <article className="feature-deep-card reverse">
            <div className="feature-deep-content">
              <span className="feature-step-tag">02 • ترقب ولحظات حماس</span>
              <h2>عداد تنازلي لحظي مباشر</h2>
              <p>
                يزيد من حماس المدعوين يوماً بيوم وساعة بساعة حتى لحظة اللقاء. يعتمد على حساب زمني دقيق
                مرتبط بالتوقيت المحلي للمدينة دون تأثر بفروق توقيت أجهزة الضيوف.
              </p>
              <div className="interactive-demo-widget">
                <span className="widget-label">معاينة تفاعلية حية للعداد:</span>
                <CountdownSection
                  eventDate="2026-11-30"
                  eventTime="19:00"
                  timezone="Africa/Cairo"
                  t={translations.ar}
                />
              </div>
            </div>
            <div className="feature-deep-visual visual-clock">
              <div className="clock-symbol-art">⏳</div>
            </div>
          </article>

          {/* Feature 3: Venue & Map Integration */}
          <article className="feature-deep-card">
            <div className="feature-deep-content">
              <span className="feature-step-tag">03 • سهولة وصول المعازيم</span>
              <h2>تكامل مباشر مع خرائط Google</h2>
              <p>
                تجنبوا الأسئلة المتكررة والاتصالات وقت الحفل. تتضمن الدعوة اسم القاعة وعنوانها بالتفصيل
                مع زرين واضحين: الأول لفتح الموقع على الخريطة، والثاني لاستخراج اتجاهات القيادة مباشرة.
              </p>
              <ul className="feature-bullet-list">
                <li>فتح فوري في تطبيق Google Maps أو Apple Maps.</li>
                <li>تحديد مسار الملاحة بضغطة زر واحدة من موقع الضيف الحالي.</li>
                <li>إمكانية إضافة اسم القاعة ورقم البوابة لتسهيل الاستقبال.</li>
              </ul>
            </div>
            <div className="feature-deep-visual visual-map">
              <div className="map-pin-mockup">
                <MapPin size={42} className="map-pin-icon" />
                <span className="map-venue-label">قاعة جويا — التجمع الخامس</span>
              </div>
            </div>
          </article>

          {/* Feature 4: Romantic Ambient Music */}
          <article className="feature-deep-card reverse">
            <div className="feature-deep-content">
              <span className="feature-step-tag">04 • لمسة الأجواء الشاعرية</span>
              <h2>مشغل موسيقى رومانسي ذكي</h2>
              <p>
                أصوات البيانو والهارب المهدئة تضفي بعداً عاطفياً على الدعوة. يعتمد مشغلنا على تقنية Web Audio
                فائقة الجودة تعمل بدون انقطاع أو انتظار تحميل ملفات خارجية.
              </p>
              <div className="interactive-demo-widget">
                <span className="widget-label">جرّب صوت مقطوعة وِصال الآن:</span>
                <button onClick={toggleTestAudio} className="btn-test-sound">
                  {testPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
                  <span>{testPlaying ? 'إيقاف المقطوعة' : 'تشغيل مقطوعة البيانو والهارب'}</span>
                </button>
              </div>
            </div>
            <div className="feature-deep-visual visual-music">
              <div className="music-notes-art">
                <Music2 size={48} />
                <div className="soundwaves">
                  <span /><span /><span /><span />
                </div>
              </div>
            </div>
          </article>

          {/* Feature 5: Native Calendar Integration (.ics) */}
          <article className="feature-deep-card">
            <div className="feature-deep-content">
              <span className="feature-step-tag">05 • لا يفوتهم الموعد</span>
              <h2>إضافة الموعد للتقويم الشخصي</h2>
              <p>
                بضغطة زر، يحمّل الضيف ملف تقويم قياسي (.ics) يضيف المناسبة بتفاصيلها وتنبيهاتها إلى تقويم هاتف
                iPhone أو Android أو Google Calendar مباشرة.
              </p>
              <button onClick={() => generateICS(sampleInvite)} className="btn-test-calendar">
                <FileDown size={18} />
                <span>جرّب تحميل ملف التقويم (.ics)</span>
              </button>
            </div>
            <div className="feature-deep-visual visual-calendar">
              <CalendarDays size={48} />
            </div>
          </article>

          {/* Feature 6: Personalized Guest Name Links */}
          <article className="feature-deep-card reverse">
            <div className="feature-deep-content">
              <span className="feature-step-tag">06 • تقدير شخصي فاخر</span>
              <h2>روابط مخصصة باسم كل ضيف</h2>
              <p>
                عبر إضافة اسم الضيف في نهاية الرابط (مثل: <code>?to=أحمد</code>)، يتم استقبال الضيف بترحيب
                شخصي راقٍ: <b>«عزيزنا أحمد، يسعدنا حضوركم»</b>، مما يعطي انطباعاً فائق الاهتمام والتقدير.
              </p>
              <div className="interactive-demo-widget">
                <span className="widget-label">جرّب كتابة أي اسم لرؤية النتيجة:</span>
                <input
                  type="text"
                  value={testGuest}
                  onChange={(e) => setTestGuest(e.target.value)}
                  placeholder="اكتب اسم الضيف..."
                  className="test-guest-input"
                />
                <div className="test-guest-preview">
                  <Heart size={14} fill="#a7835d" color="#a7835d" />
                  <span>عزيزنا <b>{testGuest || 'الضيف الكريم'}</b>، يشرفنا حضوركم ومشاركتنا فرحتنا.</span>
                </div>
              </div>
            </div>
            <div className="feature-deep-visual visual-guest">
              <span className="guest-badge-glyph">💌</span>
            </div>
          </article>
        </div>
      </section>

      {/* Final Action Banner */}
      <section className="features-bottom-cta">
        <div className="features-bottom-container">
          <h2>جاهزون لاختيار تصميمكم المفضل؟</h2>
          <p>تصفحوا كافة القوالب وعيشوا تجربة كل دعوة بالكامل الآن.</p>
          <Link to="/demos" className="btn-hero-primary">
            <span>انتقل لمعرض التصميمات</span>
            <ArrowUpLeft size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
