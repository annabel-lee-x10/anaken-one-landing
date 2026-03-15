import type { Metadata } from "next";
import SectionTracker from "@/components/SectionTracker";

export const metadata: Metadata = { title: "Now", description: "What I'm working on right now." };

const NOW = {
  updated: "2026-03-13",
  focus: [
    "Building anaken-one-new — the next version of this site",
    "Deepening AI workflow automation — prompt chaining and agent pipelines",
    "Reading: The Staff Engineer's Path",
  ],
  notFocus: [
    "Social media",
    "Meetings",
  ],
};

export default function NowPage() {
  return (
    <section className="section">
      <div className="container-narrow">
        <header style={{ marginBottom: "48px" }} className="fade-up">
          <p className="label-upper" style={{ marginBottom: "12px", color: "var(--accent-green)" }}>Now</p>
          <h1 style={{ color: "var(--accent-green)" }}>Current Focus</h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "12px" }}>
            Updated {new Date(NOW.updated).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
          <SectionTracker name="now-doing">
          <section>
            <p className="label-upper" style={{ marginBottom: "16px", color: "var(--text-head)" }}>Doing</p>
            <div className="card" style={{ overflow: "hidden" }}>
              {NOW.focus.map((item, i) => (
                <div key={i} style={{
                  display: "flex", gap: "16px", alignItems: "flex-start",
                  padding: "18px 24px",
                  borderBottom: i < NOW.focus.length - 1 ? "1px solid var(--border)" : "none",
                }}>
                  <span style={{ color: "var(--accent-green)", fontSize: "14px", flexShrink: 0, paddingTop: "2px" }}>▸</span>
                  <span style={{ fontSize: "15px", color: "var(--text-body)", lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </section>
          </SectionTracker>

          <SectionTracker name="now-not-doing">
          <section>
            <p className="label-upper" style={{ marginBottom: "16px" }}>Not Doing</p>
            <div className="card" style={{ overflow: "hidden" }}>
              {NOW.notFocus.map((item, i) => (
                <div key={i} style={{
                  display: "flex", gap: "16px", alignItems: "center",
                  padding: "16px 24px",
                  borderBottom: i < NOW.notFocus.length - 1 ? "1px solid var(--border)" : "none",
                  opacity: 0.5,
                }}>
                  <span style={{ color: "var(--text-muted)", fontSize: "14px", flexShrink: 0 }}>✕</span>
                  <span style={{ fontSize: "15px", color: "var(--text-muted)", textDecoration: "line-through" }}>{item}</span>
                </div>
              ))}
            </div>
          </section>
          </SectionTracker>

        </div>
      </div>
    </section>
  );
}
