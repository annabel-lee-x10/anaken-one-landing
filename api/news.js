// api/news.js — server-side news fetch proxy
// ANTHROPIC_API_KEY lives only in Vercel env vars, never in the client bundle

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "Server configuration error." });
  }

  const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const prompt = `Today is ${today}. Search the web for the 10 most interesting AI news stories from the past 7 days.
Return ONLY a JSON array with exactly 10 items. Each item must have:
- title: short punchy headline (max 8 words)
- summary: 1-2 sentence plain English summary (max 30 words)
- source: publication name only
- url: actual article URL starting with https://
- date: formatted like "Mar 8, 2026"
Return ONLY the raw JSON array. No markdown, no backticks, no explanation.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "x-api-key": ANTHROPIC_API_KEY,
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic error:", err);
      return res.status(502).json({ error: "Failed to fetch news." });
    }

    const data = await response.json();
    const textBlock = data.content?.find((b) => b.type === "text");
    if (!textBlock) return res.status(502).json({ error: "No text block in response." });

    const raw = textBlock.text.replace(/```json|```/g, "").trim();
    const articles = JSON.parse(raw);
    if (!Array.isArray(articles) || articles.length === 0) {
      return res.status(502).json({ error: "Unexpected response shape." });
    }

    // Validate and sanitize each article before sending to client
    const safe = articles.slice(0, 10).map((a) => ({
      title:   String(a.title   || "").replace(/<[^>]*>/g, "").slice(0, 120),
      summary: String(a.summary || "").replace(/<[^>]*>/g, "").slice(0, 300),
      source:  String(a.source  || "").replace(/<[^>]*>/g, "").slice(0, 80),
      date:    String(a.date    || "").replace(/<[^>]*>/g, "").slice(0, 20),
      // Only allow https:// URLs — block javascript:, data:, etc.
      url: /^https:\/\/.+/.test(String(a.url || "")) ? String(a.url).slice(0, 500) : "#",
    }));

    return res.status(200).json({ articles: safe });
  } catch (err) {
    console.error("News fetch error:", err);
    return res.status(500).json({ error: "Unexpected error." });
  }
}
