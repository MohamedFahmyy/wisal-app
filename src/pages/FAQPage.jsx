import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Minus,
  Search,
  X,
  WhatsAppIcon,
  ArrowUpLeft,
  MessageCircle
} from '../utils/icons';
import { faqs } from '../data/faqs';

export default function FAQPage() {
  const [activeAccordion, setActiveAccordion] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = 'الأسئلة الشائعة — وِصال';
  }, []);

  const filteredFaqs = faqs.filter((f) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
  });

  return (
    <main className="faq-page-main">
      {/* Page Header */}
      <section className="page-hero-header">
        <div className="page-hero-container">
          <div className="hero-eyebrow-pill">
            <Sparkles size={14} className="sparkle-gold" />
            <span>EVERYTHING YOU NEED TO KNOW</span>
          </div>

          <h1 className="page-hero-title">
            عندكم أي سؤال؟
            <br />
            <em>إجاباتنا بكل وضوح.</em>
          </h1>
          <p className="page-hero-description">
            جمعنا لكم أهم الاستفسارات الشائعة حول كيفية عمل الدعوات، خطوات التخصيص،
            التوافق مع أجهزة الموبايل، وخيارات المشاركة عبر واتساب.
          </p>
        </div>
      </section>

      {/* Search Input Bar */}
      <section className="faq-search-section">
        <div className="faq-search-container">
          <div className="faq-search-input-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في الأسئلة الشائعة (مثال: موسيقى، تقويم، واتساب)..."
              className="faq-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="clear-search-btn"
                aria-label="مسح البحث"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Accordion List */}
      <section className="faq-content-section">
        <div className="faq-content-container">
          {filteredFaqs.length > 0 ? (
            <div className="faq-cards-stack">
              {filteredFaqs.map((faq, index) => {
                const isOpen = activeAccordion === index;
                return (
                  <article
                    className={`faq-full-card ${isOpen ? 'is-active-accordion' : ''}`}
                    key={index}
                  >
                    <button
                      className="faq-card-question"
                      onClick={() => setActiveAccordion(isOpen ? -1 : index)}
                      aria-expanded={isOpen}
                    >
                      <span className="faq-question-text">{faq.question}</span>
                      <span className="faq-status-icon">
                        {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="faq-card-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="faq-no-results">
              <p>لم نجد إجابة مطابقة لكلمة البحث الحالية.</p>
              <button onClick={() => setSearchQuery('')} className="btn-reset-filters">
                عرض كافة الأسئلة
              </button>
            </div>
          )}

          {/* Still Have Questions Box */}
          <div className="faq-contact-card">
            <div className="contact-card-icon">
              <MessageCircle size={32} />
            </div>
            <div className="contact-card-info">
              <h3>هل لديكم استفسار آخر أو فكرة مخصصة؟</h3>
              <p>فريق وِصال يسعده الإجابة على كافة تفاصيلكم ومساعدتكم في اختيار التصميم الأنسب.</p>
            </div>
            <a
              href="https://wa.me/201112194828?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%88%D9%90%D8%B5%D8%A7%D9%84%D8%8C%20%D9%84%D8%AF%D9%8A%20%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%AD%D9%88%D9%84%20%D8%AE%D8%AF%D9%85%D8%A9%20%D8%A7%D9%84%D8%AF%D8%B9%D9%88%D8%A7%D8%AA"
              target="_blank"
              rel="noreferrer"
              className="btn-faq-whatsapp"
            >
              <WhatsAppIcon size={18} />
              <span>تحدث معنا عبر واتساب</span>
              <ArrowUpLeft size={16} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
