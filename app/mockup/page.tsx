export default function MockupPage() {
  return (
    <div style={{ fontFamily: "var(--font)", color: "var(--text-body)", background: "var(--bg)", minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{ padding: "5rem 0 4rem", textAlign: "center" }}>
        <div className="container">
          <h1>anaken.one</h1>
          <p style={{ fontSize: 19, color: "var(--text-muted)", maxWidth: 520, margin: "1rem auto 2rem" }}>
            ideate. innovate. iterate. — A personal corner of the internet.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-primary">Read Articles</button>
            <button className="btn btn-secondary">View Projects</button>
          </div>
        </div>
      </section>

      {/* Accent Swatches */}
      <section style={{ padding: "3rem 0" }}>
        <div className="container">
          <p className="label-upper" style={{ marginBottom: "1.5rem" }}>Accent Palette</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 16, marginBottom: "3rem" }}>
            {[
              { name: "Blue", cssVar: "--accent", hex: "#3B8CF5" },
              { name: "Green", cssVar: "--accent-green", hex: "#3BD66B" },
              { name: "Coral", cssVar: "--accent-coral", hex: "#EF5B4B" },
              { name: "Amber", cssVar: "--accent-amber", hex: "#F5B731" },
              { name: "Orange", cssVar: "--accent-orange", hex: "#FF5310" },
              { name: "Sky", cssVar: "--accent-sky", hex: "#5BB8F5" },
              { name: "Mint", cssVar: "--accent-mint", hex: "#D4F5DC" },
              { name: "Sage", cssVar: "--accent-sage", hex: "#B8CEB5" },
            ].map((c) => (
              <div key={c.cssVar} className="card" style={{ overflow: "hidden" }}>
                <div style={{
                  height: 90, background: `var(${c.cssVar})`,
                  display: "flex", alignItems: "flex-end", padding: 10
                }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "white", textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>{c.hex}</span>
                </div>
                <div style={{ padding: 10, fontSize: 13 }}>
                  {c.name}
                  <code style={{ display: "block", fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{c.cssVar}</code>
                </div>
              </div>
            ))}
          </div>

          <p className="label-upper" style={{ marginBottom: "1.5rem" }}>Base Palette</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 16 }}>
            {[
              { name: "Background", cssVar: "--bg", hex: "#ffffff", light: true },
              { name: "Alt Bg", cssVar: "--bg-alt", hex: "#fbfaf9", light: true },
              { name: "Sec Button", cssVar: "--bg-btn-sec", hex: "#f6f4ef", light: true },
              { name: "Dark", cssVar: "--bg-dark", hex: "#171717", light: false },
              { name: "Heading", cssVar: "--text-head", hex: "#343433", light: false },
              { name: "Body", cssVar: "--text-body", hex: "#494440", light: false },
              { name: "Muted", cssVar: "--text-muted", hex: "#848281", light: false },
              { name: "Border", cssVar: "--border", hex: "#f2f0ed", light: true },
            ].map((c) => (
              <div key={c.cssVar} className="card" style={{ overflow: "hidden" }}>
                <div style={{
                  height: 90, background: `var(${c.cssVar})`,
                  display: "flex", alignItems: "flex-end", padding: 10,
                  border: c.light ? "1px solid var(--border-mid)" : "none"
                }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    color: c.light ? "var(--text-muted)" : "white",
                    textShadow: c.light ? "none" : "0 1px 3px rgba(0,0,0,0.3)"
                  }}>{c.hex}</span>
                </div>
                <div style={{ padding: 10, fontSize: 13 }}>
                  {c.name}
                  <code style={{ display: "block", fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{c.cssVar}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section style={{ padding: "3rem 0", borderTop: "1px solid var(--border-mid)" }}>
        <div className="container">
          <p className="label-upper" style={{ marginBottom: "1.5rem" }}>Buttons</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: "1.5rem" }}>
            <button className="btn" style={{ background: "var(--bg-dark)", color: "var(--text-inv)" }}>Primary Dark</button>
            <button className="btn btn-secondary">Secondary</button>
            <button className="btn" style={{ background: "var(--accent)", color: "white" }}>Blue Accent</button>
            <button className="btn" style={{ background: "var(--accent-green)", color: "white" }}>Green</button>
            <button className="btn" style={{ background: "var(--accent-coral)", color: "white" }}>Coral</button>
            <button className="btn" style={{ background: "var(--accent-amber)", color: "white" }}>Amber</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <button className="btn btn-sm" style={{ background: "var(--accent-mint)", color: "var(--text-head)" }}>Mint Tag</button>
            <button className="btn btn-sm" style={{ background: "var(--accent-sky)", color: "white" }}>Sky Small</button>
            <button className="btn btn-sm" style={{ background: "var(--accent-orange)", color: "white" }}>Orange Small</button>
            <button className="btn btn-sm" style={{ background: "var(--accent-sage)", color: "var(--text-head)" }}>Sage Tag</button>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section style={{ padding: "3rem 0", borderTop: "1px solid var(--border-mid)" }}>
        <div className="container">
          <p className="label-upper" style={{ marginBottom: "1.5rem" }}>Cards</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            <div className="card card-hover" style={{ overflow: "hidden" }}>
              <div style={{ height: 8, background: "var(--accent)" }} />
              <div style={{ padding: 24 }}>
                <h3>Building with AI-First Workflows</h3>
                <p style={{ fontSize: 15, color: "var(--text-muted)", marginTop: 8 }}>How I rebuilt my entire workflow around LLMs and what actually stuck after six months.</p>
              </div>
            </div>
            <div className="card card-hover" style={{ overflow: "hidden" }}>
              <div style={{ height: 8, background: "var(--accent-coral)" }} />
              <div style={{ padding: 24 }}>
                <h3>Why I Stopped Using Tailwind</h3>
                <p style={{ fontSize: 15, color: "var(--text-muted)", marginTop: 8 }}>CSS custom properties give you the same consistency with none of the abstraction tax.</p>
              </div>
            </div>
            <div className="card card-hover" style={{ overflow: "hidden" }}>
              <div style={{ height: 8, background: "var(--accent-amber)" }} />
              <div style={{ padding: 24 }}>
                <h3>Optimizing Next.js for Core Web Vitals</h3>
                <p style={{ fontSize: 15, color: "var(--text-muted)", marginTop: 8 }}>Server components, streaming, and the small things that actually move the needle.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
