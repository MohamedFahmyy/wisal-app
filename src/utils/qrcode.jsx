import React, { useMemo } from 'react';
import { encodeQrMatrix } from './qrEngine';

/**
 * 100% Offline, Zero-Dependency Crisp Vector SVG QR Code Component
 */
export function QRCodeSvg({
  value,
  size = 180,
  color = '#3a2717',
  bgColor = '#ffffff',
  className = ''
}) {
  const matrix = useMemo(() => {
    try {
      return encodeQrMatrix(value);
    } catch (err) {
      console.warn('[QRCode] Failed to generate offline QR matrix:', err);
      return [];
    }
  }, [value]);

  if (!matrix || matrix.length === 0) {
    return (
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          background: bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: '12px'
        }}
      >
        QR Error
      </div>
    );
  }

  const N = matrix.length;
  // 4 modules quiet zone margin as per QR standard
  const margin = 2;
  const viewBoxSize = N + margin * 2;

  // Build combined path for maximum rendering performance
  let pathD = '';
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (matrix[r][c]) {
        pathD += `M${c + margin},${r + margin}h1v1h-1z `;
      }
    }
  }

  return (
    <div
      className={`qr-svg-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        background: bgColor,
        borderRadius: '14px',
        boxShadow: '0 6px 18px rgba(0,0,0,0.06)'
      }}
    >
      <svg
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        width={size}
        height={size}
        style={{
          display: 'block',
          shapeRendering: 'crispEdges'
        }}
        aria-label={`QR Code for ${value}`}
      >
        <rect width={viewBoxSize} height={viewBoxSize} fill={bgColor} />
        <path d={pathD} fill={color} />
      </svg>
    </div>
  );
}

export default QRCodeSvg;
