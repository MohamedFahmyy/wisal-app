/**
 * Wisal Smooth Auto-Scroll Showcase Engine
 * 
 * Automatically scrolls down the page smoothly and cinematically after opening.
 * Stops immediately on any user interaction (touch, wheel, pointerdown, scroll, or keydown).
 */

export function startAutoScroll(options = {}) {
  if (typeof window === 'undefined') return () => {};

  const {
    delay = 3200,
    speed = 46,
    stopAt = null
  } = options;

  let isRunning = false;
  let rafId = null;
  let lastTime = 0;
  let carry = 0;
  let userInteracted = false;
  let timerId = null;

  const cancel = () => {
    userInteracted = true;
    isRunning = false;
    if (rafId) cancelAnimationFrame(rafId);
    if (timerId) clearTimeout(timerId);
    removeListeners();
  };

  const handleInteraction = (e) => {
    // Ignore floating audio buttons or sound toggles
    if (e?.target?.closest && (
      e.target.closest('.mus') ||
      e.target.closest('.velvet-mus') ||
      e.target.closest('.rosearch-mus') ||
      e.target.closest('.mf-music-floating-btn') ||
      e.target.closest('.floating-audio-btn')
    )) {
      return;
    }
    cancel();
  };

  const events = ['wheel', 'touchstart', 'touchmove', 'pointerdown', 'mousedown', 'keydown'];

  const addListeners = () => {
    events.forEach((evt) => {
      window.addEventListener(evt, handleInteraction, { passive: true });
    });
  };

  const removeListeners = () => {
    events.forEach((evt) => {
      window.removeEventListener(evt, handleInteraction);
    });
  };

  addListeners();

  timerId = setTimeout(() => {
    if (userInteracted) return;

    isRunning = true;
    document.documentElement.style.scrollBehavior = 'auto';

    function step(currentTime) {
      if (!isRunning || userInteracted) return;

      if (!lastTime) lastTime = currentTime;
      const dt = Math.min(currentTime - lastTime, 100);
      lastTime = currentTime;

      carry += (speed * dt) / 1000;
      const stepPixels = Math.floor(carry);

      if (stepPixels >= 1) {
        carry -= stepPixels;
        window.scrollBy(0, stepPixels);
      }

      // Check max scroll height
      const scrollEl = document.scrollingElement || document.documentElement;
      const maxScroll = scrollEl.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY || scrollEl.scrollTop;

      // Check stopAt element boundary (e.g. #rsvp or target card)
      let targetBottom = maxScroll;
      if (stopAt) {
        const targetEl = typeof stopAt === 'string' ? document.querySelector(stopAt) : stopAt;
        if (targetEl) {
          targetBottom = targetEl.getBoundingClientRect().top + window.scrollY - 60;
        }
      }

      if (currentScroll >= Math.min(targetBottom, maxScroll) - 4) {
        cancel();
        return;
      }

      rafId = requestAnimationFrame(step);
    }

    rafId = requestAnimationFrame(step);
  }, delay);

  return cancel;
}
