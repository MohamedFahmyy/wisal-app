import fs from 'node:fs';

let content = fs.readFileSync('src/data/invitations.js', 'utf8');

const slugToId = {
  'mazen-farida': 'inv_mazen_farida',
  'mohamed-salma': 'inv_mohamed_salma',
  'karim-hagar': 'inv_karim_hagar',
  'omar-eman': 'inv_omar_eman',
  'youssef-laila': 'inv_youssef_laila',
  'salma-omar': 'inv_salma_omar',
  'ahmed-nour': 'inv_ahmed_nour',
  'nour-birthday': 'inv_nour_birthday',
  'adam-jana': 'inv_adam_jana',
  'seif-malak': 'inv_seif_malak',
  'hana-karim': 'inv_hana_karim',
  'malek-nour': 'inv_malek_nour',
  'yara-graduation': 'inv_yara_graduation'
};

for (const [slug, id] of Object.entries(slugToId)) {
  const target = `slug: '${slug}',`;
  const replacement = `id: '${id}',\n    slug: '${slug}',`;
  if (!content.includes(`id: '${id}',`)) {
    content = content.replace(target, replacement);
  }
}

const endTarget = `export function getInvitationBySlug(slug) {
  return invitations.find((inv) => inv.slug === slug);
}`;

const endReplacement = `export function getInvitationBySlug(slug) {
  return invitations.find((inv) => inv.slug === slug || inv.id === slug);
}

export function getInvitationById(id) {
  return invitations.find((inv) => inv.id === id || inv.slug === id);
}

export function resolveInvitationId(slugOrId) {
  if (!slugOrId) return 'inv_general';
  const found = invitations.find((inv) => inv.id === slugOrId || inv.slug === slugOrId);
  return found ? found.id : ('inv_' + String(slugOrId).replace(/[^a-zA-Z0-9_]/g, '_'));
}`;

if (content.includes(endTarget)) {
  content = content.replace(endTarget, endReplacement);
}

fs.writeFileSync('src/data/invitations.js', content, 'utf8');
console.log('Successfully injected unique IDs and helper functions into invitations.js');
