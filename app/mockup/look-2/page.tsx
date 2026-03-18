"use client";

const PROJECTS = [
  { name: "AI Fact-Check Engine", desc: "Verify AI-generated claims in real time.", tag: "Tool" },
  { name: "promptVault", desc: "Your personal prompt engineering HQ.", tag: "Tool" },
  { name: "Where's Munki", desc: "Find the hidden cat in a bustling city.", tag: "Game" },
  { name: "Solo in Seoul", desc: "A solo traveller's guide to Seoul.", tag: "Guide" },
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

const tagStyle = (tag: string) =>
  tag === "Tool"
    ? { bg: "#3B8CF5", border: "#3B8CF5" }
    : { bg: "#F5B731", border: "#F5B731" };

export default function Look2() {
  return (
    <>
      <div style={{ padding: "20px 0", textAlign: "center", background: "#171717", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <p style={{ fontSize: "13px", fontWeight: 600, color: "#EF5B4B", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px" }}>
          Look 2 — Bold Blocks
        </p>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
          Structural color · inverted sections · editorial confidence
        </p>
      </div>

      {/* ── Hero ── */}
      <section className="section" style={{ textAlign: "center", paddingTop: "7.5rem", paddingBottom: "6rem", background: "linear-gradient(160deg, #f0f7ff 0%, #f5faff 50%, #ffffff 100%)" }}>
        <div className="container-narrow fade-up">
          <p className="label-upper" style={{ marginBottom: "20px" }}>Anaken · u18181188</p>
          <h1 style={{ marginBottom: "24px", lineHeight: 1.08 }}>
            Workflows, Tools<br />& AI.
          </h1>
          <p style={{ fontSize: "clamp(20px, 4vw, 26px)", color: "var(--accent)", lineHeight: 1.4, letterSpacing: "0.12em", margin: "0 auto 36px" }}>
            ideate. innovate. iterate.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <span className="btn" style={{ background: "#EF5B4B", color: "white", height: "48px", padding: "0 24px", borderRadius: "32px", fontSize: "15px", fontWeight: 600, display: "inline-flex", alignItems: "center" }}>Read Articles</span>
            <span className="btn btn-secondary">See Projects</span>
          </div>
        </div>
      </section>

      {/* ── Stats strip (dark inverted) ── */}
      <section style={{ padding: "0", background: "#171717" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
          {[
            { label: "Focus", value: "Workflow Optimization" },
            { label: "Mode", value: "Perpetual Learner" },
            { label: "Stack", value: "AI-first Tooling" },
          ].map(({ label, value }, i) => (
            <div key={label} style={{
              padding: "32px 24px",
              borderRight: i < 2 ? "1px solid rgba(255,255,255,0.1)" : "none",
              textAlign: "center",
            }}>
              <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>{label}</p>
              <p style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff" }}>{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Projects ── */}
      <section className="section">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p className="label-upper" style={{ marginBottom: "10px" }}>Projects</p>
              <h2 style={{ display: "inline-block", paddingBottom: "8px", borderBottom: "3px solid var(--accent)" }}>Things I've built</h2>
            </div>
            <span className="btn btn-sm" style={{ background: "var(--accent)", color: "white", height: "38px", padding: "0 18px", borderRadius: "32px", fontSize: "14px", fontWeight: 600, display: "inline-flex", alignItems: "center" }}>View all</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
            {PROJECTS.map(({ name, desc, tag }) => {
              const ts = tagStyle(tag);
              return (
                <div key={name} className="card card-hover" style={{
                  display: "block", padding: "28px 24px",
                  borderLeft: `4px solid ${ts.border}`,
                }}>
                  <span style={{
                    display: "inline-block", marginBottom: "16px",
                    fontSize: "12px", fontWeight: 600, color: "white",
                    background: ts.bg, padding: "4px 10px", borderRadius: "20px",
                    letterSpacing: "0.04em", textTransform: "uppercase",
                  }}>
                    {tag}
                  </span>
                  <h3 style={{ fontSize: "18px", marginBottom: "8px", letterSpacing: "-0.02em" }}>{name}</h3>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6 }}>{desc}</p>
                  <p style={{ marginTop: "20px", fontSize: "13px", color: ts.border, fontWeight: 500 }}>Visit →</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── News ── */}
      <section className="section" style={{ background: "var(--bg-alt)" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p className="label-upper" style={{ marginBottom: "10px" }}>News</p>
              <h2 style={{ display: "inline-block", paddingBottom: "8px", borderBottom: "3px solid var(--accent-coral)" }}>Latest in AI</h2>
            </div>
            <span className="btn btn-secondary btn-sm">All news</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            {NEWS.map((n, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                gap: "24px", padding: "24px",
                background: "var(--bg-card)", borderRadius: "var(--radius)",
                borderLeft: "4px solid var(--accent-coral)",
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-head)", letterSpacing: "-0.02em", marginBottom: "6px" }}>{n.title}</p>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>{n.source} · {n.date}</p>
                </div>
                <span style={{ fontSize: "14px", color: "var(--accent-coral)", flexShrink: 0, paddingTop: "4px" }}>→</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Articles ── */}
      <section className="section">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p className="label-upper" style={{ marginBottom: "10px" }}>Writing</p>
              <h2 style={{ display: "inline-block", paddingBottom: "8px", borderBottom: "3px solid var(--accent-green)" }}>Recent Articles</h2>
            </div>
            <span className="btn btn-secondary btn-sm">All articles</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            {ARTICLES.map((a, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                gap: "24px", padding: "24px",
                background: "var(--bg-card)", borderRadius: "var(--radius)",
                borderLeft: "4px solid var(--accent-green)",
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-head)", letterSpacing: "-0.02em", marginBottom: "6px" }}>{a.title}</p>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6 }}>{a.desc}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: "13px", color: "var(--accent-green)", marginBottom: "8px", fontWeight: 500 }}>{a.date}</p>
                  <span style={{ fontSize: "14px", color: "var(--accent-green)" }}>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA (full blue) ── */}
      <section className="section" style={{ textAlign: "center", background: "var(--accent)" }}>
        <div className="container-narrow">
          <h2 style={{ marginBottom: "16px", color: "white" }}>Let's connect</h2>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.8)", marginBottom: "32px", lineHeight: 1.6 }}>
            Got feedback, an idea, or just want to say hi?
          </p>
          <span className="btn" style={{ background: "white", color: "var(--accent)", height: "48px", padding: "0 24px", borderRadius: "32px", fontSize: "15px", fontWeight: 600, display: "inline-flex", alignItems: "center" }}>Get in touch</span>
        </div>
      </section>

      {/* ── Mock Footer (dark) ── */}
      <footer style={{ background: "#171717", padding: "48px 0 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "32px", paddingBottom: "40px" }}>
          <div>
            <p style={{ fontSize: "18px", fontWeight: 700, color: "white", marginBottom: "8px" }}>anaken.one</p>
            <p style={{ fontSize: "14px", color: "var(--accent-sky)" }}>ideate. innovate. iterate.</p>
          </div>
          <div style={{ display: "flex", gap: "48px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {["Articles", "News", "Projects"].map(l => (
                <span key={l} style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>{l}</span>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {["Lab", "Now", "Contact"].map(l => (
                <span key={l} style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", background: "#111111" }}>
          <div className="container" style={{ padding: "20px 0", textAlign: "center" }}>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>© 2025 anaken.one</p>
          </div>
        </div>
      </footer>
    </>
  );
}
