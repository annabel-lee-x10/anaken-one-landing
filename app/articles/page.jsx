import { getAllArticles } from "@/lib/articles";
import Link from "next/link";

export const metadata = { title: "Articles — Anaken" };

export default function ArticlesPage() {
  const articles = getAllArticles();
  const bg = "#080c0f";
  const accent = "#00c878";

  return (
    <div style={{ minHeight:"100vh", background:bg, fontFamily:"'Courier New','Lucida Console',monospace", color:"#c8d8e8", position:"relative" }}>
      {/* grid bg */}
      <div style={{ position:"fixed",inset:0,zIndex:0,backgroundImage:"linear-gradient(rgba(0,200,120,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,120,0.03) 1px,transparent 1px)",backgroundSize:"40px 40px",pointerEvents:"none" }} />
      {/* glow */}
      <div style={{ position:"fixed",top:"-20%",left:"50%",transform:"translateX(-50%)",width:"600px",height:"400px",background:"radial-gradient(ellipse,rgba(0,200,100,0.06) 0%,transparent 70%)",zIndex:0,pointerEvents:"none" }} />
      {/* scanlines */}
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
          <span style={{ background:"rgba(0,200,120,0.15)",border:"1px solid rgba(0,200,120,0.35)",color:accent,padding:"4px 14px",fontSize:"11px",letterSpacing:"1.5px",textTransform:"uppercase" }}>articles</span>
        </div>
      </nav>

      {/* main */}
      <main style={{ position:"relative",zIndex:1,maxWidth:"820px",margin:"0 auto",padding:"80px 32px 60px" }}>
        <div style={{ marginBottom:"32px" }}>
          <div style={{ fontSize:"11px",color:"rgba(0,200,120,0.5)",letterSpacing:"2px",marginBottom:"8px" }}>SIGNAL.LOG / WRITING</div>
          <h1 style={{ fontSize:"32px",fontWeight:"bold",color:"#e8f4f0",margin:0 }}>Articles</h1>
        </div>

        {articles.length === 0 ? (
          <p style={{ color:"rgba(200,216,232,0.5)",fontSize:"13px" }}>No articles yet. Drop a .md file in content/articles/.</p>
        ) : (
          <div style={{ display:"flex",flexDirection:"column",gap:"2px" }}>
            {articles.map(article => (
              <Link key={article.slug} href={`/articles/${article.slug}`} style={{ display:"block",textDecoration:"none",background:"rgba(0,200,120,0.02)",border:"1px solid rgba(0,200,120,0.12)",padding:"24px 28px",transition:"all 0.2s",position:"relative",overflow:"hidden" }}>
                <div style={{ position:"absolute",top:0,right:0,width:"32px",height:"32px",borderBottom:"1px solid rgba(0,200,120,0.4)",borderLeft:"1px solid rgba(0,200,120,0.4)" }} />
                <div style={{ fontSize:"10px",color:"rgba(0,200,120,0.5)",letterSpacing:"1px",marginBottom:"8px" }}>
                  {new Date(article.date).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}
                </div>
                <h2 style={{ fontSize:"17px",fontWeight:"bold",color:"#e8f4f0",margin:"0 0 8px",lineHeight:"1.4" }}>{article.title}</h2>
                <p style={{ fontSize:"12px",color:"rgba(200,216,232,0.5)",margin:"0 0 12px",lineHeight:"1.7" }}>{article.description}</p>
                <span style={{ fontSize:"11px",letterSpacing:"1.5px",color:"rgba(0,200,120,0.4)" }}>READ →</span>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer style={{ position:"relative",zIndex:1,borderTop:"1px solid rgba(0,200,120,0.12)",padding:"16px 32px",display:"flex",justifyContent:"space-between",fontSize:"10px",color:"rgba(200,216,232,0.25)",letterSpacing:"1px" }}>
        <span>ANAKEN / u18181188</span>
        <span>NEWS · 00:00 08:00 16:00 UTC</span>
      </footer>
    </div>
  );
}
