import React, { useEffect, useState, useRef } from 'react';
import { Download, Share2, X, Sparkles } from '../../utils/icons';

/**
 * 1080x1920 Social Story Generator (Instagram Story & WhatsApp Status)
 * Generates an editorial luxury card from guest wishes using HTML5 Canvas.
 */
export function StoryCardModal({
  isOpen,
  onClose,
  guestMessage = '',
  guestName = '',
  coupleNames = 'آدم ونور'
}) {
  const [imageUrl, setImageUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  const [canShare, setCanShare] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !guestMessage) {
      setImageUrl('');
      return;
    }

    let isMounted = true;
    setIsGenerating(true);

    const generateStory = async () => {
      // 1. Ensure fonts are loaded
      try {
        await Promise.all([
          document.fonts.load('700 80px "Aref Ruqaa"'),
          document.fonts.load('600 40px "Cairo"'),
          document.fonts.load('700 44px "Cairo"')
        ]);
      } catch {
        // Fallback to system fonts
      }

      const W = 1080;
      const H = 1920;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');

      // Luxury warm background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, '#fdfaf3');
      bgGrad.addColorStop(0.5, '#f7f0e3');
      bgGrad.addColorStop(1, '#eee2cc');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Radial subtle golden halos
      const rg1 = ctx.createRadialGradient(W * 0.15, H * 0.1, 0, W * 0.15, H * 0.1, 750);
      rg1.addColorStop(0, 'rgba(199, 154, 87, 0.25)');
      rg1.addColorStop(1, 'rgba(199, 154, 87, 0)');
      ctx.fillStyle = rg1;
      ctx.fillRect(0, 0, W, H);

      const rg2 = ctx.createRadialGradient(W * 0.85, H * 0.9, 0, W * 0.85, H * 0.9, 750);
      rg2.addColorStop(0, 'rgba(199, 154, 87, 0.22)');
      rg2.addColorStop(1, 'rgba(199, 154, 87, 0)');
      ctx.fillStyle = rg2;
      ctx.fillRect(0, 0, W, H);

      // Double Royal Border
      ctx.strokeStyle = '#c5a059';
      ctx.lineWidth = 3.5;
      ctx.strokeRect(54, 54, W - 108, H - 108);

      ctx.lineWidth = 1.2;
      ctx.strokeStyle = 'rgba(181, 138, 74, 0.55)';
      ctx.strokeRect(72, 72, W - 144, H - 144);

      // Corner ornamental flourishes
      const drawCornerFlourish = (x, y, flipX, flipY) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
        ctx.strokeStyle = '#c5a059';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 30);
        ctx.lineTo(0, 0);
        ctx.lineTo(30, 0);
        ctx.stroke();
        ctx.restore();
      };
      drawCornerFlourish(84, 84, false, false);
      drawCornerFlourish(W - 84, 84, true, false);
      drawCornerFlourish(84, H - 84, false, true);
      drawCornerFlourish(W - 84, H - 84, true, true);

      ctx.direction = 'rtl';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';

      // Header Tagline
      ctx.fillStyle = '#9a6d36';
      ctx.font = '600 38px "Cairo", sans-serif';
      ctx.fillText('رسالة حب ومباركة لـ', W / 2, 320);

      // Couple Names
      ctx.fillStyle = '#6b4c2b';
      let nameFontSize = 100;
      ctx.font = `700 ${nameFontSize}px "Aref Ruqaa", "Amiri", serif`;
      while (ctx.measureText(coupleNames).width > W - 260 && nameFontSize > 55) {
        nameFontSize -= 5;
        ctx.font = `700 ${nameFontSize}px "Aref Ruqaa", "Amiri", serif`;
      }
      ctx.fillText(coupleNames, W / 2, 470);

      // Divider & Heart
      ctx.strokeStyle = '#b58a4a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 240, 530);
      ctx.lineTo(W / 2 - 40, 530);
      ctx.moveTo(W / 2 + 40, 530);
      ctx.lineTo(W / 2 + 240, 530);
      ctx.stroke();

      ctx.fillStyle = '#b58a4a';
      ctx.font = '36px serif';
      ctx.fillText('♥', W / 2, 542);

      // Wrap text algorithm
      const wrapText = (text, maxWidth) => {
        const out = [];
        String(text).split(/\n+/).forEach((par) => {
          const words = par.trim().split(/\s+/);
          let line = '';
          words.forEach((w) => {
            const testLine = line ? `${line} ${w}` : w;
            if (ctx.measureText(testLine).width > maxWidth && line) {
              out.push(line);
              line = w;
            } else {
              line = testLine;
            }
          });
          if (line) out.push(line);
        });
        return out;
      };

      // Calculate dynamic font size for message
      let msgFontSize = 56;
      let lines = [];
      do {
        ctx.font = `600 ${msgFontSize}px "Cairo", sans-serif`;
        lines = wrapText(guestMessage, W - 260);
        msgFontSize -= 4;
      } while (lines.length * msgFontSize * 1.7 > 560 && msgFontSize > 32);
      msgFontSize += 4;

      const lineHeight = msgFontSize * 1.75;
      const topStart = Math.max(720, 1000 - (lines.length * lineHeight) / 2);

      // Quote symbol
      ctx.fillStyle = 'rgba(181, 138, 74, 0.45)';
      ctx.font = '180px Georgia, serif';
      ctx.fillText('”', W / 2, topStart + 10);

      // Message text
      ctx.fillStyle = '#3a2717';
      ctx.font = `600 ${msgFontSize}px "Cairo", sans-serif`;
      lines.forEach((line, i) => {
        ctx.fillText(line, W / 2, topStart + lineHeight * (i + 0.8) + 40);
      });

      // Guest signature
      ctx.fillStyle = '#87602d';
      ctx.font = '700 44px "Cairo", sans-serif';
      ctx.fillText(guestName, W / 2, topStart + lines.length * lineHeight + 130);

      // Bottom Wisal Branding
      const bottomY = H - 380;
      // Wax seal circle
      ctx.beginPath();
      ctx.arc(W / 2, bottomY, 32, 0, Math.PI * 2);
      ctx.fillStyle = '#8b263e';
      ctx.fill();

      // Subtle seal monogram W
      ctx.fillStyle = '#fff';
      ctx.font = '700 30px "Playfair Display", serif';
      ctx.fillText('وِ', W / 2, bottomY + 11);

      // Brand Title
      ctx.fillStyle = '#3a2717';
      ctx.font = '700 64px "Aref Ruqaa", serif';
      ctx.fillText('وِصال', W / 2, bottomY + 100);

      ctx.fillStyle = '#8a7660';
      ctx.font = '500 30px "Cairo", sans-serif';
      ctx.fillText('دعوات إلكترونية فاخرة', W / 2, bottomY + 150);

      ctx.direction = 'ltr';
      ctx.font = '400 24px "DM Sans", sans-serif';
      ctx.fillStyle = '#b58a4a';
      ctx.fillText('wisal-invitations.vercel.app', W / 2, bottomY + 195);

      canvas.toBlob((blob) => {
        if (!isMounted || !blob) return;
        const file = new File([blob], `story-${guestName || 'wisal'}.png`, { type: 'image/png' });
        fileRef.current = file;
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
        setIsGenerating(false);

        // Check Web Share API
        if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
          setCanShare(true);
        } else {
          setCanShare(false);
        }
      }, 'image/png');
    };

    generateStory();

    return () => {
      isMounted = false;
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [isOpen, guestMessage, guestName, coupleNames]);

  const handleShare = async () => {
    if (fileRef.current && navigator.share) {
      try {
        await navigator.share({
          files: [fileRef.current],
          title: `رسالة مباركة من ${guestName}`,
          text: `رسالة تهنئة من ${guestName} على منصة وِصال للدعوات الرقمية`
        });
      } catch {
        // User cancelled share
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="story-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(25, 17, 10, 0.88)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        className="story-modal-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          maxWidth: '480px',
          width: '100%'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Story Preview */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxHeight: '68vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {isGenerating ? (
            <div
              style={{
                height: '420px',
                width: '236px',
                background: '#fffdfa',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                color: '#87602d'
              }}
            >
              <Sparkles size={32} className="spin" />
              <span style={{ fontSize: '14px', fontFamily: 'Cairo, sans-serif' }}>جاري إنشاء صورة الستوري…</span>
            </div>
          ) : (
            <img
              src={imageUrl}
              alt="Story Preview"
              style={{
                maxHeight: '68vh',
                maxWidth: '85vw',
                borderRadius: '16px',
                boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
                objectFit: 'contain'
              }}
            />
          )}
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            justifyContent: 'center',
            width: '100%'
          }}
        >
          {canShare && (
            <button
              onClick={handleShare}
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                padding: '10px 18px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #c79a57, #9a6d36)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Share2 size={16} />
              شير على إنستجرام أو واتساب
            </button>
          )}

          <a
            href={imageUrl}
            download={`تهنئة-${guestName || 'ضيف'}.png`}
            style={{
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              padding: '10px 18px',
              borderRadius: '999px',
              background: '#fffdfa',
              color: '#4a3520',
              border: '1px solid #c79a57',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <Download size={16} />
            تحميل الصورة (PNG)
          </a>

          <button
            onClick={onClose}
            style={{
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              padding: '10px 16px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <X size={16} />
            إغلاق
          </button>
        </div>

        <small
          style={{
            color: '#f3e6cf',
            fontSize: '12px',
            textAlign: 'center',
            fontFamily: 'Cairo, sans-serif'
          }}
        >
          {canShare
            ? 'من قائمة المشاركة، اختاروا إنستجرام (Story) أو واتساب (حالة).'
            : 'قوموا بتحميل الصورة ثم ارفعوها كـ Story على إنستجرام أو حالة على واتساب.'}
        </small>
      </div>
    </div>
  );
}

export default StoryCardModal;
