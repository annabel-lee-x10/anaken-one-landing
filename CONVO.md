# Conversation Log

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

## 2026-03-15 — Footer Nav Cleanup

**Goal:** Fix clunky footer nav — per-link rainbow colors with repeated hues across two uneven columns looked inconsistent.

**Process:**
- Mocked up 3 options on separate dev servers (ports 3001-3003): Monochrome Clean, Single Row, Labeled Groups
- User chose **Option C: Labeled Groups** — two columns with "Explore" / "Connect" headers

**Changes:**
- `components/Footer.tsx` — replaced per-link color array with two semantic groups (EXPLORE, CONNECT), added uppercase column headers with `var(--text-head)`, links use `var(--text-muted)` with hover to `var(--text-body)` via CSS class
