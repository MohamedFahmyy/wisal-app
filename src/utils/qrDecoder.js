/**
 * Independent QR Code Model 2 Matrix Decoder
 * Used for mathematical verification and round-trip automated validation.
 */

const VERSIONS = [
  null,
  { size: 21, dataCap: 14, eccCount: 10, align: [] },
  { size: 25, dataCap: 26, eccCount: 16, align: [6, 18] },
  { size: 29, dataCap: 42, eccCount: 26, align: [6, 22] },
  { size: 33, dataCap: 62, eccCount: 36, align: [6, 26] },
  { size: 37, dataCap: 84, eccCount: 48, align: [6, 30] },
  { size: 41, dataCap: 106, eccCount: 64, align: [6, 34] },
  { size: 45, dataCap: 122, eccCount: 72, align: [6, 22, 38] },
  { size: 49, dataCap: 152, eccCount: 88, align: [6, 24, 42] }
];

export function decodeQrMatrix(matrix) {
  if (!matrix || !matrix.length) return '';
  const N = matrix.length;

  const version = VERSIONS.findIndex(v => v && v.size === N);
  if (version === -1) {
    throw new Error(`Unsupported matrix size: ${N}`);
  }
  const vInfo = VERSIONS[version];

  // Reconstruct reserved mask
  const reserved = Array.from({ length: N }, () => new Array(N).fill(false));

  function markFinder(row, col) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const nr = row + r, nc = col + c;
        if (nr >= 0 && nr < N && nc >= 0 && nc < N) {
          reserved[nr][nc] = true;
        }
      }
    }
  }

  markFinder(0, 0);
  markFinder(0, N - 7);
  markFinder(N - 7, 0);

  // Timing patterns
  for (let i = 8; i < N - 8; i++) {
    reserved[6][i] = true;
    reserved[i][6] = true;
  }

  // Alignment patterns
  if (vInfo.align && vInfo.align.length) {
    for (const ar of vInfo.align) {
      for (const ac of vInfo.align) {
        if (!reserved[ar][ac]) {
          for (let r = -2; r <= 2; r++) {
            for (let c = -2; c <= 2; c++) {
              reserved[ar + r][ac + c] = true;
            }
          }
        }
      }
    }
  }

  // Format info area
  for (let i = 0; i <= 8; i++) {
    if (i < N) {
      reserved[8][i] = true;
      reserved[i][8] = true;
    }
  }
  for (let i = 0; i < 8; i++) {
    reserved[8][N - 1 - i] = true;
    reserved[N - 1 - i][8] = true;
  }
  reserved[N - 8][8] = true;

  // Unpack zigzag bitstream
  const bits = [];
  let upwards = true;

  for (let col = N - 1; col > 0; col -= 2) {
    if (col === 6) col--;
    const rows = [];
    if (upwards) {
      for (let r = N - 1; r >= 0; r--) rows.push(r);
    } else {
      for (let r = 0; r < N; r++) rows.push(r);
    }

    for (const row of rows) {
      for (let cOffset = 0; cOffset < 2; cOffset++) {
        const c = col - cOffset;
        if (!reserved[row][c]) {
          const mask = (row + c) % 2 === 0;
          const bit = matrix[row][c] ^ mask;
          bits.push(bit);
        }
      }
    }
    upwards = !upwards;
  }

  // Convert bits to bytes
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8; j++) {
      b = (b << 1) | bits[i + j];
    }
    bytes.push(b);
  }

  // Parse header
  // Mode: 4 bits
  let bitIdx = 0;
  function readBits(len) {
    let val = 0;
    for (let i = 0; i < len; i++) {
      val = (val << 1) | bits[bitIdx++];
    }
    return val;
  }

  const mode = readBits(4);
  if (mode !== 4) { // 0100 = Byte mode
    throw new Error(`Unexpected QR mode: ${mode}`);
  }

  const charCount = readBits(8);
  const outBytes = new Uint8Array(charCount);
  for (let i = 0; i < charCount; i++) {
    outBytes[i] = readBits(8);
  }

  const decoder = new TextDecoder('utf-8');
  return decoder.decode(outBytes);
}
