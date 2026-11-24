import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import crypto from 'crypto';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '8585', 10);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://wisal-app-six.vercel.app';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';

// Trust proxy for reverse proxy / Vercel rewrite IP extraction
app.set('trust proxy', 1);

// Security Headers
app.use(helmet());

// CORS Configuration - allow specified origin and headers
const allowedOrigins = ALLOWED_ORIGIN.split(',').map((o) => o.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like curl, mobile apps, or same-origin rewrites)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS policy'));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-Owner-Key', 'Authorization', 'x-admin-token'],
    credentials: true,
    maxAge: 86400
  })
);

// Body parser limited to 10KB
app.use(express.json({ limit: '10kb' }));

// ---------------------------------------------------------------------------
// Rate Limiter: In-memory sliding window (10 requests per minute per IP)
// ---------------------------------------------------------------------------
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;

// Cleanup stale IP entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now - data.resetTime > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

function rsvpRateLimiter(req, res, next) {
  // Extract client IP (respecting trust proxy and X-Forwarded-For)
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : '') || req.ip || req.socket.remoteAddress || 'unknown';

  const now = Date.now();
  let record = rateLimitMap.get(clientIp);

  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS };
    rateLimitMap.set(clientIp, record);
    return next();
  }

  record.count += 1;
  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      ok: false,
      error: 'لقد تجاوزت عدد المحاولات المسموح بها، يرجى الانتظار دقيقة والمحاولة مرة أخرى.'
    });
  }

  next();
}

// ---------------------------------------------------------------------------
// Sanitization & Helpers
// ---------------------------------------------------------------------------
function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
}

function hashKey(key) {
  return crypto.createHash('sha256').update(String(key).trim()).digest('hex');
}

function timingSafeMatch(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// ---------------------------------------------------------------------------
// 1. Health Endpoint
// ---------------------------------------------------------------------------
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    status: 'healthy',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Also support /api/health through vercel rewrite
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    status: 'healthy',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// ---------------------------------------------------------------------------
// 2. POST /api/rsvp (Guest RSVP Submission)
// ---------------------------------------------------------------------------
app.post('/api/rsvp', rsvpRateLimiter, async (req, res) => {
  try {
    const { invitationId, name, attending, guests, message, website, honeypot } = req.body || {};

    // Honeypot check: If bot filled the hidden honeypot field, silently pretend success
    if (website || honeypot) {
      return res.json({ ok: true });
    }

    // Basic required field presence
    if (!invitationId || typeof invitationId !== 'string') {
      return res.status(400).json({ ok: false, error: 'معرّف الدعوة مطلوب' });
    }

    const cleanInvId = sanitizeText(invitationId).toLowerCase();
    const cleanName = sanitizeText(name);

    if (!cleanName || cleanName.length < 1 || cleanName.length > 100) {
      return res.status(400).json({ ok: false, error: 'يرجى إدخال اسم صحيح بين حرف و 100 حرف' });
    }

    if (attending !== 'yes' && attending !== 'no') {
      return res.status(400).json({ ok: false, error: 'حالة الحضور يجب أن تكون yes أو no' });
    }

    // Guests validation (1-20 for attending, or default 1/0)
    let parsedGuests = parseInt(guests, 10);
    if (isNaN(parsedGuests) || parsedGuests < 1) {
      parsedGuests = 1;
    } else if (parsedGuests > 20) {
      parsedGuests = 20;
    }

    // Message validation (optional, max 500 chars)
    let cleanMessage = null;
    if (message && typeof message === 'string') {
      cleanMessage = sanitizeText(message).slice(0, 500);
    }

    // Check if invitation exists in database, auto-provisioning valid invitations on first response
    let [invRows] = await pool.query('SELECT id FROM invitations WHERE id = ? LIMIT 1', [cleanInvId]);
    if (!invRows || invRows.length === 0) {
      // Auto-provision standard invitations so guests are NEVER blocked
      if (cleanInvId && cleanInvId.length >= 3 && cleanInvId.length <= 64) {
        const defaultOwnerKey = crypto.randomBytes(32).toString('hex');
        const defaultHash = hashKey(defaultOwnerKey);
        await pool.query(
          'INSERT IGNORE INTO invitations (id, owner_key_hash) VALUES (?, ?)',
          [cleanInvId, defaultHash]
        );
        [invRows] = await pool.query('SELECT id FROM invitations WHERE id = ? LIMIT 1', [cleanInvId]);
      }
    }

    if (!invRows || invRows.length === 0) {
      return res.status(404).json({ ok: false, error: 'عذراً، معرّف الدعوة غير موجود في النظام' });
    }

    // Insert response with parameterized query
    await pool.query(
      `INSERT INTO responses (invitation_id, name, attending, guests, message)
       VALUES (?, ?, ?, ?, ?)`,
      [cleanInvId, cleanName, attending, parsedGuests, cleanMessage]
    );

    return res.json({ ok: true });
  } catch (err) {
    console.error('[RSVP Error]', err);
    return res.status(500).json({ ok: false, error: 'حدث خطأ غير متوقع أثناء تسجيل الرد، يرجى المحاولة لاحقاً.' });
  }
});

// ---------------------------------------------------------------------------
// 3. GET /api/responses/:invitationId (Owner View Protected by X-Owner-Key)
// ---------------------------------------------------------------------------
app.get('/api/responses/:invitationId', async (req, res) => {
  try {
    const rawInvId = req.params.invitationId;
    const ownerKey = req.headers['x-owner-key'];

    if (!rawInvId || !ownerKey) {
      // Plain 404 on missing credentials/params to prevent enumeration
      return res.status(404).json({ ok: false, error: 'Not found' });
    }

    const cleanInvId = sanitizeText(rawInvId).toLowerCase();

    // Query invitation
    const [invRows] = await pool.query(
      'SELECT id, owner_key_hash FROM invitations WHERE id = ? LIMIT 1',
      [cleanInvId]
    );

    if (!invRows || invRows.length === 0) {
      return res.status(404).json({ ok: false, error: 'Not found' });
    }

    const storedHash = invRows[0].owner_key_hash;
    const providedHash = hashKey(ownerKey);

    // Constant-time check
    if (!timingSafeMatch(providedHash, storedHash)) {
      return res.status(404).json({ ok: false, error: 'Not found' });
    }

    // Key is verified! Fetch responses
    const [responses] = await pool.query(
      `SELECT id, name, attending, guests, message, submitted_at
       FROM responses
       WHERE invitation_id = ?
       ORDER BY submitted_at DESC`,
      [cleanInvId]
    );

    // Compute totals
    let attendingCount = 0;
    let notAttendingCount = 0;
    let totalGuests = 0;

    for (const r of responses) {
      if (r.attending === 'yes') {
        attendingCount += 1;
        totalGuests += Number(r.guests) || 1;
      } else {
        notAttendingCount += 1;
      }
    }

    return res.json({
      ok: true,
      invitationId: cleanInvId,
      totals: {
        attending: attendingCount,
        notAttending: notAttendingCount,
        totalGuests,
        responsesCount: responses.length
      },
      responses
    });
  } catch (err) {
    console.error('[Responses Error]', err);
    return res.status(500).json({ ok: false, error: 'Internal Server Error' });
  }
});

// ---------------------------------------------------------------------------
// 4. POST /api/admin/invitations (Create Invitation & Generate Owner Key)
// ---------------------------------------------------------------------------
app.post('/api/admin/invitations', async (req, res) => {
  try {
    if (!ADMIN_TOKEN) {
      return res.status(500).json({ ok: false, error: 'ADMIN_TOKEN not configured on server' });
    }

    // Check authorization header
    const authHeader = req.headers['authorization'] || '';
    const adminHeader = req.headers['x-admin-token'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim() || adminHeader;

    if (!token || !timingSafeMatch(token, ADMIN_TOKEN)) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }

    let { invitationId } = req.body || {};
    if (!invitationId || typeof invitationId !== 'string') {
      invitationId = `inv_${crypto.randomBytes(6).toString('hex')}`;
    } else {
      invitationId = sanitizeText(invitationId).toLowerCase();
    }

    // Check if invitation already exists
    const [existing] = await pool.query('SELECT id FROM invitations WHERE id = ? LIMIT 1', [invitationId]);
    if (existing && existing.length > 0) {
      return res.status(409).json({ ok: false, error: 'معرّف الدعوة مستخدم بالفعل' });
    }

    // Generate cryptographically secure 64-char hex key
    const ownerKey = crypto.randomBytes(32).toString('hex');
    const ownerKeyHash = hashKey(ownerKey);

    // Store in database
    await pool.query(
      'INSERT INTO invitations (id, owner_key_hash) VALUES (?, ?)',
      [invitationId, ownerKeyHash]
    );

    return res.status(201).json({
      ok: true,
      invitationId,
      ownerKey,
      note: 'احفظ مفتاح الصاحب (ownerKey) الآن؛ لن يتم إظهاره مرة أخرى.'
    });
  } catch (err) {
    console.error('[Admin Error]', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// ---------------------------------------------------------------------------
// Start Server
// ---------------------------------------------------------------------------
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Wisal RSVP Backend running on port ${PORT}`);
  console.log(`  Allowed Origin: ${ALLOWED_ORIGIN}`);
});
