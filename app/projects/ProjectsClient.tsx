"use client";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { TYPE_COLORS } from "@/lib/projects";
import type { Project } from "@/lib/projects";

const BORDER_RADIUS = 12;
const IMG_RATIO = 0.25;

function ProjectCard({ project }: { project: Project }) {
  const isComingSoon = project.status === "coming-soon";

  const content = (
    <>
      <div style={{
        height: `${IMG_RATIO * 100}%`,
        minHeight: "70px",
        background: isComingSoon ? "var(--bg-alt)" : (TYPE_COLORS[project.type] ?? "var(--accent)"),
        overflow: "hidden",
        flexShrink: 0,
      }}>
        {isComingSoon ? (
          <div style={{
            width: "100%", height: "100%",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: "8px",
          }}>
            <div style={{ position: "relative", width: "28px", height: "28px" }}>
              <div style={{
                position: "absolute", top: "50%", left: "0",
                width: "100%", height: "2px",
                background: "var(--text-muted)", opacity: 0.4,
                transform: "translateY(-50%)",
              }} />
              <div style={{
                position: "absolute", left: "50%", top: "0",
                height: "100%", width: "2px",
                background: "var(--text-muted)", opacity: 0.4,
                transform: "translateX(-50%)",
              }} />
            </div>
            <span style={{
              fontSize: "11px", fontWeight: 500,
              color: "var(--text-muted)", opacity: 0.7,
            }}>
              Coming Soon
            </span>
          </div>
        ) : (
          <img
            src={project.image}
            alt={project.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        )}
      </div>
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
                background: TYPE_COLORS[project.type] ?? "var(--accent)",
                padding: "3px 9px", borderRadius: "20px",
                letterSpacing: "0.04em", textTransform: "uppercase",
              }}>
                {project.type}
              </span>
            )}
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 500 }}>{project.id}</span>
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
        {projects.map(p => (
          <div key={p.id} className={p.status !== "coming-soon" ? "project-grid-card" : ""} style={{ height: "280px" }}>
            <ProjectCard project={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
