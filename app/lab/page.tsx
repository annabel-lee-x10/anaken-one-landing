import type { Metadata } from "next";

export const metadata: Metadata = { title: "Lab", description: "Experiments, demos, and half-formed ideas." };

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  live: { label: "Live",  color: "#16a34a", bg: "#f0fdf4" },
  wip:  { label: "WIP",  color: "#d97706", bg: "#fffbeb" },
  idea: { label: "Idea", color: "#848281", bg: "#f5f5f4" },
};

const EXPERIMENTS = [
  { id: "01", name: "Prompt Diff",      status: "wip",  description: "Compare two prompt versions side-by-side with structured output diffing." },
  { id: "02", name: "Workflow Mapper",  status: "idea", description: "Drag-and-drop tool for mapping and timing manual workflows before automating them." },
  { id: "03", name: "Token Counter",    status: "idea", description: "Paste any text, get token counts for major models with cost estimates." },
];

export default function LabPage() {
  return (
    <section className="section">
      <div className="container-narrow">
        <header style={{ marginBottom: "48px" }} className="fade-up">
          <p className="label-upper" style={{ marginBottom: "12px" }}>Lab</p>
          <h1>Experiments</h1>
          <p style={{ fontSize: "17px", color: "var(--text-muted)", marginTop: "12px", maxWidth: "480px", lineHeight: 1.65 }}>
            Half-formed ideas, active builds, and things that might become something. Or might not.
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
  );
}
