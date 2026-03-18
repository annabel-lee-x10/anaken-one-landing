import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { SHIPPED_PROJECTS } from "@/lib/projects";
import SectionTracker from "@/components/SectionTracker";
import ProjectsClient from "./projects/ProjectsClient";

export const metadata = {
  title: "Anaken — AI Tooling & Creative Technology",
  description: "Building at the intersection of AI tooling and creative technology. Tools, games, and deep dives on what works.",
  alternates: { canonical: "https://anaken.one" },
};

export default function HomePage() {
  const allArticles = getAllArticles();
  const articles = allArticles.slice(0, 3);
  const featuredProjects = SHIPPED_PROJECTS.slice(0, 4);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <SectionTracker name="hero">
        <section className="section" style={{ textAlign: "center", paddingTop: "6rem", paddingBottom: "4.5rem" }}>
          <div className="container-narrow fade-up">
            <p className="label-upper" style={{ marginBottom: "20px" }}>AI Tooling & Creative Technology</p>
            <h1 className="gradient-text" style={{ marginBottom: "24px", lineHeight: 1.12 }}>
              Building at the intersection of AI tooling and creative technology.
            </h1>
            <p style={{ fontSize: "17px", color: "var(--text-muted)", lineHeight: 1.65, maxWidth: "480px", margin: "0 auto 32px" }}>
              Shipping fast, writing about what works. Open to collaboration.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/work" className="btn" style={{ background: "var(--accent)", color: "#ffffff", boxShadow: "0 2px 12px rgba(51,102,255,0.3)" }}>See my work</Link>
              <Link href="/articles" className="btn btn-secondary">Read my writing</Link>
            </div>
          </div>
        </section>
      </SectionTracker>

      <div className="gradient-divider" />

      {/* ── Work Preview ────────────────────────────────── */}
      <SectionTracker name="work-preview">
        <section className="section">
          <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <p className="label-upper" style={{ marginBottom: "10px", color: "var(--accent)" }}>Work</p>
                <h2 style={{ color: "var(--accent)" }}>Selected Projects</h2>
              </div>
              <Link href="/work" className="btn btn-secondary btn-sm">View all</Link>
            </div>
            <ProjectsClient projects={featuredProjects} />
          </div>
        </section>
      </SectionTracker>

      <div className="gradient-divider" />

      {/* ── Writing Preview ─────────────────────────────── */}
      <SectionTracker name="articles-preview">
        <section className="section section-alt">
          <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <p className="label-upper" style={{ marginBottom: "10px", color: "var(--accent)" }}>Writing</p>
                <h2 style={{ color: "var(--accent)" }}>Recent Articles</h2>
              </div>
              <Link href="/articles" className="btn btn-secondary btn-sm">All articles</Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
              {articles.map(a => (
                <Link key={a.slug} href={`/articles/${a.slug}`} className="card-hover" style={{
                  display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                  gap: "24px", padding: "24px",
                  background: "var(--bg-card)", borderRadius: "var(--radius)",
                  borderLeft: "3px solid var(--accent)",
                  textDecoration: "none",
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-head)", letterSpacing: "-0.02em", marginBottom: "6px" }}>{a.title}</p>
                    <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6 }}>{a.description}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <span style={{
                      display: "inline-block", fontSize: "12px", fontWeight: 600,
                      color: "var(--accent)", background: "var(--badge-active-bg)",
                      padding: "2px 10px", borderRadius: "20px", marginBottom: "8px",
                    }}>
                      {a.date ? new Date(a.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                    </span>
                    <br />
                    <span style={{ fontSize: "14px", color: "var(--accent)" }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </SectionTracker>

      <div className="gradient-divider" />

      {/* ── CTA ──────────────────────────────────────────── */}
      <SectionTracker name="cta">
        <section className="section" style={{ textAlign: "center" }}>
          <div className="container-narrow">
            <h2 className="gradient-text" style={{ marginBottom: "16px" }}>Open to collaboration</h2>
            <p style={{ fontSize: "17px", color: "var(--text-muted)", marginBottom: "32px", lineHeight: 1.6 }}>
              Got a project, an idea, or just want to connect?
            </p>
            <Link href="/contact" className="btn" style={{
              background: "linear-gradient(135deg, var(--accent), var(--accent-coral))",
              color: "#ffffff",
            }}>Get in touch</Link>
          </div>
        </section>
      </SectionTracker>
    </>
  );
}
