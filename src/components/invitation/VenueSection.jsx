import React from 'react';
import { MapPin, ArrowUpLeft, Compass } from '../../utils/icons';

export function VenueSection({ venue, t, language }) {
  if (!venue) return null;
  const isArabic = language === 'ar';
  const venueTitle = isArabic ? (venue.nameAr || venue.name) : venue.name;
  const venueAddress = isArabic ? venue.address : (venue.addressEn || venue.address);

  return (
    <div className="invitation-venue-card">
      <div className="venue-icon-badge">
        <MapPin size={26} />
      </div>

      <span className="venue-eyebrow">{t.venueLocation}</span>
      <h3 className="venue-title">{venueTitle}</h3>
      <p className="venue-address">{venueAddress}</p>

      <div className="venue-actions">
        <a
          href={venue.mapUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-venue-maps"
        >
          <span>{t.openInMaps}</span>
          <ArrowUpLeft size={16} />
        </a>

        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venueTitle + ' ' + venueAddress)}`}
          target="_blank"
          rel="noreferrer"
          className="btn-venue-directions"
        >
          <Compass size={16} />
          <span>{t.getDirections}</span>
        </a>
      </div>
    </div>
  );
}
