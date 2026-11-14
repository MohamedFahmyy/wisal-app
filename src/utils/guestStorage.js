/**
 * Wisal Multi-Invitation Guest Storage Architecture (Schema Version 2.0)
 * 
 * Provides robust client-side storage isolation, schema validation, deduplication,
 * and full CRUD operations per invitationId.
 * 
 * NOTE: Data stored in localStorage is browser-local on this device only
 * and does NOT synchronize across different devices or physical phones without a backend database.
 */

import { resolveInvitationId } from '../data/invitations.js';

export const SCHEMA_VERSION = 2;
const STORAGE_KEY = 'wisal_guest_responses_v2';
const LEGACY_STORAGE_KEY = 'wisal_guest_responses';

export const GUEST_STORAGE_CONTRACT = {
  version: '2.0',
  storageType: 'localStorage (Browser-Local Client Storage)',
  fields: [
    'id',
    'invitationId',
    'slug',
    'name',
    'attending',
    'guests',
    'message',
    'createdAt',
    'updatedAt',
    'source'
  ]
};

/**
 * Validates and normalizes a single record.
 * Returns null if record is invalid or corrupted.
 */
function validateAndNormalizeRecord(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const name = typeof raw.name === 'string' ? raw.name.trim() : '';
  if (!name) return null;

  const rawInv = raw.invitationId || raw.slug || 'general';
  const invitationId = resolveInvitationId(rawInv);
  const slug = raw.slug || invitationId.replace(/^inv_/, '').replace(/_/g, '-');

  const attending = String(raw.attending).toLowerCase() === 'no' ? 'no' : 'yes';
  const guests = attending === 'no' ? 0 : Math.max(1, parseInt(raw.guests, 10) || 1);
  const message = typeof raw.message === 'string' ? raw.message.trim() : '';

  const nowIso = new Date().toISOString();
  const createdAt = raw.createdAt || raw.time || nowIso;
  const updatedAt = raw.updatedAt || raw.time || createdAt;
  const id = raw.id || `local_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  return {
    id,
    invitationId,
    slug,
    name,
    attending,
    guests,
    message,
    createdAt,
    updatedAt,
    source: raw.source || 'client_local'
  };
}

/**
 * Reads and automatically migrates legacy records.
 */
function readAllFromStorage() {
  if (typeof window === 'undefined') return [];

  let list = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        list = parsed;
      }
    } else {
      // Check legacy v1 key
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        const legacyParsed = JSON.parse(legacyRaw);
        if (Array.isArray(legacyParsed)) {
          list = legacyParsed;
          // Migrate immediately
          const migrated = list.map(validateAndNormalizeRecord).filter(Boolean);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        }
      }
    }
  } catch (err) {
    console.warn('[GuestStorage] Corrupted storage detected, resetting safely:', err);
    return [];
  }

  // Validate every record
  return list.map(validateAndNormalizeRecord).filter(Boolean);
}

function writeAllToStorage(records) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    window.dispatchEvent(new CustomEvent('wisal_rsvp_saved', { detail: records }));
  } catch (err) {
    console.error('[GuestStorage] Failed to write records to localStorage:', err);
    throw err;
  }
}

/**
 * Retrieve all valid locally recorded guest submissions
 * @param {string|null} invitationIdOrSlug - Optional filter
 * @returns {Array} List of validated response objects
 */
export function getGuestResponses(invitationIdOrSlug = null) {
  const all = readAllFromStorage();
  if (!invitationIdOrSlug) return all;

  const targetId = resolveInvitationId(invitationIdOrSlug);
  return all.filter((item) => item.invitationId === targetId || item.slug === invitationIdOrSlug);
}

/**
 * Retrieve guest submissions isolated strictly by invitationId
 * @param {string} invitationId - Required unique invitationId
 * @returns {Array}
 */
export function getGuestResponsesByInvitation(invitationId) {
  if (!invitationId) return [];
  const targetId = resolveInvitationId(invitationId);
  return readAllFromStorage().filter((item) => item.invitationId === targetId);
}

/**
 * Persist a new guest RSVP response or update if duplicate name exists for same invitationId
 * @param {Object} data - { name, attending, guests, message, invitationId, slug }
 * @returns {Object} Saved or updated record
 */
export function saveGuestResponse({
  name,
  attending = 'yes',
  guests = 1,
  message = '',
  invitationId = '',
  slug = ''
}) {
  const trimmedName = typeof name === 'string' ? name.trim() : '';
  if (!trimmedName) {
    throw new Error('Name is required to save an RSVP response');
  }

  const resolvedInvId = resolveInvitationId(invitationId || slug);
  const resolvedSlug = slug || resolvedInvId.replace(/^inv_/, '').replace(/_/g, '-');
  const nowIso = new Date().toISOString();

  const all = readAllFromStorage();

  // Deduplication check: case-insensitive & whitespace-normalized name comparison
  const normalizedNewName = trimmedName.toLowerCase().replace(/\s+/g, ' ');
  const existingIndex = all.findIndex(
    (item) =>
      item.invitationId === resolvedInvId &&
      item.name.toLowerCase().replace(/\s+/g, ' ') === normalizedNewName
  );

  let resultRecord = null;

  if (existingIndex >= 0) {
    // Update existing record (prevent duplicates)
    const existing = all[existingIndex];
    resultRecord = {
      ...existing,
      name: trimmedName, // Keep latest capitalization
      attending: attending === 'no' ? 'no' : 'yes',
      guests: attending === 'no' ? 0 : Math.max(1, parseInt(guests, 10) || 1),
      message: (message || '').trim(),
      updatedAt: nowIso
    };
    all[existingIndex] = resultRecord;
  } else {
    // Insert new record
    resultRecord = {
      id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      invitationId: resolvedInvId,
      slug: resolvedSlug,
      name: trimmedName,
      attending: attending === 'no' ? 'no' : 'yes',
      guests: attending === 'no' ? 0 : Math.max(1, parseInt(guests, 10) || 1),
      message: (message || '').trim(),
      createdAt: nowIso,
      updatedAt: nowIso,
      source: 'client_local'
    };
    all.unshift(resultRecord);
  }

  writeAllToStorage(all);
  return resultRecord;
}

/**
 * Update an existing guest response by its unique record ID
 * @param {string} id - Record ID
 * @param {Object} updates - Fields to update
 * @returns {Object|null}
 */
export function updateGuestResponse(id, updates = {}) {
  if (!id) return null;
  const all = readAllFromStorage();
  const idx = all.findIndex((r) => r.id === id);
  if (idx === -1) return null;

  const existing = all[idx];
  const updated = {
    ...existing,
    ...updates,
    id: existing.id, // Immutable ID
    invitationId: existing.invitationId, // Immutable invitation association
    updatedAt: new Date().toISOString()
  };

  all[idx] = validateAndNormalizeRecord(updated);
  writeAllToStorage(all.filter(Boolean));
  return all[idx];
}

/**
 * Delete a specific guest response by ID
 * @param {string} id
 * @returns {boolean}
 */
export function deleteGuestResponse(id) {
  if (!id) return false;
  const all = readAllFromStorage();
  const initialLength = all.length;
  const filtered = all.filter((r) => r.id !== id);
  if (filtered.length === initialLength) return false;

  writeAllToStorage(filtered);
  return true;
}

/**
 * Clear guest submissions isolated by invitationId, or clear all if null
 * @param {string|null} invitationIdOrSlug
 */
export function clearGuestResponses(invitationIdOrSlug = null) {
  if (typeof window === 'undefined') return;

  if (!invitationIdOrSlug) {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('wisal_rsvp_saved', { detail: [] }));
    } catch (err) {
      console.warn('[GuestStorage] Failed to clear all responses:', err);
    }
    return;
  }

  const targetId = resolveInvitationId(invitationIdOrSlug);
  const all = readAllFromStorage();
  const remaining = all.filter((r) => r.invitationId !== targetId);
  writeAllToStorage(remaining);
}
