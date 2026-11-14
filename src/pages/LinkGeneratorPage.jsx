import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Link as LinkIcon,
  Copy,
  Check,
  Send,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ExternalLink
} from '../utils/icons';
import { invitations } from '../data/invitations';
import { trackPageView } from '../utils/analytics';

export default function LinkGeneratorPage() {
  const [selectedSlug, setSelectedSlug] = useState('mazen-farida');
  const [customBaseUrl, setCustomBaseUrl] = useState('');
  const [guestText, setGuestText] = useState(
    `أحمد مصطفى، 01012345678\nمنى وكريم\nعائلة الأستاذ سامي الشريف، 01198765432\nد. يوسف وفاطمة\nسارة علي`
  );
  const [messageTemplate, setMessageTemplate] = useState(
    `أهلاً {اسم} الغالي 💌\nيسعدنا ويشرفنا حضورك لمشاركتنا فرحتنا.\nدي دعوتك الخاصة:\n{لينك}`
  );
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  useEffect(() => {
    trackPageView('/links');
  }, []);

  // Compute base URL
  const baseUrl = useMemo(() => {
    if (selectedSlug === 'custom') {
      return customBaseUrl.trim() || window.location.origin;
    }
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://wisal.vercel.app';
    if (selectedSlug === 'mazen-farida') {
      return `${origin}/mazen-farida`;
    }
    return `${origin}/invite/${selectedSlug}`;
  }, [selectedSlug, customBaseUrl]);

  // Parse guests line by line
  const parsedGuests = useMemo(() => {
    return guestText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        // Check for comma or Arabic comma
        const parts = line.split(/[،,]/);
        let phone = parts.length > 1 ? parts[parts.length - 1].replace(/[^\d+]/g, '') : '';
        let name = (parts.length > 1 ? parts.slice(0, -1).join('،') : line).trim();

        // Egyptian phone number normalization (01xxxxxxxxx -> 201xxxxxxxxx)
        if (phone.startsWith('01') && phone.length === 11) {
          phone = '2' + phone;
        }

        return { name, phone };
      });
  }, [guestText]);

  // Generate personalized URL for a name
  const makeUrl = (name) => {
    const clean = baseUrl.split(/[?#]/)[0];
    return `${clean}?to=${encodeURIComponent(name)}`;
  };

  // Generate WhatsApp text for a guest
  const makeWaMessage = (name, url) => {
    return messageTemplate.split('{اسم}').join(name).split('{لينك}').join(url);
  };

  const handleCopySingle = (url, index) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 1600);
      });
    }
  };

  const handleCopyAll = () => {
    const all = parsedGuests.map((g) => `${g.name}: ${makeUrl(g.name)}`).join('\n');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(all).then(() => {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
      });
    }
  };

  return (
    <div
      className="link-generator-page"
      style={{
        background: '#fbf8f2',
        minHeight: '100vh',
        color: '#3a2a1d',
        fontFamily: 'Cairo, sans-serif',
        padding: '36px 16px 80px',
        lineHeight: 1.7
      }}
    >
      <div
        className="link-generator-wrap"
        style={{
          maxWidth: '820px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#2f7d5b',
              background: '#e7f2ea',
              padding: '4px 12px',
              borderRadius: '999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ShieldCheck size={14} />
            آمنة ومشفرة على جهازك 100%
          </span>
        </div>

        {/* Hero Title */}
        <header>
          <h1
            style={{
              fontFamily: 'Aref Ruqaa, Amiri, serif',
              fontSize: 'clamp(32px, 6vw, 44px)',
              margin: '0 0 8px',
              color: '#5a3d1c',
              lineHeight: 1.25
            }}
          >
            صانع روابط الضيوف المخصصة
          </h1>
          <p style={{ margin: 0, color: '#7a6857', fontSize: '15px' }}>
            الصق قائمة معازيمكم (اسم في كل سطر)، واحصل على رابط مخصص باسم كل ضيف مع رسالة جاهزة للإرسال المباشر على واتساب بنقرة واحدة.
          </p>
        </header>

        {/* Input Controls Card */}
        <div
          style={{
            background: '#fffdfa',
            border: '1px solid #eedec7',
            borderRadius: '18px',
            padding: '24px',
            boxShadow: '0 12px 30px -16px rgba(90, 61, 28, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          {/* Invitation Template Selector */}
          <div>
            <label
              style={{
                display: 'block',
                fontWeight: 700,
                fontSize: '14.5px',
                marginBottom: '6px',
                color: '#4a3520'
              }}
            >
              اختر تصميم الدعوة
            </label>
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1px solid #eedec7',
                background: '#fff',
                fontSize: '14.5px',
                color: '#3a2a1d',
                fontFamily: 'Cairo, sans-serif',
                outline: 'none'
              }}
            >
              {invitations.map((inv) => (
                <option key={inv.slug} value={inv.slug}>
                  {inv.people.firstPerson} {inv.people.relation} {inv.people.secondPerson} — {inv.description.slice(0, 48)}...
                </option>
              ))}
              <option value="custom">رابط مخصص آخر...</option>
            </select>
          </div>

          {selectedSlug === 'custom' && (
            <div>
              <label
                style={{
                  display: 'block',
                  fontWeight: 600,
                  fontSize: '13px',
                  marginBottom: '6px',
                  color: '#7a6857'
                }}
              >
                أدخل الرابط المخصص
              </label>
              <input
                type="url"
                dir="ltr"
                placeholder="https://..."
                value={customBaseUrl}
                onChange={(e) => setCustomBaseUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #eedec7',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          )}

          {/* Active Base URL Preview */}
          <div
            style={{
              background: '#f9f3e7',
              borderRadius: '10px',
              padding: '10px 14px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}
          >
            <span style={{ color: '#87602d', fontWeight: 600 }}>الرابط المعتمد:</span>
            <code dir="ltr" style={{ color: '#5a3d1c', wordBreak: 'break-all' }}>
              {baseUrl}
            </code>
          </div>

          {/* Guest Names Input */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
              <label
                style={{
                  fontWeight: 700,
                  fontSize: '14.5px',
                  color: '#4a3520'
                }}
              >
                أسماء الضيوف
              </label>
              <small style={{ color: '#8a7660', fontSize: '12.5px' }}>
                اسم في كل سطر. اختياري: اكتب رقم الهاتف بعد فاصلة (مثال: كريم، 01012345678)
              </small>
            </div>
            <textarea
              rows={5}
              value={guestText}
              onChange={(e) => setGuestText(e.target.value)}
              placeholder="اكتب أسماء المعازيم هنا…"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid #eedec7',
                background: '#fff',
                fontSize: '14px',
                color: '#3a2a1d',
                fontFamily: 'Cairo, sans-serif',
                lineHeight: 1.6,
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          {/* WhatsApp Message Template */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
              <label
                style={{
                  fontWeight: 700,
                  fontSize: '14.5px',
                  color: '#4a3520'
                }}
              >
                قالب رسالة الواتساب
              </label>
              <small style={{ color: '#8a7660', fontSize: '12.5px' }}>
                سيتم استبدال {'{اسم}'} باسم الضيف و {'{لينك}'} بالرابط الخاص به
              </small>
            </div>
            <textarea
              rows={3}
              value={messageTemplate}
              onChange={(e) => setMessageTemplate(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1px solid #eedec7',
                background: '#fff',
                fontSize: '13.5px',
                color: '#3a2a1d',
                fontFamily: 'Cairo, sans-serif',
                lineHeight: 1.6,
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>
        </div>

        {/* Generated Guest Links Output */}
        <div
          style={{
            background: '#fffdfa',
            border: '1px solid #eedec7',
            borderRadius: '18px',
            padding: '24px',
            boxShadow: '0 12px 30px -16px rgba(90, 61, 28, 0.15)'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '18px',
              paddingBottom: '14px',
              borderBottom: '1px solid #eedec7'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} style={{ color: '#87602d' }} />
              <b style={{ fontSize: '16px', color: '#4a3520' }}>
                قائمة الروابط المُنشأة ({parsedGuests.length} ضيف)
              </b>
            </div>

            <button
              onClick={handleCopyAll}
              disabled={parsedGuests.length === 0}
              style={{
                background: copiedAll ? '#2f7d5b' : 'linear-gradient(135deg, #c79a57, #9a6d36)',
                color: '#fff',
                border: 'none',
                borderRadius: '999px',
                padding: '8px 18px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background 0.3s ease'
              }}
            >
              {copiedAll ? <Check size={14} /> : <Copy size={14} />}
              {copiedAll ? 'تم نسخ جميع الروابط ✓' : 'نسخ جميع الروابط'}
            </button>
          </div>

          {parsedGuests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 0', color: '#8a7660' }}>
              الصق أسماء الضيوف في المربع بالأعلى لتوليد الروابط فورياً.
            </div>
          ) : (
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table
                style={{
                  width: '100%',
                  minWidth: '480px',
                  borderCollapse: 'collapse',
                  fontSize: '14px'
                }}
              >
                <thead>
                  <tr style={{ color: '#87602d', textAlign: 'start' }}>
                    <th style={{ padding: '8px 12px', borderBottom: '1px solid #eedec7' }}>الضيف</th>
                    <th style={{ padding: '8px 12px', borderBottom: '1px solid #eedec7' }}>الرابط المخصص</th>
                    <th style={{ padding: '8px 12px', borderBottom: '1px solid #eedec7', textAlign: 'center' }}>
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {parsedGuests.map((guest, idx) => {
                    const guestUrl = makeUrl(guest.name);
                    const waText = makeWaMessage(guest.name, guestUrl);
                    const waUrl = `https://wa.me/${guest.phone}?text=${encodeURIComponent(waText)}`;
                    const isCopied = copiedIndex === idx;

                    return (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: '1px solid #f2e9dc'
                        }}
                      >
                        <td style={{ padding: '12px', fontWeight: 600, color: '#3a2717' }}>
                          {guest.name}
                          {guest.phone && (
                            <span
                              dir="ltr"
                              style={{
                                display: 'block',
                                fontSize: '11px',
                                color: '#96816d',
                                fontWeight: 400
                              }}
                            >
                              +{guest.phone}
                            </span>
                          )}
                        </td>

                        <td
                          dir="ltr"
                          style={{
                            padding: '12px',
                            fontFamily: 'monospace',
                            fontSize: '12px',
                            color: '#7a6857',
                            maxWidth: '280px',
                            wordBreak: 'break-all'
                          }}
                        >
                          {guestUrl}
                        </td>

                        <td style={{ padding: '12px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              onClick={() => handleCopySingle(guestUrl, idx)}
                              style={{
                                border: '1px solid #eedec7',
                                background: isCopied ? '#e7f2ea' : '#fff',
                                color: isCopied ? '#2f7d5b' : '#5a3d1c',
                                borderRadius: '8px',
                                padding: '6px 12px',
                                fontSize: '12.5px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              {isCopied ? <Check size={13} /> : <Copy size={13} />}
                              {isCopied ? 'تم النسخ ✓' : 'نسخ'}
                            </button>

                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                background: '#25d366',
                                color: '#fff',
                                textDecoration: 'none',
                                borderRadius: '8px',
                                padding: '6px 12px',
                                fontSize: '12.5px',
                                fontWeight: 600,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Send size={12} />
                              واتساب
                            </a>

                            <a
                              href={guestUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="معاينة الدعوة"
                              style={{
                                border: '1px solid #eedec7',
                                background: '#fff',
                                color: '#87602d',
                                borderRadius: '8px',
                                padding: '6px 8px',
                                display: 'inline-flex',
                                alignItems: 'center'
                              }}
                            >
                              <ExternalLink size={13} />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Privacy Assurance Banner */}
        <div
          style={{
            background: '#fffdfa',
            border: '1px solid #eedec7',
            borderRadius: '14px',
            padding: '16px 20px',
            fontSize: '13px',
            color: '#7a6857',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <ShieldCheck size={24} style={{ color: '#2f7d5b', flexShrink: 0 }} />
          <div>
            <b>خصوصية تامة لمعازيمكم:</b> كافة الأسماء والأرقام يتم تحليلها محلياً فقط في متصفحك عبر لغة JavaScript دون
            حفظها أو إرسالها إلى أي خوادم أو جهات خارجية.
          </div>
        </div>
      </div>
    </div>
  );
}
