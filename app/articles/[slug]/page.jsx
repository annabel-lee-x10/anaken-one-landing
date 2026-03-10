import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import ArticleShell from "../ArticleShell";
import CopyButton from "./CopyButton";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

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
        type: "article",
        url,
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

export default function ArticlePage({ params }) {
  let frontmatter, content;
  try {
    ({ frontmatter, content } = getArticleBySlug(params.slug));
  } catch {
    return <div style={{ minHeight:"100vh",background:"#080c0f",color:"#c8d8e8",fontFamily:"'Courier New',monospace",display:"flex",alignItems:"center",justifyContent:"center" }}>Article not found.</div>;
  }

  const shareUrl = `https://anaken.one/articles/${params.slug}`;

  return (
    <ArticleShell activeSlug={params.slug}>
      {/* back + share */}
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"32px" }}>
        <Link href="/articles" style={{ color:"var(--t-accentDim)",fontSize:"11px",letterSpacing:"1.5px",textDecoration:"none" }}>← ALL ARTICLES</Link>
        <div style={{ display:"flex",gap:"6px" }}>
          <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(frontmatter.title)}`} target="_blank" rel="noopener noreferrer"
            style={{ background:"var(--t-bgCard)",border:"1px solid var(--t-border)",color:"var(--t-accentDim)",padding:"5px 12px",fontSize:"10px",letterSpacing:"1px",textDecoration:"none" }}>𝕏</a>
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer"
            style={{ background:"var(--t-bgCard)",border:"1px solid var(--t-border)",color:"var(--t-accentDim)",padding:"5px 12px",fontSize:"10px",letterSpacing:"1px",textDecoration:"none" }}>in</a>
          <CopyButton url={shareUrl} />
        </div>
      </div>

      {/* header */}
      <div style={{ borderLeft:"2px solid var(--t-accent)",paddingLeft:"20px",marginBottom:"32px" }}>
        <div style={{ fontSize:"10px",color:"var(--t-accentLabel)",letterSpacing:"1px",marginBottom:"10px" }}>
          {new Date(frontmatter.date).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}
        </div>
        <h1 style={{ fontSize:"26px",fontWeight:"bold",color:"var(--t-textHead)",margin:"0 0 12px",lineHeight:1.3 }}>{frontmatter.title}</h1>
        <p style={{ fontSize:"14px",color:"var(--t-textDim)",margin:0,lineHeight:"1.7" }}>{frontmatter.description}</p>
      </div>

      <hr style={{ border:"none",borderTop:"1px solid var(--t-border)",marginBottom:"36px" }} />

      {/* body */}
      <ReactMarkdown
        components={{
          h2: ({children}) => <h2 style={{ fontSize:"18px",fontWeight:"bold",color:"var(--t-textHead)",margin:"2em 0 0.7em",borderLeft:"2px solid var(--t-accent)",paddingLeft:"14px" }}>{children}</h2>,
          h3: ({children}) => <h3 style={{ fontSize:"14px",fontWeight:"bold",color:"var(--t-accent)",margin:"1.6em 0 0.5em",letterSpacing:"0.5px" }}>{children}</h3>,
          p:  ({children}) => <p  style={{ margin:"0 0 1.3em",color:"var(--t-textBody)",lineHeight:"1.85",fontSize:"15px" }}>{children}</p>,
          a:  ({href,children}) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ color:"var(--t-accent)",textDecoration:"underline" }}>{children}</a>,
          blockquote: ({children}) => <blockquote style={{ borderLeft:"2px solid var(--t-accentDim)",paddingLeft:"16px",margin:"1.5em 0",color:"var(--t-textDim)",fontStyle:"italic" }}>{children}</blockquote>,
          code: ({children}) => <code style={{ background:"var(--t-accentFaint)",border:"1px solid var(--t-border)",padding:"2px 6px",fontSize:"13px",color:"var(--t-accent)" }}>{children}</code>,
        }}
      >
        {content}
      </ReactMarkdown>

      <div style={{ marginTop:"60px",paddingTop:"24px",borderTop:"1px solid var(--t-border)" }}>
        <Link href="/articles" style={{ color:"var(--t-accentDim)",fontSize:"11px",letterSpacing:"1.5px",textDecoration:"none" }}>← ALL ARTICLES</Link>
      </div>
    </ArticleShell>
  );
}
