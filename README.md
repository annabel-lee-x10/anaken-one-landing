# anaken.one

Personal site — Next.js App Router.

## Structure

```
app/
  layout.jsx              ← root layout (GA tag, meta)
  page.jsx                ← landing SPA (intro, news, projects, contact)
  articles/
    page.jsx              ← /articles listing
    [slug]/page.jsx       ← /articles/:slug article detail
  api/
    news/route.js         ← AI news proxy (server-side only)
    contact/route.js      ← Gmail SMTP contact form

content/articles/         ← markdown article files
lib/articles.js           ← reads + parses markdown
```

## Dev

```bash
npm install
cp .env.example .env.local
# fill in env vars
npm run dev
```

## Writing an article

Create `content/articles/your-slug.md`:

```md
---
title: "Your Title"
date: "2026-03-15"
description: "One sentence shown in the listing."
slug: "your-slug"
---

Content here...
```

## Env vars (Vercel)

| Key | Purpose |
|-----|---------|
| `ANTHROPIC_API_KEY` | News feed (server-side only) |
| `GMAIL_USER` | Gmail address to send from |
| `GMAIL_APP_PASSWORD` | 16-char Google App Password |
| `CONTACT_EMAIL` | Inbox for contact form messages |

## Deploy

Push to GitHub → connect repo in Vercel → add env vars → deploy.
Next.js is detected automatically by Vercel.
