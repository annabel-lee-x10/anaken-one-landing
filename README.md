# anaken-site

Personal mini site — intro, live AI news (scheduled UTC), projects, contact form.

## Local setup

```bash
npm install
cp .env.example .env    # fill in your three keys
npm run dev
```

## Deploy to Vercel

1. Push to GitHub, import at https://vercel.com/new
2. Framework: **Vite** (auto-detected)
3. Add environment variables (Project Settings → Environment Variables):

| Key | Where to get it | Exposed to browser? |
|-----|----------------|---------------------|
| `ANTHROPIC_API_KEY` | console.anthropic.com | ❌ Server-only |
| `RESEND_API_KEY` | resend.com (free tier) | ❌ Server-only |
| `CONTACT_EMAIL` | Your email address | ❌ Server-only |

**Important:** Do NOT prefix `ANTHROPIC_API_KEY` with `VITE_` — that would bake it into the JS bundle.

## Security

- **API key** — Anthropic key lives only in `/api/news.js` (serverless), never in the browser bundle
- **Contact form** — rate limited (3/min/IP), CSRF origin-checked, all inputs sanitized including newline stripping to prevent email header injection
- **News URLs** — validated as `https://` before rendering as `<a href>`
- **Security headers** — CSP, X-Frame-Options, HSTS, Referrer-Policy, Permissions-Policy set in `vercel.json`
- **Email** — `CONTACT_EMAIL` is server-side env var only, never in client code

## Project structure

```
anaken-site/
├── index.html              ← GA tag
├── vite.config.js
├── vercel.json             ← security headers + routing
├── .env.example
├── api/
│   ├── news.js             ← Anthropic proxy (server-side, key protected)
│   └── contact.js          ← email handler (rate-limited, CSRF-checked)
└── src/
    ├── main.jsx
    └── App.jsx
```
