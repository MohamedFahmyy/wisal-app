# وِصال — WISAL | Digital Invitations Platform

> **"مش مجرد دعوة… دي أول لحظة في حكايتكم."**  
> Premium, editorial digital invitation platform built with React, Vite, and modern CSS — inspired by the aesthetic excellence and UX of [ma3zoom.vercel.app](https://ma3zoom.vercel.app/).

---

## 1. Project Overview & Brand Identity

**Brand Name:** وِصال — WISAL  
**Concept:** Digital invitations that turn an ordinary invitation link into an unforgettable, sensory opening experience.  
**Aesthetic Direction:**
- Warm ivory (`#faf8f5`), champagne (`#f4efe6`), and soft natural paper textures.
- Muted gold foil accents (`#c5a059`, `#9e7932`) and gentle terracotta/rose undertones.
- Editorial typography pairing:
  - **Arabic:** Alexandria & Tajawal
  - **English:** Playfair Display (editorial serif) & DM Sans (clean body)
- Smooth 60fps animations with full respect for `prefers-reduced-motion`.
- Fully responsive design engineered especially for mobile screens where guests open WhatsApp invitation links.

---

## 2. Technical Architecture

- **Framework:** React 19 + Vite 8
- **Routing:** React Router v7 (SPA with client-side history)
- **Styling:** Modular CSS architecture with centralized CSS custom properties:
  - `src/styles/variables.css`: Design tokens, colors, typography, spacing, shadows.
  - `src/styles/animations.css`: Keyframe motions, 3D perspectives, floating petals, confetti, sound pulses.
  - `src/styles/global.css`: Base layouts, site header, footer, landing sections, gallery, packages, features, FAQ.
  - `src/styles/templates.css`: Individual template visual mechanics, wax seals, gates, boxes, and invitation controls.
- **Icons:** Lucide React + custom SVG branded icons (WhatsApp, Instagram).
- **Audio:** Web Audio API romantic harp/piano synthesizer (Db Major progression) that requires zero external MP3 downloads, eliminating 404s, CORS issues, or broken links, plus optional custom audio support.
- **Backend-Free Architecture:** Pure frontend execution; no database, no authentication, no fake APIs.

```text
src/
  components/
    common/        # BrandLogo, Toast
    layout/        # Header, Footer
    invitation/    # TopBar, Countdown, VenueMap, DayTimeline, RSVPBox, Gallery, Blessing
    gallery/       # InvitationCard
    sections/      # Hero, Intro, Featured, HowItWorks, Features, WhyWisal, Testimonials, Packages, FAQ, CTA
  data/
    invitations.js # Centralized 12 invitation configurations
    categories.js  # Filter categories
    packages.js    # Essential, Signature, Bespoke packages
    faqs.js        # Comprehensive FAQ dataset
    testimonials.js# Labeled client reviews
  hooks/
    useCountdown.js# Accurate live countdown with timezone support
    useInvitation.js# Language toggle, audio state, guest personalization, link sharing
  pages/
    HomePage.jsx   # Complete marketing landing page
    DemosPage.jsx  # Interactive gallery with category filtering & live search
    InvitationPage.jsx # Dynamic template resolution by :slug
    FeaturesPage.jsx # Deep-dive feature showcase with interactive widgets
    PackagesPage.jsx # Pricing plans, comparison matrix, WhatsApp CTAs
    FAQPage.jsx    # Accordion search and support links
  templates/       # 12 Distinct Template Components
    ClassicWaxTemplate.jsx   # 1. Wax Seal & Ribbon Envelope
    GardenGateTemplate.jsx    # 2. Wrought-Iron Garden Gates
    RoseArchTemplate.jsx      # 3. Botanical Floral Arch & Petals
    MidnightRoyalTemplate.jsx # 4. Midnight Celestial Gold
    RingBoxTemplate.jsx       # 5. Velvet Diamond Ring Box
    KatbKetabTemplate.jsx     # 6. Andalusian Islamic Arch & Fanoos
    BirthdayGiftTemplate.jsx  # 7. Festive Gift Box & Confetti
    BlancTemplate.jsx         # 8. Editorial Minimal Blanc
    ProvenceTemplate.jsx      # 9. Provence Window & Lavender View
    ElegantLetterTemplate.jsx # 10. Vintage Folded Letter Stationery
    FloralDoorsTemplate.jsx   # 11. Palace Double Doors with Knockers
    ModernPhotoTemplate.jsx   # 12. Hero Photography & Photo Gallery
    index.js                  # Dynamic template registry
  utils/
    audio.js       # Web Audio API romantic melody synthesizer
    calendar.js    # Native .ics iCalendar file generator
    localization.js# Arabic (RTL) & English (LTR) dictionaries and date formatters
    icons.jsx      # Safe icon exports & branded SVGs
  App.jsx          # Route configuration with conditional header/footer
  main.jsx         # Application entry point
```

---

## 3. The 12 Unique Invitation Experiences

Every template has its own unique 3D opening mechanic and visual identity:

1. **Classic Wax Seal (`classic` / `mohamed-salma`):**
   - Ivory envelope with gold decorative border, silk ribbon, and a 3D wax seal monogrammed with 'و'.
   - Unfolds to reveal a formal embossed wedding card.
   - Flagship Demo: Mohamed & Salma, November 30, 2026, 7:00 PM, Joya Banquet Hall, Cairo.
2. **Garden Gate (`garden` / `karim-hagar`):**
   - Wrought-iron arched gates adorned with climbing ivy and roses that swing open in 3D perspective to reveal a garden courtyard pavilion.
3. **Rose Arch (`rose` / `omar-eman`):**
   - Romantic blush floral archway with floating rose petals drifting gracefully across the screen and silk veil reveal.
4. **Midnight Royal (`midnight` / `youssef-laila`):**
   - Deep obsidian and royal navy background with twinkling stars, golden crescent moon, and opulent gold-foil accents.
5. **Engagement Ring Box (`ring` / `salma-omar`):**
   - Luxury velvet jewelry box whose lid hinges open in 3D perspective to reveal a sparkling diamond solitaire ring on a plush cushion.
6. **Katb Ketab (`katbketab` / `ahmed-nour`):**
   - Andalusian Islamic archway with Mashrabiya latticework, glowing Fanoos lantern, and traditional Quranic calligraphy header.
7. **Birthday Gift (`birthday` / `nour-birthday`):**
   - Festive pastel gift box wrapped with satin ribbon and bow that pops open with celebratory confetti shower and countdown.
8. **Minimal Blanc (`blanc` / `adam-jana`):**
   - Editorial high-fashion minimalism with blind emboss monogram, cotton paper texture, and whisper-soft unfold reveal.
9. **Provence Window (`provence` / `seif-malak`):**
   - French rustic shuttered window opening to golden-hour lavender hills in Tunis Village, Fayoum.
10. **Elegant Letter (`letter` / `hana-karim`):**
    - Vintage airmail calligraphy envelope with postage stamp and postmark that unfolds in 3 creases into romantic stationery.
11. **Floral Palace Doors (`doors` / `malek-nour`):**
    - Grand double doors adorned with hydrangea garlands and brass lion knockers swinging open into an imperial ballroom.
12. **Modern Photo (`modern` / `yara-graduation`):**
    - High-impact editorial photography layout with glassmorphic cards and an interactive photo gallery with full-screen lightbox.

---

## 4. Platform Features

- **Live Countdown Timer:** Calculates days, hours, minutes, and seconds based on local Cairo timezone with animated digit transitions.
- **Location & Google Maps:** Displays venue details with direct "Open in Google Maps" and "Get Directions" navigation shortcuts.
- **Interactive RSVP (Frontend Demo):** Allows guests to input their name, select attendance ("Joyfully Accept" / "Regretfully Decline"), specify number of attendees, and write a congratulatory note, with immediate animated confirmation. Clearly disclosed as a client-side demonstration.
- **Calendar Integration (.ics):** Generates and downloads a standard RFC 5545 iCalendar file locally, compatible with Apple Calendar, Google Calendar, and Outlook.
- **Web Audio Ambient Music Player:** Synthesizes a delicate, romantic harp/piano melody on demand (or plays a configured custom audio file). Starts only upon explicit user touch/click.
- **Bilingual Arabic & English Support:** Full RTL/LTR layout flipping and translated labels accessible via the topbar language toggle.
- **Personalized Guest Links:** Append `?to=Ahmed` or `?guest=سارة` to any invitation URL to personalize the greeting: *"عزيزنا أحمد"* or *"Dear Ahmed"*.

---

## 5. Local Setup & Verification

```bash
# Clone the repository
cd ma3zoom-inspired-invitations

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 6. Vercel Deployment

The project is configured for single-command deployment to Vercel:

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Route Rewrites:** Handled via `vercel.json`:
  ```json
  {
    "rewrites": [
      {
        "source": "/(.*)",
        "destination": "/index.html"
      }
    ]
  }
  ```

---

## 7. QA Verification Summary

- **Routes Tested:**
  - `/` (Landing Page with all 10 marketing sections)
  - `/demos` (12 unique invitations, search query filter, category tabs)
  - `/invite/mohamed-salma` (Flagship Classic Wax Seal template)
  - `/invite/karim-hagar` (Garden Gate template)
  - `/invite/omar-eman` (Rose Arch template)
  - `/invite/youssef-laila` (Midnight Royal template)
  - `/invite/salma-omar` (Ring Box template)
  - `/invite/ahmed-nour` (Katb Ketab template)
  - `/invite/nour-birthday` (Birthday Gift template)
  - `/invite/adam-jana` (Minimal Blanc template)
  - `/invite/seif-malak` (Provence Window template)
  - `/invite/hana-karim` (Elegant Letter template)
  - `/invite/malek-nour` (Floral Doors template)
  - `/invite/yara-graduation` (Modern Photo template)
  - `/features` (Interactive showcase widgets)
  - `/packages` (Essential, Signature, Bespoke plans & matrix)
  - `/faq` (Accordion search & questions)
- **Personalized URL Query:** `/invite/mohamed-salma?to=Ahmed` tested and verified.
- **Interactive Mechanics:** Wax seal click, 3D gate swing, ring box lid hinge, window shutters, calendar .ics generation, and RSVP demonstration tested.
- **Build Status:** Clean Vite production build with zero errors.
