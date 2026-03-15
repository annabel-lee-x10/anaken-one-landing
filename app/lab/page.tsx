import type { Metadata } from "next";
import SectionTracker from "@/components/SectionTracker";

export const metadata: Metadata = { title: "Lab", description: "Active experiments in AI tooling — prompt diffing, workflow mapping, and token analysis. Some ship, all teach." };

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  live: { label: "Live",  color: "var(--status-live-fg)", bg: "var(--status-live-bg)" },
  wip:  { label: "WIP",  color: "var(--status-wip-fg)",  bg: "var(--status-wip-bg)"  },
  idea: { label: "Idea", color: "var(--status-idea-fg)", bg: "var(--status-idea-bg)" },
};

const EXPERIMENTS = [
  { id: "01", name: "Prompt Diff",      status: "wip",  description: "Compare two prompt versions side-by-side with structured output diffing. See exactly what changed in your results when you tweak a prompt." },
  { id: "02", name: "Workflow Mapper",  status: "idea", description: "Map out manual workflows visually before deciding what to automate. Drag-and-drop steps, estimate time per stage, and spot the bottlenecks." },
  { id: "03", name: "Token Counter",    status: "idea", description: "Paste any text and instantly see token counts across GPT-4, Claude, and Gemini — with cost estimates per model. Useful for budgeting API calls." },
];

export default function LabPage() {
  return (
    <SectionTracker name="lab">
    <section className="section">
      <div className="container-narrow">
        <header style={{ marginBottom: "48px" }} className="fade-up">
          <p className="label-upper" style={{ marginBottom: "12px", color: "var(--accent-coral)" }}>Lab</p>
          <h1 style={{ color: "var(--accent-coral)" }}>Experiments</h1>
          <p style={{ fontSize: "17px", color: "var(--text-muted)", marginTop: "12px", maxWidth: "480px", lineHeight: 1.65 }}>
            Where ideas get tested. Each experiment starts with a real problem — some graduate to full projects, others surface lessons worth keeping.
          </p>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {EXPERIMENTS.map(exp => {
            const s = STATUS[exp.status];
            return (
              <div key={exp.id} className="card" style={{ padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "17px", fontWeight: 600, color: "var(--text-head)", letterSpacing: "-0.02em", marginBottom: "6px" }}>{exp.name}</p>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6 }}>{exp.description}</p>
                </div>
                <span style={{
                  flexShrink: 0, fontSize: "12px", fontWeight: 600,
                  color: s.color, background: s.bg,
                  padding: "4px 10px", borderRadius: "20px",
                  letterSpacing: "0.04em",
                }}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
    </SectionTracker>
  );
}
