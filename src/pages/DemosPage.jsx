import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Sparkles, X, Users, Link as LinkIcon, QrCode } from '../utils/icons';
import { invitations } from '../data/invitations';
import { categories } from '../data/categories';
import { InvitationCard } from '../components/gallery/InvitationCard';
import { trackPageView } from '../utils/analytics';

export default function DemosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('cat') || 'all';

  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = `معرض التصميمات (${invitations.length} قالب استثنائي) — وِصال`;
    trackPageView('/demos');
  }, []);

  // Sync category changes with URL query parameter
  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    if (catId === 'all') {
      searchParams.delete('cat');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ cat: catId });
    }
  };

  const filteredInvitations = invitations.filter((inv) => {
    const matchesCat = activeCategory === 'all' || inv.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCat;

    const searchableText = [
      inv.people?.firstPerson,
      inv.people?.secondPerson,
      inv.people?.firstPersonEn,
      inv.people?.secondPersonEn,
      inv.event?.title,
      inv.event?.titleEn,
      inv.categoryLabel,
      inv.categoryLabelEn,
      inv.venue?.name,
      inv.description,
      inv.tag
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return matchesCat && searchableText.includes(q);
  });

  return (
    <main className="gallery-page-main">
      {/* Gallery Page Header */}
      <section className="page-hero-header">
        <div className="page-hero-container">
          <div className="hero-eyebrow-pill">
            <Sparkles size={14} className="sparkle-gold" />
            <span>THE COMPLETE INVITATION GALLERY</span>
          </div>

          <h1 className="page-hero-title">
            اختاروا شكل <em>حكايتكم.</em>
          </h1>
          <p className="page-hero-description">
            {invitations.length} تجربة فتح بصرية مستقلة مصممة بعناية فائقة. كل تصميم له شخصيته المستقلة،
            ألوانه الخاصة، وموسيقاه الهادئة لتليق بأجمل مناسباتكم.
          </p>

          {/* New Tools Quick Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              justifyContent: 'center',
              marginTop: '20px'
            }}
          >
            <Link
              to="/guests"
              style={{
                background: '#fffdf9',
                border: '1px solid #eedec7',
                borderRadius: '999px',
                padding: '7px 16px',
                fontSize: '13px',
                color: '#5a3d1c',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Users size={14} style={{ color: '#87602d' }} />
              لوحة إدارة الضيوف
            </Link>

            <Link
              to="/links"
              style={{
                background: '#fffdf9',
                border: '1px solid #eedec7',
                borderRadius: '999px',
                padding: '7px 16px',
                fontSize: '13px',
                color: '#5a3d1c',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LinkIcon size={14} style={{ color: '#87602d' }} />
              صانع روابط الضيوف
            </Link>

            <Link
              to="/card"
              style={{
                background: '#fffdf9',
                border: '1px solid #eedec7',
                borderRadius: '999px',
                padding: '7px 16px',
                fontSize: '13px',
                color: '#5a3d1c',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <QrCode size={14} style={{ color: '#87602d' }} />
              كروت QR المطبوعة للترابيزات
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Filter & Search Toolbar */}
      <section className="gallery-filter-toolbar">
        <div className="toolbar-container">
          {/* Category Tabs */}
          <div className="category-scroll-tabs" role="tablist" aria-label="أقسام التصميمات">
            {categories.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={activeCategory === c.id}
                className={`category-tab-btn ${activeCategory === c.id ? 'is-active' : ''}`}
                onClick={() => handleCategoryChange(c.id)}
              >
                <span>{c.label}</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم، القاعة، أو المناسبة..."
              className="gallery-search-input"
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

      {/* Results Header */}
      <section className="gallery-results-meta">
        <div className="results-meta-container">
          <span className="results-counter">
            عرض <b>{filteredInvitations.length}</b> من أصل <b>{invitations.length}</b> تصميم تفاعلي
          </span>
          <span className="results-tagline">
            <SlidersHorizontal size={14} />
            <span>مجموعة وِصال الحصرية</span>
          </span>
        </div>
      </section>

      {/* Cards Grid */}
      <section className="gallery-cards-section">
        <div className="cards-grid-container">
          {filteredInvitations.length > 0 ? (
            <div className="gallery-grid-layout">
              {filteredInvitations.map((item) => (
                <InvitationCard key={item.slug} item={item} />
              ))}
            </div>
          ) : (
            <div className="gallery-empty-state">
              <div className="empty-flourish">❦</div>
              <h3>لم نجد أي تصميم مطابق لبحثكم</h3>
              <p>جربوا استخدام كلمات بحث أخرى أو عرض كل التصميمات.</p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                  searchParams.delete('cat');
                  setSearchParams(searchParams);
                }}
                className="btn-reset-filters"
              >
                إعادة ضبط عوامل التصفية
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
