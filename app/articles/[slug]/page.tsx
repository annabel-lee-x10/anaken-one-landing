import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ShareButtons from "./ShareButtons";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllArticles().map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { frontmatter } = getArticleBySlug(slug);
    return { title: frontmatter.title, description: frontmatter.description };
  } catch { return { title: "Article" }; }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  let article: ReturnType<typeof getArticleBySlug>;
  try { article = getArticleBySlug(slug); } catch { notFound(); }

  const { frontmatter, content } = article;
  const all = getAllArticles();
  const idx = all.findIndex(a => a.slug === slug);
  const prev = idx < all.length - 1 ? all[idx + 1] : null;
  const next = idx > 0 ? all[idx - 1] : null;
  const shareUrl = `https://anaken.one/articles/${slug}`;

  return (
    <section className="section">
      <div className="container-narrow">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <Link href="/articles" className="link-dim" style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            fontSize: "14px", textDecoration: "none",
          }}>
            &larr; Articles
          </Link>
          <ShareButtons url={shareUrl} title={frontmatter.title} />
        </div>

        <header style={{ marginBottom: "48px", paddingBottom: "40px", borderBottom: "1px solid var(--border-mid)" }}>
          <p className="label-upper" style={{ marginBottom: "16px" }}>
            {frontmatter.date ? new Date(frontmatter.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}
          </p>
          <h1 style={{ marginBottom: "16px" }}>{frontmatter.title}</h1>
          {frontmatter.description && (
            <p style={{ fontSize: "18px", color: "var(--text-muted)", lineHeight: 1.65 }}>{frontmatter.description}</p>
          )}
        </header>

        <article style={{ fontSize: "17px", lineHeight: 1.8, color: "var(--text-body)" }}>
          <ReactMarkdown components={{
            h2: ({ children }) => (
              <h2 style={{ fontSize: "24px", fontWeight: 600, marginTop: "2.5em", marginBottom: "0.8em", color: "var(--text-head)", letterSpacing: "-0.02em" }}>{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 style={{ fontSize: "19px", fontWeight: 600, marginTop: "2em", marginBottom: "0.6em", color: "var(--text-head)" }}>{children}</h3>
            ),
            p: ({ children }) => <p style={{ marginBottom: "1.4em" }}>{children}</p>,
            blockquote: ({ children }) => (
              <blockquote style={{ borderLeft: "3px solid var(--border-mid)", paddingLeft: "20px", color: "var(--text-muted)", fontStyle: "italic", margin: "1.8em 0" }}>{children}</blockquote>
            ),
            code: ({ children, className }) => {
              const isBlock = className?.includes("language-");
              if (isBlock) return (
                <code style={{ display: "block", background: "var(--bg-alt)", padding: "20px", borderRadius: "var(--radius-sm)", fontSize: "14px", lineHeight: 1.65, overflowX: "auto", whiteSpace: "pre", fontFamily: "'SF Mono', Consolas, monospace", border: "1px solid var(--border-mid)" }}>{children}</code>
              );
              return <code style={{ background: "var(--bg-alt)", padding: "2px 7px", borderRadius: "6px", fontSize: "14px", fontFamily: "'SF Mono', Consolas, monospace", border: "1px solid var(--border)" }}>{children}</code>;
            },
            a: ({ href, children }) => (
              <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "underline", textUnderlineOffset: "3px" }}>{children}</a>
            ),
            ul: ({ children }) => <ul style={{ paddingLeft: "24px", marginBottom: "1.4em" }}>{children}</ul>,
            ol: ({ children }) => <ol style={{ paddingLeft: "24px", marginBottom: "1.4em" }}>{children}</ol>,
            li: ({ children }) => <li style={{ marginBottom: "0.5em" }}>{children}</li>,
          }}>
            {content}
          </ReactMarkdown>
        </article>

        <nav style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "64px", paddingTop: "40px", borderTop: "1px solid var(--border-mid)" }}>
          {prev ? (
            <Link href={`/articles/${prev.slug}`} className="card card-hover" style={{ padding: "20px 24px", textDecoration: "none" }}>
              <p className="label-upper" style={{ marginBottom: "8px" }}>&larr; Previous</p>
              <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-head)", letterSpacing: "-0.01em" }}>{prev.title}</p>
            </Link>
          ) : <div />}
          {next ? (
            <Link href={`/articles/${next.slug}`} className="card card-hover" style={{ padding: "20px 24px", textDecoration: "none", textAlign: "right" }}>
              <p className="label-upper" style={{ marginBottom: "8px" }}>Next &rarr;</p>
              <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-head)", letterSpacing: "-0.01em" }}>{next.title}</p>
            </Link>
          ) : <div />}
        </nav>
      </div>
    </section>
  );
}
