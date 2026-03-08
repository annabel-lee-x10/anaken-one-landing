import { useState, useEffect, useCallback } from "react";

// ─── Schedule: 01:00, 07:00, 13:00, 19:00 UTC ────────────────────────────────
const SCHEDULE_HOURS_UTC = [1, 7, 13, 19];
const STORAGE_KEY = "anaken-news-cache";

function lastScheduledSlot(now = Date.now()) {
  const d = new Date(now);
  const todaySlots = SCHEDULE_HOURS_UTC.map((h) => { const s = new Date(d); s.setUTCHours(h, 0, 0, 0); return s.getTime(); });
  const past = todaySlots.filter((t) => t <= now).sort((a, b) => b - a);
  if (past.length > 0) return past[0];
  const yesterday = new Date(d); yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  yesterday.setUTCHours(SCHEDULE_HOURS_UTC[SCHEDULE_HOURS_UTC.length - 1], 0, 0, 0);
  return yesterday.getTime();
}

function nextScheduledSlot(now = Date.now()) {
  const d = new Date(now);
  const todaySlots = SCHEDULE_HOURS_UTC.map((h) => { const s = new Date(d); s.setUTCHours(h, 0, 0, 0); return s.getTime(); });
  const future = todaySlots.filter((t) => t > now).sort((a, b) => a - b);
  if (future.length > 0) return future[0];
  const tomorrow = new Date(d); tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(SCHEDULE_HOURS_UTC[0], 0, 0, 0);
  return tomorrow.getTime();
}

// ─── Fallback news ────────────────────────────────────────────────────────────
const FALLBACK_NEWS = [
  { title: "AI 'Societies' Are Taking Shape", summary: "Researchers are building AI agent simulations with up to 8 billion digital twins — studying collective behavior, consciousness, and social dynamics between bots.", source: "Nature", url: "https://www.nature.com/articles/d41586-026-00070-5", date: "Mar 5, 2026" },
  { title: "AI & Labor Markets: New Research", summary: "Anthropic researchers find AI displacement risk is real but slower than feared — hiring of younger workers in exposed fields has quietly slowed since 2022.", source: "Anthropic Research", url: "https://www.anthropic.com/research/labor-market-impacts", date: "Mar 5, 2026" },
  { title: "London's Biggest Anti-AI Protest", summary: "Hundreds marched through London's King's Cross AI hub — past OpenAI, Meta & DeepMind HQs — calling for regulation, whistleblower protections, and a slowdown.", source: "MIT Tech Review", url: "https://www.technologyreview.com/2026/03/02/1133814/i-checked-out-londons-biggest-ever-anti-ai-protest/", date: "Mar 2, 2026" },
  { title: "State AI Laws Are Moving Fast", summary: "Vermont signed a synthetic media election bill into law. AI chatbot safety bills for minors are advancing across five states.", source: "Transparency Coalition", url: "https://www.transparencycoalition.ai/news/ai-legislative-update-march6-2026", date: "Mar 6, 2026" },
];

// ─── Projects ─────────────────────────────────────────────────────────────────
const PROJECTS = [
  { name: "AI Fact-Check Engine", tagline: "Verify AI-generated claims in real time.", description: "Paste any text and get a source-backed fact check powered by live AI reasoning.", url: "https://aifactchecker.anaken.one/", icon: "⚡", tag: "tool" },
  { name: "promptVault", tagline: "Your personal prompt engineering HQ.", description: "Build, store, and organize your best prompts. Optimized for iterative AI workflows.", url: "https://prompt-builder-vault.anaken.one/", icon: "🗄️", tag: "tool" },
  { name: "Anaken.one", tagline: "This site — live AI news + projects hub.", description: "A dark techy mini site with a scheduled AI news feed, powered by Claude + web search. Updates at 01:00, 07:00, 13:00, 19:00 UTC.", url: "#", icon: "🛰️", tag: "site" },
];

const CATEGORIES = ["Feedback", "Bug", "Request", "Others"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── Sanitize: strip HTML tags + angle brackets ───────────────────────────────
function sanitize(str) {
  return String(str).replace(/<[^>]*>/g, "").replace(/[<>]/g, "").trim();
}

// ─── API: fetch news via server-side proxy (key never exposed to browser) ────
async function fetchLiveNews() {
  const response = await fetch("/api/news", { method: "POST" });
  if (!response.ok) throw new Error(`News API error: ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data.articles) || data.articles.length === 0) throw new Error("Bad shape");
  return data.articles;
}

// ─── Validate a URL is safe to use as href ────────────────────────────────────
function isSafeUrl(url) {
  return typeof url === "string" && /^https:\/\/.+/.test(url);
}

// ─── Cache helpers ────────────────────────────────────────────────────────────
async function readCache() {
  try {
    if (window.storage) { const r = await window.storage.get(STORAGE_KEY); return r ? JSON.parse(r.value) : null; }
    const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null;
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
  useEffect(() => { const id = setInterval(() => { setG(true); setTimeout(() => setG(false), 150); }, 4000); return () => clearInterval(id); }, []);
  return <span style={{ color: g ? "#00ff88" : "inherit", textShadow: g ? "2px 0 #ff0055, -2px 0 #0088ff" : "none", transition: "color 0.1s" }}>{text}</span>;
};

const ScanLine = () => <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)" }} />;

const Spinner = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "60px 0" }}>
    <div style={{ width: "32px", height: "32px", border: "2px solid rgba(0,200,120,0.15)", borderTop: "2px solid #00c878", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    <span style={{ fontSize: "11px", color: "rgba(0,200,120,0.5)", letterSpacing: "2px" }}>FETCHING SIGNAL...</span>
  </div>
);

// ─── Input style helper ───────────────────────────────────────────────────────
const inputStyle = (focused) => ({
  width: "100%", background: focused ? "rgba(0,200,120,0.05)" : "rgba(0,200,120,0.02)",
  border: `1px solid ${focused ? "rgba(0,200,120,0.5)" : "rgba(0,200,120,0.15)"}`,
  color: "#c8d8e8", padding: "10px 14px", fontSize: "13px",
  fontFamily: "'Courier New', monospace", outline: "none",
  transition: "all 0.2s", boxSizing: "border-box",
});

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeSection, setActiveSection] = useState("intro");
  const [hoveredNews, setHoveredNews] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [time, setTime] = useState(new Date());
  const [news, setNews] = useState(FALLBACK_NEWS);
  const [newsLoading, setNewsLoading] = useState(false);
  const [nextSlot, setNextSlot] = useState(null);

  // Contact form state
  const [form, setForm] = useState({ name: "", email: "", category: "", message: "" });
  const [formFocused, setFormFocused] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [formStatus, setFormStatus] = useState(null); // null | "sending" | "ok" | "error"

  // ── Clock ──
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  const formatTime = (d) => d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const formatCountdown = (ts) => {
    if (!ts) return null;
    const diff = ts - Date.now(); if (diff <= 0) return "now";
    const h = Math.floor(diff / 3600000), m = Math.floor((diff % 3600000) / 60000), s = Math.floor((diff % 60000) / 1000);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // ── News scheduler ──
  const runScheduledFetch = useCallback(async () => {
    setNewsLoading(true);
    try { const articles = await fetchLiveNews(); setNews(articles); await writeCache({ articles, timestamp: Date.now() }); }
    catch (e) { console.error("Scheduled news fetch failed:", e); }
    finally { setNewsLoading(false); }
  }, []);

  useEffect(() => {
    const init = async () => {
      const now = Date.now(), slot = lastScheduledSlot(now);
      setNextSlot(nextScheduledSlot(now));
      const cached = await readCache();
      if (cached?.articles) { setNews(cached.articles); if (cached.timestamp < slot) runScheduledFetch(); }
      else runScheduledFetch();
    };
    init();
  }, [runScheduledFetch]);

  useEffect(() => {
    let tid;
    const arm = () => {
      const delay = nextScheduledSlot(Date.now()) - Date.now();
      tid = setTimeout(async () => { setNextSlot(nextScheduledSlot(Date.now())); await runScheduledFetch(); arm(); }, delay);
      setNextSlot(nextScheduledSlot(Date.now()));
    };
    arm();
    return () => clearTimeout(tid);
  }, [runScheduledFetch]);

  // ── Contact form handlers ──
  const validateForm = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!EMAIL_RE.test(form.email.trim())) errs.email = "Enter a valid email address.";
    if (!form.category) errs.category = "Please select a category.";
    if (form.message.trim().length < 5) errs.message = "Message is too short.";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validateForm();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setFormErrors({});
    setFormStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: sanitize(form.name),
          email: sanitize(form.email),
          category: form.category,
          message: sanitize(form.message),
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) { setFormStatus("ok"); setForm({ name: "", email: "", category: "", message: "" }); }
      else setFormStatus("error");
    } catch { setFormStatus("error"); }
  };

  const sections = ["intro", "news", "projects", "contact"];

  const labelStyle = { fontSize: "10px", color: "rgba(0,200,120,0.5)", letterSpacing: "2px", display: "block", marginBottom: "6px" };
  const errStyle = { fontSize: "11px", color: "#ff6b6b", marginTop: "4px" };

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

        {/* ── INTRO ── */}
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
              {[{ label: "→ VIEW PROJECTS", section: "projects", primary: true }, { label: "→ AI NEWS FEED", section: "news", primary: false }, { label: "→ CONTACT", section: "contact", primary: false }].map(({ label, section, primary }) => (
                <button key={section} onClick={() => setActiveSection(section)} style={{ background: primary ? "rgba(0,200,120,0.12)" : "transparent", border: primary ? "1px solid rgba(0,200,120,0.4)" : "1px solid rgba(200,216,232,0.15)", color: primary ? "#00c878" : "rgba(200,216,232,0.5)", padding: "10px 24px", cursor: "pointer", fontSize: "12px", letterSpacing: "1.5px", transition: "all 0.2s" }}>
                  {label}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── NEWS ── */}
        {activeSection === "news" && (
          <section style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{ marginBottom: "28px" }}>
              <div style={{ fontSize: "11px", color: "rgba(0,200,120,0.5)", letterSpacing: "2px", marginBottom: "8px" }}>SIGNAL.FEED / AI_NEWS</div>
              <h2 style={{ fontSize: "28px", margin: 0, color: "#e8f4f0", fontWeight: "bold" }}>Current Intelligence</h2>
              <div style={{ display: "flex", gap: "20px", marginTop: "8px" }}>
                {nextSlot && !newsLoading && <span style={{ fontSize: "10px", color: "rgba(0,200,120,0.35)", letterSpacing: "1px" }}>NEXT UPDATE: {formatCountdown(nextSlot)}</span>}
                {newsLoading && <span style={{ fontSize: "10px", color: "rgba(0,200,120,0.5)", letterSpacing: "1px" }}>● UPDATING...</span>}
              </div>
            </div>
            {newsLoading ? <Spinner /> : (
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {news.map((item, i) => (
                  <a key={i} href={isSafeUrl(item.url) ? item.url : "#"} target="_blank" rel="noopener noreferrer"
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

        {/* ── PROJECTS ── */}
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

        {/* ── CONTACT ── */}
        {activeSection === "contact" && (
          <section style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{ marginBottom: "32px" }}>
              <div style={{ fontSize: "11px", color: "rgba(0,200,120,0.5)", letterSpacing: "2px", marginBottom: "8px" }}>COMMS.OPEN / CONTACT</div>
              <h2 style={{ fontSize: "28px", margin: 0, color: "#e8f4f0", fontWeight: "bold" }}>Get in Touch</h2>
            </div>

            {formStatus === "ok" ? (
              <div style={{ border: "1px solid rgba(0,200,120,0.3)", background: "rgba(0,200,120,0.06)", padding: "40px", textAlign: "center" }}>
                <div style={{ fontSize: "28px", marginBottom: "12px" }}>✓</div>
                <div style={{ fontSize: "14px", color: "#00c878", letterSpacing: "1px" }}>MESSAGE TRANSMITTED</div>
                <div style={{ fontSize: "12px", color: "rgba(200,216,232,0.4)", marginTop: "8px" }}>I'll get back to you soon.</div>
                <button onClick={() => setFormStatus(null)} style={{ marginTop: "24px", background: "transparent", border: "1px solid rgba(0,200,120,0.3)", color: "#00c878", padding: "8px 20px", cursor: "pointer", fontSize: "11px", letterSpacing: "1.5px" }}>
                  SEND ANOTHER
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "560px" }}>

                {/* Name */}
                <div>
                  <label style={labelStyle}>NAME</label>
                  <input
                    type="text" value={form.name} maxLength={100}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onFocus={() => setFormFocused({ ...formFocused, name: true })}
                    onBlur={() => setFormFocused({ ...formFocused, name: false })}
                    placeholder="Your name"
                    style={inputStyle(formFocused.name)}
                  />
                  {formErrors.name && <div style={errStyle}>{formErrors.name}</div>}
                </div>

                {/* Email */}
                <div>
                  <label style={labelStyle}>EMAIL</label>
                  <input
                    type="email" value={form.email} maxLength={254}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onFocus={() => setFormFocused({ ...formFocused, email: true })}
                    onBlur={() => setFormFocused({ ...formFocused, email: false })}
                    placeholder="you@example.com"
                    style={inputStyle(formFocused.email)}
                  />
                  {formErrors.email && <div style={errStyle}>{formErrors.email}</div>}
                </div>

                {/* Category */}
                <div>
                  <label style={labelStyle}>CATEGORY</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    onFocus={() => setFormFocused({ ...formFocused, category: true })}
                    onBlur={() => setFormFocused({ ...formFocused, category: false })}
                    style={{ ...inputStyle(formFocused.category), appearance: "none", cursor: "pointer", color: form.category ? "#c8d8e8" : "rgba(200,216,232,0.35)" }}
                  >
                    <option value="" disabled>Select a category</option>
                    {CATEGORIES.map((c) => <option key={c} value={c} style={{ background: "#080c0f", color: "#c8d8e8" }}>{c}</option>)}
                  </select>
                  {formErrors.category && <div style={errStyle}>{formErrors.category}</div>}
                </div>

                {/* Message */}
                <div>
                  <label style={labelStyle}>MESSAGE</label>
                  <textarea
                    value={form.message} maxLength={1000} rows={6}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    onFocus={() => setFormFocused({ ...formFocused, message: true })}
                    onBlur={() => setFormFocused({ ...formFocused, message: false })}
                    placeholder="What's on your mind? (1000 chars max)"
                    style={{ ...inputStyle(formFocused.message), resize: "vertical", minHeight: "120px" }}
                  />
                  <div style={{ fontSize: "10px", color: form.message.length > 900 ? "#ff9966" : "rgba(200,216,232,0.25)", textAlign: "right", marginTop: "4px", letterSpacing: "1px" }}>
                    {form.message.length} / 1000
                  </div>
                  {formErrors.message && <div style={errStyle}>{formErrors.message}</div>}
                </div>

                {/* Submit */}
                {formStatus === "error" && (
                  <div style={{ fontSize: "12px", color: "#ff6b6b", border: "1px solid rgba(255,107,107,0.2)", background: "rgba(255,107,107,0.05)", padding: "10px 14px" }}>
                    ⚠ Failed to send. Please try again.
                  </div>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={formStatus === "sending"}
                  style={{ background: formStatus === "sending" ? "rgba(0,200,120,0.06)" : "rgba(0,200,120,0.12)", border: "1px solid rgba(0,200,120,0.4)", color: formStatus === "sending" ? "rgba(0,200,120,0.4)" : "#00c878", padding: "12px 28px", cursor: formStatus === "sending" ? "default" : "pointer", fontSize: "12px", letterSpacing: "2px", transition: "all 0.2s", alignSelf: "flex-start" }}
                >
                  {formStatus === "sending" ? "TRANSMITTING..." : "SEND MESSAGE →"}
                </button>
              </div>
            )}
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
        input::placeholder, textarea::placeholder { color: rgba(200,216,232,0.25); }
        option { background: #080c0f; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080c0f; }
        ::-webkit-scrollbar-thumb { background: rgba(0,200,120,0.3); }
      `}</style>
    </div>
  );
}
