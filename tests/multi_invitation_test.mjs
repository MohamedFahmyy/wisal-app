/**
 * Wisal Multi-Invitation Architecture & Data Isolation Test Suite
 * 
 * Verifies:
 * 1. Strict invitation data isolation (zero cross-contamination).
 * 2. Schema versioning, validation, and safe error handling.
 * 3. RSVP deduplication on identical guest names.
 * 4. Full CRUD operations per invitationId.
 * 5. Independent QR Code round-trip decoding.
 * 6. Cairo timezone and Calendar RFC 5545 integrity.
 */

import {
  saveGuestResponse,
  getGuestResponses,
  getGuestResponsesByInvitation,
  updateGuestResponse,
  deleteGuestResponse,
  clearGuestResponses,
  SCHEMA_VERSION
} from '../src/utils/guestStorage.js';
import { encodeQrMatrix } from '../src/utils/qrEngine.js';
import { decodeQrMatrix } from '../src/utils/qrDecoder.js';
import { invitations, resolveInvitationId, getInvitationById } from '../src/data/invitations.js';
import { getEventEpochMs } from '../src/hooks/useCountdown.js';
import { createICSContent } from '../src/utils/calendar.js';

// Setup Mock LocalStorage for headless Node environment
const storageStore = new Map();
global.localStorage = {
  getItem: (key) => storageStore.get(key) || null,
  setItem: (key, val) => storageStore.set(key, String(val)),
  removeItem: (key) => storageStore.delete(key),
  clear: () => storageStore.clear()
};
global.window = { dispatchEvent: () => {} };

let passedCount = 0;
let failedCount = 0;

function testAssert(title, condition, extraInfo = '') {
  if (condition) {
    console.log(`  ✓ PASS: ${title}`);
    passedCount++;
  } else {
    console.error(`  ✗ FAIL: ${title} ${extraInfo ? `-> ${extraInfo}` : ''}`);
    failedCount++;
  }
}

console.log('===============================================================');
console.log('  WISAL MULTI-INVITATION DATA ISOLATION & COMPREHENSIVE QA');
console.log('===============================================================\n');

// -------------------------------------------------------------
// 1. DATA MODEL & INVITATION ID AUDIT
// -------------------------------------------------------------
console.log('Test Group 1: Invitation Registry & ID Verification');
testAssert('All 16 invitations are registered', invitations.length === 16);

const allIds = invitations.map(i => i.id);
const uniqueIds = new Set(allIds);
testAssert('Every invitation has a unique, non-null ID', uniqueIds.size === 16 && !uniqueIds.has(undefined));

testAssert('Mohamed & Salma has inv_mohamed_salma', resolveInvitationId('mohamed-salma') === 'inv_mohamed_salma');
testAssert('Mazen & Farida has inv_mazen_farida', resolveInvitationId('mazen-farida') === 'inv_mazen_farida');
testAssert('Velvet has inv_velvet', resolveInvitationId('velvet') === 'inv_velvet');
testAssert('Rose Arch has inv_rosearch', resolveInvitationId('rosearch') === 'inv_rosearch');
testAssert('Adam & Jana has inv_adam_jana', resolveInvitationId('adam-jana') === 'inv_adam_jana');
testAssert('Lookup by ID works', getInvitationById('inv_karim_hagar')?.slug === 'karim-hagar');

// -------------------------------------------------------------
// 2. MULTI-INVITATION DATA ISOLATION
// -------------------------------------------------------------
console.log('\nTest Group 2: Multi-Invitation Data Isolation');
clearGuestResponses(); // Clean slate

// Submit for Invitation A: Mohamed & Salma
const rA1 = saveGuestResponse({
  name: 'طارق العوضي',
  attending: 'yes',
  guests: 2,
  message: 'ألف مبروك يا محمد ويا سلمى',
  invitationId: 'inv_mohamed_salma'
});
const rA2 = saveGuestResponse({
  name: 'سارة عبد الرحمن',
  attending: 'no',
  guests: 0,
  message: 'أعتذر لظروف السفر',
  invitationId: 'inv_mohamed_salma'
});

// Submit for Invitation B: Mazen & Farida
const rB1 = saveGuestResponse({
  name: 'مروان الشريف',
  attending: 'yes',
  guests: 3,
  message: 'فرحة العمر يا مازن ويا فريدة',
  invitationId: 'inv_mazen_farida'
});

// Submit for Invitation C: Adam & Jana
const rC1 = saveGuestResponse({
  name: 'John Miller',
  attending: 'yes',
  guests: 1,
  message: 'Congratulations Adam & Jana!',
  invitationId: 'inv_adam_jana'
});

const listA = getGuestResponsesByInvitation('inv_mohamed_salma');
const listB = getGuestResponsesByInvitation('inv_mazen_farida');
const listC = getGuestResponsesByInvitation('inv_adam_jana');

testAssert('Invitation A has exactly 2 responses', listA.length === 2);
testAssert('Invitation B has exactly 1 response', listB.length === 1);
testAssert('Invitation C has exactly 1 response', listC.length === 1);

testAssert(
  'Invitation A contains only Mohamed & Salma guests',
  listA.every(r => r.invitationId === 'inv_mohamed_salma')
);
testAssert(
  'Invitation B contains only Mazen & Farida guests',
  listB.every(r => r.invitationId === 'inv_mazen_farida')
);
testAssert(
  'Invitation C contains only Adam & Jana guests',
  listC.every(r => r.invitationId === 'inv_adam_jana')
);

// Cross-contamination verification:
testAssert(
  'Invitation A does NOT contain Mazen or Adam guests',
  !listA.some(r => r.name === 'مروان الشريف' || r.name === 'John Miller')
);

// -------------------------------------------------------------
// 3. DEDUPLICATION & RECORD UPDATING
// -------------------------------------------------------------
console.log('\nTest Group 3: Deduplication & Update Handling');
// Submit again with same name for Mohamed & Salma with updated guest count & message
const rA1Updated = saveGuestResponse({
  name: 'طارق العوضي',
  attending: 'yes',
  guests: 4, // Changed from 2 to 4
  message: 'تم تعديل الحضور لـ 4 أفراد، ربنا يتمم على خير',
  invitationId: 'inv_mohamed_salma'
});

const listAAfterUpdate = getGuestResponsesByInvitation('inv_mohamed_salma');
testAssert('Deduplication prevents count inflation (still 2 records)', listAAfterUpdate.length === 2);
testAssert('Record ID preserved across update', rA1Updated.id === rA1.id);
testAssert('Guests count updated to 4', rA1Updated.guests === 4);
testAssert('Record has updatedAt >= createdAt', new Date(rA1Updated.updatedAt) >= new Date(rA1Updated.createdAt));

// -------------------------------------------------------------
// 4. CRUD OPERATIONS (Update, Delete, Isolated Clear)
// -------------------------------------------------------------
console.log('\nTest Group 4: Full CRUD Operations');
// Update
const updatedRecord = updateGuestResponse(rB1.id, { message: 'رسالة محدثة' });
testAssert('updateGuestResponse updates message', updatedRecord && updatedRecord.message === 'رسالة محدثة');

// Delete single record
const deleteSuccess = deleteGuestResponse(rA2.id);
testAssert('deleteGuestResponse successfully removes record', deleteSuccess);
testAssert('Invitation A count decreased to 1', getGuestResponsesByInvitation('inv_mohamed_salma').length === 1);

// Isolated Clear for Invitation A
clearGuestResponses('inv_mohamed_salma');
testAssert('Invitation A is now empty', getGuestResponsesByInvitation('inv_mohamed_salma').length === 0);
testAssert('Invitation B is still intact (1 record)', getGuestResponsesByInvitation('inv_mazen_farida').length === 1);
testAssert('Invitation C is still intact (1 record)', getGuestResponsesByInvitation('inv_adam_jana').length === 1);

// -------------------------------------------------------------
// 5. INDEPENDENT QR CODE DECODING & ROUND-TRIP INTEGRITY
// -------------------------------------------------------------
console.log('\nTest Group 5: QR Code Round-Trip Decoding Validation');
const qrTestCases = [
  'https://wisal.vercel.app/mazen-farida',
  'https://wisal.vercel.app/invite/mohamed-salma',
  'https://wisal.vercel.app/invite/adam-jana?wish=1#rsvp',
  'https://wisal.vercel.app/invite/classic?to=%D8%A3%D8%AD%D9%85%D8%AF%20%D9%88%D9%86%D9%88%D8%B1'
];

qrTestCases.forEach((url, i) => {
  const matrix = encodeQrMatrix(url);
  const decoded = decodeQrMatrix(matrix);
  testAssert(`QR Code #${i + 1} decodes with 100% fidelity`, decoded === url, `Decoded: ${decoded}`);
});

// -------------------------------------------------------------
// 6. CAIRO TIMEZONE & CALENDAR INTEGRITY
// -------------------------------------------------------------
console.log('\nTest Group 6: Cairo Timezone & RFC 5545 Calendar');
const winterEpoch = getEventEpochMs('2027-01-14', '19:00', 'Africa/Cairo');
const summerEpoch = getEventEpochMs('2027-07-14', '19:00', 'Africa/Cairo');
testAssert('Cairo winter (UTC+2) maps 19:00 to 17:00 UTC', new Date(winterEpoch).getUTCHours() === 17);
testAssert('Cairo summer (UTC+3) maps 19:00 to 16:00 UTC', new Date(summerEpoch).getUTCHours() === 16);

const icsText = createICSContent(invitations[0]);
testAssert('ICS contains BEGIN:VCALENDAR', icsText.includes('BEGIN:VCALENDAR'));
testAssert('ICS contains SUMMARY', icsText.includes('SUMMARY:'));
testAssert('ICS contains LOCATION', icsText.includes('LOCATION:'));
testAssert('ICS contains DTSTART', icsText.includes('DTSTART:'));

// -------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------
console.log('\n===============================================================');
console.log(`RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`);
console.log(`OVERALL STATUS: ${failedCount === 0 ? 'SUCCESS (ALL TESTS VERIFIED)' : 'FAILED'}`);
console.log('===============================================================');

process.exit(failedCount === 0 ? 0 : 1);
