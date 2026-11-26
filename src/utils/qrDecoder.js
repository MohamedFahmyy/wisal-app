import jsQR from 'jsqr';

/**
 * Standard QR Code Matrix Decoder (using jsQR)
 * Converts 2D boolean module matrix into RGBA buffer and decodes standards-compliant QR data.
 */
export function decodeQrMatrix(matrix) {
  if (!matrix || !matrix.length) return '';
  const N = matrix.length;
  const margin = 4;
  const width = N + margin * 2;
  const rgba = new Uint8ClampedArray(width * width * 4);
  rgba.fill(255);

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (matrix[r][c]) {
        const idx = ((r + margin) * width + (c + margin)) * 4;
        rgba[idx] = 0;
        rgba[idx + 1] = 0;
        rgba[idx + 2] = 0;
        rgba[idx + 3] = 255;
      }
    }
  }

  const result = jsQR(rgba, width, width);
  return result ? result.data : '';
}

export default decodeQrMatrix;
