import { useState, useEffect } from 'react';

/**
 * Custom hook for live, accurate countdown timing with timezone support.
 * Accurately parses Africa/Cairo (UTC+2 in winter, UTC+3 in Egyptian DST)
 * so that all guests worldwide count down to the exact same moment.
 */
export function useCountdown(dateString, timeString = '19:00', timezone = 'Africa/Cairo') {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(dateString, timeString, timezone));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(dateString, timeString, timezone));
    }, 1000);

    return () => clearInterval(timer);
  }, [dateString, timeString, timezone]);

  return timeLeft;
}

export function getEventEpochMs(dateString, timeString = '19:00', timezone = 'Africa/Cairo') {
  if (!dateString) return 0;
  try {
    const cleanTime = timeString.length === 5 ? timeString + ':00' : timeString;
    const [year, month, day] = dateString.split('-').map(Number);

    // Determine Cairo DST (+03:00 from last Friday of April through last Thursday of October, +02:00 otherwise)
    let offset = '+02:00';
    if (timezone === 'Africa/Cairo') {
      const isSummer = (month > 4 && month < 10) || (month === 4 && day >= 25) || (month === 10 && day <= 30);
      offset = isSummer ? '+03:00' : '+02:00';
    }

    const isoString = `${dateString}T${cleanTime}${offset}`;
    const parsed = new Date(isoString).getTime();
    return isNaN(parsed) ? new Date(`${dateString}T${cleanTime}`).getTime() : parsed;
  } catch {
    return 0;
  }
}

function calculateTimeLeft(dateString, timeString, timezone) {
  if (!dateString) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: false, totalMs: 0 };
  }

  try {
    const targetDate = getEventEpochMs(dateString, timeString, timezone);
    const now = Date.now();
    const totalMs = targetDate - now;

    if (isNaN(totalMs) || totalMs <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true, totalMs: 0 };
    }

    const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((totalMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((totalMs % (1000 * 60)) / 1000);

    return {
      days: Math.max(0, days),
      hours: Math.max(0, hours),
      minutes: Math.max(0, minutes),
      seconds: Math.max(0, seconds),
      isPassed: false,
      totalMs
    };
  } catch {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: false, totalMs: 0 };
  }
}
