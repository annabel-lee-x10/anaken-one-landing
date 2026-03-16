import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { fetchNews } from "@/lib/news";
import { PROJECTS } from "@/lib/projects";
import SectionTracker from "@/components/SectionTracker";
import ProjectsClient from "./projects/ProjectsClient";

export const metadata = {
  title: "Anaken — AI Workflow Tools & Deep Dives",
  description: "Open-source tools for AI workflows — prompt diffing, token analysis, workflow mapping. Plus deep dives on what actually works.",
  alternates: { canonical: "https://anaken.one" },
};

export default async function HomePage() {
  const allArticles = getAllArticles();
  const articles = allArticles.slice(0, 3);
  const { items } = await fetchNews();
  const news = items.slice(0, 3);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <SectionTracker name="hero">
        <section className="section" style={{ textAlign: "center", paddingTop: "6rem", paddingBottom: "4.5rem" }}>
          <div className="container-narrow fade-up">
            <p className="label-upper" style={{ marginBottom: "20px" }}>Built by Anaken — software engineer &amp; AI workflow builder</p>
            <h1 className="gradient-text" style={{ marginBottom: "24px", lineHeight: 1.08 }}>
              AI Workflow<br />Tools.
            </h1>
            <p style={{ fontSize: "clamp(20px, 4vw, 26px)", color: "var(--text-body)", lineHeight: 1.4, letterSpacing: "0.12em", margin: "0 auto 16px" }}>
              ideate. innovate. iterate.
            </p>
            <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.65, maxWidth: "480px", margin: "0 auto 24px" }}>
              I build tools that make AI workflows visible, testable, and repeatable — then write about what actually works.
            </p>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-body)", letterSpacing: "0.04em", textTransform: "uppercase", margin: "0 auto 32px", opacity: 0.6 }}>
              Open-source tools &amp; deep-dive articles
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/projects" className="btn" style={{ background: "var(--accent)", color: "#ffffff", boxShadow: "0 2px 12px rgba(51,102,255,0.3)" }}>Explore Tools</Link>
              <Link href="/articles" className="btn btn-secondary">Read Articles</Link>
            </div>
          </div>
        </section>
      </SectionTracker>

      <div className="gradient-divider" />

      {/* ── Stats strip ──────────────────────────────────── */}
      <section className="section-alt" style={{ padding: "0" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
          {[
            { label: "Tools",      value: "Live & Free",          color: "var(--accent-green)", dot: "var(--accent-green)" },
            { label: "Deep Dives", value: "New Biweekly",         color: "var(--accent-coral)", dot: "var(--accent-coral)" },
            { label: "Lab",        value: "Building in Public",   color: "var(--accent)",       dot: "var(--accent)" },
          ].map(({ label, value, color, dot }, i) => (
            <div key={label} style={{
              padding: "28px 24px",
              borderRight: i < 2 ? "1px solid var(--border-mid)" : "none",
              textAlign: "center",
            }}>
              <p className="label-upper" style={{ marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: dot, display: "inline-block" }} />
                {label}
              </p>
              <p style={{ fontSize: "15px", fontWeight: 600, color }}>{value}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="gradient-divider" />

      {/* ── Projects ─────────────────────────────────────── */}
      <SectionTracker name="projects-preview">
        <section className="section">
          <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <p className="label-upper" style={{ margin: 0, color: "var(--accent)" }}>Projects</p>
                </div>
                <h2 style={{ color: "var(--accent)" }}>Things I&apos;ve built</h2>
              </div>
              <Link href="/projects" className="btn btn-secondary btn-sm">View all</Link>
            </div>
            <ProjectsClient projects={PROJECTS} />
          </div>
        </section>
      </SectionTracker>

      <div className="gradient-divider" />

      {/* ── News Preview ─────────────────────────────────── */}
      {news.length > 0 && (
        <SectionTracker name="news-preview">
          <section className="section section-alt">
            <div className="container">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <p className="label-upper" style={{ marginBottom: "10px", color: "var(--accent)" }}>News</p>
                  <h2 style={{ color: "var(--accent)" }}>Latest in AI</h2>
                </div>
                <Link href="/news" className="btn btn-secondary btn-sm">All news</Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                {news.map((n: { title: string; source: string; date: string; url: string; summary: string }, i: number) => {
                  const dotColor = ["var(--accent)", "var(--accent-coral)"][i % 2];
                  return (
                    <a key={i} href={n.url} target="_blank" rel="noopener noreferrer" className="card-hover" style={{
                      display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                      gap: "24px", padding: "24px",
                      background: "var(--bg-card)", borderRadius: "var(--radius)",
                      borderTop: "2px solid var(--accent-coral)",
                      textDecoration: "none",
                    }}>
                      <div style={{ flex: 1, display: "flex", gap: "12px", alignItems: "flex-start" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: dotColor, flexShrink: 0, marginTop: "8px" }} />
                        <div>
                          <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-head)", letterSpacing: "-0.02em", marginBottom: "6px" }}>{n.title}</p>
                          <span style={{ display: "inline-block", fontSize: "12px", fontWeight: 600, color: "var(--text-head)", background: "var(--accent-mint)", padding: "2px 8px", borderRadius: "20px" }}>{n.source}</span>
                          <span style={{ fontSize: "13px", color: "var(--text-muted)", marginLeft: "8px" }}>{n.date ? `${n.date}` : ""}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: "14px", color: dotColor, flexShrink: 0, paddingTop: "4px" }}>→</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </section>
        </SectionTracker>
      )}

      <div className="gradient-divider" />

      {/* ── Articles ─────────────────────────────────────── */}
      <SectionTracker name="articles-preview">
        <section className={`section ${news.length > 0 ? "" : "section-alt"}`}>
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

      {/* ── Lab Preview ─────────────────────────────────── */}
      <SectionTracker name="lab-preview">
        <section className="section section-alt">
          <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <p className="label-upper" style={{ marginBottom: "10px", color: "var(--accent)" }}>Lab</p>
                <h2 style={{ color: "var(--accent)" }}>From the Lab</h2>
              </div>
              <Link href="/lab" className="btn btn-secondary btn-sm">View Lab</Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { name: "Prompt Diff", status: "WIP", description: "Compare two prompt versions side-by-side with structured output diffing. See exactly what changed in your results when you tweak a prompt.", statusColor: "var(--status-wip-fg)", statusBg: "var(--status-wip-bg)" },
              ].map(exp => (
                <div key={exp.name} className="card" style={{ padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px", borderLeft: `3px solid ${exp.statusColor}` }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "17px", fontWeight: 600, color: "var(--text-head)", letterSpacing: "-0.02em", marginBottom: "6px" }}>{exp.name}</p>
                    <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6 }}>{exp.description}</p>
                  </div>
                  <span style={{
                    flexShrink: 0, fontSize: "13px", fontWeight: 600,
                    color: exp.statusColor, background: exp.statusBg,
                    padding: "5px 14px", borderRadius: "20px",
                    letterSpacing: "0.04em",
                  }}>
                    {exp.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionTracker>

      {/* ── Newsletter CTA ────────────────────────────────── */}
      <SectionTracker name="notify">
        <section className="section" style={{ textAlign: "center" }}>
          <div className="container-narrow">
            <h2 className="gradient-text" style={{ marginBottom: "16px" }}>Stay in the loop</h2>
            <p style={{ fontSize: "17px", color: "var(--text-muted)", marginBottom: "32px", lineHeight: 1.6 }}>
              Get notified when I ship a new tool or publish a deep dive.
            </p>
            <Link href="/contact?ref=notify" className="btn" style={{
              background: "var(--accent)",
              color: "#ffffff",
              boxShadow: "0 2px 12px rgba(51,102,255,0.3)",
            }}>Get notified →</Link>
          </div>
        </section>
      </SectionTracker>

      <div className="gradient-divider" />

      {/* ── CTA ──────────────────────────────────────────── */}
      <SectionTracker name="cta">
        <section className="section section-alt" style={{ textAlign: "center" }}>
          <div className="container-narrow">
            <h2 className="gradient-text" style={{ marginBottom: "16px" }}>Let&apos;s connect</h2>
            <p style={{ fontSize: "17px", color: "var(--text-muted)", marginBottom: "32px", lineHeight: 1.6 }}>
              Got feedback, an idea, or just want to say hi?
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
