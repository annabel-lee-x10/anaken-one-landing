# anaken.one

Personal site for Anaken (u18181188). Workflows, tools, and AI.

## Stack

- **Framework:** Next.js 16 (App Router, React 19)
- **Language:** TypeScript (strict mode)
- **Styling:** Hand-rolled CSS custom properties in `app/globals.css` — no Tailwind, no CSS-in-JS, no UI library
- **Font:** Inter via `next/font/google`
- **Content:** Markdown files in `content/articles/` parsed with `gray-matter`
- **Email:** Nodemailer (Gmail SMTP)
- **Deployment:** Vercel

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, project/news/article previews |
| `/articles` | Article listing |
| `/articles/[slug]` | Article detail (SSG via `generateStaticParams`) |
| `/news` | AI news feed (client-side fetch) |
| `/projects` | Project carousel with touch/swipe |
| `/contact` | Contact form |
| `/lab` | Experiments with status badges |
| `/now` | Current focus (nownownow.com style) |
| `/mockup` | Design system reference (not in nav) |
| `/api/news` | News API: newsdata.io → RSS fallback → static |
| `/api/contact` | Contact form handler with rate limiting |

## Architecture

- **Server components** by default; `"use client"` only for interactivity
- **Components:** `components/Nav.tsx`, `Footer.tsx`, `Analytics.tsx`, `SectionTracker.tsx`, `ThemeProvider.tsx`
- **Articles:** `lib/articles.ts` reads from `content/articles/*.md`
- **Analytics:** GA4 (`G-9MV11ZZK39`) with per-page tracking via `usePathname` and per-section tracking via `IntersectionObserver`

## Styling Rules

- All design tokens live in `app/globals.css` as CSS custom properties (`--bg`, `--accent`, `--text-head`, etc.)
- Utility classes: `.container`, `.section`, `.btn`, `.card`, `.card-hover`, `.fade-up`, `.label-upper`
- Light mode only (dark mode toggle removed, can be re-added via `ThemeProvider`)
- Mobile breakpoint: 720px, min viewport: 375px
- No Tailwind. No styled-components. No MUI.

## Environment Variables

```
# Required for contact form
GMAIL_USER=
GMAIL_APP_PASSWORD=
CONTACT_EMAIL=

# Optional — falls back to RSS feeds
NEWS_API_KEY=
```

## Commands

```
npm run dev    # Start dev server
npm run build  # Production build
npm run start  # Start production server
```

## Git / PR Workflow

- Main branch: `main`
- Feature branches follow: `claude/<slug>` (e.g. `claude/dark-mode`)
- Branch to feature branch before starting coding
- Run `npm run build` before every commit — must pass with zero errors
- Always raise PR to `main` branch only (unless explicitly told otherwise); give web URL
- create CONVO.md at project root,if not exists. Summarize current context, then append to CONVO.md before PR is raised.

## Safety Rules

### Never Touch
- Never read, print, log, or include in output: `.env`, `.env.*`, `*.key`, `*.pem`, `secrets/`, `credentials/`
- Never commit files matching: `.env*`, `*secret*`, `*credential*`, `*.pem`, `*.key`
- Never run `git push --force` without explicit confirmation
- Never run `DROP`, `DELETE`, or `TRUNCATE` on production databases
- Never delete files outside the project root

### Before Destructive Actions
- Always confirm before: deleting files, dropping tables, force-pushing, clearing caches
- If unsure whether an action is reversible, STOP and ask

### Git Hygiene
- Always check `git status` before committing
- Never stage `.env` or secret files — verify with `git diff --cached` first
- Use feature branches; never commit directly to `main`

---

## Manifest
- Try; Iterate; Learn
