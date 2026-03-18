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

const dotColors = ["#3B8CF5", "#EF5B4B", "#F5B731", "#3BD66B"];
const newsColors = ["#EF5B4B", "#F5B731", "#FF5310"];

const GradientDivider = () => (
  <div style={{ height: "2px", background: "linear-gradient(90deg, #3B8CF5, #EF5B4B, #F5B731, #3BD66B)", margin: "0 auto", maxWidth: "200px", borderRadius: "2px" }} />
);

export default function Look3() {
  return (
    <>
      <div style={{ padding: "20px 0", textAlign: "center", background: "linear-gradient(135deg, #f0f7ff, #fef9f8, #fefdf5)", borderBottom: "1px solid var(--border)" }}>
        <p style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px", background: "linear-gradient(135deg, #3B8CF5, #EF5B4B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Look 3 — Playful Pops
        </p>
        <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
          Gradient text · colorful pills · decorative dots · rainbow dividers
        </p>
      </div>

      {/* ── Hero ── */}
      <section className="section" style={{ textAlign: "center", paddingTop: "7.5rem", paddingBottom: "6rem" }}>
        <div className="container-narrow fade-up">
          <p className="label-upper" style={{ marginBottom: "20px" }}>Anaken · u18181188</p>
          <h1 style={{
            marginBottom: "24px", lineHeight: 1.08,
            background: "linear-gradient(135deg, #3B8CF5, #EF5B4B)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Workflows, Tools<br />& AI.
          </h1>
          <p style={{ fontSize: "clamp(20px, 4vw, 26px)", color: "var(--text-body)", lineHeight: 1.4, letterSpacing: "0.12em", margin: "0 auto 24px" }}>
            ideate. innovate. iterate.
          </p>
          {/* Decorative dots */}
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "36px" }}>
            {dotColors.map((c, i) => (
              <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: c }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <span className="btn" style={{ background: "var(--accent)", color: "white", height: "48px", padding: "0 24px", borderRadius: "32px", fontSize: "15px", fontWeight: 600, display: "inline-flex", alignItems: "center" }}>Read Articles</span>
            <span className="btn" style={{ background: "var(--accent-mint)", color: "var(--text-head)", height: "48px", padding: "0 24px", borderRadius: "32px", fontSize: "15px", fontWeight: 600, display: "inline-flex", alignItems: "center" }}>See Projects</span>
          </div>
        </div>
      </section>

      <GradientDivider />

      {/* ── Stats strip ── */}
      <section style={{ padding: "0", background: "var(--bg-alt)" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
          {[
            { label: "Focus", value: "Workflow Optimization", color: "#3B8CF5" },
            { label: "Mode", value: "Perpetual Learner", color: "#EF5B4B" },
            { label: "Stack", value: "AI-first Tooling", color: "#3BD66B" },
          ].map(({ label, value, color }, i) => (
            <div key={label} style={{
              padding: "28px 24px",
              borderRight: i < 2 ? "1px solid var(--border-mid)" : "none",
              textAlign: "center",
            }}>
              <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
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
      <section className="section">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <p className="label-upper" style={{ margin: 0 }}>Projects</p>
                <div style={{ display: "flex", gap: "4px" }}>
                  {["#3B8CF5", "#EF5B4B", "#F5B731"].map((c, i) => (
                    <div key={i} style={{ width: "20px", height: "6px", borderRadius: "3px", background: c }} />
                  ))}
                </div>
              </div>
              <h2>Things I've built</h2>
            </div>
            <span className="btn btn-secondary btn-sm">View all</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
            {PROJECTS.map(({ name, desc, tag }, idx) => {
              const isHovered = idx === 0;
              return (
                <div key={name} className="card" style={{
                  display: "block", padding: "28px 24px",
                  background: isHovered ? "#f0f7ff" : "var(--bg-card)",
                  position: "relative",
                }}>
                  {isHovered && <span style={{ position: "absolute", top: "8px", right: "12px", fontSize: "10px", color: "var(--text-muted)", fontStyle: "italic" }}>hover state</span>}
                  <span style={{
                    display: "inline-block", marginBottom: "16px",
                    fontSize: "12px", fontWeight: 600, color: "white",
                    background: tag === "Tool" ? "#3B8CF5" : "#EF5B4B",
                    padding: "4px 10px", borderRadius: "20px",
                    letterSpacing: "0.04em", textTransform: "uppercase",
                  }}>
                    {tag}
                  </span>
                  <h3 style={{ fontSize: "18px", marginBottom: "8px", letterSpacing: "-0.02em" }}>{name}</h3>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6 }}>{desc}</p>
                  <p style={{ marginTop: "20px", fontSize: "13px", color: tag === "Tool" ? "#3B8CF5" : "#EF5B4B", fontWeight: 500 }}>Visit →</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <GradientDivider />

      {/* ── News ── */}
      <section className="section" style={{ background: "var(--bg-alt)" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p className="label-upper" style={{ marginBottom: "10px" }}>News</p>
              <h2>Latest in AI</h2>
            </div>
            <span className="btn btn-secondary btn-sm">All news</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            {NEWS.map((n, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                gap: "24px", padding: "24px",
                background: "var(--bg-card)", borderRadius: "var(--radius)",
              }}>
                <div style={{ flex: 1, display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: newsColors[i % 3], flexShrink: 0, marginTop: "8px" }} />
                  <div>
                    <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-head)", letterSpacing: "-0.02em", marginBottom: "6px" }}>{n.title}</p>
                    <span style={{ display: "inline-block", fontSize: "12px", fontWeight: 600, color: "var(--text-head)", background: "var(--accent-mint)", padding: "2px 8px", borderRadius: "20px" }}>{n.source}</span>
                    <span style={{ fontSize: "13px", color: "var(--text-muted)", marginLeft: "8px" }}>{n.date}</span>
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
      <section className="section">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p className="label-upper" style={{ marginBottom: "10px" }}>Writing</p>
              <h2>Recent Articles</h2>
            </div>
            <span className="btn btn-secondary btn-sm">All articles</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            {ARTICLES.map((a, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                gap: "24px", padding: "24px",
                background: "var(--bg-card)", borderRadius: "var(--radius)",
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "18px", fontWeight: 600, color: i === 0 ? "var(--accent)" : "var(--text-head)", letterSpacing: "-0.02em", marginBottom: "6px" }}>
                    {a.title}
                    {i === 0 && <span style={{ fontSize: "10px", color: "var(--text-muted)", fontStyle: "italic", marginLeft: "8px" }}>hover state</span>}
                  </p>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6 }}>{a.desc}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <span style={{
                    display: "inline-block", fontSize: "12px", fontWeight: 600,
                    color: "white", background: "var(--accent-sky)",
                    padding: "2px 10px", borderRadius: "20px", marginBottom: "8px",
                  }}>{a.date}</span>
                  <br />
                  <span style={{ fontSize: "14px", color: "var(--accent)" }}>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section" style={{ textAlign: "center", background: "linear-gradient(135deg, #f0f7ff, #fef9f8, #fefdf5)" }}>
        <div className="container-narrow">
          <h2 style={{
            marginBottom: "16px",
            background: "linear-gradient(135deg, #3B8CF5, #EF5B4B)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Let's connect</h2>
          <p style={{ fontSize: "17px", color: "var(--text-muted)", marginBottom: "32px", lineHeight: 1.6 }}>
            Got feedback, an idea, or just want to say hi?
          </p>
          <span className="btn" style={{
            background: "linear-gradient(135deg, #3B8CF5, #EF5B4B)",
            color: "white", height: "48px", padding: "0 24px", borderRadius: "32px",
            fontSize: "15px", fontWeight: 600, display: "inline-flex", alignItems: "center",
          }}>Get in touch</span>
          {/* Decorative dots */}
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "24px" }}>
            {dotColors.map((c, i) => (
              <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: c }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Mock Footer ── */}
      <footer style={{ background: "var(--bg-alt)", padding: "48px 0 0" }}>
        <div style={{ height: "2px", background: "linear-gradient(90deg, #3B8CF5, #EF5B4B, #F5B731, #3BD66B)", marginBottom: "0" }} />
        <div className="container" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "32px", padding: "40px 0" }}>
          <div>
            <p style={{
              fontSize: "18px", fontWeight: 700, marginBottom: "8px",
              background: "linear-gradient(135deg, #3B8CF5, #EF5B4B)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>anaken.one</p>
            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>ideate. innovate. iterate.</p>
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
        <div style={{ borderTop: "1px solid var(--border-mid)" }}>
          <div className="container" style={{ padding: "20px 0", textAlign: "center" }}>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>© 2025 anaken.one</p>
          </div>
        </div>
      </footer>
    </>
  );
}
