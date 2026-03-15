import { NextResponse } from "next/server";

// ── RSS Feeds (free, no API key) ───────────────────────────
const FEEDS = [
  { url: "https://techcrunch.com/category/artificial-intelligence/feed/", source: "TechCrunch" },
  { url: "https://venturebeat.com/feed/", source: "VentureBeat" },
  { url: "https://www.wired.com/feed/tag/artificial-intelligence/latest/rss", source: "Wired" },
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml", source: "NYT Technology" },
];

// ── Static fallback ────────────────────────────────────────
const FALLBACK = [
  { title: "AI models continue to break reasoning benchmarks", summary: "Latest models from major labs show significant gains on logic and math tasks.", source: "TechCrunch", url: "#", date: new Date().toISOString() },
  { title: "Open-source AI narrows gap with proprietary models", summary: "Community fine-tunes and novel architectures are closing the capability gap rapidly.", source: "The Verge", url: "#", date: new Date().toISOString() },
  { title: "AI coding assistants now write majority of code at some firms", summary: "Survey finds over 50% of committed code at some orgs is AI-generated.", source: "VentureBeat", url: "#", date: new Date().toISOString() },
];

type NewsItem = {
  title: string;
  summary: string;
  source: string;
  url: string;
  date: string;
};

// ── Minimal XML RSS parser ─────────────────────────────────
function parseRSS(xml: string, sourceName: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRe = /<item[\s>]([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRe.exec(xml)) !== null) {
    const block = match[1];
    const get = (tag: string): string => {
      const cdata = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i").exec(block);
      if (cdata) return cdata[1].trim();
      const plain = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i").exec(block);
      return plain ? plain[1].replace(/<[^>]*>/g, "").trim() : "";
    };

    const title = get("title");
    const link = get("link") || (/<link>(.*?)<\/link>/i.exec(block) || [])[1] || "";
    const rawDesc = get("description") || get("summary");
    const summary = rawDesc.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#\d+;/g, "").trim().slice(0, 200);
    const pubDate = get("pubDate") || get("published") || get("dc:date");

    let date = "";
    try { const d = new Date(pubDate); if (!isNaN(d.getTime())) date = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); } catch { /* skip */ }

    const cleanLink = /^https?:\/\/.+/.test(link) ? link.slice(0, 500) : "";

    if (title && cleanLink) items.push({ title: title.slice(0, 100), summary, source: sourceName, date, url: cleanLink });
    if (items.length >= 6) break;
  }
  return items;
}

// ── newsdata.io fetcher ────────────────────────────────────
async function fetchFromAPI(apiKey: string): Promise<NewsItem[]> {
  const res = await fetch(
    `https://newsdata.io/api/1/news?apikey=${apiKey}&q=artificial+intelligence&language=en&category=technology`,
    { next: { revalidate: 28800 } }
  );
  if (!res.ok) throw new Error("API error");
  const data = await res.json();
  return (data.results ?? []).slice(0, 6).map((r: Record<string, string>) => ({
    title: r.title,
    summary: r.description ?? "",
    source: r.source_id ?? "",
    url: r.link ?? "#",
    date: r.pubDate ?? new Date().toISOString(),
  }));
}

// ── RSS fetcher ────────────────────────────────────────────
async function fetchFromRSS(): Promise<NewsItem[]> {
  const allArticles: NewsItem[] = [];
  for (const feed of FEEDS) {
    if (allArticles.length >= 6) break;
    try {
      const res = await fetch(feed.url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; RSS reader)" },
        next: { revalidate: 28800 },
      });
      if (!res.ok) continue;
      const xml = await res.text();
      const items = parseRSS(xml, feed.source);
      allArticles.push(...items.slice(0, 6 - allArticles.length));
    } catch { continue; }
  }
  return allArticles;
}

// ── GET handler ────────────────────────────────────────────
export async function GET() {
  // 1. Try newsdata.io API (if key exists)
  const apiKey = process.env.NEWS_API_KEY;
  if (apiKey) {
    try {
      const items = await fetchFromAPI(apiKey);
      if (items.length >= 3) {
        return NextResponse.json({ items, source: "api" }, {
          headers: { "Cache-Control": "public, max-age=28800" },
        });
      }
    } catch { /* fall through to RSS */ }
  }

  // 2. Fallback: RSS feeds
  try {
    const items = await fetchFromRSS();
    if (items.length >= 3) {
      return NextResponse.json({ items: items.slice(0, 6), source: "rss" }, {
        headers: { "Cache-Control": "public, max-age=28800" },
      });
    }
  } catch { /* fall through to static fallback */ }

  // 3. Last resort: static fallback
  return NextResponse.json({ items: FALLBACK, source: "fallback" });
}
