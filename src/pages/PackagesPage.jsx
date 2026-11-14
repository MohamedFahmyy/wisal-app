import React, { useEffect } from 'react';
import {
  Sparkles,
  Check,
  ArrowUpLeft,
  WhatsAppIcon,
  ShieldCheck,
  Heart
} from '../utils/icons';
import { packages } from '../data/packages';

export default function PackagesPage() {
  useEffect(() => {
    document.title = 'باقات وأسعار الدعوات — وِصال';
  }, []);

  return (
    <main className="packages-page-main">
      {/* Page Header */}
      <section className="page-hero-header">
        <div className="page-hero-container">
          <div className="hero-eyebrow-pill">
            <Sparkles size={14} className="sparkle-gold" />
            <span>TRANSPARENT & TAILORED OPTIONS</span>
          </div>

          <h1 className="page-hero-title">
            باقات مصممة
            <br />
            <em>لتناسب تطلعاتكم.</em>
          </h1>
          <p className="page-hero-description">
            سواء كنتم تبحثون عن دعوة أنيقة وسريعة من مجموعتنا الجاهزة، أو تجربة حصرية تُبنى
            بالكامل من الصفر لفكرتكم الخاصة، لدينا الباقة المثالية ليومكم.
          </p>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="packages-cards-section">
        <div className="packages-cards-container">
          <div className="packages-three-col-grid">
            {packages.map((pkg) => (
              <article
                className={`full-package-card ${pkg.popular ? 'is-popular-pack' : ''}`}
                key={pkg.id}
              >
                {pkg.popular && (
                  <div className="popular-top-badge">
                    <Sparkles size={13} />
                    <span>الباقة الأكثر طلباً</span>
                  </div>
                )}

                <div className="pack-header-block">
                  <span className="pack-arabic-name">{pkg.nameAr}</span>
                  <h2 className="pack-english-name">{pkg.name}</h2>
                  <p className="pack-tagline-text">{pkg.tagline}</p>
                </div>

                <div className="pack-price-block">
                  <span className="pack-price-amount">{pkg.price}</span>
                  {pkg.currency && <span className="pack-currency-label">{pkg.currency}</span>}
                  <span className="pack-period-sub">{pkg.period}</span>
                </div>

                <p className="pack-full-description">{pkg.description}</p>

                <div className="pack-features-header">
                  <span>ما تشمله الباقة:</span>
                </div>

                <ul className="pack-features-list">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx}>
                      <span className="feat-check-wrap">
                        <Check size={15} />
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={`https://wa.me/201000000000?text=${encodeURIComponent(pkg.whatsappMessage)}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`btn-pack-order ${pkg.popular ? 'btn-gold-pack' : 'btn-outline-pack'}`}
                >
                  <WhatsAppIcon size={17} />
                  <span>{pkg.ctaText}</span>
                  <ArrowUpLeft size={16} />
                </a>
              </article>
            ))}
          </div>

          {/* Pricing Disclaimer */}
          <div className="pricing-disclaimer-card">
            <ShieldCheck size={18} className="disclaimer-icon" />
            <div className="disclaimer-text">
              <h4>ملاحظة حول الأسعار والخدمة:</h4>
              <p>
                الأسعار المعروضة أعلاه استرشادية وقابلة للتخصيص بحسب متطلبات المناسبة والإضافات المختارة.
                التطبيق الحالي يعمل كواجهة أمامية تفاعلية بالكامل (Frontend Demonstration) دون حفظ
                بيانات سرية للزوار. للتأكيد النهائي والحجز، يتم التواصل مباشرة مع فريق العمل عبر واتساب.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Matrix Table */}
      <section className="packages-matrix-section">
        <div className="matrix-container">
          <div className="section-center-head">
            <span className="section-eyebrow">DETAILED COMPARISON</span>
            <h2 className="section-heading-title">جدول مقارنة مميزات الباقات</h2>
          </div>

          <div className="matrix-table-wrap">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th>الميزة</th>
                  <th>Essential (الأساسية)</th>
                  <th className="th-highlight">Signature (سيجنتشر)</th>
                  <th>Bespoke (تصميم خاص)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>اختيار قالب من معرض الـ 12 تصميماً</td>
                  <td>✓</td>
                  <td className="td-highlight">✓</td>
                  <td>✓ (أو فكرة جديدة كلياً)</td>
                </tr>
                <tr>
                  <td>تخصيص الأسماء والتواريخ والموقع</td>
                  <td>✓</td>
                  <td className="td-highlight">✓</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td>تكامل خرائط Google والتقويم (.ics)</td>
                  <td>✓</td>
                  <td className="td-highlight">✓</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td>دعم لغتين (عربي RTL وإنجليزي LTR)</td>
                  <td>—</td>
                  <td className="td-highlight">✓</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td>مشغل موسيقى رومانسي ذكي</td>
                  <td>—</td>
                  <td className="td-highlight">✓</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td>روابط مخصصة باسم كل ضيف (?to=Name)</td>
                  <td>—</td>
                  <td className="td-highlight">✓</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td>معرض صور عالي الدقة (Photo Gallery)</td>
                  <td>—</td>
                  <td className="td-highlight">✓</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td>تصميم حركة فتح مخصصة من الصفر</td>
                  <td>—</td>
                  <td className="td-highlight">—</td>
                  <td>✓ (حصري)</td>
                </tr>
                <tr>
                  <td>ربط دومين ونطاق خاص بالمناسبة</td>
                  <td>—</td>
                  <td className="td-highlight">—</td>
                  <td>اختياري</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
