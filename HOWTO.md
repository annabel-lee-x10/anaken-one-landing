# How To

## Scheduled Article Publishing

Add `publishDate` to any article's frontmatter to schedule it:

```yaml
---
title: "My Article"
date: "2026-03-16"
publishDate: "2026-04-01T09:00:00"
---
```

- Articles with a future `publishDate` are hidden from listings and return 404 on direct access
- Articles without `publishDate` publish immediately
- The `publishDate` is used as the displayed date (overrides `date`)
- Pages revalidate hourly (ISR) so scheduled articles auto-appear within ~1 hour

### Timezone

The `new Date()` comparison runs on Vercel's server, which uses **UTC**. So `publishDate: "2026-04-01T09:00:00"` means 9am UTC. If you want a specific timezone, use ISO offset format:

- `"2026-04-01T09:00:00+08:00"` — 9am Singapore/Malaysia time
- `"2026-04-01T09:00:00Z"` — 9am UTC explicitly
