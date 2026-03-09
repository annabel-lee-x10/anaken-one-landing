export async function POST() {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) return Response.json({ error: "Missing API key." }, { status: 500 });

  const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const prompt = `Today is ${today}. Search the web for the 6 most interesting AI news stories from the past 7 days.
Return ONLY a JSON array with exactly 6 items. Each item must have:
- title: short punchy headline (max 8 words)
- summary: 1-2 sentence plain English summary (max 30 words)
- source: publication name only
- url: actual article URL starting with https://
- date: formatted like "Mar 8, 2026"
Return ONLY the raw JSON array. No markdown, no backticks, no explanation.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "anthropic-version": "2023-06-01", "x-api-key": ANTHROPIC_API_KEY },
      body: JSON.stringify({
        model: "claude-sonnet-4-6", max_tokens: 1500,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) return Response.json({ error: `Upstream error ${res.status}` }, { status: 502 });
    const data = await res.json();
    const textBlock = data.content?.find(b => b.type === "text");
    if (!textBlock) return Response.json({ error: "No text in response." }, { status: 502 });
    let articles;
    try { articles = JSON.parse(textBlock.text.replace(/```json|```/g, "").trim()); }
    catch { return Response.json({ error: "Could not parse response." }, { status: 502 }); }
    if (!Array.isArray(articles) || !articles.length) return Response.json({ error: "Bad shape." }, { status: 502 });
    const safe = articles.slice(0, 6).map(a => ({
      title:   String(a.title   || "").replace(/<[^>]*>/g, "").slice(0, 120),
      summary: String(a.summary || "").replace(/<[^>]*>/g, "").slice(0, 300),
      source:  String(a.source  || "").replace(/<[^>]*>/g, "").slice(0, 80),
      date:    String(a.date    || "").replace(/<[^>]*>/g, "").slice(0, 20),
      url:     /^https:\/\/.+/.test(String(a.url || "")) ? String(a.url).slice(0, 500) : "#",
    }));
    return Response.json({ articles: safe });
  } catch (err) {
    console.error("[news]", err);
    return Response.json({ error: "Unexpected error." }, { status: 500 });
  }
}
