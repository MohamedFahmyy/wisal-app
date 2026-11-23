import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { fetchResponses } from '../utils/api';
import { BrandLogo } from '../components/common/BrandLogo';
import { CheckCircle2, XCircle, Users, MessageSquare, Download, Search, Sparkles, ArrowRight } from '../utils/icons';

// 5 illustrative pre-loaded responses for prospects & demo mode
const DEMO_RESPONSES = [
  {
    id: 'demo_1',
    name: 'م. أحمد الشناوي وعائلته',
    attending: 'yes',
    guests: 3,
    message: 'ألف مبروك لأجمل عرسان! في قمة السعادة لمشاركتكم هذه الليلة الاستثنائية ونتمنى لكم حياة مليئة بالحب والبركة 🤍',
    submitted_at: '2026-11-23T14:30:00Z'
  },
  {
    id: 'demo_2',
    name: 'د. سارة عبد الرحمن',
    attending: 'yes',
    guests: 1,
    message: 'بارك الله لكما وبارك عليكما وجمع بينكما في خير.. نراكم على خير إن شاء الله ✨',
    submitted_at: '2026-11-23T13:15:00Z'
  },
  {
    id: 'demo_3',
    name: 'كريم ممدوح',
    attending: 'no',
    guests: 1,
    message: 'للأسف مسافر خارج البلاد في هذا التوقيت، قلبي معكم وأتمنى لكم ليلة زفاف ساحرة وأياماً كلها سعادة 💐',
    submitted_at: '2026-11-23T11:45:00Z'
  },
  {
    id: 'demo_4',
    name: 'نور الهدى ومحمد طارق',
    attending: 'yes',
    guests: 2,
    message: 'متحمسون جداً للحضور ومشاركتكم أجمل اللحظات! ألف مبروك يا غاليين 🤍💍',
    submitted_at: '2026-11-23T09:20:00Z'
  },
  {
    id: 'demo_5',
    name: 'مها الصاوي',
    attending: 'yes',
    guests: 2,
    message: 'الدعوة وتصميمها في غاية الرقي والجمال! ألف مبروك وبالرفاه والبنين 🌹',
    submitted_at: '2026-11-22T20:10:00Z'
  }
];

export default function ResponsesDashboardPage() {
  const { invitationId } = useParams();
  const [searchParams] = useSearchParams();
  const ownerKey = searchParams.get('key') || '';

  const isDemo = invitationId === 'demo' || invitationId === 'inv_demo' || ownerKey === 'demo';

  const [loading, setLoading] = useState(!isDemo);
  const [notFound, setNotFound] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [responsesData, setResponsesData] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'yes', 'no'

  // Security: Prevent key leakage in HTTP referrers & block search engine indexing
  useEffect(() => {
    let referrerMeta = document.querySelector('meta[name="referrer"]');
    if (!referrerMeta) {
      referrerMeta = document.createElement('meta');
      referrerMeta.setAttribute('name', 'referrer');
      document.head.appendChild(referrerMeta);
    }
    const prevReferrer = referrerMeta.getAttribute('content') || 'no-referrer-when-downgrade';
    referrerMeta.setAttribute('content', 'no-referrer');

    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    const prevRobots = robotsMeta.getAttribute('content') || 'index, follow';
    robotsMeta.setAttribute('content', 'noindex, nofollow');

    return () => {
      referrerMeta.setAttribute('content', prevReferrer);
      robotsMeta.setAttribute('content', prevRobots);
    };
  }, []);

  // Fetch responses
  useEffect(() => {
    if (isDemo) {
      const attending = DEMO_RESPONSES.filter((r) => r.attending === 'yes').length;
      const notAttending = DEMO_RESPONSES.filter((r) => r.attending === 'no').length;
      const totalGuests = DEMO_RESPONSES.filter((r) => r.attending === 'yes').reduce((sum, r) => sum + r.guests, 0);

      setResponsesData({
        invitationId: 'demo',
        totals: {
          attending,
          notAttending,
          totalGuests,
          responsesCount: DEMO_RESPONSES.length
        },
        responses: DEMO_RESPONSES
      });
      setLoading(false);
      setNotFound(false);
      return;
    }

    if (!ownerKey) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setErrorMsg('');

    fetchResponses(invitationId, ownerKey)
      .then((data) => {
        if (!isMounted) return;
        if (!data) {
          setNotFound(true);
        } else {
          setResponsesData(data);
          setNotFound(false);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setErrorMsg(err.message || 'تعذر جلب الردود من الخادم');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [invitationId, ownerKey, isDemo]);

  // Filtered responses list
  const filteredResponses = useMemo(() => {
    if (!responsesData || !responsesData.responses) return [];
    return responsesData.responses.filter((item) => {
      const matchesStatus =
        filterStatus === 'all' || item.attending === filterStatus;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.message && item.message.toLowerCase().includes(q));
      return matchesStatus && matchesQuery;
    });
  }, [responsesData, filterStatus, searchQuery]);

  // CSV Export with UTF-8 BOM for clean Arabic in Excel
  const handleDownloadCsv = () => {
    if (!responsesData || !responsesData.responses) return;

    const headers = ['م', 'اسم الضيف', 'حالة الحضور', 'عدد الأفراد', 'رسالة التهنئة', 'تاريخ ووقت الإرسال'];
    const rows = responsesData.responses.map((r, idx) => [
      idx + 1,
      `"${r.name.replace(/"/g, '""')}"`,
      r.attending === 'yes' ? 'حاضر بإذن الله' : 'معتذر',
      r.attending === 'yes' ? r.guests : 0,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      new Date(r.submitted_at).toLocaleString('ar-EG')
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ردود_دعوة_${invitationId || 'wisal'}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Plain 404 screen when key is invalid or invitation not found
  if (notFound) {
    return (
      <div
        dir="rtl"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#faf8f5',
          color: '#3d3228',
          padding: '24px',
          textAlign: 'center',
          fontFamily: "'Tajawal', system-ui, sans-serif"
        }}
      >
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>🔒</div>
        <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 12px 0', color: '#684a1d' }}>
          الصفحة غير موجودة أو انتهت صلاحية الرابط
        </h1>
        <p style={{ maxWidth: '440px', fontSize: '15px', color: '#7a6858', lineHeight: 1.6, margin: '0 0 24px 0' }}>
          يرجى التأكد من استخدام الرابط السري الخاص بكم مع مفتاح الوصول الصحيح المرسل لكم من منصة وِصال.
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#8a6229',
            color: '#fff',
            padding: '10px 24px',
            borderRadius: '999px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          <span>العودة للرئيسية</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      style={{
        minHeight: '100vh',
        backgroundColor: '#faf7f2',
        color: '#3c3024',
        fontFamily: "'Tajawal', system-ui, -apple-system, sans-serif",
        padding: '24px 16px 64px 16px'
      }}
    >
      <div style={{ maxWidth: '1020px', margin: '0 auto' }}>
        {/* Header */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            paddingBottom: '24px',
            borderBottom: '1px solid #eedec7'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <BrandLogo />
            </Link>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0, color: '#4a3520' }}>
                  سجل تأكيدات الحضور (RSVP)
                </h1>
                {isDemo && (
                  <span
                    style={{
                      background: '#8a6229',
                      color: '#fff',
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      fontWeight: 'bold',
                      letterSpacing: '0.4px'
                    }}
                  >
                    نموذج تجريبي توضيحي
                  </span>
                )}
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#8a7460' }}>
                معرّف الدعوة: <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{invitationId}</span>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {responsesData && responsesData.responses && responsesData.responses.length > 0 && (
              <button
                type="button"
                onClick={handleDownloadCsv}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#fff',
                  border: '1px solid #d4af37',
                  color: '#684a1d',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(181, 138, 74, 0.12)'
                }}
              >
                <Download size={16} />
                <span>تحميل كملف Excel (CSV)</span>
              </button>
            )}
            <Link
              to={`/invite/${invitationId ? invitationId.replace(/^inv_/, '') : ''}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#8a6229',
                color: '#fff',
                padding: '9px 18px',
                borderRadius: '10px',
                fontSize: '13.5px',
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              <span>معاينة الدعوة</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </header>

        {/* Loading Spinner */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
            <p style={{ color: '#8a7460', fontSize: '15px' }}>جارٍ جلب وتحديث قائمة ردود المعازيم...</p>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div
            style={{
              margin: '24px 0',
              padding: '16px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              color: '#b91c1c',
              fontSize: '14px',
              textAlign: 'center'
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Content after loading */}
        {!loading && responsesData && (
          <div style={{ marginTop: '24px' }}>
            {/* Totals Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '14px',
                marginBottom: '28px'
              }}
            >
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #e8dfd1',
                  borderRadius: '14px',
                  padding: '20px 18px',
                  boxShadow: '0 4px 14px rgba(60, 45, 20, 0.04)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13.5px', color: '#7a6858', fontWeight: '500' }}>إجمالي الردود</span>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#f5eee3', display: 'grid', placeItems: 'center' }}>
                    <Users size={17} color="#8a6229" />
                  </div>
                </div>
                <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#4a3520', marginTop: '8px' }}>
                  {responsesData.totals.responsesCount || 0}
                </div>
                <div style={{ fontSize: '12px', color: '#a08a74', marginTop: '2px' }}>ردود مسجلة بالكامل</div>
              </div>

              <div
                style={{
                  background: '#fff',
                  border: '1px solid #d1e7dd',
                  borderRadius: '14px',
                  padding: '20px 18px',
                  boxShadow: '0 4px 14px rgba(47, 125, 91, 0.05)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13.5px', color: '#24613b', fontWeight: '500' }}>المعازيم المؤكد حضورهم</span>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#eef6f0', display: 'grid', placeItems: 'center' }}>
                    <CheckCircle2 size={17} color="#2f7d5b" />
                  </div>
                </div>
                <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#2f7d5b', marginTop: '8px' }}>
                  {responsesData.totals.attending || 0}
                </div>
                <div style={{ fontSize: '12px', color: '#569b76', marginTop: '2px' }}>ضيف أكدوا التواجد</div>
              </div>

              <div
                style={{
                  background: '#fff',
                  border: '1px solid #eedec7',
                  borderRadius: '14px',
                  padding: '20px 18px',
                  boxShadow: '0 4px 14px rgba(181, 138, 74, 0.05)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13.5px', color: '#7a5a2b', fontWeight: '500' }}>إجمالي الأفراد القادمين</span>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#faf3e8', display: 'grid', placeItems: 'center' }}>
                    <Sparkles size={17} color="#a07a3c" />
                  </div>
                </div>
                <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#7a5a2b', marginTop: '8px' }}>
                  {responsesData.totals.totalGuests || 0}
                </div>
                <div style={{ fontSize: '12px', color: '#a68553', marginTop: '2px' }}>فرد (لحساب مقاعد الصالة والبوفيه)</div>
              </div>

              <div
                style={{
                  background: '#fff',
                  border: '1px solid #f5d3d3',
                  borderRadius: '14px',
                  padding: '20px 18px',
                  boxShadow: '0 4px 14px rgba(185, 28, 28, 0.04)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13.5px', color: '#991b1b', fontWeight: '500' }}>المعتذرون</span>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#fee2e2', display: 'grid', placeItems: 'center' }}>
                    <XCircle size={17} color="#b91c1c" />
                  </div>
                </div>
                <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#b91c1c', marginTop: '8px' }}>
                  {responsesData.totals.notAttending || 0}
                </div>
                <div style={{ fontSize: '12px', color: '#c2410c', marginTop: '2px' }}>أرسلوا اعتذاراً رقيقاً</div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px',
                marginBottom: '18px'
              }}
            >
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setFilterStatus('all')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: filterStatus === 'all' ? '1px solid #8a6229' : '1px solid #eedec7',
                    background: filterStatus === 'all' ? '#8a6229' : '#fff',
                    color: filterStatus === 'all' ? '#fff' : '#5a4635',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  الكل ({responsesData.responses.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('yes')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: filterStatus === 'yes' ? '1px solid #2f7d5b' : '1px solid #eedec7',
                    background: filterStatus === 'yes' ? '#2f7d5b' : '#fff',
                    color: filterStatus === 'yes' ? '#fff' : '#5a4635',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  حاضرون ({responsesData.totals.attending})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('no')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: filterStatus === 'no' ? '1px solid #b91c1c' : '1px solid #eedec7',
                    background: filterStatus === 'no' ? '#b91c1c' : '#fff',
                    color: filterStatus === 'no' ? '#fff' : '#5a4635',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  معتذرون ({responsesData.totals.notAttending})
                </button>
              </div>

              <div style={{ position: 'relative', minWidth: '260px' }}>
                <input
                  type="text"
                  placeholder="بحث باسم الضيف أو نص الرسالة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 36px 9px 14px',
                    border: '1px solid #dccbb3',
                    borderRadius: '8px',
                    fontSize: '13.5px',
                    backgroundColor: '#fff',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <span style={{ position: 'absolute', right: '12px', top: '10px', color: '#a08a74' }}>
                  <Search size={16} />
                </span>
              </div>
            </div>

            {/* Table of Responses */}
            <div
              style={{
                background: '#fff',
                border: '1px solid #eedec7',
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(60, 45, 20, 0.04)',
                marginBottom: '32px'
              }}
            >
              {filteredResponses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 20px', color: '#8a7460' }}>
                  <p style={{ margin: 0, fontSize: '15px' }}>لا توجد ردود مطابقة لمعايير البحث الحالية.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '13.5px' }}>
                    <thead>
                      <tr style={{ background: '#f5eee3', borderBottom: '1px solid #eedec7', color: '#684a1d' }}>
                        <th style={{ padding: '12px 16px' }}>اسم الضيف</th>
                        <th style={{ padding: '12px 16px' }}>الحالة</th>
                        <th style={{ padding: '12px 16px' }}>عدد الأفراد</th>
                        <th style={{ padding: '12px 16px' }}>رسالة التهنئة</th>
                        <th style={{ padding: '12px 16px' }}>وقت الرد</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredResponses.map((item, idx) => (
                        <tr
                          key={item.id || idx}
                          style={{
                            borderBottom: '1px solid #f2e9dc',
                            backgroundColor: idx % 2 === 0 ? '#fff' : '#fffdfa'
                          }}
                        >
                          <td style={{ padding: '14px 16px', fontWeight: 'bold', color: '#3d2e1f' }}>
                            {item.name}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            {item.attending === 'yes' ? (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  color: '#2f7d5b',
                                  backgroundColor: '#eef6f0',
                                  padding: '3px 10px',
                                  borderRadius: '999px',
                                  fontSize: '12px',
                                  fontWeight: '600'
                                }}
                              >
                                <CheckCircle2 size={13} />
                                <span>حاضر</span>
                              </span>
                            ) : (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  color: '#b91c1c',
                                  backgroundColor: '#fee2e2',
                                  padding: '3px 10px',
                                  borderRadius: '999px',
                                  fontSize: '12px',
                                  fontWeight: '600'
                                }}
                              >
                                <XCircle size={13} />
                                <span>معتذر</span>
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '14px 16px', color: '#5a4635' }}>
                            {item.attending === 'yes' ? `${item.guests} فرد` : '—'}
                          </td>
                          <td style={{ padding: '14px 16px', color: '#6e5a48', maxWidth: '320px', lineHeight: 1.5 }}>
                            {item.message ? `«${item.message}»` : <span style={{ color: '#baa795' }}>بدون رسالة</span>}
                          </td>
                          <td style={{ padding: '14px 16px', color: '#96816e', fontSize: '12px', whiteSpace: 'nowrap' }}>
                            {new Date(item.submitted_at).toLocaleDateString('ar-EG', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Guest Wishes Cards Section */}
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#4a3520', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={19} color="#8a6229" />
              <span>رسائل وتهاني المعازيم</span>
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '14px'
              }}
            >
              {responsesData.responses
                .filter((r) => r.message && r.message.trim())
                .map((r, idx) => (
                  <div
                    key={r.id || idx}
                    style={{
                      background: '#fffdfa',
                      border: '1px solid #eedec7',
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 8px rgba(60, 45, 20, 0.03)'
                    }}
                  >
                    <p style={{ margin: '0 0 12px 0', fontSize: '13.5px', color: '#5a4635', lineHeight: 1.6, fontStyle: 'italic' }}>
                      «{r.message}»
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid #f2e9dc',
                        paddingTop: '8px',
                        fontSize: '12px'
                      }}
                    >
                      <b style={{ color: '#8a6229' }}>{r.name}</b>
                      <span style={{ color: '#a08a74' }}>
                        {r.attending === 'yes' ? 'حاضر 🤍' : 'اعتذر 💐'}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
