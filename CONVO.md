# Conversation Log

## 2026-03-16 — Scheduled Article Publishing with ISR

**Request:** Add ability to schedule articles with a future publish date, "queue and forget" — no manual redeployment needed.

**Changes:**
- Added optional `publishDate` frontmatter field to `ArticleMeta` type in `lib/articles.ts`
- Added `isPublished()` helper that checks if the current time is past the `publishDate`
- `getAllArticles()` filters out articles with a future `publishDate`
- `getArticleBySlug()` returns 404 for unpublished articles (prevents direct URL access)
- `publishDate` overrides `date` for display and sorting — the article shows the scheduled date, not the upload date
- Added ISR (`revalidate = 3600`) to article listing, article detail, and homepage — Vercel re-checks hourly so scheduled articles auto-appear within ~1 hour
- Added `dynamicParams = true` to article detail page so scheduled slugs not in build-time params can render on-demand
- Articles without `publishDate` publish immediately (backward compatible)

**Usage:** Add `publishDate: "2026-04-01T09:00:00"` to article frontmatter to schedule publishing.

**Files changed:** `lib/articles.ts`, `app/articles/page.tsx`, `app/articles/[slug]/page.tsx`, `app/page.tsx`, `CONVO.md`

---

## 2026-03-16 — Add Vercel Web Analytics

**Goal:** Add Vercel Web Analytics for visitor tracking (unique visitors, pageviews, top pages, referrers) alongside existing GA4 setup.

**Context:** User referenced solo-in-seoul project which had both `@vercel/analytics` and `@vercel/speed-insights`. Speed Insights requires Vercel Pro plan — user is on Hobby, so only Web Analytics was added.

**What changed:**
- Installed `@vercel/analytics` package
- Added `<VercelAnalytics />` component to root layout (aliased to avoid naming collision with existing GA4 `<Analytics />` component)

**Files changed:**
- `app/layout.tsx` — import + render `<VercelAnalytics />`
- `package.json` / `package-lock.json` — added `@vercel/analytics` dependency

**Dashboard setup required:** Enable Web Analytics in Vercel project settings (Settings → Analytics).

---

## 2026-03-15 — Fix: Dynamic article/project counts on homepage

**Problem:** Stats strip on homepage had hardcoded "6 Published" and "6 Shipped" — article count was stale after adding the 7th article.

**Fix:** Replaced hardcoded strings with dynamic `allArticles.length` and `PROJECTS.length` (both already imported). Counts now auto-update.

**Files changed:** `app/page.tsx`

---

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
## 2026-03-15 — Content Polish: Corp Comms Review

**Context:** Corporate communications review of all user-facing copy. Site was technically solid and visually polished but content was thin, generic, or stale across several pages.

**Changes (12 files):**

1. **Homepage hero** — Replaced generic bio and insider handle reference with curiosity-driven positioning. Stats strip changed from buzzword labels ("Workflow Optimization", "Perpetual Learner") to real proof points ("6 Shipped", "6 Published", "3 In Progress").
2. **Now page** — Removed stale "Building anaken-one-new" (already merged). Added /now movement explainer. Updated to 4 current focus items with context. "Not doing" items now explain why.
3. **Lab page** — Reframed intro from self-deprecating ("might become something. Or might not.") to intentional experimentation. Enriched each experiment description with why-it-matters context.
4. **Project descriptions** — Removed dev-speak ("No dependencies, pure browser", "rebuilt collaboratively"). Rewrote to lead with user value. Projects page intro contextualizes the collection.
5. **Contact page** — Warmer intro that promises a reply. Richer metadata.
6. **Articles page** — Editorial framing line ("No listicles — just honest thinking"). Richer metadata.
7. **News page** — Enriched SEO metadata.
8. **Article tags** — Added tags to 4 articles that had none (role-reversal, literacy-gap, then-and-now, ai-threat).
9. **Duplicate heading fix** — Renamed second "The Honest Picture" section in literacy-gap article to "Where This Goes From Here".

**Files changed (12):**
- `app/page.tsx`, `app/now/page.tsx`, `app/lab/page.tsx`, `app/projects/page.tsx`, `app/contact/page.tsx`, `app/articles/page.tsx`, `app/news/page.tsx`
- `lib/projects.ts`
- `content/articles/the-great-role-reversal.md`, `content/articles/the-literacy-gap.md`, `content/articles/use-of-ai-then-and-now.md`, `content/articles/is-ai-really-a-threat.md`

---

## 2026-03-15 — Homepage Polish: Identity, Colors & Components

**Context:** Detailed UX/design feedback identified scattered color palette, vague identity, orphaned decorative elements, and component polish gaps.

**Key decisions:**
- Replace `u18181188` with `a10101100` (old coder handle) throughout
- Keep "ideate. innovate. iterate." tagline
- Full color consolidation: blue primary + violet secondary, demote amber/green to functional use

**What changed:**

1. **Identity** — `u18181188` → `a10101100` in hero label and footer. Added bio line: "I build tools, write about AI workflows, and ship experiments."
2. **Color consolidation** — All section headings (Projects, News, Articles) now use `var(--accent)` (blue) instead of per-section green/coral/amber. Gradient text narrowed from blue→pink to blue→violet (`#6644CC`). Gradient dividers and footer border updated to 3-stop (blue→violet→coral).
3. **Decorative cleanup** — Removed orphaned colored dots from hero and CTA sections. Removed colored pill bars next to Projects heading.
4. **Lab teaser** — New "From the Lab" section on homepage showing 2 experiments with status badges.
5. **Footer warmth** — Added descriptor line, updated identity and gradient border.
6. **Theme toggle** — Added `title` tooltip for the moon/sun icon.
7. **News dots** — Consolidated from 3-color rotation to alternating blue/coral.

**Files changed (4):**
- `app/page.tsx` — identity, bio, color consolidation, dots removed, lab teaser added
- `app/globals.css` — gradient-text and gradient-divider narrowed to blue→violet
- `components/Footer.tsx` — identity, gradient border, descriptor line
- `components/Nav.tsx` — title tooltip on theme toggle

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

---

## 2026-03-15 — Security & Refactoring Review

**Context:** Senior engineer review of tech stack for security posture and refactoring needs.

**Findings & Fixes:**

1. **URL construction bug (HIGH)** — `getNews()` in `app/page.tsx` had operator precedence error (`||` vs `?:`) that could produce `https://undefined`. Fixed with `??` operator.
2. **Server self-fetch (MEDIUM)** — Homepage called its own `/api/news` route via HTTP, risking cold-start deadlocks. Extracted news logic to `lib/news.ts`; both homepage and API route now use shared `fetchNews()`.
3. **No error boundaries** — Added `app/error.tsx` (global error fallback) and `app/not-found.tsx` (branded 404).
4. **Missing prefers-reduced-motion** — Added `@media (prefers-reduced-motion: reduce)` to `globals.css` to disable animations for users who request it.

**Not fixed (low risk for personal site):**
- In-memory rate limiting (acceptable, Vercel provides DDoS protection)
- Markdown `javascript:` href (self-authored content only)
- Contact origin check without CORS headers (validation + rate limiting is the real protection)

**Files changed (6):**
- `app/page.tsx` — fixed URL logic, replaced self-fetch with direct `fetchNews()` call
- `app/api/news/route.ts` — thin wrapper around shared `fetchNews()`
- `lib/news.ts` — NEW: extracted news fetching logic (API → RSS → fallback)
- `app/error.tsx` — NEW: global error boundary
- `app/not-found.tsx` — NEW: branded 404 page
- `app/globals.css` — added `prefers-reduced-motion` media query

---

## 2026-03-15 — Visual Overhaul: Corp Comms Critique

**Context:** Head of Corporate Communications review of site visuals. Site is technically solid but visually generic — lacks brand distinctiveness, visual hierarchy between content types, and has excessive whitespace.

**Changes (7 recommendations, all implemented):**

1. **Tightened accent palette** — Stats strip uses consistent `--accent` (blue) instead of 3 random colors. Article date badges use `--accent` instead of `--accent-sky`.
2. **Differentiated content types** — Articles: blue left border. News: coral top stripe. Lab: status-colored left border + larger badges.
3. **Reduced section padding** — `.section` 6.5rem→5rem, `.section-sm` 4rem→3rem, hero 7.5rem→6rem / 6rem→4.5rem. Mobile proportional.
4. **Strengthened hero** — Added positioning line "Building at the intersection of AI & developer tooling", blue glow shadow on primary CTA.
5. **Enriched footer** — Tagline in body color (not faded), extended positioning line, wider column gap (40→56px).
6. **Added grid view for projects** — Grid/carousel toggle on desktop, defaults to grid on mobile. 3→2→1 col responsive. Carousel preserved as alternative.
7. **Added visual texture** — Subtle dot pattern on `.section-alt` via CSS radial-gradient. Stronger hover lift for cards in alt sections.

**Files changed (4):**
- `app/globals.css` — padding, texture, hover states, responsive
- `app/page.tsx` — hero, card borders, color consolidation, stats strip
- `app/projects/ProjectsClient.tsx` — grid view toggle + extracted ProjectCard component
- `components/Footer.tsx` — enriched content + spacing

---

## 2026-03-15 — Site Repositioning: Investor-Ready Copy

**Context:** Startup investor critique identified key weaknesses: no clear target audience, generic value proposition ("Exploring how AI changes..."), premature vanity metrics, scattered lab experiments, and "updated weekly" liability.

**Decision:** Reposition as **AI Workflow Toolkit** (product-first) with secondary content monetization lane.

**Changes:**

1. **Hero rewrite** — Headline: "Workflows, Tools & AI." → "AI Workflow Tools." Identity line added ("Built by Anaken — software engineer & AI workflow builder"). Subheading now product-focused: "I build tools that make AI workflows visible, testable, and repeatable." CTA order swapped: "Explore Tools" (primary) → "Read Articles" (secondary).
2. **Stats strip** — Removed vanity metrics (project/article counts). Replaced with qualitative signals: "Live & Free" (tools), "New Biweekly" (deep dives), "Building in Public" (lab).
3. **Lab preview** — Filtered to WIP/Live only (removed "Idea" status Token Counter from homepage).
4. **Lab page** — Split experiments into "In Progress" (WIP/Live) and "On the Roadmap" (Idea) sections. Roadmap items rendered at 75% opacity.
5. **Newsletter CTA** — Added "Stay in the loop" section with "Get notified" link before contact CTA.
6. **Metadata** — Updated title to "AI Workflow Tools & Deep Dives" and description to reflect toolkit positioning.
7. **Removed "updated weekly"** — Replaced with "Open-source tools & deep-dive articles".

**Files changed:**
- `app/page.tsx` — hero, stats, lab preview, newsletter CTA, metadata
- `app/lab/page.tsx` — split active vs roadmap experiments

**PR:** https://github.com/annabel-lee-x10/anaken-one-landing/pull/19
