/**
 * Wisal Privacy-First Analytics Tracker
 * 
 * Inspired by Ma3zoom's track.js:
 * - Zero cookies, zero personal IP addresses or invasive fingerprinting.
 * - Captures page path, guest query (?to=), UTM attribution (?from=, ?utm_source=),
 *   referrer origin, and device classification (mobile, tablet, desktop, in-app browser).
 */

export function detectDevice() {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent || '';
  let device = /iPad|Tablet/i.test(ua) ? 'tablet' : (/Mobi|Android|iPhone/i.test(ua) ? 'mobile' : 'desktop');
  
  if (/FBAN|FBAV/i.test(ua)) {
    device += ' (Facebook in-app)';
  } else if (/Instagram/i.test(ua)) {
    device += ' (Instagram in-app)';
  } else if (/WhatsApp/i.test(ua)) {
    device += ' (WhatsApp in-app)';
  }
  return device;
}

export function trackPageView(customPage) {
  if (typeof window === 'undefined') return;

  try {
    const host = window.location.hostname;
    const pathname = window.location.pathname.replace(/\/$/, '') || '/';
    const page = customPage || pathname;

    const params = new URLSearchParams(window.location.search);
    const to = params.get('to') || params.get('guest') || params.get('name') || '';
    const from = params.get('from') || params.get('utm_source') || '';

    let referrer = '';
    try {
      referrer = document.referrer ? new URL(document.referrer).hostname : '';
    } catch {
      referrer = '';
    }
    if (referrer === host) referrer = 'internal';
    if (!referrer) referrer = 'direct';

    const device = detectDevice();
    const lang = document.documentElement.lang || 'ar';

    // Unique per-day visit flag (privacy-preserving local session cache)
    const today = new Date().toISOString().slice(0, 10);
    const seenKey = `wisal_view_${page}_${today}`;
    let isUniqueToday = true;
    try {
      if (localStorage.getItem(seenKey)) {
        isUniqueToday = false;
      } else {
        localStorage.setItem(seenKey, '1');
      }
    } catch {
      // LocalStorage access restricted
    }

    const payload = {
      event: 'page_view',
      page,
      to: to.slice(0, 100),
      from: from.slice(0, 100),
      ref: referrer,
      device,
      lang,
      isUniqueToday,
      timestamp: new Date().toISOString()
    };

    // Client-side event logging
    if (process.env.NODE_ENV === 'development') {
      console.debug('[Wisal Analytics]', payload);
    }

    // Optional webhook endpoint dispatch if defined
    const endpoint = window.__WISAL_ANALYTICS_ENDPOINT__;
    if (endpoint) {
      const data = new URLSearchParams(payload);
      fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        body: data,
        keepalive: true
      }).catch(() => {});
    }
  } catch (err) {
    // Fail silently to never interfere with client experience
  }
}
