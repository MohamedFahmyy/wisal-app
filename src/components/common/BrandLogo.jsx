import React from 'react';
import { Link } from 'react-router-dom';

export function BrandLogo({ isLight = false, className = '' }) {
  return (
    <Link to="/" className={`brand-logo ${isLight ? 'is-light' : ''} ${className}`}>
      <span className="brand-mark-gold" aria-hidden="true">
        و
      </span>
      <div className="brand-text">
        <span className="brand-name">وِصال</span>
        <span className="brand-sub">WISAL INVITATIONS</span>
      </div>
    </Link>
  );
}
