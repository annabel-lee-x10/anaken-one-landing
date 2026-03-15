import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import SectionTracker from "@/components/SectionTracker";

export const metadata = {
  title: "Anaken — Workflows, Tools & AI",
  description: "ideate. innovate. iterate. — Exploring workflows, AI tooling, and systems optimization.",
  alternates: { canonical: "https://anaken.one" },
};

const PROJECTS = [
  { name: "AI Fact-Check Engine", desc: "Verify AI-generated claims in real time.", href: "https://aifactchecker.anaken.one/", tag: "Tool" },
  { name: "promptVault",           desc: "Your personal prompt engineering HQ.",    href: "https://promptvault.anaken.one/",   tag: "Tool" },
  { name: "Space Commanders",      desc: "Classic arcade shooter for the browser.", href: "https://space-commanders-classic.anaken.one/", tag: "Game" },
  { name: "Simple Snake",          desc: "Snake, rebuilt collaboratively.",          href: "https://simple-snake.anaken.one/",  tag: "Game" },
];

const DOT_COLORS = ["#3366FF", "#FF3355", "#FFCC00", "#00CC66"];

const tagStyle = (tag: string) =>
  tag === "Tool"
    ? { bg: "var(--accent)", color: "#ffffff" }
    : { bg: "var(--accent-coral)", color: "#ffffff" };

async function getNews() {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
    const res = await fetch(`${base}/api/news`, { next: { revalidate: 28800 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items ?? data.articles ?? []).slice(0, 3);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const articles = getAllArticles().slice(0, 3);
  const news = await getNews();

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <SectionTracker name="hero">
        <section className="section" style={{ textAlign: "center", paddingTop: "7.5rem", paddingBottom: "6rem" }}>
          <div className="container-narrow fade-up">
            <p className="label-upper" style={{ marginBottom: "20px" }}>Anaken · u18181188</p>
            <h1 className="gradient-text" style={{ marginBottom: "24px", lineHeight: 1.08 }}>
              Workflows, Tools<br />& AI.
            </h1>
            <p style={{ fontSize: "clamp(20px, 4vw, 26px)", color: "var(--text-body)", lineHeight: 1.4, letterSpacing: "0.12em", margin: "0 auto 24px" }}>
              ideate. innovate. iterate.
            </p>
            {/* Decorative dots */}
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "36px" }}>
              {DOT_COLORS.map((c, i) => (
                <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: c }} />
              ))}
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/articles" className="btn" style={{ background: "var(--accent)", color: "#ffffff" }}>Read Articles</Link>
              <Link href="/projects" className="btn btn-secondary">See Projects</Link>
            </div>
          </div>
        </section>
      </SectionTracker>

      <div className="gradient-divider" />

      {/* ── Stats strip ──────────────────────────────────── */}
      <section className="section-alt" style={{ padding: "0" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
          {[
            { label: "Focus",  value: "Workflow Optimization", color: "#3366FF" },
            { label: "Mode",   value: "Perpetual Learner",     color: "#FF3355" },
            { label: "Stack",  value: "AI-first Tooling",      color: "#00CC66" },
          ].map(({ label, value, color }, i) => (
            <div key={label} style={{
              padding: "28px 24px",
              borderRight: i < 2 ? "1px solid var(--border-mid)" : "none",
              textAlign: "center",
            }}>
              <p className="label-upper" style={{ marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: color, display: "inline-block" }} />
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
                  <p className="label-upper" style={{ margin: 0, color: "var(--accent-green)" }}>Projects</p>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {["#3366FF", "#FF3355", "#FFCC00"].map((c, i) => (
                      <div key={i} style={{ width: "20px", height: "6px", borderRadius: "3px", background: c }} />
                    ))}
                  </div>
                </div>
                <h2 style={{ color: "var(--accent-green)" }}>Things I&apos;ve built</h2>
              </div>
              <Link href="/projects" className="btn btn-secondary btn-sm">View all</Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
              {PROJECTS.map(({ name, desc, href, tag }) => {
                const ts = tagStyle(tag);
                return (
                  <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="card card-hover" style={{
                    display: "block", padding: "28px 24px", textDecoration: "none",
                  }}>
                    <span style={{
                      display: "inline-block", marginBottom: "16px",
                      fontSize: "12px", fontWeight: 600, color: ts.color,
                      background: ts.bg, padding: "4px 10px", borderRadius: "20px",
                      letterSpacing: "0.04em", textTransform: "uppercase",
                    }}>
                      {tag}
                    </span>
                    <h3 style={{ fontSize: "18px", marginBottom: "8px", letterSpacing: "-0.02em" }}>{name}</h3>
                    <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6 }}>{desc}</p>
                    <p style={{ marginTop: "20px", fontSize: "13px", color: ts.bg, fontWeight: 500 }}>Visit →</p>
                  </a>
                );
              })}
            </div>
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
                  <p className="label-upper" style={{ marginBottom: "10px", color: "var(--accent-coral)" }}>News</p>
                  <h2 style={{ color: "var(--accent-coral)" }}>Latest in AI</h2>
                </div>
                <Link href="/news" className="btn btn-secondary btn-sm">All news</Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                {news.map((n: { title: string; source: string; date: string; url: string; summary: string }, i: number) => {
                  const dotColor = ["#FF3355", "#FFCC00", "#FF6633"][i % 3];
                  return (
                    <a key={i} href={n.url} target="_blank" rel="noopener noreferrer" className="card-hover" style={{
                      display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                      gap: "24px", padding: "24px",
                      background: "var(--bg-card)", borderRadius: "var(--radius)",
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
                  textDecoration: "none",
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-head)", letterSpacing: "-0.02em", marginBottom: "6px" }}>{a.title}</p>
                    <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6 }}>{a.description}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <span style={{
                      display: "inline-block", fontSize: "12px", fontWeight: 600,
                      color: "var(--accent-sky)", background: "var(--badge-active-bg)",
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

      {/* ── CTA ──────────────────────────────────────────── */}
      <SectionTracker name="cta">
        <section className="section" style={{ textAlign: "center" }}>
          <div className="container-narrow">
            <h2 className="gradient-text" style={{ marginBottom: "16px" }}>Let&apos;s connect</h2>
            <p style={{ fontSize: "17px", color: "var(--text-muted)", marginBottom: "32px", lineHeight: 1.6 }}>
              Got feedback, an idea, or just want to say hi?
            </p>
            <Link href="/contact" className="btn" style={{
              background: "linear-gradient(135deg, var(--accent), var(--accent-coral))",
              color: "#ffffff",
            }}>Get in touch</Link>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "24px" }}>
              {DOT_COLORS.map((c, i) => (
                <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: c }} />
              ))}
            </div>
          </div>
        </section>
      </SectionTracker>
    </>
  );
}
