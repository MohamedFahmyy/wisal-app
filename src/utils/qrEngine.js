import QRCode from 'qrcode';

/**
 * Standards-compliant, 100% ISO/IEC 18004 QR Code Matrix Generator
 * Returns an N x N boolean matrix where true = dark module, false = light module.
 * Fully compatible with all iOS, Android, and industrial barcode scanners.
 */
export function encodeQrMatrix(text) {
  if (!text) return [];
  try {
    const qr = QRCode.create(text, { errorCorrectionLevel: 'M' });
    const N = qr.modules.size;
    const matrix = [];
    for (let r = 0; r < N; r++) {
      const row = [];
      for (let c = 0; c < N; c++) {
        row.push(qr.modules.get(r, c) === 1);
      }
      matrix.push(row);
    }
    return matrix;
  } catch (err) {
    console.warn('[qrEngine] Failed to create standard QR matrix:', err);
    return [];
  }
}

export default encodeQrMatrix;
