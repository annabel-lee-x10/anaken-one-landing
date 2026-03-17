import type { Metadata } from "next";
import SectionTracker from "@/components/SectionTracker";

export const metadata: Metadata = { title: "Now", description: "What I'm focused on right now — current projects, learning, and priorities. Updated regularly." };

const NOW = {
  updated: "2026-03-15",
  focus: [
    "Shipping new lab experiments — Prompt Diff is the current build, Token Counter is next",
    "Writing about AI literacy and workflow systems — new articles every week or two",
    "Exploring agent pipelines — chaining Claude, tool use, and structured outputs for real tasks",
    "Reading: The Staff Engineer's Path by Tanya Reilly",
  ],
  notFocus: [
    "Social media — this site is the main channel",
    "Chasing trends — depth over breadth",
  ],
};

export default function NowPage() {
  return (
    <section className="section">
      <div className="container-narrow">
        <header style={{ marginBottom: "48px" }} className="fade-up">
          <p className="label-upper" style={{ marginBottom: "12px", color: "var(--accent-green)" }}>Now</p>
          <h1 style={{ color: "var(--accent-green)" }}>Current Focus</h1>
          <p style={{ fontSize: "15px", color: "var(--text-muted)", marginTop: "12px", lineHeight: 1.6, maxWidth: "480px" }}>
            A snapshot of what I'm working on and thinking about. Inspired by the <a href="https://nownownow.com/about" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none" }}>/now page</a> movement.
          </p>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "10px", opacity: 0.7 }}>
            Last updated {new Date(NOW.updated).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
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
                  <span style={{ color: "var(--accent)", fontSize: "14px", flexShrink: 0, paddingTop: "2px" }}>▸</span>
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
