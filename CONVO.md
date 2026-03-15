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
