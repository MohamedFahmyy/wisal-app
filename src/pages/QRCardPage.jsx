import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  QrCode,
  Printer,
  Sparkles,
  Heart,
  ArrowRight,
  Share2,
  Calendar,
  MapPin,
  CheckCircle2
} from '../utils/icons';
import { QRCodeSvg } from '../utils/qrcode';
import { invitations } from '../data/invitations';
import { trackPageView } from '../utils/analytics';

export default function QRCardPage() {
  const [searchParams] = useSearchParams();
  const [selectedSlug, setSelectedSlug] = useState('mazen-farida');
  const [activeTheme, setActiveTheme] = useState('classic'); // 'classic', 'garden', 'midnight', 'katbketab'
  const [coupleNames, setCoupleNames] = useState('مازن & فريدة');
  const [eventDate, setEventDate] = useState('الخميس، 14 يناير 2027');
  const [venueName, setVenueName] = useState('قاعة الياسمين الملكية — القاهرة');

  useEffect(() => {
    trackPageView('/card');
  }, []);

  // Update inputs if slug changes
  useEffect(() => {
    const inv = invitations.find((i) => i.slug === selectedSlug);
    if (inv) {
      setCoupleNames(`${inv.people.firstPerson} ${inv.people.relation} ${inv.people.secondPerson}`);
      setEventDate(inv.event.dateFormatted);
      setVenueName(inv.venue.nameAr);
    }
  }, [selectedSlug]);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://wisal.vercel.app';
  const inviteUrl = useMemo(() => {
    if (selectedSlug === 'mazen-farida') return `${origin}/mazen-farida`;
    return `${origin}/invite/${selectedSlug}`;
  }, [selectedSlug, origin]);

  const tableWishUrl = useMemo(() => {
    return `${inviteUrl}?wish=1#rsvp`;
  }, [inviteUrl]);

  // Color theme definitions for A6 cards
  const themeStyles = {
    classic: {
      cardBg: '#fdfbf7',
      borderColor: '#c79a57',
      primaryText: '#422f1d',
      accentColor: '#87602d',
      sealColor: '#8b263e',
      label: 'كلاسيك ذهبي وشموع'
    },
    garden: {
      cardBg: '#f9fcf8',
      borderColor: '#7a9a6b',
      primaryText: '#233820',
      accentColor: '#4f7243',
      sealColor: '#3c6332',
      label: 'زهور الحديقة الربيعية'
    },
    midnight: {
      cardBg: '#1a1f2c',
      borderColor: '#d4af37',
      primaryText: '#f5f0e1',
      accentColor: '#e6ca65',
      sealColor: '#d4af37',
      label: 'ملكي ليلي فاخر'
    },
    katbketab: {
      cardBg: '#fbfcf9',
      borderColor: '#3b7a57',
      primaryText: '#1c3829',
      accentColor: '#2b5e41',
      sealColor: '#1c3829',
      label: 'عقد قران ومصحف شريف'
    }
  };

  const currentTheme = themeStyles[activeTheme] || themeStyles.classic;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="qr-card-page"
      style={{
        background: '#f8f5ee',
        minHeight: '100vh',
        color: '#3a2a1d',
        fontFamily: 'Cairo, sans-serif',
        padding: '36px 16px 80px',
        lineHeight: 1.7
      }}
    >
      <div
        className="qr-card-wrap"
        style={{
          maxWidth: '920px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px'
        }}
      >
        {/* Navigation Breadcrumb (Screen only) */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link
            to="/"
            style={{
              color: '#87602d',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ArrowRight size={16} />
            العودة للرئيسية
          </Link>

          <button
            onClick={handlePrint}
            style={{
              background: 'linear-gradient(135deg, #c79a57, #9a6d36)',
              color: '#fff',
              border: 'none',
              borderRadius: '999px',
              padding: '9px 20px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 6px 18px -6px rgba(154, 109, 54, 0.4)'
            }}
          >
            <Printer size={16} />
            طباعة الكروت (A6 / PDF)
          </button>
        </div>

        {/* Hero Header (Screen only) */}
        <header className="no-print">
          <h1
            style={{
              fontFamily: 'Aref Ruqaa, Amiri, serif',
              fontSize: 'clamp(32px, 6vw, 44px)',
              margin: '0 0 8px',
              color: '#5a3d1c',
              lineHeight: 1.25
            }}
          >
            كروت QR المطبوعة للترابيزات والدعوات
          </h1>
          <p style={{ margin: 0, color: '#7a6857', fontSize: '15px', maxWidth: '64ch' }}>
            كارتين بمقاس A6 بنفس هوية وجمال دعوتكم: كارت للدعوة تدّوه باليد لمن يفضل الدعوات الورقية، وكارت يتحط على
            ترابيزات القاعة يوم الفرح والمعازيم يمسحوه ويكتبولكم تهنئتهم مباشرة.
          </p>
        </header>

        {/* Configuration Controls (Screen only) */}
        <div
          className="no-print"
          style={{
            background: '#fffdfa',
            border: '1px solid #eedec7',
            borderRadius: '18px',
            padding: '20px 24px',
            boxShadow: '0 12px 30px -16px rgba(90, 61, 28, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {/* Invitation Template Select */}
            <div style={{ flex: '1 1 240px' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '13.5px', marginBottom: '6px' }}>
                اختر الدعوة المرتبطة
              </label>
              <select
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid #eedec7',
                  background: '#fff',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '14px'
                }}
              >
                {invitations.map((inv) => (
                  <option key={inv.slug} value={inv.slug}>
                    {inv.people.firstPerson} و {inv.people.secondPerson} ({inv.categoryLabel})
                  </option>
                ))}
              </select>
            </div>

            {/* Theme switcher tabs */}
            <div style={{ flex: '1 1 300px' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '13.5px', marginBottom: '6px' }}>
                نمط وألوان الكارت
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {Object.entries(themeStyles).map(([key, item]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTheme(key)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '999px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: activeTheme === key ? '2px solid #87602d' : '1px solid #eedec7',
                      background: activeTheme === key ? '#f4ebd9' : '#fff',
                      color: activeTheme === key ? '#5a3d1c' : '#7a6857'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Printable A6 Cards Side-by-Side Grid */}
        <div
          className="print-cards-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '24px',
            justifyContent: 'center'
          }}
        >
          {/* Card 1: Official Invitation Card */}
          <div
            className="a6-card"
            style={{
              background: currentTheme.cardBg,
              color: currentTheme.primaryText,
              border: `2px solid ${currentTheme.borderColor}`,
              borderRadius: '16px',
              padding: '32px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 20px 45px -15px rgba(58, 42, 29, 0.25)',
              position: 'relative',
              minHeight: '520px',
              justifyContent: 'space-between'
            }}
          >
            {/* Top Ornamental Frame */}
            <div>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: currentTheme.sealColor,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: 700,
                  fontSize: '18px'
                }}
              >
                وِ
              </div>
              <span
                style={{
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '13px',
                  letterSpacing: '0.04em',
                  color: currentTheme.accentColor,
                  fontWeight: 600
                }}
              >
                بِسمِ اللهِ الرَّحمٰنِ الرَّحيم
              </span>
              <h2
                style={{
                  fontFamily: 'Aref Ruqaa, Amiri, serif',
                  fontSize: '36px',
                  margin: '6px 0 2px',
                  color: currentTheme.accentColor,
                  lineHeight: 1.2
                }}
              >
                {coupleNames}
              </h2>
              <p style={{ margin: '4px 0 16px', fontSize: '13.5px', opacity: 0.9 }}>
                يسعدنا ويشرفنا حضوركم ومشاركتنا فرحة العمر
              </p>
            </div>

            {/* QR Code */}
            <div style={{ margin: '12px 0' }}>
              <QRCodeSvg value={inviteUrl} size={150} color={currentTheme.primaryText} />
            </div>

            {/* Bottom Details */}
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: currentTheme.accentColor }}>
                {eventDate}
              </div>
              <div style={{ fontSize: '12.5px', opacity: 0.85, marginTop: '2px' }}>{venueName}</div>
              <div
                style={{
                  fontSize: '11.5px',
                  marginTop: '12px',
                  paddingTop: '8px',
                  borderTop: `1px solid ${currentTheme.borderColor}40`,
                  opacity: 0.8
                }}
              >
                امسح الـ QR بكاميرا هاتفك لفتح الدعوة التفاعلية وخريطة القاعة
              </div>
            </div>
          </div>

          {/* Card 2: Table Greetings & Guestbook Card */}
          <div
            className="a6-card"
            style={{
              background: currentTheme.cardBg,
              color: currentTheme.primaryText,
              border: `2px solid ${currentTheme.borderColor}`,
              borderRadius: '16px',
              padding: '32px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 20px 45px -15px rgba(58, 42, 29, 0.25)',
              position: 'relative',
              minHeight: '520px',
              justifyContent: 'space-between'
            }}
          >
            {/* Top Ornamental Frame */}
            <div>
              <div
                style={{
                  color: currentTheme.accentColor,
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '10px'
                }}
              >
                <Heart size={28} fill={currentTheme.accentColor} />
              </div>

              <span
                style={{
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '13px',
                  letterSpacing: '0.04em',
                  color: currentTheme.accentColor,
                  fontWeight: 600
                }}
              >
                نورتوا فرحتنا الغالية
              </span>
              <h2
                style={{
                  fontFamily: 'Aref Ruqaa, Amiri, serif',
                  fontSize: '34px',
                  margin: '6px 0 2px',
                  color: currentTheme.accentColor,
                  lineHeight: 1.2
                }}
              >
                دفتر تهاني {coupleNames}
              </h2>
              <p style={{ margin: '4px 0 16px', fontSize: '13.5px', opacity: 0.9 }}>
                كلماتكم الطيبة ودعواتكم الصادقة تسعد قلوبنا وتخلّد ذكريات اليوم
              </p>
            </div>

            {/* QR Code */}
            <div style={{ margin: '12px 0' }}>
              <QRCodeSvg value={tableWishUrl} size={150} color={currentTheme.primaryText} />
            </div>

            {/* Bottom Details */}
            <div>
              <div
                style={{
                  background: `${currentTheme.borderColor}15`,
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: currentTheme.accentColor,
                  display: 'inline-block',
                  marginBottom: '8px'
                }}
              >
                كارت الترابيزات المخصص
              </div>
              <div
                style={{
                  fontSize: '11.5px',
                  paddingTop: '8px',
                  borderTop: `1px solid ${currentTheme.borderColor}40`,
                  opacity: 0.8
                }}
              >
                امسح الـ QR لكتابة رسالة تهنئة تصل فوراً إلى العرسان
              </div>
            </div>
          </div>
        </div>

        {/* 4 Steps Showcase (Screen only) */}
        <div
          className="no-print"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginTop: '12px'
          }}
        >
          {[
            { icon: '🍽️', title: 'الكارت على الترابيزة', desc: 'يوضع بأناقة بجانب باقات الورد والضيافة' },
            { icon: '📱', title: 'الضيف يمسح الكود', desc: 'بكاميرا الموبايل فوراً دون تحميل أي تطبيقات' },
            { icon: '💌', title: 'يكتب تهنئته بحب', desc: 'رسالة خاصة وصادقة تسعد قلوب العرسان' },
            { icon: '📋', title: 'تصلكم في لوحة التحكم', desc: 'لحفظها ومشاركتها كـ Stories استثنائية' }
          ].map((step, idx) => (
            <div
              key={idx}
              style={{
                background: '#fffdfa',
                border: '1px solid #eedec7',
                borderRadius: '16px',
                padding: '16px 12px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '4px' }}>{step.icon}</div>
              <b style={{ display: 'block', fontSize: '14.5px', color: '#4a3520' }}>{step.title}</b>
              <small style={{ color: '#8a7660', fontSize: '12px' }}>{step.desc}</small>
            </div>
          ))}
        </div>

        {/* Production & Printing Note (Screen only) */}
        <div
          className="no-print"
          style={{
            background: '#fffdfa',
            border: '1px solid #eedec7',
            borderRadius: '16px',
            padding: '20px',
            fontSize: '13.5px',
            color: '#6e5a48',
            lineHeight: 1.7
          }}
        >
          <b style={{ color: '#422f1d' }}>طريقة الاستلام والطباعة:</b>
          <p style={{ margin: '6px 0 0' }}>
            نوفر لكم الكارتين بأسمائكم وتاريخ فرحكم ومكان الحفل، بنفس ألوان وختم دعوتكم الإلكترونية مع كود الـ QR جاهز
            وموجه لصفحتكم. يمكنكم النقر على زر <b>طباعة الكروت (A6 / PDF)</b> للحصول على ملف جاهز فوراً للطباعة على ورق
            كوشيه أو قطني فاخر في أي مطبعة ديجيتال.
          </p>
        </div>
      </div>

      {/* Embedded Print CSS */}
      <style>{`
        @media print {
          body {
            background: #fff !important;
            padding: 0 !important;
          }
          .no-print, header, footer, .app-layout-container > header, .app-layout-container > footer {
            display: none !important;
          }
          .qr-card-page {
            background: #fff !important;
            padding: 0 !important;
          }
          .qr-card-wrap {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .print-cards-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 20px !important;
            page-break-inside: avoid !important;
          }
          .a6-card {
            border: 2px solid #c79a57 !important;
            box-shadow: none !important;
            border-radius: 12px !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>
    </div>
  );
}
