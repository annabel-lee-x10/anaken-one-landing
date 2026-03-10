// Free RSS feeds — no API key, no cost per visitor
// Uses rss2json.com free tier (1000 req/day) as RSS-to-JSON proxy

const RSS_FEEDS = [
  "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffeeds.feedburner.com%2FTheAIBlog",
  "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fventurebeat.com%2Fcategory%2Fai%2Ffeed%2F",
];

// Fallback feed if all else fails
const FALLBACK = [
  { title:"OpenAI Releases GPT-4o Updates", summary:"OpenAI continues iterating on its multimodal flagship model with improved reasoning and faster response times.", source:"VentureBeat", url:"https://venturebeat.com/ai/", date:"Mar 2026" },
  { title:"Google DeepMind Advances Robotics AI", summary:"DeepMind's latest research demonstrates robots learning complex tasks from a handful of human demonstrations.", source:"VentureBeat", url:"https://venturebeat.com/ai/", date:"Mar 2026" },
  { title:"EU AI Act Enforcement Begins", summary:"The EU's landmark AI Act starts applying to high-risk systems, with companies racing to meet new compliance requirements.", source:"VentureBeat", url:"https://venturebeat.com/ai/", date:"Mar 2026" },
  { title:"Anthropic Raises New Funding Round", summary:"Anthropic secures additional investment to accelerate development of its Claude AI models and safety research.", source:"VentureBeat", url:"https://venturebeat.com/ai/", date:"Mar 2026" },
  { title:"Open Source Models Close Gap With GPT-4", summary:"New benchmarks show open-weight models from Meta and Mistral performing competitively with proprietary alternatives.", source:"VentureBeat", url:"https://venturebeat.com/ai/", date:"Mar 2026" },
  { title:"AI Coding Tools Hit 1 Billion Users", summary:"GitHub Copilot, Cursor, and competitors collectively cross the one billion active user milestone in early 2026.", source:"VentureBeat", url:"https://venturebeat.com/ai/", date:"Mar 2026" },
];

function parseDate(str) {
  try { const d = new Date(str); if (!isNaN(d)) return d.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}); } catch {}
  return "";
}

export async function GET() {
  for (const feedUrl of RSS_FEEDS) {
    try {
      const res = await fetch(feedUrl, { next: { revalidate: 28800 } }); // cache 8h server-side
      if (!res.ok) continue;
      const data = await res.json();
      if (data.status !== "ok" || !Array.isArray(data.items) || !data.items.length) continue;

      const articles = data.items.slice(0, 6).map(item => ({
        title:   String(item.title   || "").replace(/<[^>]*>/g,"").slice(0, 100),
        summary: String(item.description || item.content || "").replace(/<[^>]*>/g,"").slice(0, 200).trim(),
        source:  String(data.feed?.title || item.author || "").replace(/<[^>]*>/g,"").slice(0, 60),
        date:    parseDate(item.pubDate),
        url:     /^https?:\/\/.+/.test(String(item.link||"")) ? String(item.link).slice(0,500) : "#",
      })).filter(a => a.title && a.url !== "#");

      if (articles.length >= 3) return Response.json({ articles }, { headers: { "Cache-Control": "public, max-age=28800" } });
    } catch { continue; }
  }

  // All feeds failed — return hardcoded fallback
  return Response.json({ articles: FALLBACK }, { headers: { "Cache-Control": "public, max-age=3600" } });
}
