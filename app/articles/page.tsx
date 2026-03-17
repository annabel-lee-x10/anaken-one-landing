import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import type { Metadata } from "next";
import SectionTracker from "@/components/SectionTracker";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Articles",
  description: "Original writing on AI literacy, workflow systems, and how technology reshapes the way we think and work.",
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <SectionTracker name="articles-listing">
    <section className="section">
      <div className="container-narrow">
        <header style={{ marginBottom: "48px" }} className="fade-up">
          <p className="label-upper" style={{ marginBottom: "12px", color: "var(--accent-amber)" }}>Writing</p>
          <h1 style={{ color: "var(--accent-amber)" }}>Articles</h1>
          <p style={{ fontSize: "17px", color: "var(--text-muted)", marginTop: "12px", lineHeight: 1.6 }}>
            Long-form takes on AI, workflows, and the systems behind how we work. No listicles — just honest thinking about tools that are changing everything.
          </p>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {articles.map(a => (
            <Link key={a.slug} href={`/articles/${a.slug}`} className="card card-hover" style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              gap: "24px", padding: "24px 28px", textDecoration: "none",
            }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "17px", fontWeight: 600, color: "var(--text-head)", letterSpacing: "-0.02em", marginBottom: "6px" }}>{a.title}</p>
                <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6 }}>{a.description}</p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, paddingTop: "2px" }}>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "10px" }}>
                  {a.date ? new Date(a.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                </p>
                <span style={{ fontSize: "14px", color: "var(--accent)" }}>&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
    </SectionTracker>
  );
}
