import Link from "next/link";
import { PROJECTS, TYPE_COLORS, getProjectBySlug } from "@/lib/projects";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SectionTracker from "@/components/SectionTracker";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PROJECTS.filter(p => p.status !== "coming-soon").map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project" };
  return { title: project.name, description: project.tagline };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const color = TYPE_COLORS[project.type] ?? "var(--accent)";
  const isGameOrGuide = project.type === "Game" || project.type === "Guide";
  const backHref = isGameOrGuide ? "/games" : "/projects";
  const backLabel = isGameOrGuide ? "Games" : "Projects";

  return (
    <SectionTracker name={`project-${project.slug}`}>
      <section className="section">
        <div className="container-narrow">
          <Link href={backHref} className="link-dim" style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            fontSize: "14px", textDecoration: "none", marginBottom: "40px",
          }}>
            ← {backLabel}
          </Link>

          <header style={{ marginBottom: "48px", paddingBottom: "40px", borderBottom: "1px solid var(--border-mid)" }}>
            <span style={{
              display: "inline-block", marginBottom: "16px",
              fontSize: "12px", fontWeight: 600, color,
              background: `var(--type-bg-${project.type.toLowerCase()}, var(--badge-active-bg))`,
              padding: "4px 10px", borderRadius: "20px",
              letterSpacing: "0.04em", textTransform: "uppercase",
            }}>
              {project.type}
            </span>
            <h1 style={{ marginBottom: "12px" }}>{project.name}</h1>
            <p style={{ fontSize: "18px", color: "var(--text-muted)", lineHeight: 1.65 }}>{project.tagline}</p>
          </header>

          {project.description && (
            <div style={{ fontSize: "17px", lineHeight: 1.8, color: "var(--text-body)", marginBottom: "48px" }}>
              <p>{project.description}</p>
            </div>
          )}

          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                background: color,
                color: "#ffffff",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Visit Project →
            </a>
          )}
        </div>
      </section>
    </SectionTracker>
  );
}
