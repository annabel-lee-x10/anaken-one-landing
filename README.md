# anaken.one — Next.js

## Setup
```bash
npm install
cp .env.example .env.local  # fill in your keys
npm run dev                  # localhost:3000
```

## Adding Articles
Drop a `.md` file into `content/articles/` with this frontmatter:
```md
---
title: "Your Article Title"
date: "2026-03-15"
description: "One sentence summary shown in listing."
slug: "your-article-slug"
---

Article body in standard markdown...
```
Push to GitHub → Vercel auto-deploys → article appears at `/articles/your-article-slug`.

## Environment Variables (Vercel)
| Key | Value |
|-----|-------|
| `ANTHROPIC_API_KEY` | From console.anthropic.com |
| `GMAIL_USER` | Gmail address to send from |
| `GMAIL_APP_PASSWORD` | 16-char Google App Password (no spaces) |
| `CONTACT_EMAIL` | Inbox to receive messages |
