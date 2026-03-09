import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import CopyButton from "./CopyButton";

export async function generateStaticParams() {
  return getAllArticles().map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  try {
    const { frontmatter } = getArticleBySlug(params.slug);
    return { title: `${frontmatter.title} — Anaken`, description: frontmatter.description };
  } catch { return { title: "Article — Anaken" }; }
}

export default function ArticlePage({ params }) {
  let frontmatter, content;
  try {
    ({ frontmatter, content } = getArticleBySlug(params.slug));
  } catch {
    return <div style={{ minHeight:"100vh",background:"#080c0f",color:"#c8d8e8",fontFamily:"'Courier New',monospace",display:"flex",alignItems:"center",justifyContent:"center" }}>Article not found.</div>;
  }

  const accent = "#00c878";
  const shareUrl = `https://anaken.one/articles/${params.slug}`;

  return (
    <div style={{ minHeight:"100vh",background:"#080c0f",fontFamily:"'Courier New','Lucida Console',monospace",color:"#c8d8e8",position:"relative" }}>
      <div style={{ position:"fixed",inset:0,zIndex:0,backgroundImage:"linear-gradient(rgba(0,200,120,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,120,0.03) 1px,transparent 1px)",backgroundSize:"40px 40px",pointerEvents:"none" }} />
      <div style={{ position:"fixed",top:"-20%",left:"50%",transform:"translateX(-50%)",width:"600px",height:"400px",background:"radial-gradient(ellipse,rgba(0,200,100,0.06) 0%,transparent 70%)",zIndex:0,pointerEvents:"none" }} />
      <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px)" }} />

      {/* nav */}
      <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:100,borderBottom:"1px solid rgba(0,200,120,0.2)",background:"rgba(8,12,15,0.95)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 32px",height:"52px" }}>
        <Link href="/" style={{ display:"flex",alignItems:"center",gap:"8px",textDecoration:"none" }}>
          <span style={{ color:accent,fontSize:"18px",letterSpacing:"2px",fontWeight:"bold" }}>ANAKEN</span>
          <span style={{ color:"rgba(0,200,120,0.4)",fontSize:"11px" }}>/ u18181188</span>
        </Link>
        <div style={{ display:"flex",gap:"4px",alignItems:"center" }}>
          {["intro","news","projects","contact"].map(s => (
            <Link key={s} href={`/#${s}`} style={{ background:"transparent",border:"1px solid transparent",color:"rgba(200,216,232,0.5)",padding:"4px 14px",fontSize:"11px",letterSpacing:"1.5px",textTransform:"uppercase",textDecoration:"none" }}>{s}</Link>
          ))}
          <Link href="/articles" style={{ background:"rgba(0,200,120,0.15)",border:"1px solid rgba(0,200,120,0.35)",color:accent,padding:"4px 14px",fontSize:"11px",letterSpacing:"1.5px",textTransform:"uppercase",textDecoration:"none" }}>articles</Link>
        </div>
      </nav>

      <main style={{ position:"relative",zIndex:1,maxWidth:"760px",margin:"0 auto",padding:"80px 32px 80px" }}>
        {/* back + share */}
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"32px" }}>
          <Link href="/articles" style={{ color:"rgba(0,200,120,0.4)",fontSize:"11px",letterSpacing:"1.5px",textDecoration:"none" }}>← ALL ARTICLES</Link>
          <div style={{ display:"flex",gap:"6px" }}>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(frontmatter.title)}`} target="_blank" rel="noopener noreferrer"
              style={{ background:"rgba(0,200,120,0.08)",border:"1px solid rgba(0,200,120,0.2)",color:"rgba(0,200,120,0.7)",padding:"5px 12px",fontSize:"10px",letterSpacing:"1px",textDecoration:"none" }}>𝕏</a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer"
              style={{ background:"rgba(0,200,120,0.08)",border:"1px solid rgba(0,200,120,0.2)",color:"rgba(0,200,120,0.7)",padding:"5px 12px",fontSize:"10px",letterSpacing:"1px",textDecoration:"none" }}>in</a>
            <CopyButton url={shareUrl} />
          </div>
        </div>

        {/* header */}
        <div style={{ borderLeft:`2px solid ${accent}`,paddingLeft:"20px",marginBottom:"32px" }}>
          <div style={{ fontSize:"10px",color:"rgba(0,200,120,0.5)",letterSpacing:"1px",marginBottom:"10px" }}>
            {new Date(frontmatter.date).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}
          </div>
          <h1 style={{ fontSize:"26px",fontWeight:"bold",color:"#e8f4f0",margin:"0 0 12px",lineHeight:1.3 }}>{frontmatter.title}</h1>
          <p style={{ fontSize:"14px",color:"rgba(200,216,232,0.5)",margin:0,lineHeight:"1.7" }}>{frontmatter.description}</p>
        </div>

        <hr style={{ border:"none",borderTop:"1px solid rgba(0,200,120,0.12)",marginBottom:"36px" }} />

        {/* article body */}
        <div className="article-body">
          <ReactMarkdown
            components={{
              h2: ({children}) => <h2 style={{ fontSize:"18px",fontWeight:"bold",color:"#e8f4f0",margin:"2em 0 0.7em",borderLeft:`2px solid ${accent}`,paddingLeft:"14px" }}>{children}</h2>,
              h3: ({children}) => <h3 style={{ fontSize:"14px",fontWeight:"bold",color:accent,margin:"1.6em 0 0.5em",letterSpacing:"0.5px" }}>{children}</h3>,
              p:  ({children}) => <p  style={{ margin:"0 0 1.3em",color:"rgba(200,216,232,0.7)",lineHeight:"1.85",fontSize:"15px" }}>{children}</p>,
              a:  ({href,children}) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ color:accent,textDecoration:"underline" }}>{children}</a>,
              blockquote: ({children}) => <blockquote style={{ borderLeft:`2px solid rgba(0,200,120,0.4)`,paddingLeft:"16px",margin:"1.5em 0",color:"rgba(200,216,232,0.5)",fontStyle:"italic" }}>{children}</blockquote>,
              code: ({children}) => <code style={{ background:"rgba(0,200,120,0.08)",border:"1px solid rgba(0,200,120,0.15)",padding:"2px 6px",fontSize:"13px",color:accent }}>{children}</code>,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* bottom back */}
        <div style={{ marginTop:"60px",paddingTop:"24px",borderTop:"1px solid rgba(0,200,120,0.12)" }}>
          <Link href="/articles" style={{ color:"rgba(0,200,120,0.4)",fontSize:"11px",letterSpacing:"1.5px",textDecoration:"none" }}>← ALL ARTICLES</Link>
        </div>
      </main>

      <footer style={{ position:"relative",zIndex:1,borderTop:"1px solid rgba(0,200,120,0.12)",padding:"16px 32px",display:"flex",justifyContent:"space-between",fontSize:"10px",color:"rgba(200,216,232,0.25)",letterSpacing:"1px" }}>
        <span>ANAKEN / u18181188</span>
        <span>NEWS · 00:00 08:00 16:00 UTC</span>
      </footer>
    </div>
  );
}


