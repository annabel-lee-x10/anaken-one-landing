import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles",
  description: "Writing on AI, workflows, tools, and the way things work.",
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <section className="section">
      <div className="container-narrow">
        <header style={{ marginBottom: "48px" }} className="fade-up">
          <p className="label-upper" style={{ marginBottom: "12px" }}>Writing</p>
          <h1>Articles</h1>
          <p style={{ fontSize: "17px", color: "var(--text-muted)", marginTop: "12px", lineHeight: 1.6 }}>
            {articles.length} articles on AI, workflows, tools, and thinking.
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
  );
}
