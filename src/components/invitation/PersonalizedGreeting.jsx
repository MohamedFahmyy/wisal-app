import React from 'react';
import { Heart } from '../../utils/icons';

export function PersonalizedGreeting({ guestName, t, language }) {
  if (!guestName) {
    return (
      <div className="personalized-greeting default-guest">
        <span className="greeting-sparkle">✦</span>
        <h3 className="guest-title">{t.welcomeHonor}</h3>
        <p className="guest-message">{t.personalizedWelcome}</p>
      </div>
    );
  }

  const isArabic = language === 'ar';
  const prefix = isArabic ? 'عزيزنا / عزيزتنا' : 'Dear';

  return (
    <div className="personalized-greeting custom-guest">
      <div className="greeting-badge">
        <Heart size={14} fill="currentColor" />
        <span>دعوة شخصية خاصة</span>
      </div>
      <h3 className="guest-title">
        {prefix} <span className="guest-highlight">{guestName}</span>
      </h3>
      <p className="guest-message">
        {isArabic
          ? `يسعدنا ويشرفنا جداً حضوركم ومشاركتنا فرحتنا الكبرى في هذا اليوم الذي لا يكتمل إلا بوجودكم الكريم.`
          : `We would be deeply honored by your gracious presence to celebrate our special day with us.`}
      </p>
    </div>
  );
}
