import { useState, useEffect, useCallback } from "react";

const SCHEDULE_HOURS_UTC = [0, 8, 16];
const STORAGE_KEY = "anaken-news-cache";
const THEME_KEY   = "anaken-theme";

function lastScheduledSlot(now = Date.now()) {
  const d = new Date(now);
  const todaySlots = SCHEDULE_HOURS_UTC.map((h) => { const s = new Date(d); s.setUTCHours(h,0,0,0); return s.getTime(); });
  const past = todaySlots.filter((t) => t <= now).sort((a,b) => b-a);
  if (past.length > 0) return past[0];
  const yd = new Date(d); yd.setUTCDate(yd.getUTCDate()-1);
  yd.setUTCHours(SCHEDULE_HOURS_UTC[SCHEDULE_HOURS_UTC.length-1],0,0,0);
  return yd.getTime();
}
function nextScheduledSlot(now = Date.now()) {
  const d = new Date(now);
  const todaySlots = SCHEDULE_HOURS_UTC.map((h) => { const s = new Date(d); s.setUTCHours(h,0,0,0); return s.getTime(); });
  const future = todaySlots.filter((t) => t > now).sort((a,b) => a-b);
  if (future.length > 0) return future[0];
  const tm = new Date(d); tm.setUTCDate(tm.getUTCDate()+1);
  tm.setUTCHours(SCHEDULE_HOURS_UTC[0],0,0,0);
  return tm.getTime();
}

// ─── Responsive hook ──────────────────────────────────────────────────────────
function useWindowWidth() {
  const [w, setW] = useState(() => typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return w;
}

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const THEMES = {
  dark: {
    bg:"#080c0f", bgNav:"rgba(8,12,15,0.95)", bgCard:"rgba(0,200,120,0.02)",
    bgCardHover:"rgba(0,200,120,0.07)", bgInput:"rgba(0,200,120,0.02)",
    bgInputFocus:"rgba(0,200,120,0.06)", bgGrid:"rgba(0,200,120,0.03)",
    bgGlow:"rgba(0,200,100,0.06)", bgBottomNav:"rgba(8,12,15,0.97)",
    border:"rgba(0,200,120,0.12)", borderHover:"rgba(0,200,120,0.45)",
    borderNav:"rgba(0,200,120,0.2)", borderInput:"rgba(0,200,120,0.15)",
    borderInputF:"rgba(0,200,120,0.5)",
    accent:"#00c878", accentDim:"rgba(0,200,120,0.4)", accentMute:"rgba(0,200,120,0.35)",
    accentFaint:"rgba(0,200,120,0.15)", accentLabel:"rgba(0,200,120,0.5)",
    accentNext:"rgba(0,200,120,0.35)",
    text:"#c8d8e8", textHead:"#e8f4f0", textMid:"rgba(200,216,232,0.7)",
    textDim:"rgba(200,216,232,0.5)", textFaint:"rgba(200,216,232,0.25)",
    textBody:"rgba(200,216,232,0.6)", textPlaceholder:"rgba(200,216,232,0.25)",
    scanline:true, toggleIcon:"☀", toggleTip:"Light mode", optionBg:"#080c0f",
  },
  light: {
    bg:"#f4f1eb", bgNav:"rgba(244,241,235,0.97)", bgCard:"rgba(0,100,80,0.03)",
    bgCardHover:"rgba(0,100,80,0.07)", bgInput:"rgba(0,100,80,0.03)",
    bgInputFocus:"rgba(0,100,80,0.07)", bgGrid:"rgba(0,100,80,0.04)",
    bgGlow:"rgba(0,160,100,0.05)", bgBottomNav:"rgba(244,241,235,0.97)",
    border:"rgba(0,100,80,0.14)", borderHover:"rgba(0,120,90,0.55)",
    borderNav:"rgba(0,100,80,0.2)", borderInput:"rgba(0,100,80,0.18)",
    borderInputF:"rgba(0,120,90,0.55)",
    accent:"#007a55", accentDim:"rgba(0,120,85,0.55)", accentMute:"rgba(0,120,85,0.4)",
    accentFaint:"rgba(0,120,85,0.12)", accentLabel:"rgba(0,100,70,0.55)",
    accentNext:"rgba(0,100,70,0.4)",
    text:"#1a2e25", textHead:"#0e1f18", textMid:"rgba(20,50,35,0.75)",
    textDim:"rgba(20,50,35,0.5)", textFaint:"rgba(20,50,35,0.3)",
    textBody:"rgba(20,50,35,0.65)", textPlaceholder:"rgba(20,50,35,0.3)",
    scanline:false, toggleIcon:"☾", toggleTip:"Dark mode", optionBg:"#f4f1eb",
  },
};

const FALLBACK_NEWS = [
  { title:"AI 'Societies' Are Taking Shape", summary:"Researchers building AI agent simulations with up to 8 billion digital twins — studying collective behavior and social dynamics between bots.", source:"Nature", url:"https://www.nature.com/articles/d41586-026-00070-5", date:"Mar 5, 2026" },
  { title:"AI & Labor Markets: New Research", summary:"Anthropic researchers find AI displacement risk is real but slower than feared — hiring of younger workers in exposed fields has quietly slowed.", source:"Anthropic Research", url:"https://www.anthropic.com/research/labor-market-impacts", date:"Mar 5, 2026" },
  { title:"London's Biggest Anti-AI Protest", summary:"Hundreds marched through London's King's Cross AI hub past OpenAI, Meta & DeepMind HQs calling for regulation and a slowdown.", source:"MIT Tech Review", url:"https://www.technologyreview.com/2026/03/02/1133814/i-checked-out-londons-biggest-ever-anti-ai-protest/", date:"Mar 2, 2026" },
  { title:"State AI Laws Are Moving Fast", summary:"Vermont signed a synthetic media election bill into law. AI chatbot safety bills for minors are advancing across five states.", source:"Transparency Coalition", url:"https://www.transparencycoalition.ai/news/ai-legislative-update-march6-2026", date:"Mar 6, 2026" },
  { title:"Samsung Targets 800M Gemini Devices", summary:"Samsung aims to double AI-equipped mobile devices to 800 million units by end of 2026, bringing Gemini features to mid-tier phones.", source:"Crescendo AI", url:"https://www.crescendo.ai/news/latest-ai-news-and-updates", date:"Mar 1, 2026" },
  { title:"Apple Reimagines Siri with AI", summary:"Apple announced a fully redesigned, context-aware AI-powered Siri set to debut in 2026 with on-screen awareness capabilities.", source:"Crescendo AI", url:"https://www.crescendo.ai/news/latest-ai-news-and-updates", date:"Feb 28, 2026" },
];

const PROJECTS = [
  { name:"AI Fact-Check Engine", tagline:"Verify AI-generated claims in real time.", description:"Paste any text and get a source-backed fact check powered by live AI reasoning.", url:"https://aifactchecker.anaken.one/", icon:"⚡", tag:"tool" },
  { name:"promptVault", tagline:"Your personal prompt engineering HQ.", description:"Build, store, and organize your best prompts. Optimized for iterative AI workflows.", url:"https://prompt-builder-vault.anaken.one/", icon:"🗄️", tag:"tool" },
  { name:"Anaken.one", tagline:"This site — live AI news + projects hub.", description:"A dark techy mini site with a scheduled AI news feed, powered by Claude + web search. Updates at 00:00, 08:00, 16:00 UTC.", url:"#", icon:"🛰️", tag:"site" },
];

const CATEGORIES = ["Feedback","Bug","Request","Others"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitize(str) {
  return String(str).replace(/<[^>]*>/g,"").replace(/[<>]/g,"").trim();
}

async function fetchLiveNews() {
  const r = await fetch("/api/news", { method:"POST" });
  if (!r.ok) throw new Error(`News API error: ${r.status}`);
  const d = await r.json();
  if (!Array.isArray(d.articles) || d.articles.length === 0) throw new Error("Bad shape");
  return d.articles;
}
function isSafeUrl(url) { return typeof url==="string" && /^https:\/\/.+/.test(url); }

async function readCache() {
  try {
    if (window.storage) { const r = await window.storage.get(STORAGE_KEY); return r ? JSON.parse(r.value) : null; }
    const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null;
  } catch { return null; }
}
async function writeCache(payload) {
  try {
    const s = JSON.stringify(payload);
    if (window.storage) await window.storage.set(STORAGE_KEY, s);
    else localStorage.setItem(STORAGE_KEY, s);
  } catch {}
}

const GlitchText = ({ text, t }) => {
  const [g,setG] = useState(false);
  useEffect(() => { const id=setInterval(()=>{setG(true);setTimeout(()=>setG(false),150);},4000); return ()=>clearInterval(id); },[]);
  return <span style={{ color:g?(t===THEMES.dark?"#00ff88":"#00a86b"):"inherit", textShadow:g?"2px 0 #ff0055, -2px 0 #0088ff":"none", transition:"color 0.1s" }}>{text}</span>;
};

const ScanLine = () => <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px)" }} />;

const Spinner = ({ t }) => (
  <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:"16px",padding:"60px 0" }}>
    <div style={{ width:"32px",height:"32px",border:`2px solid ${t.accentFaint}`,borderTop:`2px solid ${t.accent}`,borderRadius:"50%",animation:"spin 0.8s linear infinite" }} />
    <span style={{ fontSize:"11px",color:t.accentLabel,letterSpacing:"2px" }}>FETCHING SIGNAL...</span>
  </div>
);

// ─── Bottom nav tab icons ──────────────────────────────────────────────────────
const TAB_ICONS = { intro:"⌂", news:"◉", projects:"⊞", contact:"✉" };
const TAB_LABELS = { intro:"Home", news:"News", projects:"Projects", contact:"Contact" };

export default function App() {
  const width = useWindowWidth();
  const isMobile = width < 640;

  const [themeName,setThemeName] = useState(()=>{ try{return localStorage.getItem(THEME_KEY)||"dark";}catch{return "dark";} });
  const t = THEMES[themeName]||THEMES.dark;
  const isDark = themeName==="dark";
  const toggleTheme = () => { const n=isDark?"light":"dark"; setThemeName(n); try{localStorage.setItem(THEME_KEY,n);}catch{} };

  const [activeSection,setActiveSection] = useState("intro");
  const [hoveredNews,setHoveredNews] = useState(null);
  const [hoveredProject,setHoveredProject] = useState(null);
  const [time,setTime] = useState(new Date());
  const [news,setNews] = useState(FALLBACK_NEWS);
  const [newsLoading,setNewsLoading] = useState(false);
  const [nextSlot,setNextSlot] = useState(null);
  const [lastFetched,setLastFetched] = useState(null);
  const [form,setForm] = useState({name:"",email:"",category:"",message:""});
  const [formFocused,setFormFocused] = useState({});
  const [formErrors,setFormErrors] = useState({});
  const [formStatus,setFormStatus] = useState(null);

  useEffect(()=>{ const ti=setInterval(()=>setTime(new Date()),1000); return()=>clearInterval(ti); },[]);
  const formatTime = (d) => d.toLocaleTimeString("en-US",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"});
  const formatCountdown = (ts) => {
    if (!ts) return null;
    const diff=ts-Date.now(); if(diff<=0) return "now";
    const h=Math.floor(diff/3600000),m=Math.floor((diff%3600000)/60000),s=Math.floor((diff%60000)/1000);
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  };

  const runScheduledFetch = useCallback(async () => {
    setNewsLoading(true);
    try { const articles=await fetchLiveNews(); const ts=Date.now(); setNews(articles); setLastFetched(ts); await writeCache({articles,timestamp:ts}); }
    catch(e){ console.error("Scheduled news fetch failed:",e); }
    finally { setNewsLoading(false); }
  },[]);

  useEffect(()=>{
    const init=async()=>{
      const now=Date.now(),slot=lastScheduledSlot(now);
      setNextSlot(nextScheduledSlot(now));
      const cached=await readCache();
      if(cached?.articles){setNews(cached.articles);setLastFetched(cached.timestamp);if(cached.timestamp<slot)runScheduledFetch();}
      else runScheduledFetch();
    };
    init();
  },[runScheduledFetch]);

  useEffect(()=>{
    let tid;
    const arm=()=>{ const delay=nextScheduledSlot(Date.now())-Date.now(); tid=setTimeout(async()=>{setNextSlot(nextScheduledSlot(Date.now()));await runScheduledFetch();arm();},delay); setNextSlot(nextScheduledSlot(Date.now())); };
    arm();
    return()=>clearTimeout(tid);
  },[runScheduledFetch]);

  const validateForm = () => {
    const errs={};
    if(!form.name.trim()) errs.name="Name is required.";
    if(!EMAIL_RE.test(form.email.trim())) errs.email="Enter a valid email address.";
    if(!form.category) errs.category="Please select a category.";
    if(form.message.trim().length<5) errs.message="Message is too short.";
    return errs;
  };

  const handleSubmit = async () => {
    const errs=validateForm();
    if(Object.keys(errs).length>0){setFormErrors(errs);return;}
    setFormErrors({});setFormStatus("sending");
    try {
      const res=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:sanitize(form.name),email:sanitize(form.email),category:form.category,message:sanitize(form.message)})});
      const data=await res.json();
      if(res.ok&&data.ok){setFormStatus("ok");setForm({name:"",email:"",category:"",message:""});}
      else setFormStatus("error");
    } catch { setFormStatus("error"); }
  };

  const sections = ["intro","news","projects","contact"];

  const inputStyle = (focused) => ({
    width:"100%", background:focused?t.bgInputFocus:t.bgInput,
    border:`1px solid ${focused?t.borderInputF:t.borderInput}`,
    color:t.text, padding:isMobile?"12px 14px":"10px 14px",
    fontSize:isMobile?"16px":"13px", // 16px prevents iOS auto-zoom
    fontFamily:"'Courier New',monospace", outline:"none",
    transition:"all 0.2s", boxSizing:"border-box", borderRadius:"0",
    WebkitAppearance:"none",
  });
  const labelStyle = { fontSize:"10px",color:t.accentLabel,letterSpacing:"2px",display:"block",marginBottom:"6px" };
  const errStyle = { fontSize:"11px",color:"#e05050",marginTop:"4px" };

  // Padding for main content — extra bottom on mobile for tab bar
  const mainPadding = isMobile ? "72px 16px 90px" : "80px 24px 60px";

  return (
    <div style={{ minHeight:"100vh",background:t.bg,color:t.text,fontFamily:"'Courier New','Lucida Console',monospace",position:"relative",overflow:"hidden",transition:"background 0.3s,color 0.3s" }}>
      {isDark && <ScanLine />}

      {/* Background grid */}
      <div style={{ position:"fixed",inset:0,zIndex:0,backgroundImage:`linear-gradient(${t.bgGrid} 1px,transparent 1px),linear-gradient(90deg,${t.bgGrid} 1px,transparent 1px)`,backgroundSize:"40px 40px" }} />
      {/* Glow */}
      <div style={{ position:"fixed",top:"-20%",left:"50%",transform:"translateX(-50%)",width:"600px",height:"400px",background:`radial-gradient(ellipse,${t.bgGlow} 0%,transparent 70%)`,zIndex:0,pointerEvents:"none" }} />

      {/* ── DESKTOP NAV ── */}
      {!isMobile && (
        <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:100,borderBottom:`1px solid ${t.borderNav}`,background:t.bgNav,backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 32px",height:"52px",transition:"background 0.3s,border-color 0.3s" }}>
          <div style={{ display:"flex",alignItems:"center",gap:"8px" }}>
            <span style={{ color:t.accent,fontSize:"18px",letterSpacing:"2px",fontWeight:"bold" }}>ANAKEN</span>
            <span style={{ color:t.accentDim,fontSize:"11px" }}>/ u18181188</span>
          </div>
          <div style={{ display:"flex",gap:"4px",alignItems:"center" }}>
            {sections.map((s) => (
              <button key={s} onClick={()=>setActiveSection(s)} style={{ background:activeSection===s?t.accentFaint:"transparent",border:activeSection===s?`1px solid ${t.accentMute}`:"1px solid transparent",color:activeSection===s?t.accent:t.textDim,padding:"4px 14px",cursor:"pointer",fontSize:"11px",letterSpacing:"1.5px",textTransform:"uppercase",transition:"all 0.2s" }}>
                {s==="news"&&newsLoading?"news ◌":s}
              </button>
            ))}
            <button onClick={toggleTheme} title={t.toggleTip} style={{ marginLeft:"8px",background:t.accentFaint,border:`1px solid ${t.border}`,color:t.accent,width:"30px",height:"30px",cursor:"pointer",fontSize:"14px",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s",flexShrink:0 }}>
              {t.toggleIcon}
            </button>
          </div>
          <div style={{ fontSize:"11px",color:t.accentLabel,letterSpacing:"1px" }}>{formatTime(time)}</div>
        </nav>
      )}

      {/* ── MOBILE TOP BAR ── */}
      {isMobile && (
        <header style={{ position:"fixed",top:0,left:0,right:0,zIndex:100,borderBottom:`1px solid ${t.borderNav}`,background:t.bgNav,backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",height:"52px" }}>
          <div style={{ display:"flex",alignItems:"center",gap:"6px" }}>
            <span style={{ color:t.accent,fontSize:"16px",letterSpacing:"2px",fontWeight:"bold" }}>ANAKEN</span>
            <span style={{ color:t.accentDim,fontSize:"10px" }}>/ u18181188</span>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:"8px" }}>
            <span style={{ fontSize:"10px",color:t.accentLabel,letterSpacing:"1px" }}>{formatTime(time)}</span>
            <button onClick={toggleTheme} title={t.toggleTip} style={{ background:t.accentFaint,border:`1px solid ${t.border}`,color:t.accent,width:"36px",height:"36px",cursor:"pointer",fontSize:"16px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,borderRadius:"0" }}>
              {t.toggleIcon}
            </button>
          </div>
        </header>
      )}

      {/* ── MAIN ── */}
      <main style={{ position:"relative",zIndex:1,maxWidth:"820px",margin:"0 auto",padding:mainPadding }}>

        {/* ── INTRO ── */}
        {activeSection==="intro" && (
          <section style={{ animation:"fadeIn 0.4s ease" }}>
            <div style={{ borderLeft:`2px solid ${t.accent}`,paddingLeft:isMobile?"16px":"24px",marginBottom:"32px" }}>
              <div style={{ fontSize:"11px",color:t.accentLabel,letterSpacing:"2px",marginBottom:"12px" }}>SYSTEM.BOOT / IDENTITY</div>
              <h1 style={{ fontSize:isMobile?"clamp(36px,10vw,52px)":"clamp(36px,6vw,64px)",fontWeight:"bold",lineHeight:1.1,margin:"0 0 16px",color:t.textHead,letterSpacing:"-1px" }}>
                <GlitchText text="Anaken" t={t} />
              </h1>
              <p style={{ fontSize:isMobile?"15px":"16px",lineHeight:"1.8",color:t.textMid,maxWidth:"520px",margin:0 }}>
                Ageless hobbyist. I love learning workflows and processes — then taking them apart to make them faster, leaner, and smarter.
              </p>
            </div>

            {/* Stats grid — 3-col desktop, 1-col mobile */}
            <div style={{ display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(3,1fr)",gap:"1px",background:t.border,border:`1px solid ${t.border}`,marginBottom:"32px" }}>
              {[{label:"Focus",value:"Workflow Optimization"},{label:"Mode",value:"Perpetual Learner"},{label:"Stack",value:"AI-first Tooling"}].map((item)=>(
                <div key={item.label} style={{ background:t.bg,padding:isMobile?"14px 16px":"20px",borderBottom:isMobile?`1px solid ${t.border}`:"none",transition:"background 0.3s" }}>
                  <div style={{ fontSize:"10px",color:t.accentLabel,letterSpacing:"2px",marginBottom:"4px" }}>{item.label.toUpperCase()}</div>
                  <div style={{ fontSize:"14px",color:t.text }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* CTA buttons — stack on mobile */}
            <div style={{ display:"flex",flexDirection:isMobile?"column":"row",gap:"10px" }}>
              {[{label:"→ VIEW PROJECTS",section:"projects",primary:true},{label:"→ AI NEWS FEED",section:"news",primary:false},{label:"→ CONTACT",section:"contact",primary:false}].map(({label,section,primary})=>(
                <button key={section} onClick={()=>setActiveSection(section)} style={{ background:primary?t.accentFaint:"transparent",border:`1px solid ${primary?t.accentMute:t.border}`,color:primary?t.accent:t.textDim,padding:isMobile?"14px 20px":"10px 24px",cursor:"pointer",fontSize:"12px",letterSpacing:"1.5px",transition:"all 0.2s",width:isMobile?"100%":"auto",textAlign:isMobile?"center":"left" }}>
                  {label}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── NEWS ── */}
        {activeSection==="news" && (
          <section style={{ animation:"fadeIn 0.4s ease" }}>
            <div style={{ marginBottom:"24px" }}>
              <div style={{ fontSize:"11px",color:t.accentLabel,letterSpacing:"2px",marginBottom:"8px" }}>SIGNAL.FEED / AI_NEWS</div>
              <h2 style={{ fontSize:isMobile?"22px":"28px",margin:"0 0 8px",color:t.textHead,fontWeight:"bold" }}>Current Intelligence</h2>
              <div style={{ display:"flex",flexDirection:"column",gap:"4px" }}>
                {lastFetched&&!newsLoading&&<span style={{ fontSize:"10px",color:t.accentLabel,letterSpacing:"1px" }}>UPDATED: {new Date(lastFetched).toUTCString().replace("GMT","UTC")}</span>}
                {nextSlot&&!newsLoading&&<span style={{ fontSize:"10px",color:t.accentNext,letterSpacing:"1px" }}>NEXT: {formatCountdown(nextSlot)}</span>}
                {newsLoading&&<span style={{ fontSize:"10px",color:t.accentLabel,letterSpacing:"1px" }}>● UPDATING...</span>}
              </div>
            </div>
            {newsLoading ? <Spinner t={t} /> : (
              <div style={{ display:"flex",flexDirection:"column",gap:"2px" }}>
                {news.map((item,i)=>(
                  <a key={i} href={isSafeUrl(item.url)?item.url:"#"} target="_blank" rel="noopener noreferrer"
                    onMouseEnter={()=>setHoveredNews(i)} onMouseLeave={()=>setHoveredNews(null)}
                    style={{ display:"block",background:hoveredNews===i?t.bgCardHover:t.bgCard,border:`1px solid ${hoveredNews===i?t.accentMute:t.border}`,padding:isMobile?"16px":"20px 24px",textDecoration:"none",transition:"all 0.2s" }}
                  >
                    {/* Title row — stack date below on mobile */}
                    <div style={{ marginBottom:"8px" }}>
                      <div style={{ fontSize:isMobile?"14px":"15px",fontWeight:"bold",color:hoveredNews===i?t.accent:t.text,transition:"color 0.2s",lineHeight:"1.4",marginBottom:isMobile?"4px":"0" }}>{item.title}</div>
                      <div style={{ fontSize:"10px",color:t.accentDim,letterSpacing:"1px" }}>{item.date}</div>
                    </div>
                    <p style={{ margin:"0 0 10px",fontSize:"13px",color:t.textBody,lineHeight:"1.6" }}>{item.summary}</p>
                    <span style={{ fontSize:"10px",color:t.accentLabel,letterSpacing:"1px" }}>{item.source} ↗</span>
                  </a>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── PROJECTS ── */}
        {activeSection==="projects" && (
          <section style={{ animation:"fadeIn 0.4s ease" }}>
            <div style={{ marginBottom:"24px" }}>
              <div style={{ fontSize:"11px",color:t.accentLabel,letterSpacing:"2px",marginBottom:"8px" }}>OUTPUT.REGISTRY / BUILDS</div>
              <h2 style={{ fontSize:isMobile?"22px":"28px",margin:0,color:t.textHead,fontWeight:"bold" }}>Projects</h2>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(auto-fit,minmax(280px,1fr))",gap:"2px" }}>
              {PROJECTS.map((p,i)=>(
                <a key={i} href={p.url} target={p.url==="#"?"_self":"_blank"} rel="noopener noreferrer"
                  onMouseEnter={()=>setHoveredProject(i)} onMouseLeave={()=>setHoveredProject(null)}
                  style={{ display:"block",background:hoveredProject===i?t.bgCardHover:t.bgCard,border:`1px solid ${hoveredProject===i?t.borderHover:t.border}`,padding:isMobile?"20px":"28px",textDecoration:"none",transition:"all 0.25s",position:"relative",overflow:"hidden" }}
                >
                  <div style={{ position:"absolute",top:0,right:0,width:"40px",height:"40px",borderBottom:`1px solid ${hoveredProject===i?t.accentDim:t.border}`,borderLeft:`1px solid ${hoveredProject===i?t.accentDim:t.border}`,transition:"all 0.25s" }} />
                  <div style={{ fontSize:"28px",marginBottom:"12px" }}>{p.icon}</div>
                  <div style={{ fontSize:"10px",color:t.accentDim,letterSpacing:"2px",marginBottom:"6px" }}>{p.tag.toUpperCase()}</div>
                  <h3 style={{ fontSize:isMobile?"17px":"20px",margin:"0 0 6px",color:hoveredProject===i?t.accent:t.textHead,transition:"color 0.2s",fontWeight:"bold" }}>{p.name}</h3>
                  <p style={{ margin:"0 0 6px",fontSize:"13px",color:t.text,fontWeight:"bold" }}>{p.tagline}</p>
                  <p style={{ margin:"0 0 16px",fontSize:"12px",color:t.textDim,lineHeight:"1.6" }}>{p.description}</p>
                  <div style={{ fontSize:"11px",letterSpacing:"1.5px",color:hoveredProject===i?t.accent:t.accentDim,transition:"color 0.2s" }}>
                    {p.url==="#"?"YOU ARE HERE →":"OPEN PROJECT →"}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ── CONTACT ── */}
        {activeSection==="contact" && (
          <section style={{ animation:"fadeIn 0.4s ease" }}>
            <div style={{ marginBottom:"24px" }}>
              <div style={{ fontSize:"11px",color:t.accentLabel,letterSpacing:"2px",marginBottom:"8px" }}>COMMS.OPEN / CONTACT</div>
              <h2 style={{ fontSize:isMobile?"22px":"28px",margin:0,color:t.textHead,fontWeight:"bold" }}>Get in Touch</h2>
            </div>

            {formStatus==="ok" ? (
              <div style={{ border:`1px solid ${t.accentMute}`,background:t.accentFaint,padding:"40px",textAlign:"center" }}>
                <div style={{ fontSize:"28px",marginBottom:"12px" }}>✓</div>
                <div style={{ fontSize:"14px",color:t.accent,letterSpacing:"1px" }}>MESSAGE TRANSMITTED</div>
                <div style={{ fontSize:"12px",color:t.textDim,marginTop:"8px" }}>I'll get back to you soon.</div>
                <button onClick={()=>setFormStatus(null)} style={{ marginTop:"24px",background:"transparent",border:`1px solid ${t.accentMute}`,color:t.accent,padding:"10px 20px",cursor:"pointer",fontSize:"11px",letterSpacing:"1.5px" }}>
                  SEND ANOTHER
                </button>
              </div>
            ) : (
              <div style={{ display:"flex",flexDirection:"column",gap:"18px",maxWidth:isMobile?"100%":"560px" }}>
                <div>
                  <label style={labelStyle}>NAME</label>
                  <input type="text" value={form.name} maxLength={100} autoComplete="name"
                    onChange={(e)=>setForm({...form,name:e.target.value})}
                    onFocus={()=>setFormFocused({...formFocused,name:true})}
                    onBlur={()=>setFormFocused({...formFocused,name:false})}
                    placeholder="Your name" style={inputStyle(formFocused.name)} />
                  {formErrors.name&&<div style={errStyle}>{formErrors.name}</div>}
                </div>
                <div>
                  <label style={labelStyle}>EMAIL</label>
                  <input type="email" value={form.email} maxLength={254} autoComplete="email" inputMode="email"
                    onChange={(e)=>setForm({...form,email:e.target.value})}
                    onFocus={()=>setFormFocused({...formFocused,email:true})}
                    onBlur={()=>setFormFocused({...formFocused,email:false})}
                    placeholder="you@example.com" style={inputStyle(formFocused.email)} />
                  {formErrors.email&&<div style={errStyle}>{formErrors.email}</div>}
                </div>
                <div>
                  <label style={labelStyle}>CATEGORY</label>
                  <select value={form.category}
                    onChange={(e)=>setForm({...form,category:e.target.value})}
                    onFocus={()=>setFormFocused({...formFocused,category:true})}
                    onBlur={()=>setFormFocused({...formFocused,category:false})}
                    style={{...inputStyle(formFocused.category),appearance:"none",WebkitAppearance:"none",cursor:"pointer",color:form.category?t.text:t.textPlaceholder}}>
                    <option value="" disabled>Select a category</option>
                    {CATEGORIES.map((c)=><option key={c} value={c} style={{background:t.optionBg,color:t.text}}>{c}</option>)}
                  </select>
                  {formErrors.category&&<div style={errStyle}>{formErrors.category}</div>}
                </div>
                <div>
                  <label style={labelStyle}>MESSAGE</label>
                  <textarea value={form.message} maxLength={1000} rows={isMobile?5:6}
                    onChange={(e)=>setForm({...form,message:e.target.value})}
                    onFocus={()=>setFormFocused({...formFocused,message:true})}
                    onBlur={()=>setFormFocused({...formFocused,message:false})}
                    placeholder="What's on your mind? (1000 chars max)"
                    style={{...inputStyle(formFocused.message),resize:"vertical",minHeight:"110px"}} />
                  <div style={{ fontSize:"10px",color:form.message.length>900?"#e07040":t.textFaint,textAlign:"right",marginTop:"4px",letterSpacing:"1px" }}>{form.message.length} / 1000</div>
                  {formErrors.message&&<div style={errStyle}>{formErrors.message}</div>}
                </div>
                {formStatus==="error"&&(
                  <div style={{ fontSize:"12px",color:"#e05050",border:"1px solid rgba(224,80,80,0.2)",background:"rgba(224,80,80,0.05)",padding:"10px 14px" }}>⚠ Failed to send. Please try again.</div>
                )}
                <button onClick={handleSubmit} disabled={formStatus==="sending"}
                  style={{ background:formStatus==="sending"?t.bgCard:t.accentFaint,border:`1px solid ${t.accentMute}`,color:formStatus==="sending"?t.accentDim:t.accent,padding:isMobile?"16px":"12px 28px",cursor:formStatus==="sending"?"default":"pointer",fontSize:"12px",letterSpacing:"2px",transition:"all 0.2s",width:isMobile?"100%":"auto" }}>
                  {formStatus==="sending"?"TRANSMITTING...":"SEND MESSAGE →"}
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      {/* ── DESKTOP FOOTER ── */}
      {!isMobile && (
        <footer style={{ position:"relative",zIndex:1,borderTop:`1px solid ${t.border}`,padding:"16px 32px",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"10px",color:t.textFaint,letterSpacing:"1px" }}>
          <span>ANAKEN / u18181188</span>
          <span>NEWS · 00:00 08:00 16:00 UTC</span>
        </footer>
      )}

      {/* ── MOBILE BOTTOM TAB BAR ── */}
      {isMobile && (
        <nav style={{ position:"fixed",bottom:0,left:0,right:0,zIndex:100,borderTop:`1px solid ${t.borderNav}`,background:t.bgBottomNav,backdropFilter:"blur(12px)",display:"flex",alignItems:"stretch",height:"62px",paddingBottom:"env(safe-area-inset-bottom)" }}>
          {sections.map((s)=>{
            const active=activeSection===s;
            return (
              <button key={s} onClick={()=>setActiveSection(s)} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"3px",background:"transparent",border:"none",color:active?t.accent:t.textDim,cursor:"pointer",padding:"0",transition:"color 0.2s",position:"relative" }}>
                {active&&<div style={{ position:"absolute",top:0,left:"20%",right:"20%",height:"2px",background:t.accent }} />}
                <span style={{ fontSize:"18px",lineHeight:1 }}>
                  {s==="news"&&newsLoading?"◌":TAB_ICONS[s]}
                </span>
                <span style={{ fontSize:"9px",letterSpacing:"1px",textTransform:"uppercase" }}>{TAB_LABELS[s]}</span>
              </button>
            );
          })}
        </nav>
      )}

      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        * { box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
        html { -webkit-text-size-adjust:100%; }
        body { margin:0; transition:background 0.3s; }
        input, textarea, select { font-family:'Courier New',monospace; }
        input::placeholder, textarea::placeholder { color:${t.textPlaceholder}; }
        option { background:${t.optionBg}; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:${t.bg}; }
        ::-webkit-scrollbar-thumb { background:${t.accentMute}; }
        /* Prevent iOS input zoom — already handled by font-size:16px in inputStyle */
        @media (max-width:639px) {
          input, textarea, select { font-size:16px !important; }
        }
      `}</style>
    </div>
  );
}
