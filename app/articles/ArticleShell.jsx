"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const THEME_KEY = "anaken-theme";
const THEMES = {
  dark: {
    bg:"#080c0f", bgNav:"rgba(8,12,15,0.95)", border:"rgba(0,200,120,0.12)",
    borderNav:"rgba(0,200,120,0.2)", accent:"#00c878", accentDim:"rgba(0,200,120,0.4)",
    text:"#c8d8e8", textHead:"#e8f4f0", textDim:"rgba(200,216,232,0.5)",
    textBody:"rgba(200,216,232,0.6)", accentLabel:"rgba(0,200,120,0.5)",
    accentFaint:"rgba(0,200,120,0.15)", accentMute:"rgba(0,200,120,0.35)",
    bgCard:"rgba(0,200,120,0.02)", bgCardHover:"rgba(0,200,120,0.07)",
    bgGlow:"rgba(0,200,100,0.06)", bgGrid:"rgba(0,200,120,0.03)",
    toggleIcon:"☀", toggleTip:"Light mode", scanline:true,
  },
  light: {
    bg:"#f4f1eb", bgNav:"rgba(244,241,235,0.97)", border:"rgba(0,100,80,0.14)",
    borderNav:"rgba(0,100,80,0.2)", accent:"#007a55", accentDim:"rgba(0,120,85,0.55)",
    text:"#1a2e25", textHead:"#0e1f18", textDim:"rgba(20,50,35,0.5)",
    textBody:"rgba(20,50,35,0.65)", accentLabel:"rgba(0,100,70,0.55)",
    accentFaint:"rgba(0,120,85,0.12)", accentMute:"rgba(0,120,85,0.4)",
    bgCard:"rgba(0,100,80,0.03)", bgCardHover:"rgba(0,100,80,0.07)",
    bgGlow:"rgba(0,160,100,0.05)", bgGrid:"rgba(0,100,80,0.04)",
    toggleIcon:"☾", toggleTip:"Dark mode", scanline:false,
  },
};

export default function ArticleShell({ children, activeSlug }) {
  const [themeName, setThemeName] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY) || "dark";
    setThemeName(saved);
    setMounted(true);
  }, []);

  const t = THEMES[themeName] || THEMES.dark;
  const isDark = themeName === "dark";
  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    setThemeName(next);
    localStorage.setItem(THEME_KEY, next);
  };

  // Don't flash wrong theme on first render
  const opacity = mounted ? 1 : 0;

  return (
    <div style={{ minHeight:"100vh", background:t.bg, fontFamily:"'Courier New','Lucida Console',monospace", color:t.text, position:"relative", opacity, transition:"opacity 0.1s, background 0.3s, color 0.3s" }}>
      {/* grid */}
      <div style={{ position:"fixed",inset:0,zIndex:0,backgroundImage:`linear-gradient(${t.bgGrid} 1px,transparent 1px),linear-gradient(90deg,${t.bgGrid} 1px,transparent 1px)`,backgroundSize:"40px 40px",pointerEvents:"none" }} />
      {/* glow */}
      <div style={{ position:"fixed",top:"-20%",left:"50%",transform:"translateX(-50%)",width:"600px",height:"400px",background:`radial-gradient(ellipse,${t.bgGlow} 0%,transparent 70%)`,zIndex:0,pointerEvents:"none" }} />
      {/* scanlines */}
      {isDark && <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px)" }} />}

      {/* nav */}
      <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:100,borderBottom:`1px solid ${t.borderNav}`,background:t.bgNav,backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 32px",height:"52px",transition:"background 0.3s,border-color 0.3s" }}>
        <Link href="/" style={{ display:"flex",alignItems:"center",gap:"8px",textDecoration:"none" }}>
          <span style={{ color:t.accent,fontSize:"18px",letterSpacing:"2px",fontWeight:"bold" }}>ANAKEN</span>
          <span style={{ color:t.accentDim,fontSize:"11px" }}>/ u18181188</span>
        </Link>
        <div style={{ display:"flex",gap:"4px",alignItems:"center" }}>
          {["intro","news","articles","projects","contact"].map(s => {
            const isArticles = s === "articles";
            const isActive = isArticles && !activeSlug ? true : false;
            if (s === "intro" || s === "news" || s === "projects" || s === "contact") {
              return (
                <Link key={s} href={`/#${s}`} style={{ background:"transparent",border:"1px solid transparent",color:t.textDim,padding:"4px 14px",fontSize:"11px",letterSpacing:"1.5px",textTransform:"uppercase",textDecoration:"none",transition:"all 0.2s" }}>{s}</Link>
              );
            }
            return (
              <Link key={s} href="/articles" style={{ background:t.accentFaint,border:`1px solid ${t.accentMute}`,color:t.accent,padding:"4px 14px",fontSize:"11px",letterSpacing:"1.5px",textTransform:"uppercase",textDecoration:"none",transition:"all 0.2s" }}>articles</Link>
            );
          })}
          <button onClick={toggleTheme} title={t.toggleTip} style={{ marginLeft:"8px",background:t.accentFaint,border:`1px solid ${t.border}`,color:t.accent,width:"30px",height:"30px",cursor:"pointer",fontSize:"14px",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s",flexShrink:0 }}>
            {t.toggleIcon}
          </button>
        </div>
        <div style={{ fontSize:"11px",color:t.accentLabel,letterSpacing:"1px" }}>
          {mounted ? new Date().toLocaleTimeString("en-US",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"}) : ""}
        </div>
      </nav>

      {/* content */}
      <main style={{ position:"relative",zIndex:1,maxWidth:"820px",margin:"0 auto",padding:"80px 32px 60px" }}>
        {/* Pass theme tokens down via CSS vars so children can use them */}
        <style>{`
          :root {
            --t-accent: ${t.accent};
            --t-accentDim: ${t.accentDim};
            --t-accentLabel: ${t.accentLabel};
            --t-accentFaint: ${t.accentFaint};
            --t-accentMute: ${t.accentMute};
            --t-text: ${t.text};
            --t-textHead: ${t.textHead};
            --t-textDim: ${t.textDim};
            --t-textBody: ${t.textBody};
            --t-border: ${t.border};
            --t-bgCard: ${t.bgCard};
            --t-bg: ${t.bg};
          }
        `}</style>
        {children}
      </main>

      <footer style={{ position:"relative",zIndex:1,borderTop:`1px solid ${t.border}`,padding:"16px 32px",display:"flex",justifyContent:"space-between",fontSize:"10px",color:t.textDim,letterSpacing:"1px" }}>
        <span>ANAKEN / u18181188</span>
        <span>NEWS · 00:00 08:00 16:00 UTC</span>
      </footer>
    </div>
  );
}
