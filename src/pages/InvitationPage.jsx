import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowUpLeft, Heart, Sparkles } from '../utils/icons';
import { getInvitationBySlug } from '../data/invitations';
import { useInvitation } from '../hooks/useInvitation';
import { getTemplateComponent } from '../templates';
import { InvitationTopBar } from '../components/invitation/InvitationTopBar';
import { Toast } from '../components/common/Toast';

export default function InvitationPage() {
  const { slug } = useParams();
  const invitation = getInvitationBySlug(slug);

  const invitationHooks = useInvitation(invitation);
  const {
    language,
    isPlayingMusic,
    toggleMusic,
    toggleLanguage,
    copiedToast,
    copyShareLink,
    t
  } = invitationHooks;

  // Dynamic Page Title
  useEffect(() => {
    if (invitation) {
      const p = invitation.people;
      const title = `${p?.firstPerson || ''} ${p?.relation || '&'} ${p?.secondPerson || ''} — ${invitation.event?.title || 'دعوة خاصة'}`;
      document.title = title;
    } else {
      document.title = 'الدعوة غير موجودة — وِصال';
    }
  }, [invitation]);

  if (!invitation) {
    return (
      <main className="invitation-not-found-page">
        <div className="not-found-card">
          <div className="not-found-flourish">❦</div>
          <h2>عذراً، لم يتم العثور على هذه الدعوة</h2>
          <p>قد يكون الرابط غير صحيح أو انتهت صلاحية العرض التجريبي.</p>
          <Link to="/demos" className="btn-back-to-demos">
            <span>استكشف كافة تصميمات وِصال</span>
            <ArrowUpLeft size={16} />
          </Link>
        </div>
      </main>
    );
  }

  // Dynamically resolve template component from registry
  const TemplateComponent = getTemplateComponent(invitation.template);

  return (
    <div className={`invitation-experience-wrapper lang-${language}`}>
      {/* Sticky Floating Action Topbar */}
      <InvitationTopBar
        invitation={invitation}
        isPlayingMusic={isPlayingMusic}
        onToggleMusic={toggleMusic}
        language={language}
        onToggleLanguage={toggleLanguage}
        onShare={copyShareLink}
        t={t}
      />

      {/* Main Unique Template Canvas */}
      <main className="invitation-template-canvas">
        <TemplateComponent invitation={invitation} hooks={invitationHooks} />
      </main>

      {/* Link Copied Toast Notification */}
      <Toast message={t.linkCopied} visible={copiedToast} />
    </div>
  );
}
