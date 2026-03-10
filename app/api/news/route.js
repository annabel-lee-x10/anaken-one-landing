// Fetches RSS XML directly — no third-party proxy, no API key, no cost

const FEEDS = [
  { url: "https://techcrunch.com/category/artificial-intelligence/feed/", source: "TechCrunch" },
  { url: "https://venturebeat.com/feed/", source: "VentureBeat" },
  { url: "https://www.wired.com/feed/tag/artificial-intelligence/latest/rss", source: "Wired" },
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml", source: "NYT Technology" },
];

// Minimal XML RSS parser — extracts <item> blocks and pulls fields out
function parseRSS(xml, sourceName) {
  const items = [];
  const itemRe = /<item[\s>]([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRe.exec(xml)) !== null) {
    const block = match[1];
    const get = (tag) => {
      // Try CDATA first, then plain text
      const cdata = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i").exec(block);
      if (cdata) return cdata[1].trim();
      const plain = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i").exec(block);
      return plain ? plain[1].replace(/<[^>]*>/g, "").trim() : "";
    };

    const title   = get("title");
    const link    = get("link") || (/<link>(.*?)<\/link>/i.exec(block)||[])[1] || "";
    const rawDesc = get("description") || get("summary");
    // Strip HTML tags and truncate for summary
    const summary = rawDesc.replace(/<[^>]*>/g,"").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&#\d+;/g,"").trim().slice(0, 200);
    const pubDate = get("pubDate") || get("published") || get("dc:date");
    const source  = get("dc:creator") ? `${sourceName}` : sourceName;

    let date = "";
    try { const d = new Date(pubDate); if (!isNaN(d)) date = d.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}); } catch {}

    const cleanLink = /^https?:\/\/.+/.test(link) ? link.slice(0,500) : "";

    if (title && cleanLink) items.push({ title: title.slice(0,100), summary, source, date, url: cleanLink });
    if (items.length >= 6) break;
  }
  return items;
}

export async function GET() {
  const allArticles = [];

  for (const feed of FEEDS) {
    if (allArticles.length >= 6) break;
    try {
      const res = await fetch(feed.url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; RSS reader)" },
        next: { revalidate: 28800 }, // Next.js server-side cache: 8 hours
      });
      if (!res.ok) continue;
      const xml = await res.text();
      const items = parseRSS(xml, feed.source);
      allArticles.push(...items.slice(0, 6 - allArticles.length));
    } catch { continue; }
  }

  if (allArticles.length >= 3) {
    return Response.json(
      { articles: allArticles.slice(0, 6) },
      { headers: { "Cache-Control": "public, max-age=28800" } }
    );
  }

  // Hard fallback — only reached if all feeds are down
  return Response.json({
    articles: [
      { title:"AI News Temporarily Unavailable", summary:"Unable to fetch the latest headlines. Check back soon or visit TechCrunch AI for the latest.", source:"System", date:"", url:"https://techcrunch.com/category/artificial-intelligence/" },
    ]
  });
}
