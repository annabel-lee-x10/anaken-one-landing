import { getAllArticles } from "@/lib/articles";
import Link from "next/link";

export const metadata = {
  title: "Articles — Anaken",
  description: "Practical writing on tools, technology, and staying sharp.",
};

const T = {
  bg: "#080c0f",
  bgCard: "rgba(0,200,120,0.02)",
  bgCardHover: "rgba(0,200,120,0.06)",
  bgGrid: "rgba(0,200,120,0.03)",
  bgGlow: "rgba(0,200,100,0.06)",
  bgNav: "rgba(8,12,15,0.95)",
  border: "rgba(0,200,120,0.12)",
  borderHover: "rgba(0,200,120,0.45)",
  borderNav: "rgba(0,200,120,0.2)",
  accent: "#00c878",
  accentDim: "rgba(0,200,120,0.4)",
  accentLabel: "rgba(0,200,120,0.5)",
  text: "#c8d8e8",
  textHead: "#e8f4f0",
  textDim: "rgba(200,216,232,0.5)",
  textFaint: "rgba(200,216,232,0.25)",
};

export default function ArticlesPage() {
  const articles = getAllArticles();

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
          <span style={{ color: T.accent, padding: "4px 14px", fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", background: "rgba(0,200,120,0.07)", border: `1px solid rgba(0,200,120,0.25)` }}>articles</span>
        </div>
      </nav>

      <main style={{ position: "relative", zIndex: 1, maxWidth: "720px", margin: "0 auto", padding: "80px 24px 60px" }}>
        <div style={{ marginBottom: "40px" }}>
          <div style={{ fontSize: "11px", color: T.accentLabel, letterSpacing: "2px", marginBottom: "8px" }}>SIGNAL.LOG / WRITING</div>
          <h1 style={{ fontSize: "clamp(28px,5vw,40px)", fontWeight: "bold", margin: "0 0 12px", color: T.textHead, letterSpacing: "-0.5px" }}>Articles</h1>
          <p style={{ fontSize: "14px", color: T.textDim, margin: 0, lineHeight: "1.7" }}>Practical writing on tools, technology, and staying sharp.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              style={{ display: "block", background: T.bgCard, border: `1px solid ${T.border}`, padding: "24px 28px", textDecoration: "none", transition: "all 0.2s", position: "relative", overflow: "hidden" }}
            >
              <div style={{ position: "absolute", top: 0, right: 0, width: "32px", height: "32px", borderBottom: `1px solid ${T.accentDim}`, borderLeft: `1px solid ${T.accentDim}` }} />
              <div style={{ fontSize: "10px", color: T.accentLabel, letterSpacing: "1px", marginBottom: "8px" }}>
                {new Date(article.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </div>
              <h2 style={{ fontSize: "17px", fontWeight: "bold", color: T.textHead, margin: "0 0 8px", lineHeight: "1.4" }}>{article.title}</h2>
              <p style={{ fontSize: "13px", color: T.textDim, margin: "0 0 12px", lineHeight: "1.7" }}>{article.description}</p>
              <span style={{ fontSize: "11px", letterSpacing: "1.5px", color: T.accentDim }}>READ →</span>
            </Link>
          ))}
        </div>

        {articles.length === 0 && (
          <div style={{ border: `1px solid ${T.border}`, padding: "48px", textAlign: "center", color: T.textDim, fontSize: "13px", letterSpacing: "1px" }}>
            NO ARTICLES YET
          </div>
        )}
      </main>

      <footer style={{ position: "relative", zIndex: 1, borderTop: `1px solid ${T.border}`, padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "10px", color: T.textFaint, letterSpacing: "1px" }}>
        <span>ANAKEN / u18181188</span>
        <Link href="/" style={{ color: T.textFaint, textDecoration: "none", letterSpacing: "1px" }}>← BACK TO HOME</Link>
      </footer>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        a:hover h2 { color: #00c878 !important; }
        a[href^="/articles/"]:hover { background: rgba(0,200,120,0.06) !important; border-color: rgba(0,200,120,0.45) !important; }
      `}</style>
    </div>
  );
}
