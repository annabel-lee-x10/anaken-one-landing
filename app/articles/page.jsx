import { getAllArticles } from "@/lib/articles";
import ArticleShell from "./ArticleShell";
import Link from "next/link";

export const metadata = { title: "Articles — Anaken" };

export default function ArticlesPage() {
  const articles = getAllArticles();
  return (
    <ArticleShell>
      <div style={{ marginBottom:"32px" }}>
        <div style={{ fontSize:"11px",color:"var(--t-accentLabel)",letterSpacing:"2px",marginBottom:"8px" }}>SIGNAL.LOG / WRITING</div>
        <h1 style={{ fontSize:"32px",fontWeight:"bold",color:"var(--t-textHead)",margin:0 }}>Articles</h1>
      </div>

      {articles.length === 0 ? (
        <p style={{ color:"var(--t-textDim)",fontSize:"13px" }}>No articles yet. Drop a .md file in content/articles/.</p>
      ) : (
        <div style={{ display:"flex",flexDirection:"column",gap:"2px" }}>
          {articles.map(article => (
            <Link key={article.slug} href={`/articles/${article.slug}`} style={{ display:"block",textDecoration:"none",background:"var(--t-bgCard)",border:"1px solid var(--t-border)",padding:"24px 28px",transition:"all 0.2s",position:"relative",overflow:"hidden" }}>
              <div style={{ position:"absolute",top:0,right:0,width:"32px",height:"32px",borderBottom:"1px solid var(--t-accentDim)",borderLeft:"1px solid var(--t-accentDim)" }} />
              <div style={{ fontSize:"10px",color:"var(--t-accentLabel)",letterSpacing:"1px",marginBottom:"8px" }}>
                {new Date(article.date).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}
              </div>
              <h2 style={{ fontSize:"17px",fontWeight:"bold",color:"var(--t-textHead)",margin:"0 0 8px",lineHeight:"1.4" }}>{article.title}</h2>
              <p style={{ fontSize:"12px",color:"var(--t-textDim)",margin:"0 0 12px",lineHeight:"1.7" }}>{article.description}</p>
              <span style={{ fontSize:"11px",letterSpacing:"1.5px",color:"var(--t-accentDim)" }}>READ →</span>
            </Link>
          ))}
        </div>
      )}
    </ArticleShell>
  );
}
