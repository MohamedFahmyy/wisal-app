import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpLeft, Sparkles, Heart } from '../../utils/icons';

export function InvitationCard({ item }) {
  const firstPerson = item.people?.firstPerson || item.names?.split(' ')[0] || '';
  const secondPerson = item.people?.secondPerson || '';
  const relation = item.people?.relation || (secondPerson ? '&' : '');
  const template = item.template || 'classic';

  // Get preview icon/art glyph for each template
  const getThumbnailGlyph = () => {
    switch (template) {
      case 'ring':
      case 'mohamed-salma':
        return '💍';
      case 'birthday':
      case 'party':
        return '🎁';
      case 'midnight':
        return '✧';
      case 'katbketab':
      case 'arch':
        return '۞';
      case 'doors':
        return '🏛️';
      case 'provence':
        return '🪻';
      case 'letter':
        return '💌';
      case 'garden':
        return '🌿';
      case 'rose':
        return '🌸';
      case 'modern':
        return '📷';
      case 'blanc':
        return '𓇢';
      case 'classic':
      case 'wax':
      default:
        return 'و';
    }
  };

  return (
    <article className={`invitation-card-item card-theme-${template}`}>
      <Link to={`/invite/${item.slug}`} className="card-link-wrapper" aria-label={`عرض دعوة ${item.event?.title || item.title}`}>
        {/* Artistic Thumbnail Preview */}
        <div className="card-thumbnail-art">
          <div className="card-art-backdrop" />
          <div className="card-art-frame">
            <div className="card-badge-row">
              <span className="card-category-pill">{item.categoryLabel}</span>
              {item.tag && <span className="card-tag-pill">{item.tag}</span>}
            </div>

            <div className="card-central-emblem">
              <span className="emblem-glyph">{getThumbnailGlyph()}</span>
            </div>

            <div className="card-title-block">
              <h3 className="card-person-names">
                {firstPerson} {relation} {secondPerson}
              </h3>
              <span className="card-date-line">
                {item.event?.dateFormatted || item.dateLabel || item.date}
              </span>
            </div>

            <div className="card-hover-reveal">
              <span className="btn-preview-pill">
                <span>افتح التجربة</span>
                <ArrowUpLeft size={15} />
              </span>
            </div>
          </div>
        </div>

        {/* Card Body Info */}
        <div className="card-meta-body">
          <div className="card-meta-text">
            <h4 className="card-headline">{item.event?.title || item.title}</h4>
            <p className="card-desc-snippet">{item.description}</p>
          </div>

          <div className="card-action-bar">
            <span className="venue-hint">📍 {item.venue?.name || item.venue}</span>
            <span className="open-arrow-circle">
              <ArrowUpLeft size={16} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default InvitationCard;
