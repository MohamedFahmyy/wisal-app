import { saveGuestResponse, getGuestResponses, clearGuestResponses } from '../src/utils/guestStorage.js';
import { encodeQrMatrix } from '../src/utils/qrEngine.js';
import { getEventEpochMs } from '../src/hooks/useCountdown.js';
import { createICSContent } from '../src/utils/calendar.js';

console.log('========================================================');
console.log('   WISAL E2E FUNCTIONAL UNIT & DATA FLOW AUDIT');
console.log('========================================================\n');

// Mock localStorage for Node environment
const storageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();
global.localStorage = storageMock;
global.window = { dispatchEvent: () => {} };

let allPassed = true;
function assert(desc, condition, details = '') {
  if (condition) {
    console.log(`[PASS] ${desc}`);
  } else {
    console.error(`[FAIL] ${desc} - ${details}`);
    allPassed = false;
  }
}

// ----------------------------------------------------
// TEST 1: RSVP STORAGE ADAPTER
// ----------------------------------------------------
console.log('--- Test Suite 1: RSVP Storage Adapter ---');
clearGuestResponses();
assert('Initial storage is empty', getGuestResponses().length === 0);

const resp1 = saveGuestResponse({
  name: 'أحمد & نور مصطفى',
  attending: 'yes',
  guests: 3,
  message: 'ألف مبروك! مبروك للعروسين 🤍',
  slug: 'mohamed-salma'
});
assert('Saved record has unique ID', resp1.id && resp1.id.startsWith('local_'));
assert('Saved record source is client_local', resp1.source === 'client_local');
assert('Saved record name matches', resp1.name === 'أحمد & نور مصطفى');
assert('Saved record count matches', resp1.guests === 3);

const resp2 = saveGuestResponse({
  name: 'John & Sarah Miller',
  attending: 'no',
  guests: 2,
  message: 'Warmest congratulations!',
  slug: 'adam-jana'
});
assert('Attending=no sets guests to 0', resp2.guests === 0);

const allSaved = getGuestResponses();
assert('Storage contains 2 records', allSaved.length === 2);

const filteredSlug = getGuestResponses('mohamed-salma');
assert('Filter by slug works', filteredSlug.length === 1 && filteredSlug[0].slug === 'mohamed-salma');

// ----------------------------------------------------
// TEST 2: KPI MATHEMATICAL CONSISTENCY
// ----------------------------------------------------
console.log('\n--- Test Suite 2: KPI Mathematical Integrity ---');
const totalYes = allSaved.filter(r => r.attending === 'yes').length;
const totalNo = allSaved.filter(r => r.attending === 'no').length;
const totalPeople = allSaved.reduce((acc, r) => acc + (r.attending === 'yes' ? r.guests : 0), 0);

assert('totalYes calculation correct', totalYes === 1);
assert('totalNo calculation correct', totalNo === 1);
assert('totalPeople calculation correct', totalPeople === 3);

// ----------------------------------------------------
// TEST 3: PERSONALIZED URLS & SPECIAL CHARACTERS
// ----------------------------------------------------
console.log('\n--- Test Suite 3: Personalized Links Encoding ---');
const testGuests = [
  'أحمد مصطفى',
  'سارة & كريم',
  'Dr. Sarah + John / London',
  'عائلة الشريف #1'
];
const baseUrl = 'https://wisal.vercel.app/invite/classic';

testGuests.forEach(gName => {
  const enc = encodeURIComponent(gName);
  const fullUrl = `${baseUrl}?to=${enc}`;
  const extracted = decodeURIComponent(new URL(fullUrl).searchParams.get('to'));
  assert(`URL encoding round-trip for "${gName}"`, extracted === gName, `got: ${extracted}`);
});

// ----------------------------------------------------
// TEST 4: OFFLINE QR CODE ENGINE
// ----------------------------------------------------
console.log('\n--- Test Suite 4: Offline Vector QR Code Engine ---');
const testQrUrls = [
  'https://wisal.vercel.app/mazen-farida',
  'https://wisal.vercel.app/invite/mohamed-salma?wish=1#rsvp',
  'https://wisal.vercel.app/invite/adam-jana?to=%D8%A3%D8%AD%D9%85%D8%AF%20%D9%85%D8%B5%D8%B7%D9%81%D9%89'
];

testQrUrls.forEach((qrUrl, idx) => {
  const matrix = encodeQrMatrix(qrUrl);
  assert(`QR Matrix generated for URL #${idx + 1}`, matrix && matrix.length >= 21);
  assert(`QR Matrix is square (N x N)`, matrix.length === matrix[0].length);
  // Check finder pattern top-left (7x7)
  const isFinderTopLeft = matrix[0][0] && matrix[0][6] && matrix[6][0] && matrix[6][6] && !matrix[0][7];
  assert(`Finder pattern present in matrix #${idx + 1}`, isFinderTopLeft);
});

// ----------------------------------------------------
// TEST 5: COUNTDOWN TIMEZONE ENGINE
// ----------------------------------------------------
console.log('\n--- Test Suite 5: Countdown Cairo Timezone Engine ---');
const winterEpoch = getEventEpochMs('2027-01-14', '19:00', 'Africa/Cairo');
const summerEpoch = getEventEpochMs('2027-07-14', '19:00', 'Africa/Cairo');

const winterDate = new Date(winterEpoch);
const summerDate = new Date(summerEpoch);

// In winter Cairo is UTC+2 (19:00 Cairo = 17:00 UTC)
assert('Winter Cairo 19:00 corresponds to UTC 17:00', winterDate.getUTCHours() === 17);
// In summer Cairo is UTC+3 (19:00 Cairo = 16:00 UTC)
assert('Summer Cairo 19:00 corresponds to UTC 16:00', summerDate.getUTCHours() === 16);

// ----------------------------------------------------
// TEST 6: CALENDAR ICS RFC 5545 BLOB GENERATION
// ----------------------------------------------------
console.log('\n--- Test Suite 6: Calendar ICS Generator ---');
const icsContent = createICSContent({
  people: { firstPerson: 'محمد', secondPerson: 'سلمى' },
  event: { title: 'حفل زفاف العمر', date: '2027-01-14', time: '19:00', timezone: 'Africa/Cairo' },
  venue: { name: 'قاعة الياسمين', address: 'القاهرة' },
  slug: 'mohamed-salma'
});
assert('ICS contains BEGIN:VCALENDAR', icsContent.includes('BEGIN:VCALENDAR'));
assert('ICS contains SUMMARY', icsContent.includes('SUMMARY:محمد & سلمى - حفل زفاف العمر'));
assert('ICS contains LOCATION', icsContent.includes('LOCATION:قاعة الياسمين, القاهرة'));

console.log('\n========================================================');
console.log(`ALL AUTOMATED FUNCTIONAL TESTS PASSED: ${allPassed ? 'YES (100%)' : 'NO'}`);
console.log('========================================================');
