import React, { useState } from 'react';
import { Camera, Eye } from '../../utils/icons';

export function PhotoGallerySection({ gallery, title, language }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  if (!gallery || gallery.length === 0) return null;
  const isArabic = language === 'ar';

  return (
    <div className="invitation-gallery-block">
      <div className="gallery-header">
        <Camera size={18} />
        <span className="gallery-eyebrow">
          {isArabic ? 'لحظات لا تُنسى' : 'Cherished Moments'}
        </span>
      </div>

      <div className="gallery-grid">
        {gallery.map((photoUrl, index) => (
          <div
            key={index}
            className="gallery-item-card"
            onClick={() => setSelectedPhoto(photoUrl)}
          >
            <img src={photoUrl} alt={`Memory ${index + 1}`} loading="lazy" />
            <div className="gallery-overlay">
              <Eye size={20} />
            </div>
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <div className="lightbox-modal" onClick={() => setSelectedPhoto(null)}>
          <div className="lightbox-content">
            <img src={selectedPhoto} alt="Full preview" />
          </div>
        </div>
      )}
    </div>
  );
}
