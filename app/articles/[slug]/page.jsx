import { getArticleBySlug, getAllArticles } from "@/lib/articles";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  try {
    const { frontmatter } = getArticleBySlug(params.slug);
    return {
      title: `${frontmatter.title} — Anaken`,
      description: frontmatter.description,
    };
  } catch {
    return { title: "Article Not Found" };
  }
}

const T = {
  bg: "#080c0f",
  bgGrid: "rgba(0,200,120,0.03)",
  bgGlow: "rgba(0,200,100,0.06)",
  bgNav: "rgba(8,12,15,0.95)",
  border: "rgba(0,200,120,0.12)",
  borderNav: "rgba(0,200,120,0.2)",
  accent: "#00c878",
  accentDim: "rgba(0,200,120,0.4)",
  accentLabel: "rgba(0,200,120,0.5)",
  text: "#c8d8e8",
  textHead: "#e8f4f0",
  textDim: "rgba(200,216,232,0.5)",
  textFaint: "rgba(200,216,232,0.25)",
  textBody: "rgba(200,216,232,0.75)",
};

export default function ArticlePage({ params }) {
  let article;
  try {
    article = getArticleBySlug(params.slug);
  } catch {
    notFound();
  }

  const { frontmatter, content } = article;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'Courier New','Lucida Console',monospace", position: "relative", overflow: "hidden" }}>
      {/* Background grid */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, backgroundImage: `linear-gradient(${T.bgGrid} 1px,transparent 1px),linear-gradient(90deg,${T.bgGrid} 1px,transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />
      {/* Glow */}
      <div style={{ position: "fixed", top: "-20%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "400px", background: `radial-gradient(ellipse,${T.bgGlow} 0%,transparent 70%)`, zIndex: 0, pointerEvents: "none" }} />
      {/* Scanlines */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px)" }} />

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, borderBottom: `1px solid ${T.borderNav}`, background: T.bgNav, backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: "52px" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <span style={{ color: T.accent, fontSize: "18px", letterSpacing: "2px", fontWeight: "bold" }}>ANAKEN</span>
          <span style={{ color: T.accentDim, fontSize: "11px" }}>/ u18181188</span>
        </Link>
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <Link href="/" style={{ color: T.textDim, padding: "4px 14px", fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none" }}>home</Link>
          <Link href="/articles" style={{ color: T.accentDim, padding: "4px 14px", fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none" }}>articles</Link>
        </div>
      </nav>

      <main style={{ position: "relative", zIndex: 1, maxWidth: "720px", margin: "0 auto", padding: "80px 24px 60px" }}>
        {/* Back link */}
        <Link href="/articles" style={{ fontSize: "11px", color: T.accentDim, textDecoration: "none", letterSpacing: "1.5px", display: "inline-block", marginBottom: "32px" }}>
          ← ALL ARTICLES
        </Link>

        {/* Header */}
        <header style={{ marginBottom: "40px", borderLeft: `2px solid ${T.accent}`, paddingLeft: "24px" }}>
          <div style={{ fontSize: "10px", color: T.accentLabel, letterSpacing: "1px", marginBottom: "12px" }}>
            {new Date(frontmatter.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>
          <h1 style={{ fontSize: "clamp(22px,4vw,34px)", fontWeight: "bold", color: T.textHead, margin: "0 0 16px", lineHeight: "1.3", letterSpacing: "-0.3px" }}>
            {frontmatter.title}
          </h1>
          <p style={{ fontSize: "15px", color: T.textDim, margin: 0, lineHeight: "1.8" }}>{frontmatter.description}</p>
        </header>

        <hr style={{ border: "none", borderTop: `1px solid ${T.border}`, marginBottom: "40px" }} />

        {/* Article body */}
        <article className="article-body">
          <ReactMarkdown>{content}</ReactMarkdown>
        </article>

        <div style={{ marginTop: "56px", paddingTop: "24px", borderTop: `1px solid ${T.border}` }}>
          <Link href="/articles" style={{ fontSize: "11px", color: T.accentDim, textDecoration: "none", letterSpacing: "1.5px" }}>← ALL ARTICLES</Link>
        </div>
      </main>

      <footer style={{ position: "relative", zIndex: 1, borderTop: `1px solid ${T.border}`, padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "10px", color: T.textFaint, letterSpacing: "1px" }}>
        <span>ANAKEN / u18181188</span>
        <Link href="/" style={{ color: T.textFaint, textDecoration: "none" }}>← BACK TO HOME</Link>
      </footer>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }

        /* Article prose styling */
        .article-body { font-size: 15px; line-height: 1.85; color: ${T.textBody}; }
        .article-body p { margin: 0 0 1.4em; }
        .article-body h2 { font-size: 18px; font-weight: bold; color: ${T.textHead}; margin: 2.2em 0 0.8em; letter-spacing: "0.5px"; border-left: 2px solid ${T.accent}; padding-left: 14px; }
        .article-body h3 { font-size: 15px; font-weight: bold; color: ${T.accent}; margin: 1.8em 0 0.6em; letter-spacing: "1px"; }
        .article-body strong { color: ${T.textHead}; font-weight: bold; }
        .article-body em { color: ${T.accentDim}; font-style: italic; }
        .article-body a { color: ${T.accent}; text-underline-offset: 3px; }
        .article-body a:hover { opacity: 0.8; }
        .article-body hr { border: none; border-top: 1px solid ${T.border}; margin: 2em 0; }
        .article-body ul, .article-body ol { padding-left: 1.4em; margin: 0 0 1.4em; }
        .article-body li { margin-bottom: 0.5em; }
        .article-body code { background: rgba(0,200,120,0.08); border: 1px solid rgba(0,200,120,0.15); padding: 2px 6px; font-family: 'Courier New', monospace; font-size: 13px; color: ${T.accent}; }
        .article-body pre { background: rgba(0,200,120,0.04); border: 1px solid ${T.border}; padding: 16px 20px; overflow-x: auto; margin: 0 0 1.4em; }
        .article-body pre code { background: none; border: none; padding: 0; }
        .article-body blockquote { border-left: 2px solid ${T.accentDim}; padding-left: 16px; margin: 0 0 1.4em; color: ${T.textDim}; font-style: italic; }

        @media (max-width: 639px) {
          main { padding: 72px 16px 48px !important; }
          .article-body { font-size: 14px; }
        }
      `}</style>
    </div>
  );
}
