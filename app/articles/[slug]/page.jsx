import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import ArticleShell from "../ArticleShell";
import CopyButton from "./CopyButton";
import Link from "next/link";

// ─── Inline markdown → React elements ────────────────────────────────────────
// Handles: **bold**, *italic*, `code`, [text](url)
function renderInline(text, key = 0) {
  const tokens = [];
  const re = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0, i = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) tokens.push(text.slice(last, m.index));
    if (m[2] !== undefined)      tokens.push(<strong key={i++}>{m[2]}</strong>);
    else if (m[3] !== undefined) tokens.push(<em key={i++}>{m[3]}</em>);
    else if (m[4] !== undefined) tokens.push(<code key={i++}>{m[4]}</code>);
    else if (m[5] !== undefined) tokens.push(<a key={i++} href={m[6]} target="_blank" rel="noopener noreferrer">{m[5]}</a>);
    last = re.lastIndex;
  }
  if (last < text.length) tokens.push(text.slice(last));
  return tokens.length === 1 && typeof tokens[0] === "string" ? tokens[0] : tokens;
}

// ─── Block markdown → React elements ─────────────────────────────────────────
// Handles: ## h2, ### h3, > blockquote, blank-line-separated paragraphs
function renderMarkdown(md) {
  const lines = md.split("\n");
  const blocks = [];
  let para = [];

  const flushPara = () => {
    if (para.length) {
      const text = para.join(" ").trim();
      if (text) blocks.push({ type: "p", text });
      para = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith("### ")) {
      flushPara();
      blocks.push({ type: "h3", text: line.slice(4) });
    } else if (line.startsWith("## ")) {
      flushPara();
      blocks.push({ type: "h2", text: line.slice(3) });
    } else if (line.startsWith("> ")) {
      flushPara();
      blocks.push({ type: "blockquote", text: line.slice(2) });
    } else if (line === "") {
      flushPara();
    } else {
      para.push(line);
    }
  }
  flushPara();

  return blocks.map((b, i) => {
    const inner = renderInline(b.text, i);
    switch (b.type) {
      case "h2":         return <h2 key={i}>{inner}</h2>;
      case "h3":         return <h3 key={i}>{inner}</h3>;
      case "blockquote": return <blockquote key={i}>{inner}</blockquote>;
      default:           return <p key={i}>{inner}</p>;
    }
  });
}

// ─── Static params + metadata ─────────────────────────────────────────────────
export async function generateStaticParams() {
  return getAllArticles().map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  try {
    const { frontmatter } = getArticleBySlug(params.slug);
    const url = `https://anaken.one/articles/${params.slug}`;
    return {
      title: frontmatter.title,
      description: frontmatter.description,
      alternates: { canonical: url },
      robots: { index: true, follow: true },
      openGraph: {
        type: "article", url,
        title: frontmatter.title,
        description: frontmatter.description,
        publishedTime: frontmatter.date,
        siteName: "Anaken",
      },
      twitter: {
        card: "summary",
        title: frontmatter.title,
        description: frontmatter.description,
      },
    };
  } catch { return { title: "Article — Anaken" }; }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ArticlePage({ params }) {
  let frontmatter, content;
  try {
    ({ frontmatter, content } = getArticleBySlug(params.slug));
  } catch {
    return (
      <div style={{ minHeight:"100vh", background:"#080c0f", color:"#c8d8e8", fontFamily:"'Courier New',monospace", display:"flex", alignItems:"center", justifyContent:"center" }}>
        Article not found.
      </div>
    );
  }

  const shareUrl = `https://anaken.one/articles/${params.slug}`;

  return (
    <ArticleShell activeSlug={params.slug}>

      {/* back + share */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"32px" }}>
        <Link href="/articles" style={{ color:"var(--t-accentDim)", fontSize:"11px", letterSpacing:"1.5px", textDecoration:"none" }}>← ALL ARTICLES</Link>
        <div style={{ display:"flex", gap:"6px" }}>
          <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(frontmatter.title)}`}
            target="_blank" rel="noopener noreferrer"
            style={{ background:"var(--t-bgCard)", border:"1px solid var(--t-border)", color:"var(--t-accentDim)", padding:"5px 12px", fontSize:"10px", letterSpacing:"1px", textDecoration:"none" }}>𝕏</a>
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank" rel="noopener noreferrer"
            style={{ background:"var(--t-bgCard)", border:"1px solid var(--t-border)", color:"var(--t-accentDim)", padding:"5px 12px", fontSize:"10px", letterSpacing:"1px", textDecoration:"none" }}>in</a>
          <CopyButton url={shareUrl} />
        </div>
      </div>

      {/* header */}
      <div style={{ borderLeft:"2px solid var(--t-accent)", paddingLeft:"20px", marginBottom:"32px" }}>
        <div style={{ fontSize:"10px", color:"var(--t-accentLabel)", letterSpacing:"1px", marginBottom:"10px" }}>
          {new Date(frontmatter.date).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" })}
        </div>
        <h1 style={{ fontSize:"26px", fontWeight:"bold", color:"var(--t-textHead)", margin:"0 0 12px", lineHeight:1.3 }}>{frontmatter.title}</h1>
        <p style={{ fontSize:"14px", color:"var(--t-textDim)", margin:0, lineHeight:"1.7" }}>{frontmatter.description}</p>
      </div>

      <hr style={{ border:"none", borderTop:"1px solid var(--t-border)", marginBottom:"36px" }} />

      {/* body */}
      <style>{`
        .article-body p          { margin: 0 0 1.3em; color: var(--t-textBody); line-height: 1.85; font-size: 15px; }
        .article-body h2         { font-size: 18px; font-weight: bold; color: var(--t-textHead); margin: 2em 0 0.7em; border-left: 2px solid var(--t-accent); padding-left: 14px; }
        .article-body h3         { font-size: 14px; font-weight: bold; color: var(--t-accent); margin: 1.6em 0 0.5em; letter-spacing: 0.5px; }
        .article-body a          { color: var(--t-accent); text-decoration: underline; }
        .article-body blockquote { border-left: 2px solid var(--t-accentDim); padding-left: 16px; margin: 1.5em 0; color: var(--t-textDim); font-style: italic; }
        .article-body code       { background: var(--t-accentFaint); border: 1px solid var(--t-border); padding: 2px 6px; font-size: 13px; color: var(--t-accent); font-family: inherit; }
        .article-body strong     { color: var(--t-textHead); font-weight: bold; }
        .article-body em         { font-style: italic; }
      `}</style>

      <div className="article-body">
        {renderMarkdown(content)}
      </div>

      <div style={{ marginTop:"60px", paddingTop:"24px", borderTop:"1px solid var(--t-border)" }}>
        <Link href="/articles" style={{ color:"var(--t-accentDim)", fontSize:"11px", letterSpacing:"1.5px", textDecoration:"none" }}>← ALL ARTICLES</Link>
      </div>

    </ArticleShell>
  );
}
