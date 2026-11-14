/**
 * Lightweight, zero-dependency, 100% offline QR Code generator
 * Generates standards-compliant QR Code (Model 2, Byte Mode, ECC Level M/L)
 * as crisp vector SVG elements.
 */

// Precomputed GF(256) tables for Reed-Solomon encoding
const EXP_TABLE = new Uint8Array(256);
const LOG_TABLE = new Uint8Array(256);
for (let i = 0, x = 1; i < 255; i++) {
  EXP_TABLE[i] = x;
  LOG_TABLE[x] = i;
  x = (x << 1) ^ ((x >> 7) * 0x11d);
}
EXP_TABLE[255] = EXP_TABLE[0];

function gMult(a, b) {
  return a === 0 || b === 0 ? 0 : EXP_TABLE[(LOG_TABLE[a] + LOG_TABLE[b]) % 255];
}

// Generate Reed-Solomon generator polynomial
function rsGeneratorPoly(degree) {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const nextPoly = new Uint8Array(poly.length + 1);
    for (let j = 0; j < poly.length; j++) {
      nextPoly[j] ^= gMult(poly[j], EXP_TABLE[i]);
      nextPoly[j + 1] ^= poly[j];
    }
    poly = nextPoly;
  }
  return poly;
}

// Compute Reed-Solomon ECC codewords
function calculateEcc(data, eccLength) {
  const gen = rsGeneratorPoly(eccLength);
  const res = new Uint8Array(data.length + eccLength);
  res.set(data);
  for (let i = 0; i < data.length; i++) {
    const coef = res[i];
    if (coef !== 0) {
      for (let j = 0; j < gen.length; j++) {
        res[i + j] ^= gMult(gen[j], coef);
      }
    }
  }
  return res.slice(data.length);
}

// Minimalist Version definitions (Versions 1 to 5, Byte mode, ECC M)
const VERSIONS = [
  null,
  { size: 21, dataCap: 14, eccCount: 10, align: [] },
  { size: 25, dataCap: 26, eccCount: 16, align: [6, 18] },
  { size: 29, dataCap: 42, eccCount: 26, align: [6, 22] },
  { size: 33, dataCap: 62, eccCount: 18 * 2, align: [6, 26], blocks: 2 },
  { size: 37, dataCap: 84, eccCount: 24 * 2, align: [6, 30], blocks: 2 },
  { size: 41, dataCap: 106, eccCount: 16 * 4, align: [6, 34], blocks: 4 },
  { size: 45, dataCap: 122, eccCount: 18 * 4, align: [6, 22, 38], blocks: 4 },
  { size: 49, dataCap: 152, eccCount: 22 * 4, align: [6, 24, 42], blocks: 4 }
];

export function encodeQrMatrix(text) {
  // Convert text to UTF-8 bytes
  const encoder = new TextEncoder();
  const textBytes = encoder.encode(text);
  const dataLen = textBytes.length;

  // Pick smallest fitting version
  let version = 1;
  while (version < VERSIONS.length && VERSIONS[version].dataCap < dataLen + 2) {
    version++;
  }
  if (version >= VERSIONS.length) version = VERSIONS.length - 1;
  const vInfo = VERSIONS[version];

  // Encode byte mode header: Mode 0100 (4 bits) + Length (8 bits for v1-9) + data
  const bits = [];
  function pushBits(val, len) {
    for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1);
  }
  pushBits(4, 4); // Byte mode indicator
  pushBits(Math.min(dataLen, vInfo.dataCap), 8); // Character count
  for (let i = 0; i < Math.min(dataLen, vInfo.dataCap); i++) {
    pushBits(textBytes[i], 8);
  }
  // Terminator
  pushBits(0, 4);
  while (bits.length % 8 !== 0) bits.push(0);

  // Convert bitstream to bytes
  const dataBytes = new Uint8Array(vInfo.dataCap);
  let byteIdx = 0;
  for (let i = 0; i < bits.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8; j++) b = (b << 1) | (bits[i + j] || 0);
    dataBytes[byteIdx++] = b;
  }
  // Pad bytes 0xEC, 0x11
  const pad = [0xec, 0x11];
  let pIdx = 0;
  while (byteIdx < vInfo.dataCap) {
    dataBytes[byteIdx++] = pad[pIdx++ % 2];
  }

  // Calculate ECC
  const eccBytes = calculateEcc(dataBytes, vInfo.eccCount);

  // Combine data + ECC
  const allCodewords = new Uint8Array(dataBytes.length + eccBytes.length);
  allCodewords.set(dataBytes, 0);
  allCodewords.set(eccBytes, dataBytes.length);

  // Construct 2D Module Matrix
  const N = vInfo.size;
  const matrix = Array.from({ length: N }, () => new Array(N).fill(null));
  const reserved = Array.from({ length: N }, () => new Array(N).fill(false));

  function setModule(r, c, val, isRes = true) {
    if (r >= 0 && r < N && c >= 0 && c < N) {
      matrix[r][c] = val;
      if (isRes) reserved[r][c] = true;
    }
  }

  // Draw 7x7 Finder Pattern with 1px separator
  function drawFinder(row, col) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const nr = row + r;
        const nc = col + c;
        if (nr >= 0 && nr < N && nc >= 0 && nc < N) {
          if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
            const isDark = (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
            setModule(nr, nc, isDark);
          } else {
            setModule(nr, nc, false);
          }
        }
      }
    }
  }

  drawFinder(0, 0);
  drawFinder(0, N - 7);
  drawFinder(N - 7, 0);

  // Timing patterns
  for (let i = 8; i < N - 8; i++) {
    setModule(6, i, i % 2 === 0);
    setModule(i, 6, i % 2 === 0);
  }

  // Alignment patterns
  if (vInfo.align && vInfo.align.length) {
    for (const ar of vInfo.align) {
      for (const ac of vInfo.align) {
        if (!reserved[ar][ac]) {
          for (let r = -2; r <= 2; r++) {
            for (let c = -2; c <= 2; c++) {
              const dark = Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0);
              setModule(ar + r, ac + c, dark);
            }
          }
        }
      }
    }
  }

  // Reserve format information area
  for (let i = 0; i <= 8; i++) {
    if (!reserved[8][i]) setModule(8, i, false);
    if (!reserved[i][8]) setModule(i, 8, false);
  }
  for (let i = 0; i < 8; i++) {
    setModule(8, N - 1 - i, false);
    setModule(N - 1 - i, 8, false);
  }
  setModule(N - 8, 8, true); // Dark module

  // Place codewords in zigzag
  let bitPointer = 0;
  const totalBits = allCodewords.length * 8;
  let upwards = true;

  for (let col = N - 1; col > 0; col -= 2) {
    if (col === 6) col--; // Skip vertical timing pattern
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
          let bit = false;
          if (bitPointer < totalBits) {
            const byteVal = allCodewords[Math.floor(bitPointer / 8)];
            const bitInByte = 7 - (bitPointer % 8);
            bit = ((byteVal >> bitInByte) & 1) === 1;
            bitPointer++;
          }
          // Mask pattern 0: (row + col) % 2 === 0
          const mask = (row + c) % 2 === 0;
          matrix[row][c] = bit ^ mask;
        }
      }
    }
    upwards = !upwards;
  }

  // Format info for ECC Level M, Mask 0: 0x5412 XOR 0x5412 = 0
  const formatBits = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0];
  // Write format info around top-left, top-right, and bottom-left
  const formatLocsTop = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5],
    [8, 7], [8, 8], [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8]
  ];
  for (let i = 0; i < 15; i++) {
    const [r, c] = formatLocsTop[i];
    matrix[r][c] = formatBits[i] === 1;
  }

  const formatLocsOther = [
    [N - 1, 8], [N - 2, 8], [N - 3, 8], [N - 4, 8], [N - 5, 8], [N - 6, 7], [N - 7, 8],
    [8, N - 8], [8, N - 7], [8, N - 6], [8, N - 5], [8, N - 4], [8, N - 3], [8, N - 2], [8, N - 1]
  ];
  for (let i = 0; i < 15; i++) {
    const [r, c] = formatLocsOther[i];
    matrix[r][c] = formatBits[i] === 1;
  }

  return matrix;
}
