import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpLeft,
  Sparkles,
  Heart,
  Play,
  CalendarDays,
  MapPin,
  Music2,
  Share2,
  Check,
  CheckCircle2,
  Plus,
  Minus,
  Smartphone,
  ShieldCheck,
  Star,
  Gift
} from '../../utils/icons';
import { invitations } from '../../data/invitations';
import { packages } from '../../data/packages';
import { faqs } from '../../data/faqs';
import { testimonials } from '../../data/testimonials';
import { InvitationCard } from '../gallery/InvitationCard';

/* =========================================================================
   1. HERO SECTION
   ========================================================================= */
export function HeroSection() {
  const [heroCardOpened, setHeroCardOpened] = useState(false);

  return (
    <section className="landing-hero-section">
      <div className="hero-mesh-glow" aria-hidden="true" />
      <div className="hero-orbit orbit-outer" aria-hidden="true" />
      <div className="hero-orbit orbit-inner" aria-hidden="true" />

      <div className="landing-hero-container">
        {/* Left / Right Hero Copy */}
        <div className="hero-content-col">
          <div className="hero-eyebrow-pill">
            <Sparkles size={14} className="sparkle-gold" />
            <span>دعوات رقمية بتفاصيل استثنائية</span>
          </div>

          <h1 className="hero-main-title">
            مش مجرد دعوة…
            <br />
            <em className="hero-title-italic">دي أول لحظة</em>
            <br />
            في حكايتكم.
          </h1>

          <p className="hero-lead-paragraph">
            حوّلوا رابط الدعوة العادي إلى تجربة تفاعلية ساحرة تأسر قلوب ضيوفكم من أول لمسة.
            ختم شمع ملكي، بوابات تفتح، موسيقى هادئة، وموقع القاعة بضغطة زر واحدة.
          </p>

          <div className="hero-cta-group">
            <Link to="/demos" className="btn-hero-primary">
              <span>استكشف التصميمات</span>
              <ArrowUpLeft size={18} />
            </Link>

            <a href="#how" className="btn-hero-secondary">
              <span className="play-badge">
                <Play size={12} fill="currentColor" />
              </span>
              <span>شاهد كيف تعمل</span>
            </a>
          </div>

          <div className="hero-trust-badge">
            <div className="trust-avatar-stack">
              <span className="avatar-chip">م</span>
              <span className="avatar-chip">س</span>
              <span className="avatar-chip">♡</span>
            </div>
            <div className="trust-text">
              <div className="trust-stars">★★★★★</div>
              <span>صُممت لتناسب أرقى حفلات الزفاف والمناسبات</span>
            </div>
          </div>
        </div>

        {/* Visual Interactive Preview Card */}
        <div className="hero-visual-col">
          <div
            className={`hero-interactive-card ${heroCardOpened ? 'is-opened' : ''}`}
            onClick={() => setHeroCardOpened(!heroCardOpened)}
            title="انقر لفتح الدعوة التفاعلية"
          >
            <div className="hero-card-sheen" />
            <div className="hero-ribbon-silk">
              <span>W</span>
            </div>

            <div className="hero-card-front">
              <span className="card-kicker">TOGETHER WITH THEIR FAMILIES</span>
              <div className="card-monogram-emblem">❦</div>
              <h2 className="card-couple-names">
                محمد <i>&</i> سلمى
              </h2>
              <span className="card-event-date">30 • 11 • 2026</span>
              <div className="card-hairline-rule" />
              <p className="card-short-note">يشرفنا حضوركم ومشاركتنا أسعد اللحظات</p>

              <div className="hero-card-seal-wrap">
                <div className="hero-wax-seal">و</div>
                <span className="seal-tooltip">
                  {heroCardOpened ? 'انقر للإغلاق' : 'انقر لفتح التجربة'}
                </span>
              </div>
            </div>

            {/* Revealed inner details */}
            <div className="hero-card-interior">
              <span className="inner-date">الإثنين، 30 نوفمبر 2026 — 7:00 مساءً</span>
              <span className="inner-venue">📍 Joya Banquet Hall — القاهرة</span>
              <div className="inner-countdown">
                <span>16 <small>يوم</small></span>
                <span>08 <small>ساعة</small></span>
                <span>42 <small>دقيقة</small></span>
              </div>
              <Link to="/invite/mohamed-salma" className="btn-hero-card-open" onClick={(e) => e.stopPropagation()}>
                <span>افتح التجربة الكاملة</span>
                <ArrowUpLeft size={14} />
              </Link>
            </div>
          </div>

          <div className="hero-floating-pill pill-top">
            <Heart size={14} fill="#a87570" color="#a87570" />
            <span>لحظة تليق بأجمل يوم</span>
          </div>

          <div className="hero-floating-pill pill-bottom">
            <Sparkles size={14} color="#a7835d" />
            <span>{invitations.length} تجربة فتح فريدة</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   2. INTRO CRAFT STRIP
   ========================================================================= */
export function IntroStrip() {
  return (
    <section className="intro-strip-section">
      <div className="intro-strip-container">
        <div className="intro-quote-side">
          <span className="intro-eyebrow">THE ART OF INVITING</span>
          <h2>
            لأن التفاصيل الاستثنائية
            <br />
            <em>هي اللي بتفضل في الذاكرة.</em>
          </h2>
        </div>
        <div className="intro-text-side">
          <p>
            من أول ما الضيف يلمس الشاشة لكسر ختم الشمع، لحد ما يشوف العداد التنازلي واللوكيشن
            ويسمع الموسيقى — بنصمم تجربة حسية كاملة تحكي قصة حبكم وتليق بضيوفكم.
          </p>
          <div className="craft-signature">وِصال • التفاصيل تصنع الفارق</div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   3. FEATURED INVITATION DESIGNS
   ========================================================================= */
export function FeaturedDesignsSection() {
  const featured = invitations.slice(0, 6);

  return (
    <section className="featured-designs-section">
      <div className="section-header-wrap">
        <div className="section-title-col">
          <span className="section-eyebrow">THE SIGNATURE COLLECTION</span>
          <h2 className="section-heading-title">كل مناسبة… وليها حكاية خاصة</h2>
          <p className="section-lead-subtitle">
            استكشفوا مجموعة مختارة من أحدث تصميمات وِصال. كل تصميم يقدم تجربة فتح فريدة تعكس روح الحفل.
          </p>
        </div>

        <Link to="/demos" className="btn-view-all-demos">
          <span>شاهد كل التصميمات ({invitations.length} قالب)</span>
          <ArrowUpLeft size={17} />
        </Link>
      </div>

      <div className="featured-cards-grid">
        {featured.map((item) => (
          <InvitationCard key={item.slug} item={item} />
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   4. HOW IT WORKS (4 Clear Steps)
   ========================================================================= */
export function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      title: 'اختاروا التصميم الأقرب لقلبكم',
      desc: 'تصفحوا معرض وِصال واختاروا حركة الفتح والتصميم البصري اللي يعكس هوية يومكم.'
    },
    {
      num: '02',
      title: 'شاركوا تفاصيلكم الخاصة',
      desc: 'الأسماء، تاريخ الحفل، موعد الزفة، موقع القاعة على الخريطة، ولمستكم الموسيقية.'
    },
    {
      num: '03',
      title: 'راجعوا الدعوة وعيشوا التجربة',
      desc: 'نعرض عليكم رابط المعاينة التفاعلي لطلب أي تعديلات حتى نصل لأعلى درجات الإتقان.'
    },
    {
      num: '04',
      title: 'شاركوا الرابط مع أحبابكم',
      desc: 'استلموا رابط الدعوة المخصص وابعثوه لكل المعازيم على واتساب بضغطة زر واحدة.'
    }
  ];

  return (
    <section className="how-it-works-section" id="how">
      <div className="how-container">
        <div className="section-center-head">
          <span className="section-eyebrow">EFFORTLESS JOURNEY</span>
          <h2 className="section-heading-title">من الفكرة لأول ضيف في 4 خطوات بسيطة</h2>
          <p className="section-lead-subtitle">
            خلّوا التفاصيل التقنية علينا، وركزوا إنتوا في بهجة التجهيز ليومكم الكبير.
          </p>
        </div>

        <div className="steps-cards-grid">
          {steps.map((step) => (
            <div className="step-card" key={step.num}>
              <span className="step-number-badge">{step.num}</span>
              <h3 className="step-card-title">{step.title}</h3>
              <p className="step-card-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   5. PLATFORM FEATURES
   ========================================================================= */
export function FeaturesOverviewSection() {
  const featureList = [
    {
      icon: Sparkles,
      title: 'لحظة فتح تفاعلية لا تُنسى',
      desc: 'كسر ختم الشمع، فتح بوابات القصر، أو فتح علبة المجوهرات بحركة ثلاثية الأبعاد سلسة.'
    },
    {
      icon: CalendarDays,
      title: 'عداد تنازلي لحظي مباشر',
      desc: 'يحسب الأيام والساعات والدقائق والثواني بدقة متناهية وفق التوقيت المحلي للمناسبة.'
    },
    {
      icon: MapPin,
      title: 'موقع القاعة بضغطة واحدة',
      desc: 'زر مباشر يفتح خرائط Google مع إمكانية استخراج مسار الاتجاهات من موقع الضيف.'
    },
    {
      icon: CheckCircle2,
      title: 'تأكيد حضور تفاعلي (RSVP)',
      desc: 'نموذج واضح يمكّن الضيف من تحديد حضوره وعدد الأفراد المرفقين برسالة تهنئة رقيقة.'
    },
    {
      icon: Music2,
      title: 'مشغل موسيقى رومانسي',
      desc: 'موسيقى هادئة تعزف بنعومة مع بدء التفاعل، مع تحكم كامل للزائر في التشغيل والإيقاف.'
    },
    {
      icon: CalendarDays,
      title: 'إضافة فورية للتقويم (.ics)',
      desc: 'تحميل ملف تقويم قياسي يتوافق مع Apple Calendar و Google Calendar و Outlook.'
    },
    {
      icon: Share2,
      title: 'دعوة مخصصة باسم كل ضيف',
      desc: 'إمكانية إرسال روابط شخصية تظهر اسم كل ضيف (عزيزنا أحمد) لشعور استثنائي بالتقدير.'
    },
    {
      icon: Smartphone,
      title: 'مصممة خصيصاً للموبايل',
      desc: 'متوافقة 100% مع كافة الشاشات، تفتح مباشرة من رسائل واتساب بدون أي تطبيق.'
    }
  ];

  return (
    <section className="features-overview-section">
      <div className="features-container">
        <div className="section-center-head">
          <span className="section-eyebrow">INTELLIGENT ELEGANCE</span>
          <h2 className="section-heading-title">كل ما يحتاجه ضيوفكم في شاشة واحدة</h2>
          <p className="section-lead-subtitle">
            نجمع بين جمال المظهر ودقة الوظائف العملية لتسهيل حضور ومشاركة كل مدعو.
          </p>
        </div>

        <div className="features-mosaic-grid">
          {featureList.map((f, i) => (
            <article className="feature-mosaic-card" key={i}>
              <div className="feature-icon-circle">
                <f.icon size={22} />
              </div>
              <span className="feature-order-num">0{i + 1}</span>
              <h3 className="feature-mosaic-title">{f.title}</h3>
              <p className="feature-mosaic-desc">{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   6. WHY WISAL SECTION (Comparison)
   ========================================================================= */
export function WhyWisalSection() {
  const comparisons = [
    {
      aspect: 'انطباع الضيف الأول',
      traditional: 'صورة عادية أو ملف PDF يضيع بين المحادثات',
      wisal: 'تجربة تفاعلية مبهرة مع ختم شمع وموسيقى هادئة'
    },
    {
      aspect: 'الوصول للقاعة واللوكيشن',
      traditional: 'إرسال لوكيشن منفصل يسبب حيرة وخلط في العناوين',
      wisal: 'زر خرائط Google مباشر ومدمج بالدعوة مع الاتجاهات'
    },
    {
      aspect: 'تأكيد الحضور (RSVP)',
      traditional: 'مكالمات ورسائل متفرقة وصعوبة حصر الأعداد',
      wisal: 'نموذج تفاعلي منظم يحدد الحضور وعدد الأفراد'
    },
    {
      aspect: 'حفظ الموعد',
      traditional: 'ينسى المعازيم التاريخ مع زحام المشاغل اليومية',
      wisal: 'زر ذكي يضيف الحفل إلى تقويم الهاتف بضغطة واحدة'
    },
    {
      aspect: 'التخصيص الشخصي',
      traditional: 'دعوة عامة بنفس الصيغة لجميع الناس',
      wisal: 'رابط خاص باسم كل ضيف (عزيزنا فلان) لتقدير راقٍ'
    }
  ];

  return (
    <section className="why-wisal-section">
      <div className="why-wisal-container">
        <div className="section-center-head">
          <span className="section-eyebrow">THE WISAL DIFFERENCE</span>
          <h2 className="section-heading-title">ليه تختاروا وِصال بدلاً من الدعوات التقليدية؟</h2>
          <p className="section-lead-subtitle">
            مقارنة بسيطة توضح كيف تحوّل وِصال دعوتكم من مجرد إشعار عابر إلى ذكرى لا تُنسى.
          </p>
        </div>

        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>الميزة</th>
                <th className="th-muted">البطاقات والصور التقليدية</th>
                <th className="th-wisal">تجربة وِصال الرقمية</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, idx) => (
                <tr key={idx}>
                  <td className="td-aspect">{row.aspect}</td>
                  <td className="td-traditional">{row.traditional}</td>
                  <td className="td-wisal">
                    <span className="wisal-check-bullet">
                      <Check size={14} />
                    </span>
                    <span>{row.wisal}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   7. TESTIMONIALS SECTION (Sample labeled)
   ========================================================================= */
export function TestimonialsSection() {
  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <div className="section-center-head">
          <span className="section-eyebrow">ILLUSTRATIVE EXAMPLES • نماذج استرشادية وتوضيحية</span>
          <h2 className="section-heading-title">نماذج توضيحية لتجارب وانطباعات الضيوف</h2>
          <p className="section-lead-subtitle">
            (قسم استرشادي توضيحي): نماذج افتراضية تحاكي انطباعات العرسان والمعازيم وتجسد التأثير المتوقع لتجربة دعوات وِصال التفاعلية، تم تصنيفها كأمثلة توضيحية التزاماً بالشفافية والمصداقية.
          </p>
        </div>

        <div className="testimonials-cards-grid">
          {testimonials.map((t) => (
            <article className="testimonial-card" key={t.id}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', background: '#f6ede0', color: '#8a6229', padding: '2px 8px', borderRadius: '6px', marginBottom: '10px', fontWeight: 600 }}>
                <span>نموذج استرشادي</span>
              </div>
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">«{t.quote}»</p>
              <div className="testimonial-author">
                <span className="author-names">{t.names}</span>
                <span className="author-event">{t.event} — {t.city}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="testimonials-disclaimer">
          <ShieldCheck size={14} />
          <span>شفافية المحتوى: الآراء المعروضة أعلاه نماذج استرشادية توضيحية تحاكي تفاعل الضيوف ولا تُمثل شهادات عملاء حية دون إذن رسمي مسبق.</span>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   8. PACKAGES PREVIEW SECTION
   ========================================================================= */
export function PackagesPreviewSection() {
  return (
    <section className="packages-preview-section">
      <div className="packages-container">
        <div className="section-center-head">
          <span className="section-eyebrow">🔥 عرض خاص — خصم 50% على جميع الباقات</span>
          <h2 className="section-heading-title">باقات وِصال المصممة على ذوقكم</h2>
          <p className="section-lead-subtitle">
            اختاروا الباقة المناسبة ليومكم بنصف السعر لفترة محدودة، مع إمكانية الترقية وإضافة اللمسات الخاصة.
          </p>
        </div>

        <div className="packages-preview-grid">
          {packages.map((pkg) => (
            <article
              className={`package-card-item ${pkg.popular ? 'is-popular' : ''}`}
              key={pkg.id}
            >
              {pkg.popular && (
                <div className="package-popular-ribbon">
                  <Sparkles size={12} />
                  <span>الأكثر اختياراً</span>
                </div>
              )}

              <span className="pkg-subtitle">{pkg.nameAr}</span>
              <h3 className="pkg-title">{pkg.name}</h3>
              <p className="pkg-desc">{pkg.description}</p>

              <div className="pkg-price-row">
                {pkg.originalPrice && (
                  <span className="pkg-original-price">
                    {pkg.originalPrice} {pkg.currency}
                  </span>
                )}
                <span className="pkg-amount">{pkg.price}</span>
                {pkg.currency && <span className="pkg-curr">{pkg.currency}</span>}
                <span className="pkg-period">/ {pkg.period}</span>
                {pkg.discount && (
                  <span className="pkg-discount-badge">{pkg.discount}</span>
                )}
              </div>

              <ul className="pkg-features-list">
                {pkg.features.slice(0, 5).map((feat, i) => (
                  <li key={i}>
                    <Check size={16} className="feat-check" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/packages"
                className={`btn-pkg-action ${pkg.popular ? 'btn-gold' : 'btn-outline-pkg'}`}
              >
                <span>تفاصيل الباقة والطلب</span>
                <ArrowUpLeft size={16} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   9. FAQ PREVIEW SECTION
   ========================================================================= */
export function FAQPreviewSection() {
  const [activeFAQ, setActiveFAQ] = useState(0);
  const previewFAQs = faqs.slice(0, 4);

  return (
    <section className="faq-preview-section">
      <div className="faq-container">
        <div className="section-center-head">
          <span className="section-eyebrow">FREQUENTLY ASKED</span>
          <h2 className="section-heading-title">إجابات على أهم تساؤلاتكم</h2>
          <p className="section-lead-subtitle">
            كل ما يدور في ذهنكم حول استلام الرابط، تشغيل الموسيقى، وتخصيص التفاصيل.
          </p>
        </div>

        <div className="faq-accordion-list">
          {previewFAQs.map((faq, idx) => (
            <article
              className={`faq-item-card ${activeFAQ === idx ? 'is-expanded' : ''}`}
              key={idx}
            >
              <button
                className="faq-question-btn"
                onClick={() => setActiveFAQ(activeFAQ === idx ? -1 : idx)}
                aria-expanded={activeFAQ === idx}
              >
                <span>{faq.question}</span>
                <span className="faq-toggle-icon">
                  {activeFAQ === idx ? <Minus size={18} /> : <Plus size={18} />}
                </span>
              </button>

              {activeFAQ === idx && (
                <div className="faq-answer-pane">
                  <p>{faq.answer}</p>
                </div>
              )}
            </article>
          ))}
        </div>

        <div className="faq-view-all-row">
          <Link to="/faq" className="btn-link-all-faqs">
            <span>عرض كافة الأسئلة الشائعة (8 أسئلة)</span>
            <ArrowUpLeft size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   10. FINAL CTA SECTION
   ========================================================================= */
export function FinalCTASection() {
  return (
    <section className="final-cta-section">
      <div className="final-cta-container">
        <div className="final-cta-flourish">❦</div>
        <span className="final-cta-eyebrow">YOUR STORY, BEAUTIFULLY INVITED</span>
        <h2 className="final-cta-heading">
          جاهزون لتبدأوا
          <br />
          <em>حكايتكم بلمسة استثنائية؟</em>
        </h2>
        <p className="final-cta-lead">
          اختاروا التصميم اللي يلمس قلوبكم، ودعوا وِصال تتولى صياغة أول لحظة في يومكم بأسلوب لا يُنسى.
        </p>

        <div className="final-cta-buttons">
          <Link to="/demos" className="btn-cta-gold">
            <span>تصفحوا التصميمات الآن</span>
            <ArrowUpLeft size={18} />
          </Link>

          <a
            href="https://wa.me/201112194828?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%88%D9%90%D8%B5%D8%A7%D9%84%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AA%D8%B5%D9%85%D9%8A%D9%85%20%D8%AF%D8%B9%D9%88%D8%A9%20%D8%A5%D9%84%D9%83%D8%AA%D8%B1%D9%88%D9%86%D9%8A%D8%A9"
            target="_blank"
            rel="noreferrer"
            className="btn-cta-whatsapp"
          >
            <span>استشرنا عبر واتساب</span>
            <ArrowUpLeft size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
