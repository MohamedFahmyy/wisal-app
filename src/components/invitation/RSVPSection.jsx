import React, { useState, useEffect } from 'react';
import { CheckCircle2, Heart, ShieldCheck, Sparkles } from '../../utils/icons';
import { saveGuestResponse } from '../../utils/guestStorage';
import { submitRsvp } from '../../utils/api';

export function RSVPSection({ guestName, t, language, slug = '' }) {
  const [name, setName] = useState(guestName || '');
  const [attending, setAttending] = useState('yes'); // 'yes' or 'no'
  const [guestCount, setGuestCount] = useState('2');
  const [note, setNote] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Keep synced if guestName URL param changes
  useEffect(() => {
    if (guestName) {
      setName(guestName);
    }
  }, [guestName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setErrorMsg(language === 'ar' ? 'يرجى كتابة الاسم لتأكيد الحضور' : 'Please enter your name to confirm RSVP');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    const pathSlug = typeof window !== 'undefined'
      ? window.location.pathname.replace(/^\/invite\//, '').replace(/\/$/, '')
      : 'general';
    const targetSlug = slug || pathSlug || 'general';
    const resolvedGuests = attending === 'yes' ? parseInt(guestCount, 10) || 1 : 1;

    try {
      // 1. Send to real backend API via Vercel proxy
      await submitRsvp({
        invitationId: targetSlug.startsWith('inv_') ? targetSlug : `inv_${targetSlug}`,
        name: trimmed,
        attending,
        guests: resolvedGuests,
        message: note.trim(),
        honeypot
      });

      // 2. Silent local backup copy (so offline/local guest dashboard retains history)
      try {
        saveGuestResponse({
          name: trimmed,
          attending,
          guests: attending === 'yes' ? resolvedGuests : 0,
          message: note.trim(),
          invitationId: targetSlug,
          slug: targetSlug
        });
      } catch (localErr) {
        // Silent catch for local backup
      }

      setSubmitted(true);
    } catch (err) {
      console.error('[RSVP Error]', err);
      // Requirement 6: If failed or API unavailable, DO NOT show "submitted", display clear Arabic error
      setErrorMsg(
        err.message ||
        (language === 'ar'
          ? 'تعذر إرسال الرد إلى الخادم، يرجى التأكد من اتصالك بالإنترنت والمحاولة مرة أخرى.'
          : 'Failed to submit RSVP to the server. Please check your connection and try again.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setErrorMsg('');
  };

  return (
    <div id="rsvp" className="invitation-rsvp-card">
      <div className="rsvp-badge">
        <Sparkles size={14} />
        <span>{t.kindlyReply}</span>
      </div>

      <h3 className="rsvp-title">
        {language === 'ar' ? 'مستعدون لمشاركتنا الفرحة؟' : 'Will You Join Our Celebration?'}
      </h3>
      <p className="rsvp-subtitle">{t.rsvpSubtitle}</p>

      {submitted ? (
        <div className="rsvp-feedback-box">
          <div className="feedback-check">
            <CheckCircle2 size={36} />
          </div>
          <h4 className="feedback-title">
            {attending === 'yes' ? 'يسعدنا ويشرفنا حضوركم!' : 'سنفتقد وجودكم بكل تأكيد!'}
          </h4>
          <p className="feedback-message">
            {attending === 'yes' ? t.rsvpSuccessMessage : t.rsvpDeclinedMessage}
          </p>

          <div className="feedback-details">
            <div>
              <b>{language === 'ar' ? 'الاسم:' : 'Name:'}</b> {name.trim() || (language === 'ar' ? 'ضيف كريم' : 'Honored Guest')}
            </div>
            {attending === 'yes' && (
              <div>
                <b>{language === 'ar' ? 'عدد الأفراد:' : 'Guests:'}</b> {guestCount}
              </div>
            )}
            {note.trim() && (
              <div>
                <b>{language === 'ar' ? 'رسالة التهنئة:' : 'Message:'}</b> «{note.trim()}»
              </div>
            )}
          </div>

          <div
            style={{
              marginTop: '14px',
              padding: '10px 14px',
              background: '#eef6f0',
              border: '1px solid #cce5d4',
              borderRadius: '10px',
              fontSize: '13px',
              color: '#24613b',
              textAlign: 'center',
              fontWeight: '500'
            }}
          >
            {language === 'ar'
              ? '✓ تم تسجيل تأكيد حضوركم وإرساله للعروسين بنجاح 🤍'
              : '✓ Your RSVP has been successfully sent to the couple! 🤍'}
          </div>

          <button onClick={resetForm} className="btn-edit-rsvp" style={{ marginTop: '14px' }}>
            {language === 'ar' ? 'تعديل بيانات الحضور' : 'Edit Response'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rsvp-form" noValidate>
          {/* Honeypot field for bot protection */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ display: 'none' }}
            tabIndex="-1"
            autoComplete="off"
            aria-hidden="true"
          />

          <div className="form-group">
            <label className="form-label">{t.guestNameLabel} <span style={{ color: '#b57a72' }}>*</span></label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder={t.guestNamePlaceholder}
              className={`form-input ${errorMsg ? 'has-error' : ''}`}
            />
            {errorMsg && (
              <span className="form-error-text" style={{ color: '#b57a72', fontSize: '12.5px', marginTop: '4px', display: 'block' }}>
                {errorMsg}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">{t.attendingStatus}</label>
            <div className="attendance-options">
              <button
                type="button"
                className={`attendance-btn ${attending === 'yes' ? 'is-selected' : ''}`}
                onClick={() => setAttending('yes')}
              >
                <span>{t.willAttend}</span>
                <Heart size={16} fill={attending === 'yes' ? 'currentColor' : 'none'} />
              </button>

              <button
                type="button"
                className={`attendance-btn decline ${attending === 'no' ? 'is-selected' : ''}`}
                onClick={() => setAttending('no')}
              >
                <span>{t.willNotAttend}</span>
              </button>
            </div>
          </div>

          {attending === 'yes' && (
            <div className="form-group">
              <label className="form-label">{t.guestCountLabel}</label>
              <select
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="form-select"
              >
                <option value="1">{t.onePerson}</option>
                <option value="2">{t.twoPersons}</option>
                <option value="3">{t.threePersons}</option>
                <option value="4">{t.fourPersons}</option>
                <option value="5">{t.fiveOrMore}</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              {language === 'ar' ? 'كلمة محبة للعروسين (اختياري)' : 'Warm Wish (Optional)'}
            </label>
            <textarea
              rows="2"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={language === 'ar' ? 'اكتبوا تهنئتكم أو أي ملاحظات...' : 'Write your congratulations...'}
              className="form-textarea"
            />
          </div>

          <button type="submit" className="btn-submit-rsvp" disabled={isSubmitting}>
            <span>{isSubmitting ? (language === 'ar' ? 'جارٍ الإرسال...' : 'Submitting...') : t.submitRSVP}</span>
            <Sparkles size={16} />
          </button>
        </form>
      )}
    </div>
  );
}
export default RSVPSection;
