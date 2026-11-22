import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Users,
  CheckCircle2,
  XCircle,
  Search,
  Download,
  Copy,
  RefreshCw,
  Share2,
  Heart,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Trash2,
  Calendar,
  AlertTriangle
} from '../utils/icons';
import { StoryCardModal } from '../components/common/StoryCardModal';
import { trackPageView } from '../utils/analytics';
import {
  getGuestResponsesByInvitation,
  clearGuestResponses,
  deleteGuestResponse
} from '../utils/guestStorage';
import { invitations, getInvitationById, resolveInvitationId } from '../data/invitations';

// Realistic sample demo dataset scoped to demo presentation
const SAMPLE_DEMO_DATA = [
  {
    id: 'demo_1',
    invitationId: 'inv_demo',
    slug: 'demo',
    name: 'يوسف أحمد ومروة',
    attending: 'yes',
    guests: 2,
    message: 'ألف مبروك يا عرساننا الغاليين، ربنا يتمم بألف خير ويجعل أيامكم كلها سعادة وهنا ❤️',
    createdAt: '2026-11-13T19:30:00Z',
    updatedAt: '2026-11-13T19:30:00Z',
    source: 'demo'
  },
  {
    id: 'demo_2',
    invitationId: 'inv_demo',
    slug: 'demo',
    name: 'سلمى خالد',
    attending: 'yes',
    guests: 1,
    message: 'مستنية اليوم ده من زمااان! هتبقوا أحلى وأجمل عرسان في الدنيا 🤍✨',
    createdAt: '2026-11-13T17:15:00Z',
    updatedAt: '2026-11-13T17:15:00Z',
    source: 'demo'
  },
  {
    id: 'demo_3',
    invitationId: 'inv_demo',
    slug: 'demo',
    name: 'عائلة الشريف',
    attending: 'yes',
    guests: 4,
    message: 'بارك الله لكما وبارك عليكما وجمع بينكما في خير.. نراكم على خير إن شاء الله.',
    createdAt: '2026-11-13T14:00:00Z',
    updatedAt: '2026-11-13T14:00:00Z',
    source: 'demo'
  },
  {
    id: 'demo_4',
    invitationId: 'inv_demo',
    slug: 'demo',
    name: 'م. هاني سمير',
    attending: 'no',
    guests: 0,
    message: 'آسف جداً يا حبايبي مش هقدر أكون حاضر لسفري خارج البلاد، قلبي معاكم وألف مبروك مقدماً 🙏',
    createdAt: '2026-11-12T21:10:00Z',
    updatedAt: '2026-11-12T21:10:00Z',
    source: 'demo'
  },
  {
    id: 'demo_5',
    invitationId: 'inv_demo',
    slug: 'demo',
    name: 'أحمد طارق',
    attending: 'yes',
    guests: 1,
    message: 'هجيب الرقص معايا 😂❤️ ألف ألف مبروك يا كباتن!',
    createdAt: '2026-11-11T16:00:00Z',
    updatedAt: '2026-11-11T16:00:00Z',
    source: 'demo'
  }
];

export default function GuestDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Multi-Invitation Selector: resolve from ?inv= or ?slug= or default to first invitation
  const initialParam = searchParams.get('inv') || searchParams.get('slug') || 'mazen-farida';
  const initialInvId = resolveInvitationId(initialParam);

  const [selectedInvitationId, setSelectedInvitationId] = useState(initialInvId);
  const [localResponses, setLocalResponses] = useState([]);
  const [dataView, setDataView] = useState('local'); // 'local', 'demo', 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'yes', 'no'
  const [toastMessage, setToastMessage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Story Card State
  const [activeStory, setActiveStory] = useState(null);

  // Active Invitation Metadata
  const activeInvitation = useMemo(() => {
    return getInvitationById(selectedInvitationId) || invitations[0];
  }, [selectedInvitationId]);

  const coupleNames = useMemo(() => {
    if (!activeInvitation) return 'العرسان';
    const p = activeInvitation.people || {};
    return `${p.firstPerson || ''} ${p.relation || '&'} ${p.secondPerson || ''}`.trim();
  }, [activeInvitation]);

  // Load actual local submissions strictly isolated by selectedInvitationId
  const loadLocalSubmissions = useCallback(() => {
    const list = getGuestResponsesByInvitation(selectedInvitationId);
    setLocalResponses(list);
  }, [selectedInvitationId]);

  useEffect(() => {
    trackPageView('/guests');
    loadLocalSubmissions();

    // Listen for cross-tab or local RSVP events
    const handleStorageEvent = () => loadLocalSubmissions();
    window.addEventListener('wisal_rsvp_saved', handleStorageEvent);
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('wisal_rsvp_saved', handleStorageEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [loadLocalSubmissions]);

  // Handle Invitation Switch
  const handleInvitationChange = (newInvId) => {
    setSelectedInvitationId(newInvId);
    const targetInv = getInvitationById(newInvId);
    if (targetInv) {
      setSearchParams({ inv: targetInv.slug });
    }
  };

  const showToast = (text) => {
    setToastMessage(text);
    setTimeout(() => {
      setToastMessage('');
    }, 2400);
  };

  // Combine datasets based on active view
  const combinedResponses = useMemo(() => {
    if (dataView === 'local') return localResponses;
    if (dataView === 'demo') return SAMPLE_DEMO_DATA;
    // 'all' view: local submissions take top priority, followed by demo data
    return [...localResponses, ...SAMPLE_DEMO_DATA];
  }, [dataView, localResponses]);

  // Mathematical Totals Verification STRICTLY for this active invitation/view
  const stats = useMemo(() => {
    const totalYes = combinedResponses.filter((r) => r.attending === 'yes').length;
    const totalNo = combinedResponses.filter((r) => r.attending === 'no').length;
    const totalPeople = combinedResponses.reduce(
      (acc, r) => acc + (r.attending === 'yes' ? (parseInt(r.guests, 10) || 0) : 0),
      0
    );
    return { totalYes, totalNo, totalPeople };
  }, [combinedResponses]);

  // Filtered rows by search and status
  const filteredResponses = useMemo(() => {
    return combinedResponses.filter((r) => {
      if (statusFilter === 'yes' && r.attending !== 'yes') return false;
      if (statusFilter === 'no' && r.attending !== 'no') return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return r.name.toLowerCase().includes(q) || (r.message && r.message.toLowerCase().includes(q));
    });
  }, [combinedResponses, statusFilter, searchQuery]);

  // Messages with text
  const messageItems = useMemo(() => {
    return combinedResponses.filter((r) => r.message && r.message.trim().length > 0);
  }, [combinedResponses]);

  // CSV Export with UTF-8 BOM (\uFEFF) strictly for selected invitation
  const handleExportCSV = () => {
    const headers = ['الاسم', 'الرد', 'عدد الأفراد', 'الرسالة', 'تاريخ الرد', 'معرف الدعوة', 'المصدر'];
    const rows = filteredResponses.map((r) => [
      r.name,
      r.attending === 'yes' ? 'حاضر' : 'اعتذر',
      r.attending === 'yes' ? r.guests : 0,
      r.message || '',
      new Date(r.createdAt || r.time).toLocaleString('ar-EG', {
        timeZone: 'Africa/Cairo',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      selectedInvitationId,
      r.source === 'client_local' ? 'رد محلي من هذا المتصفح' : 'نموذج تجريبي'
    ]);

    const totalRow = [
      'الإجمالي',
      `${stats.totalYes} حاضر · ${stats.totalNo} اعتذر`,
      `${stats.totalPeople} فرد`,
      '',
      '',
      '',
      ''
    ];

    const allData = [headers, ...rows, [], totalRow];
    const csvContent = allData
      .map((row) =>
        row
          .map((cell) => {
            let clean = String(cell == null ? '' : cell);
            if (/^[=+\-@]/.test(clean)) clean = "'" + clean;
            return `"${clean.replace(/"/g, '""')}"`;
          })
          .join(',')
      )
      .join('\r\n');

    // Prepend UTF-8 BOM for perfect Excel Arabic display
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ضيوف-${coupleNames}.csv`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      link.remove();
    }, 500);

    showToast('تم تصدير ملف Excel بترميز UTF-8 سليم ✓');
  };

  // Copy Summary text to clipboard
  const handleCopySummary = () => {
    const text = `ضيوف ${coupleNames} (${activeInvitation?.event?.title || 'دعوة خاصة'}) — منصة وِصال
حاضر: ${stats.totalYes} | اعتذر: ${stats.totalNo} | إجمالي الأفراد: ${stats.totalPeople}

${filteredResponses
  .map(
    (r, i) =>
      `${i + 1}. ${r.name} — ${r.attending === 'yes' ? `حاضر (${r.guests} أفراد)` : 'اعتذر'}${
        r.message ? ` — "${r.message}"` : ''
      }`
  )
  .join('\n')}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        () => showToast('تم نسخ القائمة إلى الحافظة ✓'),
        () => showToast('تعذر النسخ تلقائياً')
      );
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadLocalSubmissions();
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('تم تحديث البيانات لحظياً ✓');
    }, 400);
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('هل تريد حذف هذا الرد من سجل هذا الجهاز؟')) {
      deleteGuestResponse(id);
      loadLocalSubmissions();
      showToast('تم حذف الرد بنجاح');
    }
  };

  const handleClearLocal = () => {
    if (window.confirm(`هل تريد مسح ردود دعوة "${coupleNames}" المسجلة محلياً؟`)) {
      clearGuestResponses(selectedInvitationId);
      loadLocalSubmissions();
      showToast('تم تفريغ السجل المحلي لهذه الدعوة');
    }
  };

  return (
    <div
      className="guest-dashboard-page"
      style={{
        background: '#fbf7ee',
        minHeight: '100vh',
        color: '#422f1d',
        fontFamily: 'Cairo, sans-serif',
        padding: '36px 16px 80px',
        lineHeight: 1.7
      }}
    >
      <div
        className="guest-dashboard-wrap"
        style={{
          maxWidth: '840px',
          margin: '0 auto'
        }}
      >
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
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

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                background: '#e7f2ea',
                color: '#2f7d5b',
                padding: '4px 12px',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Check size={12} />
              {localResponses.length} رد محلي لدعوة {coupleNames}
            </span>

            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                background: '#efe1c6',
                color: '#6e4921',
                padding: '4px 12px',
                borderRadius: '999px'
              }}
            >
              معمارية التخزين المنعزل (Isolated)
            </span>
          </div>
        </div>

        {/* Multi-Invitation Selector Dropdown */}
        <div
          style={{
            background: '#fffdf9',
            border: '1px solid #eedec7',
            borderRadius: '16px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} style={{ color: '#87602d' }} />
            <span style={{ fontWeight: 700, fontSize: '14.5px', color: '#4a3520' }}>
              اختر الدعوة لعرض ضيوفها:
            </span>
          </div>

          <select
            value={selectedInvitationId}
            onChange={(e) => handleInvitationChange(e.target.value)}
            style={{
              flex: '1 1 280px',
              maxWidth: '420px',
              padding: '9px 14px',
              borderRadius: '10px',
              border: '1.5px solid #c79a57',
              background: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              color: '#422f1d',
              fontFamily: 'Cairo, sans-serif',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {invitations.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.people.firstPerson} & {inv.people.secondPerson} ({inv.categoryLabel}) — {inv.event.title}
              </option>
            ))}
          </select>
        </div>

        {/* Hero Header */}
        <header style={{ textAlign: 'center', marginBottom: '20px' }}>
          <small
            style={{
              color: '#87602d',
              fontSize: '15px',
              fontWeight: 700,
              letterSpacing: '0.04em'
            }}
          >
            لوحة إدارة وتأكيد الحضور المنعزلة
          </small>
          <h1
            style={{
              fontFamily: 'Aref Ruqaa, Amiri, serif',
              fontSize: 'clamp(34px, 7vw, 52px)',
              margin: '6px 0 0',
              color: '#5a3d1c',
              lineHeight: 1.25
            }}
          >
            ضيوف {coupleNames}
          </h1>

          <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#7a6857' }}>
            {activeInvitation?.event?.title} — {activeInvitation?.event?.dateFormatted}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              color: '#c5a059',
              marginTop: '8px'
            }}
          >
            <div style={{ width: '60px', height: '1px', background: 'linear-gradient(90deg, transparent, #c5a059)' }} />
            <Heart size={16} fill="#c5a059" />
            <div style={{ width: '60px', height: '1px', background: 'linear-gradient(-90deg, transparent, #c5a059)' }} />
          </div>
        </header>

        {/* Explicit Warning Banner as Required */}
        <div
          style={{
            background: '#fff8eb',
            border: '1.5px solid #f0cd8a',
            borderRadius: '16px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}
        >
          <AlertTriangle size={22} style={{ color: '#b57a1e', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '13.5px', color: '#754d12' }}>
            <b style={{ display: 'block', fontSize: '14.5px', marginBottom: '2px', color: '#573809' }}>
              الردود محفوظة على هذا الجهاز والمتصفح فقط، ولا تتم مزامنتها بين أجهزة مختلفة.
            </b>
            هذه المنصة تعمل بمعمارية واجهة أمامية خالصة (Client-Only Storage). كل دعوة لها معرف فريد (invitationId)
            مستقل تماماً لضمان عدم تداخل الردود بين الدعوات المختلفة على هذا الجهاز.
          </div>
        </div>

        {/* Data Source Switcher Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            marginBottom: '18px',
            flexWrap: 'wrap'
          }}
        >
          <button
            onClick={() => setDataView('local')}
            style={{
              padding: '7px 18px',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              border: dataView === 'local' ? '1px solid #2f7d5b' : '1px solid #eedec7',
              background: dataView === 'local' ? '#2f7d5b' : '#fffdf9',
              color: dataView === 'local' ? '#fff' : '#5a4635',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            الردود الفعلية لدعوة {coupleNames} ({localResponses.length})
          </button>

          <button
            onClick={() => setDataView('demo')}
            style={{
              padding: '7px 18px',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              border: dataView === 'demo' ? '1px solid #87602d' : '1px solid #eedec7',
              background: dataView === 'demo' ? '#87602d' : '#fffdf9',
              color: dataView === 'demo' ? '#fff' : '#5a4635'
            }}
          >
            بيانات استرشادية تجريبية ({SAMPLE_DEMO_DATA.length})
          </button>

          <button
            onClick={() => setDataView('all')}
            style={{
              padding: '7px 18px',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              border: dataView === 'all' ? '1px solid #76532e' : '1px solid #eedec7',
              background: dataView === 'all' ? '#76532e' : '#fffdf9',
              color: dataView === 'all' ? '#fff' : '#5a4635'
            }}
          >
            عرض الكل ({localResponses.length + SAMPLE_DEMO_DATA.length})
          </button>
        </div>

        {/* Live Mathematical KPIs (Strictly for this invitation) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 95px), 1fr))',
            gap: '10px',
            marginBottom: '20px'
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #c79a57, #9a6d36)',
              borderRadius: '16px',
              padding: '16px 10px',
              textAlign: 'center',
              color: '#fff',
              boxShadow: '0 8px 24px -10px rgba(154, 109, 54, 0.4)'
            }}
          >
            <b style={{ display: 'block', fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 800, lineHeight: 1.1 }}>
              {stats.totalPeople.toLocaleString('ar-EG')}
            </b>
            <span style={{ fontSize: '13px', opacity: 0.95 }}>فرد حاضر</span>
          </div>

          <div
            style={{
              background: '#fffdf9',
              border: '1px solid #eedec7',
              borderRadius: '16px',
              padding: '16px 10px',
              textAlign: 'center'
            }}
          >
            <b style={{ display: 'block', fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 800, color: '#2f7d5b', lineHeight: 1.1 }}>
              {stats.totalYes.toLocaleString('ar-EG')}
            </b>
            <span style={{ fontSize: '13px', color: '#7a6857' }}>تأكيد حضور</span>
          </div>

          <div
            style={{
              background: '#fffdf9',
              border: '1px solid #eedec7',
              borderRadius: '16px',
              padding: '16px 10px',
              textAlign: 'center'
            }}
          >
            <b style={{ display: 'block', fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 800, color: '#a3253a', lineHeight: 1.1 }}>
              {stats.totalNo.toLocaleString('ar-EG')}
            </b>
            <span style={{ fontSize: '13px', color: '#7a6857' }}>اعتذار</span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            alignItems: 'center',
            marginBottom: '16px'
          }}
        >
          <div style={{ flex: '1 1 240px', position: 'relative' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#a38d77',
                pointerEvents: 'none'
              }}
            />
            <input
              type="search"
              placeholder="ابحث بالاسم أو نص الرسالة…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 40px 10px 14px',
                borderRadius: '12px',
                border: '1px solid #eedec7',
                background: '#fffdf9',
                fontSize: '14px',
                color: '#422f1d',
                outline: 'none',
                fontFamily: 'Cairo, sans-serif'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setStatusFilter('all')}
              style={{
                border: statusFilter === 'all' ? '1px solid #76532e' : '1px solid #eedec7',
                background: statusFilter === 'all' ? '#76532e' : '#fffdf9',
                color: statusFilter === 'all' ? '#fff' : '#5a4635',
                padding: '8px 16px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              الكل ({combinedResponses.length})
            </button>
            <button
              onClick={() => setStatusFilter('yes')}
              style={{
                border: statusFilter === 'yes' ? '1px solid #2f7d5b' : '1px solid #eedec7',
                background: statusFilter === 'yes' ? '#2f7d5b' : '#fffdf9',
                color: statusFilter === 'yes' ? '#fff' : '#5a4635',
                padding: '8px 16px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              حاضر ({stats.totalYes})
            </button>
            <button
              onClick={() => setStatusFilter('no')}
              style={{
                border: statusFilter === 'no' ? '1px solid #a3253a' : '1px solid #eedec7',
                background: statusFilter === 'no' ? '#a3253a' : '#fffdf9',
                color: statusFilter === 'no' ? '#fff' : '#5a4635',
                padding: '8px 16px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              اعتذر ({stats.totalNo})
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '20px',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button
              onClick={handleExportCSV}
              style={{
                background: 'linear-gradient(135deg, #c79a57, #9a6d36)',
                color: '#fff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Download size={16} />
              تصدير ملف Excel لدعوة {coupleNames}
            </button>

            <button
              onClick={handleCopySummary}
              style={{
                background: '#fffdf9',
                color: '#5a3d1c',
                border: '1px solid #eedec7',
                padding: '10px 16px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Copy size={16} />
              نسخ ملخص الحضور
            </button>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              style={{
                background: '#fffdf9',
                color: '#5a3d1c',
                border: '1px solid #eedec7',
                padding: '10px 14px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RefreshCw size={15} className={isRefreshing ? 'spin' : ''} />
              تحديث
            </button>
          </div>

          {localResponses.length > 0 && dataView !== 'demo' && (
            <button
              onClick={handleClearLocal}
              style={{
                background: 'transparent',
                color: '#a3253a',
                border: '1px solid #eedec7',
                padding: '8px 12px',
                borderRadius: '10px',
                fontSize: '12.5px',
                cursor: 'pointer'
              }}
            >
              مسح ردود هذه الدعوة
            </button>
          )}
        </div>

        {/* Responses List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '36px' }}>
          {filteredResponses.length === 0 ? (
            <div
              style={{
                background: '#fffdf9',
                border: '1px solid #eedec7',
                borderRadius: '14px',
                padding: '36px 16px',
                textAlign: 'center',
                color: '#8a7660'
              }}
            >
              {dataView === 'local'
                ? `لا توجد ردود مسجلة بعد لدعوة "${coupleNames}". عند تأكيد أي ضيف لحضوره من رابط الدعوة، سيظهر رده هنا فورياً.`
                : 'لم نجد أي ضيوف يطابقون معايير البحث.'}
            </div>
          ) : (
            filteredResponses.map((r) => {
              const isYes = r.attending === 'yes';
              const isLocal = r.source === 'client_local';

              return (
                <div
                  key={r.id}
                  style={{
                    background: '#fffdf9',
                    border: isLocal ? '1.5px solid #2f7d5b' : '1px solid #eedec7',
                    borderRadius: '14px',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    boxShadow: '0 4px 12px -8px rgba(0,0,0,0.05)',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '16px', color: '#3a2717' }}>
                          {r.name}
                        </span>

                        {isLocal ? (
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              background: '#e7f2ea',
                              color: '#2f7d5b',
                              padding: '2px 8px',
                              borderRadius: '999px'
                            }}
                          >
                            رد محلي مسجل
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              background: '#f4ebd9',
                              color: '#87602d',
                              padding: '2px 8px',
                              borderRadius: '999px'
                            }}
                          >
                            نموذج تجريبي
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '12px', color: '#96816d' }}>
                        {new Date(r.createdAt || r.time).toLocaleString('ar-EG', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ textAlign: 'left' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            fontSize: '13px',
                            fontWeight: 700,
                            padding: '3px 12px',
                            borderRadius: '999px',
                            background: isYes ? '#e7f2ea' : '#f8e6e8',
                            color: isYes ? '#2f7d5b' : '#a3253a'
                          }}
                        >
                          {isYes ? 'حاضر' : 'اعتذر'}
                        </span>
                        {isYes && (
                          <div style={{ fontSize: '12px', color: '#8a7660', marginTop: '2px' }}>
                            {(r.guests || 1).toLocaleString('ar-EG')} {r.guests === 1 ? 'فرد' : 'أفراد'}
                          </div>
                        )}
                      </div>

                      {isLocal && (
                        <button
                          onClick={() => handleDeleteItem(r.id)}
                          title="حذف هذا الرد"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#b57a72',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {r.message && (
                    <div
                      style={{
                        background: '#f8f2e6',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        fontSize: '14px',
                        color: '#4e3b2b',
                        whiteSpace: 'pre-wrap',
                        marginTop: '4px'
                      }}
                    >
                      {r.message}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Guest Love Letters / Messages Wall */}
        {messageItems.length > 0 && (
          <section style={{ marginTop: '40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h2
                style={{
                  fontFamily: 'Aref Ruqaa, Amiri, serif',
                  fontSize: '32px',
                  color: '#5a3d1c',
                  margin: 0
                }}
              >
                رسائل الحب والتهنئة
              </h2>
              <p style={{ margin: '4px 0 0', color: '#87602d', fontSize: '14px' }}>
                شاركوا تهاني أحبابكم كـ Story أنيقة وفخمة على حساباتكم بدقة 1080×1920
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '14px'
              }}
            >
              {messageItems.map((m) => (
                <div
                  key={m.id}
                  style={{
                    background: '#fffdf9',
                    border: '1px solid #eedec7',
                    borderRadius: '16px',
                    padding: '18px',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 8px 20px -12px rgba(120, 82, 35, 0.2)'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '14px',
                      fontSize: '44px',
                      color: 'rgba(197, 160, 89, 0.35)',
                      fontFamily: 'Georgia, serif',
                      lineHeight: 1,
                      pointerEvents: 'none'
                    }}
                  >
                    “
                  </div>

                  <p
                    style={{
                      margin: '12px 0 16px',
                      fontSize: '14.5px',
                      color: '#422f1d',
                      lineHeight: 1.65,
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {m.message}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid #f2e7d7',
                      paddingTop: '12px',
                      marginTop: 'auto'
                    }}
                  >
                    <b style={{ fontSize: '14px', color: '#87602d' }}>{m.name}</b>

                    <button
                      onClick={() =>
                        setActiveStory({
                          message: m.message,
                          name: m.name
                        })
                      }
                      style={{
                        background: '#fbf3e4',
                        border: '1px solid #e2cbaf',
                        borderRadius: '999px',
                        padding: '5px 12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#6e4921',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <Share2 size={13} />
                      شير ستوري
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer Note */}
        <footer
          style={{
            marginTop: '48px',
            textAlign: 'center',
            fontSize: '13px',
            color: '#8a7660',
            borderTop: '1px solid #eedec7',
            paddingTop: '24px'
          }}
        >
          <p>
            تصلكم ردود المعازيم محلياً على هذا المتصفح، مع إمكانية الربط المباشر بأي قاعدة بيانات سحابية.
          </p>
          <div style={{ marginTop: '12px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link
              to="/links"
              style={{
                color: '#87602d',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              أداة صانع روابط المعازيم ←
            </Link>
            <span>·</span>
            <Link
              to="/card"
              style={{
                color: '#87602d',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              كروت QR المطبوعة للترابيزات ←
            </Link>
          </div>
        </footer>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#5a3d1c',
            color: '#fff',
            padding: '10px 22px',
            borderRadius: '999px',
            fontSize: '14px',
            fontWeight: 600,
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            zIndex: 9999,
            pointerEvents: 'none'
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Story Card Modal */}
      {activeStory && (
        <StoryCardModal
          isOpen={Boolean(activeStory)}
          onClose={() => setActiveStory(null)}
          guestMessage={activeStory.message}
          guestName={activeStory.name}
          coupleNames={coupleNames}
        />
      )}
    </div>
  );
}
