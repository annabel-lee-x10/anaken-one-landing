"use client";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import type { Project } from "@/lib/projects";

const BORDER_RADIUS = 12;
const IMG_RATIO = 0.12;

/* Gradient stops matching the footer line: blue → purple → coral */
const GRADIENT_STOPS: [number, number, number][] = [
  [0x33, 0x66, 0xFF], // #3366FF  (0%)
  [0x66, 0x44, 0xCC], // #6644CC  (50%)
  [0xFF, 0x33, 0x55], // #FF3355 (100%)
];

function sampleGradient(index: number, total: number): string {
  if (total <= 1) return `rgb(${GRADIENT_STOPS[0].join(",")})`;
  const t = index / (total - 1); // 0 → 1
  const segment = t * (GRADIENT_STOPS.length - 1);
  const lo = Math.min(Math.floor(segment), GRADIENT_STOPS.length - 2);
  const frac = segment - lo;
  const a = GRADIENT_STOPS[lo], b = GRADIENT_STOPS[lo + 1];
  const r = Math.round(a[0] + (b[0] - a[0]) * frac);
  const g = Math.round(a[1] + (b[1] - a[1]) * frac);
  const bl = Math.round(a[2] + (b[2] - a[2]) * frac);
  return `rgb(${r},${g},${bl})`;
}

function ProjectCard({ project, index, total }: { project: Project; index: number; total: number }) {
  const isComingSoon = project.status === "coming-soon";
  const cardColor = sampleGradient(index, total);
  const displayNum = String(index + 1).padStart(2, "0");

  const content = (
    <>
      <div style={{
        height: `${IMG_RATIO * 100}%`,
        minHeight: "48px",
        background: cardColor,
        flexShrink: 0,
      }} />
      <div style={{ padding: "16px 20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            {isComingSoon ? (
              <span style={{
                fontSize: "11px", fontWeight: 600,
                color: "var(--text-muted)",
                background: "var(--bg-alt)",
                padding: "3px 9px", borderRadius: "20px",
                letterSpacing: "0.04em", textTransform: "uppercase",
              }}>
                Coming Soon
              </span>
            ) : (
              <span style={{
                fontSize: "11px", fontWeight: 600,
                color: "#fff",
                background: cardColor,
                padding: "3px 9px", borderRadius: "20px",
                letterSpacing: "0.04em", textTransform: "uppercase",
              }}>
                {project.type}
              </span>
            )}
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 500 }}>{displayNum}</span>
          </div>
          <h3 style={{ fontSize: "16px", marginBottom: "6px" }}>{project.name}</h3>
        </div>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.5 }}>{project.tagline}</p>
      </div>
    </>
  );

  const cardStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    borderRadius: `${BORDER_RADIUS}px`,
    background: "var(--bg-card)",
    boxShadow: "var(--shadow-lift)",
    border: `1px ${isComingSoon ? "dashed" : "solid"} var(--border-mid)`,
    textDecoration: "none",
    color: "inherit",
    overflow: "hidden",
    opacity: isComingSoon ? 0.85 : 1,
  };

  if (isComingSoon) {
    return <div style={cardStyle}>{content}</div>;
  }

  return (
    <Link
      href={`/projects/${project.slug}`}
      onClick={() => {
        trackEvent("project_select", { project_name: project.name, project_id: project.id });
      }}
      style={cardStyle}
    >
      {content}
    </Link>
  );
}

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  return (
    <div>
      <div className="projects-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
      }}>
        <style>{`
          @media (max-width: 900px) {
            .projects-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media (max-width: 540px) {
            .projects-grid { grid-template-columns: 1fr !important; }
          }
          .project-grid-card {
            transition: transform var(--t) var(--ease), box-shadow var(--t) var(--ease);
          }
          .project-grid-card:hover {
            transform: translateY(-4px);
          }
          .project-grid-card:hover > a {
            box-shadow: var(--shadow-lift-hv) !important;
          }
        `}</style>
        {projects.map((p, i) => (
          <div key={p.id} className={p.status !== "coming-soon" ? "project-grid-card" : ""} style={{ height: "280px" }}>
            <ProjectCard project={p} index={i} total={projects.length} />
          </div>
        ))}
      </div>
    </div>
  );
}
