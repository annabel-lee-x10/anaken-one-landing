import { useState, useEffect, useCallback } from "react";

// ─── Schedule: 01:00, 07:00, 13:00, 19:00 UTC ───────────────────────────────
const SCHEDULE_HOURS_UTC = [1, 7, 13, 19];
const STORAGE_KEY = "anaken-news-cache";

/** Returns the most recent scheduled slot timestamp (ms, UTC) before now */
function lastScheduledSlot(now = Date.now()) {
  const d = new Date(now);
  const todaySlots = SCHEDULE_HOURS_UTC.map((h) => {
    const s = new Date(d);
    s.setUTCHours(h, 0, 0, 0);
    return s.getTime();
  });
  const past = todaySlots.filter((t) => t <= now).sort((a, b) => b - a);
  if (past.length > 0) return past[0];
  // All today's slots are in the future — use yesterday's last slot
  const yesterday = new Date(d);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const lastHour = SCHEDULE_HOURS_UTC[SCHEDULE_HOURS_UTC.length - 1];
  yesterday.setUTCHours(lastHour, 0, 0, 0);
  return yesterday.getTime();
}

/** Returns the next scheduled slot timestamp (ms, UTC) after now */
function nextScheduledSlot(now = Date.now()) {
  const d = new Date(now);
  const todaySlots = SCHEDULE_HOURS_UTC.map((h) => {
    const s = new Date(d);
    s.setUTCHours(h, 0, 0, 0);
    return s.getTime();
  });
  const future = todaySlots.filter((t) => t > now).sort((a, b) => a - b);
  if (future.length > 0) return future[0];
  // All today's slots are past — wrap to tomorrow's first slot
  const tomorrow = new Date(d);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(SCHEDULE_HOURS_UTC[0], 0, 0, 0);
  return tomorrow.getTime();
}

// ─── Fallback news (shown until first scheduled fetch runs) ──────────────────
const FALLBACK_NEWS = [
  {
    title: "AI 'Societies' Are Taking Shape",
    summary: "Researchers are building AI agent simulations with up to 8 billion digital twins — studying collective behavior, consciousness, and social dynamics between bots.",
    source: "Nature",
    url: "https://www.nature.com/articles/d41586-026-00070-5",
    date: "Mar 5, 2026",
  },
  {
    title: "AI & Labor Markets: New Research",
    summary: "Anthropic researchers find AI displacement risk is real but slower than feared — hiring of younger workers in exposed fields has quietly slowed since 2022.",
    source: "Anthropic Research",
    url: "https://www.anthropic.com/research/labor-market-impacts",
    date: "Mar 5, 2026",
  },
  {
    title: "London's Biggest Anti-AI Protest",
    summary: "Hundreds marched through London's King's Cross AI hub — past OpenAI, Meta & DeepMind HQs — calling for regulation, whistleblower protections, and a slowdown.",
    source: "MIT Tech Review",
    url: "https://www.technologyreview.com/2026/03/02/1133814/i-checked-out-londons-biggest-ever-anti-ai-protest/",
    date: "Mar 2, 2026",
  },
  {
    title: "State AI Laws Are Moving Fast",
    summary: "Vermont signed a synthetic media election bill into law. AI chatbot safety bills for minors are advancing across five states.",
    source: "Transparency Coalition",
    url: "https://www.transparencycoalition.ai/news/ai-legislative-update-march6-2026",
    date: "Mar 6, 2026",
  },
];

const PROJECTS = [
  {
    name: "AI Fact-Check Engine",
    tagline: "Verify AI-generated claims in real time.",
    description: "Paste any text and get a source-backed fact check powered by live AI reasoning.",
    url: "https://aifactchecker.anaken.one/",
    icon: "⚡",
    tag: "tool",
  },
  {
    name: "promptVault",
    tagline: "Your personal prompt engineering HQ.",
    description: "Build, store, and organize your best prompts. Optimized for iterative AI workflows.",
    url: "https://prompt-builder-vault.anaken.one/",
    icon: "🗄️",
    tag: "tool",
  },
  {
    name: "Anaken.one",
    tagline: "This site — live AI news + projects hub.",
    description: "A dark techy mini site with a scheduled AI news feed, powered by Claude + web search. Updates at 01:00, 07:00, 13:00, 19:00 UTC.",
    url: "#",
    icon: "🛰️",
    tag: "site",
  },
];

// ─── API ─────────────────────────────────────────────────────────────────────
async function fetchLiveNews() {
  const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const prompt = `Today is ${today}. Search the web for the 4 most interesting AI news stories from the past 7 days.
Return ONLY a JSON array with exactly 4 items. Each item must have:
- title: short punchy headline (max 8 words)
- summary: 1-2 sentence plain English summary (max 30 words)
- source: publication name only
- url: actual article URL
- date: formatted like "Mar 8, 2026"
Return ONLY the raw JSON array. No markdown, no backticks, no explanation.`;

  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  const headers = { "Content-Type": "application/json", "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" };
  if (apiKey) headers["x-api-key"] = apiKey;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  const textBlock = data.content?.find((b) => b.type === "text");
  if (!textBlock) throw new Error("No text block");
  const raw = textBlock.text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("Bad shape");
  return parsed.slice(0, 4);
}

// ─── Cache helpers (works for both window.storage and localStorage) ───────────
async function readCache() {
  try {
    if (window.storage) {
      const r = await window.storage.get(STORAGE_KEY);
      return r ? JSON.parse(r.value) : null;
    }
    const r = localStorage.getItem(STORAGE_KEY);
    return r ? JSON.parse(r) : null;
  } catch { return null; }
}

async function writeCache(payload) {
  try {
    const s = JSON.stringify(payload);
    if (window.storage) await window.storage.set(STORAGE_KEY, s);
    else localStorage.setItem(STORAGE_KEY, s);
  } catch {}
}

// ─── Sub-components ───────────────────────────────────────────────────────────
const GlitchText = ({ text }) => {
  const [g, setG] = useState(false);
  useEffect(() => {
    const id = setInterval(() => { setG(true); setTimeout(() => setG(false), 150); }, 4000);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{ color: g ? "#00ff88" : "inherit", textShadow: g ? "2px 0 #ff0055, -2px 0 #0088ff" : "none", transition: "color 0.1s" }}>
      {text}
    </span>
  );
};

const ScanLine = () => (
  <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)" }} />
);

const Spinner = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "60px 0" }}>
    <div style={{ width: "32px", height: "32px", border: "2px solid rgba(0,200,120,0.15)", borderTop: "2px solid #00c878", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    <span style={{ fontSize: "11px", color: "rgba(0,200,120,0.5)", letterSpacing: "2px" }}>FETCHING SIGNAL...</span>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeSection, setActiveSection] = useState("intro");
  const [hoveredNews, setHoveredNews] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [time, setTime] = useState(new Date());
  const [news, setNews] = useState(FALLBACK_NEWS);
  const [newsLoading, setNewsLoading] = useState(false);
  const [nextSlot, setNextSlot] = useState(null);

  // ── Clock ──
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (d) => d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const formatCountdown = (ts) => {
    if (!ts) return null;
    const diff = ts - Date.now();
    if (diff <= 0) return "now";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // ── Scheduled fetch logic ──
  const runScheduledFetch = useCallback(async () => {
    setNewsLoading(true);
    try {
      const articles = await fetchLiveNews();
      const timestamp = Date.now();
      setNews(articles);
      await writeCache({ articles, timestamp });
    } catch (e) {
      console.error("Scheduled news fetch failed:", e);
    } finally {
      setNewsLoading(false);
    }
  }, []);

  // ── On mount: load cache, check if current slot needs fetching ──
  useEffect(() => {
    const init = async () => {
      const now = Date.now();
      const slot = lastScheduledSlot(now);
      const next = nextScheduledSlot(now);
      setNextSlot(next);

      const cached = await readCache();
      if (cached?.articles) {
        setNews(cached.articles);
        // Only re-fetch if cache predates the most recent slot
        if (cached.timestamp < slot) {
          runScheduledFetch();
        }
      } else {
        // No cache at all — fetch immediately so user isn't stuck on fallback
        runScheduledFetch();
      }
    };
    init();
  }, [runScheduledFetch]);

  // ── Scheduler: set a timeout to fire at the next slot, then repeat ──
  useEffect(() => {
    let timeoutId;

    const scheduleNext = () => {
      const delay = nextScheduledSlot(Date.now()) - Date.now();
      timeoutId = setTimeout(async () => {
        const next = nextScheduledSlot(Date.now());
        setNextSlot(next);
        await runScheduledFetch();
        scheduleNext(); // re-arm for the following slot
      }, delay);
      setNextSlot(nextScheduledSlot(Date.now()));
    };

    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, [runScheduledFetch]);

  const sections = ["intro", "news", "projects"];

  return (
    <div style={{ minHeight: "100vh", background: "#080c0f", color: "#c8d8e8", fontFamily: "'Courier New', 'Lucida Console', monospace", position: "relative", overflow: "hidden" }}>
      <ScanLine />
      <div style={{ position: "fixed", inset: 0, zIndex: 0, backgroundImage: `linear-gradient(rgba(0,200,120,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,120,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
      <div style={{ position: "fixed", top: "-20%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "400px", background: "radial-gradient(ellipse, rgba(0,200,100,0.06) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, borderBottom: "1px solid rgba(0,200,120,0.2)", background: "rgba(8,12,15,0.92)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: "52px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#00c878", fontSize: "18px", letterSpacing: "2px", fontWeight: "bold" }}>ANAKEN</span>
          <span style={{ color: "rgba(0,200,120,0.4)", fontSize: "11px" }}>/ u18181188</span>
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          {sections.map((s) => (
            <button key={s} onClick={() => setActiveSection(s)} style={{ background: activeSection === s ? "rgba(0,200,120,0.15)" : "transparent", border: activeSection === s ? "1px solid rgba(0,200,120,0.5)" : "1px solid transparent", color: activeSection === s ? "#00c878" : "rgba(200,216,232,0.5)", padding: "4px 14px", cursor: "pointer", fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", transition: "all 0.2s" }}>
              {s === "news" && newsLoading ? "news ◌" : s}
            </button>
          ))}
        </div>
        <div style={{ fontSize: "11px", color: "rgba(0,200,120,0.5)", letterSpacing: "1px" }}>{formatTime(time)}</div>
      </nav>

      <main style={{ position: "relative", zIndex: 1, maxWidth: "820px", margin: "0 auto", padding: "80px 24px 60px" }}>

        {/* INTRO */}
        {activeSection === "intro" && (
          <section style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{ borderLeft: "2px solid #00c878", paddingLeft: "24px", marginBottom: "40px" }}>
              <div style={{ fontSize: "11px", color: "rgba(0,200,120,0.5)", letterSpacing: "2px", marginBottom: "12px" }}>SYSTEM.BOOT / IDENTITY</div>
              <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: "bold", lineHeight: 1.1, margin: "0 0 16px", color: "#e8f4f0", letterSpacing: "-1px" }}>
                <GlitchText text="Anaken" />
              </h1>
              <p style={{ fontSize: "16px", lineHeight: "1.8", color: "rgba(200,216,232,0.7)", maxWidth: "520px", margin: 0 }}>
                Ageless hobbyist. I love learning workflows and processes — then taking them apart to make them faster, leaner, and smarter.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "rgba(0,200,120,0.1)", border: "1px solid rgba(0,200,120,0.15)", marginBottom: "40px" }}>
              {[{ label: "Focus", value: "Workflow Optimization" }, { label: "Mode", value: "Perpetual Learner" }, { label: "Stack", value: "AI-first Tooling" }].map((item) => (
                <div key={item.label} style={{ background: "#080c0f", padding: "20px", borderRight: "1px solid rgba(0,200,120,0.08)" }}>
                  <div style={{ fontSize: "10px", color: "rgba(0,200,120,0.5)", letterSpacing: "2px", marginBottom: "6px" }}>{item.label.toUpperCase()}</div>
                  <div style={{ fontSize: "14px", color: "#c8d8e8" }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {[{ label: "→ VIEW PROJECTS", section: "projects", primary: true }, { label: "→ AI NEWS FEED", section: "news", primary: false }].map(({ label, section, primary }) => (
                <button key={section} onClick={() => setActiveSection(section)} style={{ background: primary ? "rgba(0,200,120,0.12)" : "transparent", border: primary ? "1px solid rgba(0,200,120,0.4)" : "1px solid rgba(200,216,232,0.15)", color: primary ? "#00c878" : "rgba(200,216,232,0.5)", padding: "10px 24px", cursor: "pointer", fontSize: "12px", letterSpacing: "1.5px", transition: "all 0.2s" }}>
                  {label}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* NEWS */}
        {activeSection === "news" && (
          <section style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{ marginBottom: "28px" }}>
              <div style={{ fontSize: "11px", color: "rgba(0,200,120,0.5)", letterSpacing: "2px", marginBottom: "8px" }}>SIGNAL.FEED / AI_NEWS</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "12px" }}>
                <h2 style={{ fontSize: "28px", margin: 0, color: "#e8f4f0", fontWeight: "bold" }}>Current Intelligence</h2>
              </div>
              <div style={{ display: "flex", gap: "20px", marginTop: "8px" }}>
                {nextSlot && !newsLoading && (
                  <span style={{ fontSize: "10px", color: "rgba(0,200,120,0.35)", letterSpacing: "1px" }}>
                    NEXT UPDATE: {formatCountdown(nextSlot)}
                  </span>
                )}
                {newsLoading && (
                  <span style={{ fontSize: "10px", color: "rgba(0,200,120,0.5)", letterSpacing: "1px" }}>● UPDATING...</span>
                )}
              </div>
            </div>

            {newsLoading ? <Spinner /> : (
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {news.map((item, i) => (
                  <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
                    onMouseEnter={() => setHoveredNews(i)} onMouseLeave={() => setHoveredNews(null)}
                    style={{ display: "block", background: hoveredNews === i ? "rgba(0,200,120,0.06)" : "rgba(0,200,120,0.02)", border: `1px solid ${hoveredNews === i ? "rgba(0,200,120,0.35)" : "rgba(0,200,120,0.1)"}`, padding: "20px 24px", textDecoration: "none", transition: "all 0.2s" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", gap: "12px" }}>
                      <span style={{ fontSize: "15px", fontWeight: "bold", color: hoveredNews === i ? "#00c878" : "#c8d8e8", transition: "color 0.2s" }}>{item.title}</span>
                      <span style={{ fontSize: "10px", color: "rgba(0,200,120,0.4)", whiteSpace: "nowrap", letterSpacing: "1px" }}>{item.date}</span>
                    </div>
                    <p style={{ margin: "0 0 10px", fontSize: "13px", color: "rgba(200,216,232,0.6)", lineHeight: "1.6" }}>{item.summary}</p>
                    <span style={{ fontSize: "10px", color: "rgba(0,200,120,0.5)", letterSpacing: "1px" }}>{item.source} ↗</span>
                  </a>
                ))}
              </div>
            )}
          </section>
        )}

        {/* PROJECTS */}
        {activeSection === "projects" && (
          <section style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{ marginBottom: "32px" }}>
              <div style={{ fontSize: "11px", color: "rgba(0,200,120,0.5)", letterSpacing: "2px", marginBottom: "8px" }}>OUTPUT.REGISTRY / BUILDS</div>
              <h2 style={{ fontSize: "28px", margin: 0, color: "#e8f4f0", fontWeight: "bold" }}>Projects</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2px" }}>
              {PROJECTS.map((p, i) => (
                <a key={i} href={p.url} target={p.url === "#" ? "_self" : "_blank"} rel="noopener noreferrer"
                  onMouseEnter={() => setHoveredProject(i)} onMouseLeave={() => setHoveredProject(null)}
                  style={{ display: "block", background: hoveredProject === i ? "rgba(0,200,120,0.08)" : "rgba(0,200,120,0.02)", border: `1px solid ${hoveredProject === i ? "rgba(0,200,120,0.45)" : "rgba(0,200,120,0.12)"}`, padding: "28px", textDecoration: "none", transition: "all 0.25s", position: "relative", overflow: "hidden" }}
                >
                  <div style={{ position: "absolute", top: 0, right: 0, width: "40px", height: "40px", borderBottom: `1px solid ${hoveredProject === i ? "rgba(0,200,120,0.4)" : "rgba(0,200,120,0.15)"}`, borderLeft: `1px solid ${hoveredProject === i ? "rgba(0,200,120,0.4)" : "rgba(0,200,120,0.15)"}`, transition: "all 0.25s" }} />
                  <div style={{ fontSize: "28px", marginBottom: "16px" }}>{p.icon}</div>
                  <div style={{ fontSize: "10px", color: "rgba(0,200,120,0.4)", letterSpacing: "2px", marginBottom: "8px" }}>{p.tag.toUpperCase()}</div>
                  <h3 style={{ fontSize: "20px", margin: "0 0 8px", color: hoveredProject === i ? "#00c878" : "#e8f4f0", transition: "color 0.2s", fontWeight: "bold" }}>{p.name}</h3>
                  <p style={{ margin: "0 0 6px", fontSize: "13px", color: "rgba(200,216,232,0.8)", fontWeight: "bold" }}>{p.tagline}</p>
                  <p style={{ margin: "0 0 20px", fontSize: "12px", color: "rgba(200,216,232,0.5)", lineHeight: "1.6" }}>{p.description}</p>
                  <div style={{ fontSize: "11px", letterSpacing: "1.5px", color: hoveredProject === i ? "#00c878" : "rgba(0,200,120,0.4)", transition: "color 0.2s" }}>
                    {p.url === "#" ? "YOU ARE HERE →" : "OPEN PROJECT →"}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(0,200,120,0.1)", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "10px", color: "rgba(200,216,232,0.25)", letterSpacing: "1px" }}>
        <span>ANAKEN / u18181188</span>
        <span>NEWS · 01:00 07:00 13:00 19:00 UTC</span>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080c0f; }
        ::-webkit-scrollbar-thumb { background: rgba(0,200,120,0.3); }
      `}</style>
    </div>
  );
}
