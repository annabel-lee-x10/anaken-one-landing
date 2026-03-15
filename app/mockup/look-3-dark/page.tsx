"use client";

const PROJECTS = [
  { name: "AI Fact-Check Engine", desc: "Verify AI-generated claims in real time.", tag: "Tool" },
  { name: "promptVault", desc: "Your personal prompt engineering HQ.", tag: "Tool" },
  { name: "Space Commanders", desc: "Classic arcade shooter for the browser.", tag: "Game" },
  { name: "Simple Snake", desc: "Snake, rebuilt collaboratively.", tag: "Game" },
];

const NEWS = [
  { title: "OpenAI launches GPT-5 with reasoning improvements", source: "The Verge", date: "Mar 12" },
  { title: "EU AI Act enforcement begins for high-risk systems", source: "TechCrunch", date: "Mar 10" },
  { title: "Anthropic releases Claude with 1M context", source: "Ars Technica", date: "Mar 8" },
];

const ARTICLES = [
  { title: "Building with AI-First Workflows", desc: "How I rebuilt my entire workflow around LLMs.", date: "Mar 5" },
  { title: "Why I Stopped Using Tailwind", desc: "CSS custom properties with none of the abstraction tax.", date: "Feb 22" },
  { title: "Optimizing Next.js for Core Web Vitals", desc: "Server components and the things that move the needle.", date: "Feb 10" },
];

const dotColors = ["#3B8CF5", "#EF5B4B", "#F5B731", "#3BD66B"];
const newsColors = ["#EF5B4B", "#F5B731", "#FF5310"];

/* ── Dark palette ── */
const dk = {
  bg: "#000000",
  bgCard: "#0a0a0a",
  bgCardHover: "#111111",
  bgAlt: "#050505",
  border: "#1a1a1a",
  textHead: "#f0f0f0",
  textBody: "#b0b0b0",
  textMuted: "#666666",
};

const GradientDivider = () => (
  <div style={{ height: "2px", background: "linear-gradient(90deg, #3B8CF5, #EF5B4B, #F5B731, #3BD66B)", margin: "0 auto", maxWidth: "200px", borderRadius: "2px" }} />
);

export default function Look3Dark() {
  return (
    <div style={{ background: dk.bg, color: dk.textBody, minHeight: "100vh" }}>
      {/* Override the site's white background for this page */}
      <style>{`
        body, main { background: ${dk.bg} !important; }
        nav { background: rgba(0,0,0,0.8) !important; backdrop-filter: blur(12px) !important; border-bottom: 1px solid ${dk.border} !important; }
        nav a, nav span, nav p { color: ${dk.textMuted} !important; }
        nav a:hover { color: ${dk.textHead} !important; }
        footer { display: none !important; }
      `}</style>

      <div style={{ padding: "20px 0", textAlign: "center", background: "#050505", borderBottom: `1px solid ${dk.border}` }}>
        <p style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px", background: "linear-gradient(135deg, #3B8CF5, #EF5B4B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Look 3 Dark — Playful Pops
        </p>
        <p style={{ fontSize: "14px", color: dk.textMuted }}>
          Pure black · gradient text · colorful pills · rainbow dividers
        </p>
      </div>

      {/* ── Hero ── */}
      <section style={{ textAlign: "center", padding: "7.5rem 0 6rem" }}>
        <div className="container-narrow fade-up">
          <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: dk.textMuted, marginBottom: "20px" }}>Anaken · u18181188</p>
          <h1 style={{
            marginBottom: "24px", lineHeight: 1.08,
            background: "linear-gradient(135deg, #3B8CF5, #EF5B4B)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Workflows, Tools<br />& AI.
          </h1>
          <p style={{ fontSize: "clamp(20px, 4vw, 26px)", color: dk.textBody, lineHeight: 1.4, letterSpacing: "0.12em", margin: "0 auto 24px" }}>
            ideate. innovate. iterate.
          </p>
          {/* Decorative dots */}
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "36px" }}>
            {dotColors.map((c, i) => (
              <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: c }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <span style={{ background: "#3B8CF5", color: "white", height: "48px", padding: "0 24px", borderRadius: "32px", fontSize: "15px", fontWeight: 600, display: "inline-flex", alignItems: "center" }}>Read Articles</span>
            <span style={{ background: "#111111", color: dk.textHead, border: `1px solid ${dk.border}`, height: "48px", padding: "0 24px", borderRadius: "32px", fontSize: "15px", fontWeight: 600, display: "inline-flex", alignItems: "center" }}>See Projects</span>
          </div>
        </div>
      </section>

      <GradientDivider />

      {/* ── Stats strip ── */}
      <section style={{ padding: "0", background: dk.bgAlt }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
          {[
            { label: "Focus", value: "Workflow Optimization", color: "#3B8CF5" },
            { label: "Mode", value: "Perpetual Learner", color: "#EF5B4B" },
            { label: "Stack", value: "AI-first Tooling", color: "#3BD66B" },
          ].map(({ label, value, color }, i) => (
            <div key={label} style={{
              padding: "28px 24px",
              borderRight: i < 2 ? `1px solid ${dk.border}` : "none",
              textAlign: "center",
            }}>
              <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: dk.textMuted, marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: color, display: "inline-block" }} />
                {label}
              </p>
              <p style={{ fontSize: "15px", fontWeight: 600, color }}>{value}</p>
            </div>
          ))}
        </div>
      </section>

      <GradientDivider />

      {/* ── Projects ── */}
      <section style={{ padding: "6.5rem 0" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: dk.textMuted, margin: 0 }}>Projects</p>
                <div style={{ display: "flex", gap: "4px" }}>
                  {["#3B8CF5", "#EF5B4B", "#F5B731"].map((c, i) => (
                    <div key={i} style={{ width: "20px", height: "6px", borderRadius: "3px", background: c }} />
                  ))}
                </div>
              </div>
              <h2 style={{ color: dk.textHead }}>Things I've built</h2>
            </div>
            <span style={{ background: "#111111", color: dk.textHead, border: `1px solid ${dk.border}`, height: "38px", padding: "0 18px", borderRadius: "32px", fontSize: "14px", fontWeight: 600, display: "inline-flex", alignItems: "center" }}>View all</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
            {PROJECTS.map(({ name, desc, tag }, idx) => {
              const isHovered = idx === 0;
              const tagColor = tag === "Tool" ? "#3B8CF5" : "#EF5B4B";
              return (
                <div key={name} style={{
                  display: "block", padding: "28px 24px", borderRadius: "12px",
                  background: isHovered ? "#0d1520" : dk.bgCard,
                  border: `1px solid ${isHovered ? "#1a2a3f" : dk.border}`,
                  position: "relative",
                }}>
                  {isHovered && <span style={{ position: "absolute", top: "8px", right: "12px", fontSize: "10px", color: dk.textMuted, fontStyle: "italic" }}>hover state</span>}
                  <span style={{
                    display: "inline-block", marginBottom: "16px",
                    fontSize: "12px", fontWeight: 600, color: "white",
                    background: tagColor,
                    padding: "4px 10px", borderRadius: "20px",
                    letterSpacing: "0.04em", textTransform: "uppercase",
                  }}>
                    {tag}
                  </span>
                  <h3 style={{ fontSize: "18px", marginBottom: "8px", letterSpacing: "-0.02em", color: dk.textHead }}>{name}</h3>
                  <p style={{ fontSize: "14px", color: dk.textMuted, lineHeight: 1.6 }}>{desc}</p>
                  <p style={{ marginTop: "20px", fontSize: "13px", color: tagColor, fontWeight: 500 }}>Visit →</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <GradientDivider />

      {/* ── News ── */}
      <section style={{ padding: "6.5rem 0", background: dk.bgAlt }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: dk.textMuted, marginBottom: "10px" }}>News</p>
              <h2 style={{ color: dk.textHead }}>Latest in AI</h2>
            </div>
            <span style={{ background: "#111111", color: dk.textHead, border: `1px solid ${dk.border}`, height: "38px", padding: "0 18px", borderRadius: "32px", fontSize: "14px", fontWeight: 600, display: "inline-flex", alignItems: "center" }}>All news</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            {NEWS.map((n, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                gap: "24px", padding: "24px",
                background: dk.bgCard, borderRadius: "12px",
                border: `1px solid ${dk.border}`,
              }}>
                <div style={{ flex: 1, display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: newsColors[i % 3], flexShrink: 0, marginTop: "8px" }} />
                  <div>
                    <p style={{ fontSize: "16px", fontWeight: 600, color: dk.textHead, letterSpacing: "-0.02em", marginBottom: "6px" }}>{n.title}</p>
                    <span style={{ display: "inline-block", fontSize: "12px", fontWeight: 600, color: dk.textHead, background: "#0a1f0a", border: "1px solid #1a3a1a", padding: "2px 8px", borderRadius: "20px" }}>{n.source}</span>
                    <span style={{ fontSize: "13px", color: dk.textMuted, marginLeft: "8px" }}>{n.date}</span>
                  </div>
                </div>
                <span style={{ fontSize: "14px", color: newsColors[i % 3], flexShrink: 0, paddingTop: "4px" }}>→</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GradientDivider />

      {/* ── Articles ── */}
      <section style={{ padding: "6.5rem 0" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: dk.textMuted, marginBottom: "10px" }}>Writing</p>
              <h2 style={{ color: dk.textHead }}>Recent Articles</h2>
            </div>
            <span style={{ background: "#111111", color: dk.textHead, border: `1px solid ${dk.border}`, height: "38px", padding: "0 18px", borderRadius: "32px", fontSize: "14px", fontWeight: 600, display: "inline-flex", alignItems: "center" }}>All articles</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            {ARTICLES.map((a, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                gap: "24px", padding: "24px",
                background: dk.bgCard, borderRadius: "12px",
                border: `1px solid ${dk.border}`,
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "18px", fontWeight: 600, color: i === 0 ? "#3B8CF5" : dk.textHead, letterSpacing: "-0.02em", marginBottom: "6px" }}>
                    {a.title}
                    {i === 0 && <span style={{ fontSize: "10px", color: dk.textMuted, fontStyle: "italic", marginLeft: "8px" }}>hover state</span>}
                  </p>
                  <p style={{ fontSize: "14px", color: dk.textMuted, lineHeight: 1.6 }}>{a.desc}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <span style={{
                    display: "inline-block", fontSize: "12px", fontWeight: 600,
                    color: "#5BB8F5", background: "#0a1525", border: "1px solid #1a2a40",
                    padding: "2px 10px", borderRadius: "20px", marginBottom: "8px",
                  }}>{a.date}</span>
                  <br />
                  <span style={{ fontSize: "14px", color: "#3B8CF5" }}>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ textAlign: "center", padding: "6.5rem 0", background: "linear-gradient(135deg, #050a15, #0f0508, #0a0a00)" }}>
        <div className="container-narrow">
          <h2 style={{
            marginBottom: "16px",
            background: "linear-gradient(135deg, #3B8CF5, #EF5B4B)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Let's connect</h2>
          <p style={{ fontSize: "17px", color: dk.textMuted, marginBottom: "32px", lineHeight: 1.6 }}>
            Got feedback, an idea, or just want to say hi?
          </p>
          <span style={{
            background: "linear-gradient(135deg, #3B8CF5, #EF5B4B)",
            color: "white", height: "48px", padding: "0 24px", borderRadius: "32px",
            fontSize: "15px", fontWeight: 600, display: "inline-flex", alignItems: "center",
          }}>Get in touch</span>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "24px" }}>
            {dotColors.map((c, i) => (
              <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: c }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Mock Footer ── */}
      <footer style={{ background: dk.bg, padding: "48px 0 0" }}>
        <div style={{ height: "2px", background: "linear-gradient(90deg, #3B8CF5, #EF5B4B, #F5B731, #3BD66B)" }} />
        <div className="container" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "32px", padding: "40px 0" }}>
          <div>
            <p style={{
              fontSize: "18px", fontWeight: 700, marginBottom: "8px",
              background: "linear-gradient(135deg, #3B8CF5, #EF5B4B)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>anaken.one</p>
            <p style={{ fontSize: "14px", color: dk.textMuted }}>ideate. innovate. iterate.</p>
          </div>
          <div style={{ display: "flex", gap: "48px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { name: "Articles", color: "#3B8CF5" },
                { name: "News", color: "#EF5B4B" },
                { name: "Projects", color: "#F5B731" },
              ].map(l => (
                <span key={l.name} style={{ fontSize: "14px", color: l.color }}>{l.name}</span>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { name: "Lab", color: "#3BD66B" },
                { name: "Now", color: "#5BB8F5" },
                { name: "Contact", color: "#FF5310" },
              ].map(l => (
                <span key={l.name} style={{ fontSize: "14px", color: l.color }}>{l.name}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${dk.border}` }}>
          <div className="container" style={{ padding: "20px 0", textAlign: "center" }}>
            <p style={{ fontSize: "13px", color: dk.textMuted }}>© 2025 anaken.one</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
