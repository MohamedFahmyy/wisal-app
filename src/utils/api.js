/**
 * Wisal RSVP API Client
 * Requests route to same-domain /api/* which Vercel proxies to the backend server.
 */

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

/**
 * Submit guest RSVP response
 * @param {Object} payload - { invitationId, name, attending, guests, message, honeypot }
 * @returns {Promise<{ ok: boolean }>}
 */
export async function submitRsvp({
  invitationId,
  name,
  attending = 'yes',
  guests = 1,
  message = '',
  honeypot = ''
}) {
  const url = `${API_BASE_URL}/api/rsvp`;

  const bodyData = {
    invitationId,
    name: typeof name === 'string' ? name.trim() : '',
    attending: attending === 'no' ? 'no' : 'yes',
    guests: Math.max(1, Math.min(20, parseInt(guests, 10) || 1)),
    message: typeof message === 'string' ? message.trim() : '',
    website: honeypot || ''
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errMsg = data.error || (res.status === 404
        ? 'عذراً، لم يتم العثور على سجل هذه الدعوة.'
        : res.status === 429
        ? 'تم تجاوز حد المحاولات المسموح به، يرجى الانتظار قليلاً.'
        : 'تعذر إرسال الرد، يرجى المحاولة مرة أخرى.');
      const error = new Error(errMsg);
      error.status = res.status;
      throw error;
    }

    return { ok: true, data };
  } catch (err) {
    // If it's already our friendly Error with message, rethrow
    if (err.message && !err.message.includes('fetch')) {
      throw err;
    }
    // Network / offline error
    throw new Error('تعذر الاتصال بخادم الدعوات. يرجى التأكد من اتصالك بالإنترنت والمحاولة مجدداً.');
  }
}

/**
 * Fetch responses for an invitation with owner key
 * @param {string} invitationId
 * @param {string} ownerKey
 * @returns {Promise<{ ok: boolean, totals: Object, responses: Array } | null>}
 */
export async function fetchResponses(invitationId, ownerKey) {
  if (!invitationId || !ownerKey) {
    return null;
  }

  const cleanInvId = encodeURIComponent(invitationId.trim());
  const url = `${API_BASE_URL}/api/responses/${cleanInvId}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Owner-Key': ownerKey.trim()
      }
    });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'فشل في استرجاع قائمة الردود');
    }

    return await res.json();
  } catch (err) {
    if (err.status === 404) return null;
    throw err;
  }
}
