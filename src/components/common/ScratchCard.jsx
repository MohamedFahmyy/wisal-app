import React, { useRef, useEffect, useState, useCallback } from 'react';

/**
 * Reusable HTML5 Canvas Scratch-to-Reveal Engine
 * High-DPI / Retina-ready with touch & mouse support.
 */
export function ScratchCard({
  width = 280,
  height = 140,
  borderRadius = 16,
  coverText = 'امسح لكشف المفاجأة ✨',
  threshold = 45,
  onReveal,
  className = '',
  children
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const isDrawingRef = useRef(false);
  const scratchedPixelsRef = useRef(0);

  // Initialize canvas with luxury metallic gold gradient
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);

    // Luxury metallic gold gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#c79a57');
    gradient.addColorStop(0.25, '#dfb775');
    gradient.addColorStop(0.5, '#f3d99d');
    gradient.addColorStop(0.75, '#c79a57');
    gradient.addColorStop(1, '#9a6d36');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, borderRadius);
    ctx.fill();

    // Subtle luxury border inside canvas
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Scratch instruction text
    ctx.fillStyle = '#3a2712';
    ctx.font = '600 14px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(coverText, width / 2, height / 2);
  }, [width, height, borderRadius, coverText]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const cw = Math.floor(width * dpr);
    const ch = Math.floor(height * dpr);

    try {
      const imgData = ctx.getImageData(0, 0, cw, ch);
      const pixels = imgData.data;
      let transparent = 0;
      const total = pixels.length / 4;

      // Sample every 4th pixel for high performance
      for (let i = 3; i < pixels.length; i += 16) {
        if (pixels[i] === 0) transparent++;
      }

      const percent = (transparent / (total / 4)) * 100;
      if (percent >= threshold && !isRevealed) {
        setIsRevealed(true);
        if (onReveal) onReveal();
      }
    } catch {
      // In case of cross-origin security context
    }
  };

  const scratch = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    const x = (clientX - rect.left) * dpr;
    const y = (clientY - rect.top) * dpr;

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22 * dpr, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.restore();

    scratchedPixelsRef.current++;
    if (scratchedPixelsRef.current % 5 === 0) {
      checkScratchPercentage();
    }
  };

  const handlePointerDown = (e) => {
    isDrawingRef.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
    checkScratchPercentage();
  };

  return (
    <div
      ref={containerRef}
      className={`scratch-card-container ${className}`}
      style={{
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: `${borderRadius}px`,
        overflow: 'hidden',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    >
      {/* Revealed content underneath */}
      <div
        className="scratch-card-content"
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {children}
      </div>

      {/* Canvas scratch cover */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          cursor: isRevealed ? 'default' : 'grab',
          touchAction: 'none',
          transition: 'opacity 0.6s ease',
          opacity: isRevealed ? 0 : 1,
          pointerEvents: isRevealed ? 'none' : 'auto',
          borderRadius: `${borderRadius}px`
        }}
      />
    </div>
  );
}
export default ScratchCard;
