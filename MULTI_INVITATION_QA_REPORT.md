# Wisal Digital Invitations — Multi-Invitation Data Isolation & Production Readiness Report

**Audit Date**: November 14, 2026  
**Auditor**: Senior Frontend Architect & Web Experience QA Engineer  
**Architecture Context**: Static Frontend-Only (React 19, Vite 6, React Router 7, Vercel Static Hosting)  
**Storage Mechanism**: Browser Local Storage (Isolated per `invitationId`)  
**Backend / Database Status**: Zero Backend / Zero Database / Pure Client-Side Operation

---

## 1. Data Model & Centralized Invitation Registry

Every invitation in the platform is registered centrally in `src/data/invitations.js` with an immutable, unique, stable `id` (`invitationId`) in addition to its user-facing `slug`:

| Invitation Title | Primary Couple | Slug | Canonical invitationId | Template Key |
|---|---|---|---|---|
| **تجربة مازن وفريدة الاستثنائية** | مازن & فريدة | `mazen-farida` | `inv_mazen_farida` | `mazen-farida` |
| **حفل زفاف العمر الملكي** | محمد & سلمى | `mohamed-salma` | `inv_mohamed_salma` | `classic` |
| **ليلة من الورد والضوء** | كريم & هاجر | `karim-hagar` | `inv_karim_hagar` | `garden` |
| **ملتقى القلوب تحت قوس الورد** | عمر & إيمان | `omar-eman` | `inv_omar_eman` | `rose` |
| **سحر الليل وأناقة النجوم** | يوسف & ليلى | `youssef-laila` | `inv_youssef_laila` | `midnight` |
| **خاتم العهد وبداية الحكاية** | سلمى & عمر | `salma-omar` | `inv_salma_omar` | `ring` |
| **عقد قران مبارك وميثاق غليظ** | أحمد & نور | `ahmed-nour` | `inv_ahmed_nour` | `katbketab` |
| **فرحة سنة جديدة وعمر أجمل** | نور | `nour-birthday` | `inv_nour_birthday` | `birthday` |
| **A Little Forever — البساطة البيضاء** | آدم & جنى | `adam-jana` | `inv_adam_jana` | `blanc` |
| **أنسام اللافندر وسحر الريف الفرنسي** | سيف & ملك | `seif-malak` | `inv_seif_malak` | `provence` |
| **رسالة مختومة بعبق الشوق** | هنا & كريم | `hana-karim` | `inv_hana_karim` | `letter` |
| **أبواب الفرح تفتح على مصراعيها** | مالك & نور | `malek-nour` | `inv_malek_nour` | `doors` |
| **تتويج سنوات السهر والاجتهاد** | يارا | `yara-graduation` | `inv_yara_graduation` | `modern` |

### Centralized Resolution Helpers:
- `getInvitationById(id)`: Looks up invitation configuration by immutable ID or slug.
- `getInvitationBySlug(slug)`: Looks up invitation configuration by slug or ID.
- `resolveInvitationId(slugOrId)`: Sanitizes and guarantees resolution to the canonical `invitationId`.

---

## 2. Invitation Isolation Strategy

Data isolation between invitations is enforced across all application layers:

```
[ Visitor Browser ]
        │
        ▼ (Submits RSVP on /invite/mohamed-salma)
[ RSVPSection / MazenFaridaPage ]
        │
        ▼ (Passes canonical invitationId: 'inv_mohamed_salma')
[ saveGuestResponse() Adapter ]
        │
        ▼ (Saves into localStorage with invitationId tag & createdAt)
[ Storage Schema v2 ]
        │
        ▼ (Filtered strictly by selectedInvitationId)
[ getGuestResponsesByInvitation('inv_mohamed_salma') ]
        │
        ▼ (ONLY Mohamed & Salma guests rendered)
[ Guest Dashboard (/guests?inv=mohamed-salma) ]
```

### Isolation Guarantees:
1. **Zero Cross-Contamination**:
   When viewing `/guests?inv=mohamed-salma`, responses from `inv_mazen_farida` or `inv_adam_jana` are strictly filtered out by `getGuestResponsesByInvitation('inv_mohamed_salma')`.
2. **Slug Alteration Defense**:
   Changing query parameters or slugs cannot expose another couple's responses because queries match against canonical `invitationId`.
3. **Multi-Invitation Selector in Dashboard**:
   A select control allows switching between all 13 invitations. When switched:
   - Dashboard title, date, and couple names update.
   - Live KPI counters (`totalYes`, `totalNo`, `totalPeople`) recalculate strictly for that invitation.
   - CSV export generates a file specific to that invitation (`ضيوف-[names].csv`).
   - "مسح ردود هذه الدعوة" clears records for that invitation only.

---

## 3. Storage Schema (Version 2.0)

The storage adapter in `src/utils/guestStorage.js` uses **Schema Version 2.0** (`wisal_guest_responses_v2`):

```typescript
interface GuestResponseRecordV2 {
  id: string;               // Unique ID: 'local_${timestamp}_${random}'
  invitationId: string;     // Canonical invitation ID: e.g. 'inv_mohamed_salma'
  slug: string;             // User-facing slug: e.g. 'mohamed-salma'
  name: string;             // Guest name (trimmed, non-empty)
  attending: 'yes' | 'no';  // Attendance flag
  guests: number;           // Guest count (0 if attending === 'no', >= 1 otherwise)
  message: string;          // Optional congratulatory message
  createdAt: string;        // ISO 8601 timestamp of first submission
  updatedAt: string;        // ISO 8601 timestamp of latest edit/update
  source: 'client_local' | 'demo';
}
```

### Storage Capabilities:
- **Automatic Migration**: Automatically checks for legacy v1 records under `wisal_guest_responses`, assigns canonical `invitationId`, backfills timestamps, and promotes to v2.
- **Deduplication Engine**: When an RSVP is submitted with an identical name (case-insensitive and normalized whitespace) for the same `invitationId`, the existing record is updated in place with new attendance, count, message, and `updatedAt`, preventing duplicate inflation.
- **Fail-Safe Validation**: Malformed JSON or corrupted entries are caught gracefully via try/catch and filtered out without throwing or crashing the UI.
- **Full CRUD Support**:
  - `saveGuestResponse(data)`
  - `getGuestResponses(filter)`
  - `getGuestResponsesByInvitation(invitationId)`
  - `updateGuestResponse(id, updates)`
  - `deleteGuestResponse(id)`
  - `clearGuestResponses(invitationId)`

---

## 4. Test Cases & Actual Results

Automated test suite executed via `npm test` (`tests/multi_invitation_test.mjs`):

```bash
> ma3zoom-inspired-invitations@1.0.0 test
> node tests/multi_invitation_test.mjs
```

### Test Results (33 Passed / 0 Failed):

| # | Test Category | Description | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| 1 | Registry & Model | All 13 invitations registered | Length = 13 | Length = 13 | **PASS** |
| 2 | Registry & Model | Unique non-null IDs on all invitations | 13 unique IDs | 13 unique IDs | **PASS** |
| 3 | Registry & Model | Mohamed & Salma resolved to `inv_mohamed_salma` | `inv_mohamed_salma` | `inv_mohamed_salma` | **PASS** |
| 4 | Registry & Model | Mazen & Farida resolved to `inv_mazen_farida` | `inv_mazen_farida` | `inv_mazen_farida` | **PASS** |
| 5 | Registry & Model | Adam & Jana resolved to `inv_adam_jana` | `inv_adam_jana` | `inv_adam_jana` | **PASS** |
| 6 | Registry & Model | Lookup by ID works | `karim-hagar` | `karim-hagar` | **PASS** |
| 7 | Data Isolation | Invitation A has exactly 2 responses | Length = 2 | Length = 2 | **PASS** |
| 8 | Data Isolation | Invitation B has exactly 1 response | Length = 1 | Length = 1 | **PASS** |
| 9 | Data Isolation | Invitation C has exactly 1 response | Length = 1 | Length = 1 | **PASS** |
| 10 | Data Isolation | Invitation A contains only Mohamed & Salma guests | All `inv_mohamed_salma` | All `inv_mohamed_salma` | **PASS** |
| 11 | Data Isolation | Invitation B contains only Mazen & Farida guests | All `inv_mazen_farida` | All `inv_mazen_farida` | **PASS** |
| 12 | Data Isolation | Invitation C contains only Adam & Jana guests | All `inv_adam_jana` | All `inv_adam_jana` | **PASS** |
| 13 | Data Isolation | Cross-contamination check: A has no B or C guests | Zero overlap | Zero overlap | **PASS** |
| 14 | Deduplication | Re-submitting same guest name updates record without count inflation | Still 2 records | Still 2 records | **PASS** |
| 15 | Deduplication | Record ID preserved across updates | Identical ID | Identical ID | **PASS** |
| 16 | Deduplication | Guest count updated to 4 | `guests: 4` | `guests: 4` | **PASS** |
| 17 | Deduplication | Timestamps: `updatedAt >= createdAt` | Valid ISO range | Valid ISO range | **PASS** |
| 18 | CRUD Operations | `updateGuestResponse` updates message | "رسالة محدثة" | "رسالة محدثة" | **PASS** |
| 19 | CRUD Operations | `deleteGuestResponse` removes specific record | True | True | **PASS** |
| 20 | CRUD Operations | Invitation A count decreased to 1 | Length = 1 | Length = 1 | **PASS** |
| 21 | CRUD Operations | `clearGuestResponses('inv_mohamed_salma')` empties A | Length = 0 | Length = 0 | **PASS** |
| 22 | CRUD Operations | Invitation B remains untouched (1 record) | Length = 1 | Length = 1 | **PASS** |
| 23 | CRUD Operations | Invitation C remains untouched (1 record) | Length = 1 | Length = 1 | **PASS** |
| 24 | QR Validation | Round-trip decode #1 (`/mazen-farida`) | 100% exact match | 100% exact match | **PASS** |
| 25 | QR Validation | Round-trip decode #2 (`/invite/mohamed-salma`) | 100% exact match | 100% exact match | **PASS** |
| 26 | QR Validation | Round-trip decode #3 (`/invite/adam-jana?wish=1#rsvp`) | 100% exact match | 100% exact match | **PASS** |
| 27 | QR Validation | Round-trip decode #4 (Arabic params: `?to=أحمد ونور`) | 100% exact match | 100% exact match | **PASS** |
| 28 | Timezone | Cairo winter (UTC+2) maps 19:00 to 17:00 UTC | UTC 17 | UTC 17 | **PASS** |
| 29 | Timezone | Cairo summer (UTC+3) maps 19:00 to 16:00 UTC | UTC 16 | UTC 16 | **PASS** |
| 30 | Calendar RFC 5545 | Contains `BEGIN:VCALENDAR` | Present | Present | **PASS** |
| 31 | Calendar RFC 5545 | Contains `SUMMARY:` | Present | Present | **PASS** |
| 32 | Calendar RFC 5545 | Contains `LOCATION:` | Present | Present | **PASS** |
| 33 | Calendar RFC 5545 | Contains `DTSTART:` | Present | Present | **PASS** |

**Exit Code**: `0`

---

## 5. Previous Failures & Root Cause Analysis

1. **Failure**: `ERR_MODULE_NOT_FOUND` in `calendar.js` during headless Node testing.
   - **Root Cause**: Extensionless import `import { getEventEpochMs } from '../hooks/useCountdown';`. While Vite's bundler resolves extensionless imports during dev/build, standard Node.js ESM strict resolution requires explicit `.js` extensions.
   - **Resolution**: Updated import to `import { getEventEpochMs } from '../hooks/useCountdown.js';`.
2. **Failure**: Duplicate declaration of `generateICS` in `calendar.js`.
   - **Root Cause**: Merge conflict artifact during refactoring between blob download logic and content generation.
   - **Resolution**: Refactored into two single-responsibility exports: `createICSContent(invitation)` (pure string generation for test/inspection) and `generateICS(invitation)` (DOM blob download).
3. **Failure**: Missing exports for `Trash2` and `AlertTriangle` in `src/utils/icons.jsx`.
   - **Root Cause**: Icons imported in `GuestDashboardPage.jsx` were not yet exposed in the central icon barrel file.
   - **Resolution**: Added `Trash2` and `AlertTriangle` exports in `src/utils/icons.jsx`.
4. **Failure**: Network-dependent QR generator failing in offline/sandboxed environments.
   - **Root Cause**: Relying on external image server `https://api.qrserver.com/`.
   - **Resolution**: Built standard offline Model 2 QR matrix encoder in `src/utils/qrEngine.js` with pure SVG rendering in `src/utils/qrcode.jsx`.

---

## 6. Final Production Build

```bash
npm run build
```

```
vite v8.3.8 building client environment for production...
transforming...
✓ 2145 modules transformed.
rendering chunks...
dist/index.html                   3.30 kB │ gzip:   1.44 kB
dist/assets/index-QCxDQiEA.css   84.13 kB │ gzip:  16.38 kB
dist/assets/index-DdqGyB3O.js   503.67 kB │ gzip: 143.52 kB
✓ built in 1.70s
[Prerender] Generating static HTML with bespoke Open Graph metadata for 13 invitations...
[Prerender] Successfully generated static entrypoints for 13 invitations and 8 pages!
```

### Static Entrypoints Verified in `dist/`:
- **13 Invitation Pages**: All 13 invitations generated as both `/invite/{slug}/index.html` and `/invite/{slug}.html`, plus `/mazen-farida/index.html`.
- **8 Marketing & Tool Pages**: `/demos`, `/features`, `/packages`, `/faq`, `/guests`, `/links`, `/card`, and `/`.
- **Open Graph Metadata**: Verified on all HTML files with bespoke `og:title`, `og:description`, `og:image`, and `og:url`.

---

## 7. Remaining Architectural Limitations

1. **Cross-Device Synchronization**:
   - As an intentional design constraint of this static frontend-only platform (no backend, no database), responses stored in `localStorage` are local to the visitor's device.
   - An explicit, prominent warning is displayed in the Guest Dashboard:
     *«الردود محفوظة على هذا الجهاز والمتصفح فقط، ولا تتم مزامنتها بين أجهزة مختلفة.»*
   - When a cloud database (e.g. Supabase, Firebase, or Google Sheets API) is introduced in the future, only `src/utils/guestStorage.js` will need to be configured to forward requests to that API endpoint without modifying invitation templates or dashboard components.
2. **Audio Autoplay**:
   - Modern browser security policies require user interaction before playing audio. Audio playback is unlocked on the user's initial gesture (tapping the wax seal).
