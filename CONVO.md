# Conversation Log

## 2026-03-15 — New Article: "The Floor Is Dropping"

**Goal:** Format and publish a new article about how AI compounds the intelligence divide by making thinking optional.

**What was done:**
- Created `content/articles/the-floor-is-dropping-how-ai-is-compounding-the-intelligence-gap.md` with frontmatter (title, date, description) matching existing article format
- Slug derived from filename per `lib/articles.ts` convention
- Replaced all em dashes with hyphens across all 7 articles (95 occurrences)
- Date set to 2026-03-15 — becomes the most recent article, shown on homepage
- Verified: article count (6→7), homepage preview, sitemap, prev/next nav all update automatically
- Build passes with zero errors

**Files changed:**
- `content/articles/the-floor-is-dropping-how-ai-is-compounding-the-intelligence-gap.md` — NEW: full article
- `content/articles/*.md` — all 6 existing articles: em dashes replaced with hyphens

---

## 2026-03-15 — Homepage 3D Carousel

**Context:** Homepage projects section used a static card grid while `/projects` had a 3D orbit carousel. User wanted the same carousel on the homepage.

**What changed:**
- Replaced homepage projects grid with `ProjectsClient` 3D orbit carousel component
- Removed unused `TYPE_COLORS` import from homepage

**Files changed:**
- `app/page.tsx` — swapped grid for `<ProjectsClient projects={PROJECTS} />`

---

## 2026-03-15 — 3D Carousel + Accent Color Reorder

**Context:** Project cards on `/projects` used a grid layout with expand-to-view-details pattern. User wanted direct click-through to `/projects/[slug]` for GA4 tracking, plus a visual upgrade to a 3D animated carousel.

**What changed:**

1. **3D Orbit Carousel** — Replaced grid layout with a framer-motion 3D carousel (inspired by 21st.dev animated-carousel). Cards orbit in 3D space with auto-rotation, hover-to-pause, click-to-snap, and 1.15x hover scale. Uses `perspective: 1200px`, `preserve-3d`, and counter-rotation so cards always face the viewer.
   - Added `motion` (framer-motion) dependency
   - Cards link directly to `/projects/[slug]` — no more expand/details pattern

2. **Card Images** — Added `image` field to project data. Each card now has a 25% height color strip at the top with an SVG placeholder (solid type color + white label). Ready for real screenshots.

3. **Accent Color Reorder** — Changed global accent cascade from blue→red→yellow→green to **blue→green→yellow→red**:
   - `globals.css` — CSS variable declaration order + gradient updated
   - Section color assignments cycled: Articles=blue, News=green, Projects=yellow, Lab=red, Now=blue, Contact=green
   - `DOT_COLORS`, footer gradient, news dot colors, project section bars all updated
   - `TYPE_COLORS`: Game changed from red to green

4. **Card Pill Fix** — Type badge pills changed from colored-text-on-light-bg to white-text-on-solid-color (dark text for Guide/yellow for readability)

**Files changed:**
- `app/projects/ProjectsClient.tsx` — full rewrite: 3D carousel with motion
- `lib/projects.ts` — added `image` field, Game type color → green
- `app/globals.css` — accent order: amber before coral, gradient updated
- `app/page.tsx` — DOT_COLORS, section colors, news dots reordered
- `app/news/page.tsx` — green heading
- `app/projects/page.tsx` — amber heading
- `app/lab/page.tsx` — coral heading
- `app/now/page.tsx` — blue (accent) heading
- `app/contact/page.tsx` — green heading
- `components/Footer.tsx` — gradient reordered
- `public/projects/*.svg` — NEW: 6 placeholder card images
- `package.json` — added `motion` dependency

## 2026-03-15 — Project Slug Routes for Analytics

**Context:** All 6 projects shared a single `/projects` pageview in GA4, making it impossible to track per-project interest.

**What changed:**
- Created `lib/projects.ts` — shared project data with auto-generated slugs from project names
- Added `app/projects/[slug]/page.tsx` — individual SSG detail pages per project with SEO metadata and SectionTracker
- Updated `/projects` listing to import from shared module, added "View Details" internal link alongside "Visit Project"
- Updated homepage to show all 6 projects (was 4) and link to `/projects/[slug]` instead of external URLs
- Each project now gets a distinct GA4 pageview automatically (e.g. `/projects/space-commanders`)
- Adding a new project only requires adding one entry to `RAW_PROJECTS` in `lib/projects.ts` — slug is auto-generated

## 2026-03-15 — v2 Architecture Migration

**Context:** Merged two repos — `anaken-one-landing` (repo 1, production content) and `anaken-one-new` (repo 2, new architecture) — into a single codebase.

**What changed:**
- Next.js 14 / React 18 / JSX → Next.js 16 / React 19 / TypeScript (strict)
- 694-line `ClientApp.jsx` SPA monolith → 10 separate App Router pages
- CSS-in-JS inline styles → `globals.css` with CSS custom properties
- Hash-based routing → proper Next.js App Router with real URLs
- New pages added: `/news`, `/projects`, `/contact`, `/lab`, `/now`, `/mockup`
- News API merged: newsdata.io (optional) → RSS fallback → static fallback
- Contact API ported to TS with all security preserved (rate limiting, sanitization, origin whitelist)
- GA4 analytics: per-page tracking via `usePathname`, per-section via `IntersectionObserver`
- Share popover added to article pages (X, LinkedIn, copy link)
- `/uses` page removed at user's request

**Fixes during session:**
- HTML entities (`&check;`, `&blacktriangleright;`) rendering as text → replaced with Unicode characters
- Contact API origin whitelist missing `localhost:3002` → added
- Missing `CONTACT_EMAIL` env var → user added to `.env.local`
- News page Refresh button removed per user request

**PR:** https://github.com/annabel-lee-x10/anaken-one-landing/pull/1

## 2026-03-15 — Update profile tagline

**Goal:** Replace the old bio tagline ("Ageless hobbyist. I love learning workflows and processes...") with a new motto: **"ideate. innovate. iterate."**

**Analysis:** Shifts from 25-word conversational bio to 3-word manifesto. Maps to the same site themes — ideate (curiosity/AI exploration), innovate (building tools/projects), iterate (workflow optimization) — at a higher abstraction level.

**Changes (7 locations, 4 files):**
- `app/page.tsx` — hero bio text + restyled for motto (larger font, letter-spacing), page meta description
- `app/layout.tsx` — root description, OpenGraph description, Twitter card description
- `components/Footer.tsx` — footer tagline
- `app/mockup/page.tsx` — design reference bio

**SEO:** Metadata uses hybrid format ("ideate. innovate. iterate. — Exploring workflows, AI tooling, and systems optimization.") to preserve keywords. Stats grid kept as-is.

## 2026-03-15 — Internal Analytics Enhancement

**Goal:** Comprehensive internal analytics for personal analysis — track footprints, per-section engagement, and user journeys. Nothing visible on the site; all analysis via GA4 dashboard.

**What was built:**
- `lib/analytics.ts` (NEW) — typed `trackEvent()` utility with `EventMap` for type-safe GA4 events
- Refactored `SectionTracker.tsx` to use centralized `trackEvent` instead of raw `window.gtag`
- Added `SectionTracker` to all 7 subpages (articles, article detail, projects, news, lab, now, contact)
- Nav journey tracking — `nav_click` events on all nav links (desktop, mobile, logo, contact CTA) with `from_page` context
- Interaction events: `contact_submit`, `share_click` (twitter/linkedin/copy), `project_select`, `project_visit`, `news_click`

**Files changed (14):**
- `lib/analytics.ts` — NEW: event map + trackEvent utility
- `components/SectionTracker.tsx` — uses trackEvent
- `components/Nav.tsx` — nav_click tracking on all links
- `app/articles/page.tsx`, `app/articles/[slug]/page.tsx`, `app/projects/page.tsx`, `app/news/page.tsx`, `app/lab/page.tsx`, `app/now/page.tsx`, `app/contact/page.tsx` — SectionTracker added
- `app/contact/ContactForm.tsx` — contact_submit event
- `app/articles/[slug]/ShareButtons.tsx` — share_click events
- `app/projects/ProjectsClient.tsx` — project_select + project_visit events
- `app/news/NewsClient.tsx` — news_click event

**GA4 setup required:** Register custom dimensions (section_name, link_label, from_page, article_slug, project_name, method) in GA4 Admin > Custom Definitions.

## 2026-03-15 — UI Tweaks Batch

**Goal:** Various UI improvements and content updates.

**Changes:**
- **Footer hover hint** — `u18181188` now shows tooltip "you can call me a10101100 if you wished" on hover
- **Project type pill colors** — Tool (blue), Game (coral), Guide (amber) with matching dark mode backgrounds via CSS variables (`--type-bg-tool`, `--type-bg-game`, `--type-bg-guide`)
- **New projects** — Added Where's Munki (Game, wheresmunki.anaken.one) and Solo in Seoul (Guide, soloinseoul.anaken.one)
- **Now page** — Removed nownownow.com attribution link
- **News API diagnosis** — newsdata.io returning 401 (API key expired/revoked), RSS fallback working correctly
- **Dark mode news pill fix** — Hardcoded `#EEF4FF` background on news source pill → `var(--badge-active-bg)` for proper dark mode support

**Files changed (6):**
- `components/Footer.tsx` — title attribute on u18181188
- `app/globals.css` — type-specific badge CSS variables (light + dark)
- `app/projects/page.tsx` — 2 new projects added
- `app/projects/ProjectsClient.tsx` — TYPE_COLORS map, per-type badge styling
- `app/now/page.tsx` — removed nownownow.com reference
- `app/news/NewsClient.tsx` — badge background uses CSS variable

## 2026-03-15 — Playful Pops + Dark Mode

**Goal:** Add color to the site (was looking dull/monochromatic) and implement dark mode with pure black background.

**Process:**
- Mocked up 3 color treatment looks: Subtle Warmth, Bold Blocks, Playful Pops
- User chose **Look 3: Playful Pops** — gradient text, decorative dots, rainbow dividers, colorful pills
- Created dark mode variant mockup with pure black (#000) background
- Applied to the live site with full dark mode support

**What changed:**
- `app/globals.css` — dark mode CSS variables (`[data-theme="dark"]`), `.gradient-text` and `.gradient-divider` utility classes, status/badge CSS vars
- `components/ThemeProvider.tsx` — re-enabled with localStorage persistence + prefers-color-scheme detection
- `components/Nav.tsx` — theme toggle button (☽/☀), dark-aware scrolled header, gradient logo
- `components/Footer.tsx` — rainbow gradient top border, colorful per-link accent colors, gradient logo
- `app/page.tsx` — full Playful Pops: gradient heading, dots, colored stats, pill badges, gradient dividers, gradient CTA
- `app/projects/ProjectsClient.tsx` — hardcoded #fff and #EEF4FF → CSS variables
- `app/lab/page.tsx` — status badge colors → CSS variables for dark mode

**Mockup pages kept for reference:** `/mockup/look-1`, `/mockup/look-2`, `/mockup/look-3`, `/mockup/look-3-dark`

## 2026-03-15 — Bright Playful Color Refinement

**Goal:** Monochrome gray text felt jarring against playful pops accents. User wanted bold, clean primary colors like Google/Microsoft applied to headings, labels, and accents — "full playful" energy.

**Process:**
- Presented 3 warm-tinting options (Plum, Earthy, Rose) — user rejected, wanted basic primary colors instead
- Clarified depth: colored headings only vs accent refresh vs full playful — user chose **Full Playful**
- Spun up 3 dev servers with different palettes: Google Primaries (:3001), Microsoft Fluent (:3002), Bright Playful (:3003)
- User chose **Option C: Bright Playful** — the most vibrant and youthful palette

**Color Palette:**
- Blue: `#3366FF`, Red: `#FF3355`, Yellow: `#FFCC00`, Green: `#00CC66`, Orange: `#FF6633`, Cyan: `#00CCFF`

**Changes (10 files):**
- `app/globals.css` — 6 accent variables updated to bright primaries, dark mode text warmed (#F2EFF6, #B5B0BF, #6E6A78)
- `app/page.tsx` — section headings/labels colored (Projects=green, News=red, Articles=blue), DOT_COLORS + stats updated
- `app/projects/page.tsx` — green heading + label
- `app/projects/ProjectsClient.tsx` — TYPE_COLORS: Tool=#3366FF, Game=#FF3355, Guide=#FFCC00
- `app/articles/page.tsx` — blue heading + label
- `app/news/page.tsx` — red heading + label
- `app/lab/page.tsx` — amber heading + label (#E6B800 for h1 readability)
- `app/now/page.tsx` — green heading + label
- `app/contact/page.tsx` — red heading + label
- `components/Footer.tsx` — gradient border updated to new primaries

## 2026-03-15 — Footer Nav Cleanup

**Goal:** Fix clunky footer nav — per-link rainbow colors with repeated hues across two uneven columns looked inconsistent.

**Process:**
- Mocked up 3 options on separate dev servers (ports 3001-3003): Monochrome Clean, Single Row, Labeled Groups
- User chose **Option C: Labeled Groups** — two columns with "Explore" / "Connect" headers

**Changes:**
- `components/Footer.tsx` — replaced per-link color array with two semantic groups (EXPLORE, CONNECT), added uppercase column headers with `var(--text-head)`, links use `var(--text-muted)` with hover to `var(--text-body)` via CSS class

## 2026-03-15 — Dark Mode: Soft Graphite + Samsung AMOLED Detection

**Problem:** Eye fatigue complaints with pure black (`#000000`) dark mode on non-AMOLED screens.

**Solution:**
- Default dark mode switched to **Soft Graphite** (`#1e1e1e`) — neutral gray palette that reduces eye strain on LCD/IPS displays
- Samsung AMOLED devices (detected via user agent: `samsung`, `sm-`, `gt-`) keep pure black for power efficiency
- Detection uses `data-display` attribute (`amoled` | `lcd`) on `<html>`, with CSS specificity layering

**Selection process:** 3 aesthetics prototyped in parallel worktrees and evaluated side by side:
1. Warm Charcoal (`#1a1917`) — warm brown-gray
2. Cool Slate (`#161a22`) — blue-gray
3. **Soft Graphite (`#1e1e1e`)** — neutral gray (selected)

**Files changed:**
- `app/globals.css` — Soft Graphite palette + Samsung AMOLED override block
- `components/ThemeProvider.tsx` — `isSamsungDevice()` detection, sets `data-display` attribute

## 2026-03-15 — Samsung UA Detection Fix

**Problem:** Pure black not displaying on Samsung Galaxy Z Fold 7. Chrome 110+ strips device model from UA string (UA reduction), so `sm-`/`gt-` patterns never match.

**Fix:** Use `navigator.userAgentData.getHighEntropyValues()` (UA Client Hints API) to get real manufacturer/model, with fallback to legacy UA sniffing for Samsung Internet and older browsers.

**Files changed:**
- `components/ThemeProvider.tsx` — async `isSamsungDevice()` with Client Hints API + type declarations
