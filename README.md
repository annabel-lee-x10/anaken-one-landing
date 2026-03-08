# anaken-site

Personal mini site — intro, live AI news feed (auto-refreshes every 6h via Claude + web search), and projects.

## Local setup

```bash
npm install
cp .env.example .env        # add your Anthropic API key
npm run dev
```

## Deploy to Vercel

### Option A — Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option B — GitHub → Vercel dashboard
1. Push this folder to a GitHub repo
2. Go to https://vercel.com/new → import the repo
3. Framework preset: **Vite** (auto-detected)
4. Add environment variable:
   - Key: `VITE_ANTHROPIC_API_KEY`
   - Value: your key from https://console.anthropic.com
5. Deploy

## Project structure

```
anaken-site/
├── index.html
├── vite.config.js
├── vercel.json
├── .env.example
└── src/
    ├── main.jsx
    └── App.jsx        ← all the site logic lives here
```

## Notes

- News fetches run at **01:00, 07:00, 13:00, 19:00 UTC** — not on every page load
- On load, the cached result is shown instantly; a fetch only fires if the cache predates the most recent scheduled slot
- The news feed uses Claude's web search tool to fetch live stories
- To add more projects, edit the `PROJECTS` array in `src/App.jsx`
