import { useState, useEffect, useCallback, useRef } from "react";

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

const PROMPT_VAULT_ICON = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiPgogIDxkZWZzPgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJiZyIgY3g9IjQwJSIgY3k9IjQwJSIgcj0iNjAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2M2ZTllNCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM5ZWNmYzgiLz4KICAgIDwvcmFkaWFsR3JhZGllbnQ+CiAgPC9kZWZzPgoKICA8IS0tIEJhY2tncm91bmQgKyByaW5nIC0tPgogIDxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ3IiBmaWxsPSJ1cmwoI2JnKSIvPgogIDxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ3IiBmaWxsPSJub25lIiBzdHJva2U9IiMyNTNmNTgiIHN0cm9rZS13aWR0aD0iNiIvPgoKICA8IS0tIE9wZW4tdG9wIGJveCDigJQgY2VudGVyZWQgeCAyN+KAkzczLCB5IDI34oCTNzYgLS0+CiAgPHBhdGggZD0iTTI5LDUwIEwyOSw3NCBRMjksNzggMzMsNzggTDY3LDc4IFE3MSw3OCA3MSw3NCBMNzEsNTAiCiAgICAgICAgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjUzZjU4IiBzdHJva2Utd2lkdGg9IjQuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CiAgPHBhdGggZD0iTTI5LDQ1IEwyOSwzMyBRMjksMjggMzMsMjggTDQxLDI4IgogICAgICAgIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzI1M2Y1OCIgc3Ryb2tlLXdpZHRoPSI0LjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgogIDxwYXRoIGQ9Ik01OSwyOCBMNjcsMjggUTcxLDI4IDcxLDMzIEw3MSw0NSIKICAgICAgICBmaWxsPSJub25lIiBzdHJva2U9IiMyNTNmNTgiIHN0cm9rZS13aWR0aD0iNC41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KCiAgPCEtLSBHZWFyIGNlbnRlcmVkIGF0ICg1MCw0NykgLS0+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTAsNDcpIj4KICAgIDxwYXRoIGQ9Ik0gNi4wOCwtMS4yMSBMIDguNDksLTAuNTAgTCA4LjQ5LDAuNTAgTCA2LjA4LDEuMjEgTCA1LjE2LDMuNDQgTCA2LjM1LDUuNjUgTCA1LjY1LDYuMzUgTCAzLjQ0LDUuMTYgTCAxLjIxLDYuMDggTCAwLjUwLDguNDkgTCAtMC41MCw4LjQ5IEwgLTEuMjEsNi4wOCBMIC0zLjQ0LDUuMTYgTCAtNS42NSw2LjM1IEwgLTYuMzUsNS42NSBMIC01LjE2LDMuNDQgTCAtNi4wOCwxLjIxIEwgLTguNDksMC41MCBMIC04LjQ5LC0wLjUwIEwgLTYuMDgsLTEuMjEgTCAtNS4xNiwtMy40NCBMIC02LjM1LC01LjY1IEwgLTUuNjUsLTYuMzUgTCAtMy40NCwtNS4xNiBMIC0xLjIxLC02LjA4IEwgLTAuNTAsLTguNDkgTCAwLjUwLC04LjQ5IEwgMS4yMSwtNi4wOCBMIDMuNDQsLTUuMTYgTCA1LjY1LC02LjM1IEwgNi4zNSwtNS42NSBMIDUuMTYsLTMuNDQgWiIKICAgICAgICAgIGZpbGw9IiMyNTNmNTgiLz4KICAgIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIzLjIiIGZpbGw9IiNiOGRmZDgiLz4KICA8L2c+CgogIDwhLS0gS2V5aG9sZSBjZW50ZXJlZCBhdCAoNTAsNjUpIC0tPgogIDxjaXJjbGUgY3g9IjUwIiBjeT0iNjIiIHI9IjQuOCIgZmlsbD0iIzJkNGYzZSIvPgogIDxwb2x5Z29uIHBvaW50cz0iNDYuNSw2NiA1My41LDY2IDUyLDc0IDQ4LDc0IiBmaWxsPSIjMmQ0ZjNlIi8+CgogIDwhLS0gUGVuY2lsIGNlbnRlcmVkIGluIHRvcCBnYXAgKGJldHdlZW4geD00MeKAkzU5KSwgYm9sZCBmb3Igc21hbGwgc2l6ZXMgLS0+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTAsMjgpIHJvdGF0ZSgtNDApIj4KICAgIDxyZWN0IHg9Ii0zIiB5PSItOC41IiB3aWR0aD0iNiIgaGVpZ2h0PSIxMi41IiByeD0iMSIgZmlsbD0iIzI1M2Y1OCIvPgogICAgPHBvbHlnb24gcG9pbnRzPSItMyw0IDMsNCAwLDEwIiBmaWxsPSIjZDRhNTc0Ii8+CiAgICA8cG9seWdvbiBwb2ludHM9Ii0xLjUsNy41IDEuNSw3LjUgMCwxMCIgZmlsbD0iI2U4YzQ5YSIvPgogICAgPHJlY3QgeD0iLTMiIHk9Ii0xMC41IiB3aWR0aD0iNiIgaGVpZ2h0PSIyLjUiIHJ4PSIxIiBmaWxsPSIjOGFhOGI1Ii8+CiAgPC9nPgo8L3N2Zz4K";
const FACTCHECK_ICON = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8IS0tIEJhY2tncm91bmQgLS0+CiAgPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMTAiIGZpbGw9IiMxMTExMTEiIHN0cm9rZT0iIzJhMmEyYSIgc3Ryb2tlLXdpZHRoPSIxIi8+CiAgPCEtLSBGb3VyIEFJIG5vZGVzIC0tPgogIDxjaXJjbGUgY3g9IjE0IiBjeT0iMTQiIHI9IjQiIGZpbGw9IiNEOTdCNEEiIG9wYWNpdHk9IjAuOSIvPgogIDxjaXJjbGUgY3g9IjM0IiBjeT0iMTQiIHI9IjQiIGZpbGw9IiMxOUMzN0QiIG9wYWNpdHk9IjAuOSIvPgogIDxjaXJjbGUgY3g9IjE0IiBjeT0iMzQiIHI9IjQiIGZpbGw9IiM0QThGRDkiIG9wYWNpdHk9IjAuOSIvPgogIDxjaXJjbGUgY3g9IjM0IiBjeT0iMzQiIHI9IjQiIGZpbGw9IiNDNDRBRDkiIG9wYWNpdHk9IjAuOSIvPgogIDwhLS0gTGluZXMgdG8gY2VudGVyIC0tPgogIDxsaW5lIHgxPSIxNCIgeTE9IjE0IiB4Mj0iMjQiIHkyPSIyNCIgc3Ryb2tlPSIjMmEyYTJhIiBzdHJva2Utd2lkdGg9IjEuMiIgb3BhY2l0eT0iMC42Ii8+CiAgPGxpbmUgeDE9IjM0IiB5MT0iMTQiIHgyPSIyNCIgeTI9IjI0IiBzdHJva2U9IiMyYTJhMmEiIHN0cm9rZS13aWR0aD0iMS4yIiBvcGFjaXR5PSIwLjYiLz4KICA8bGluZSB4MT0iMTQiIHkxPSIzNCIgeDI9IjI0IiB5Mj0iMjQiIHN0cm9rZT0iIzJhMmEyYSIgc3Ryb2tlLXdpZHRoPSIxLjIiIG9wYWNpdHk9IjAuNiIvPgogIDxsaW5lIHgxPSIzNCIgeTE9IjM0IiB4Mj0iMjQiIHkyPSIyNCIgc3Ryb2tlPSIjMmEyYTJhIiBzdHJva2Utd2lkdGg9IjEuMiIgb3BhY2l0eT0iMC42Ii8+CiAgPCEtLSBDZW50ZXIgc3ludGhlc2lzIG5vZGUgLS0+CiAgPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iNSIgZmlsbD0iI0Q5N0I0QSIgb3BhY2l0eT0iMC45NSIvPgogIDx0ZXh0IHg9IjI0IiB5PSIyOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSI2IiBmaWxsPSIjZmZmIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIj7il4g8L3RleHQ+Cjwvc3ZnPgo=";
const ANAKEN_ICON = "data:image/svg+xml,%3Csvg xmlns='http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='47' fill='%23080c0f' stroke='%2300c878' stroke-width='5'%2F%3E%3Ccircle cx='50' cy='50' r='8' fill='none' stroke='%2300c878' stroke-width='4'%2F%3E%3Cline x1='50' y1='20' x2='50' y2='38' stroke='%2300c878' stroke-width='3' stroke-linecap='round'%2F%3E%3Cline x1='50' y1='62' x2='50' y2='80' stroke='%2300c878' stroke-width='3' stroke-linecap='round'%2F%3E%3Cline x1='20' y1='50' x2='38' y2='50' stroke='%2300c878' stroke-width='3' stroke-linecap='round'%2F%3E%3Cline x1='62' y1='50' x2='80' y2='50' stroke='%2300c878' stroke-width='3' stroke-linecap='round'%2F%3E%3Ccircle cx='50' cy='50' r='28' fill='none' stroke='%2300c878' stroke-width='1.5' stroke-dasharray='5 4' opacity='0.4'%2F%3E%3C%2Fsvg%3E";
const SNAKE_ICON = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHJ4PSIxMCIgZmlsbD0iIzExMTExMSIgc3Ryb2tlPSIjMmEyYTJhIiBzdHJva2Utd2lkdGg9IjEiLz4KICA8IS0tIFNuYWtlIGJvZHkgc2VnbWVudHMgLS0+CiAgPHJlY3QgeD0iOCIgeT0iMjAiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIHJ4PSIxLjUiIGZpbGw9IiMwMGM4NzgiIG9wYWNpdHk9IjAuOSIvPgogIDxyZWN0IHg9IjE2IiB5PSIyMCIgd2lkdGg9IjgiIGhlaWdodD0iOCIgcng9IjEuNSIgZmlsbD0iIzAwYzg3OCIgb3BhY2l0eT0iMC43NSIvPgogIDxyZWN0IHg9IjI0IiB5PSIyMCIgd2lkdGg9IjgiIGhlaWdodD0iOCIgcng9IjEuNSIgZmlsbD0iIzAwYzg3OCIgb3BhY2l0eT0iMC42Ii8+CiAgPHJlY3QgeD0iMjQiIHk9IjI4IiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiByeD0iMS41IiBmaWxsPSIjMDBjODc4IiBvcGFjaXR5PSIwLjQ1Ii8+CiAgPHJlY3QgeD0iMzIiIHk9IjI4IiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiByeD0iMS41IiBmaWxsPSIjMDBjODc4IiBvcGFjaXR5PSIwLjMiLz4KICA8IS0tIFNuYWtlIGhlYWQgLS0+CiAgPHJlY3QgeD0iOCIgeT0iMTIiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIHJ4PSIyIiBmaWxsPSIjMDBjODc4Ii8+CiAgPCEtLSBFeWVzIC0tPgogIDxjaXJjbGUgY3g9IjExIiBjeT0iMTUiIHI9IjEuMiIgZmlsbD0iIzExMTExMSIvPgogIDxjaXJjbGUgY3g9IjE0IiBjeT0iMTUiIHI9IjEuMiIgZmlsbD0iIzExMTExMSIvPgogIDwhLS0gRm9vZCAoYXBwbGUgcGl4ZWwpIC0tPgogIDxyZWN0IHg9IjMyIiB5PSIxMiIgd2lkdGg9IjYiIGhlaWdodD0iNiIgcng9IjEiIGZpbGw9IiNEOTdCNEEiIG9wYWNpdHk9IjAuOTUiLz4KPC9zdmc+";

const PROJECTS = [
  { name:"AI Fact-Check Engine", tagline:"Verify AI-generated claims in real time.", description:"Paste any text and get a source-backed fact check powered by live AI reasoning.", url:"https://aifactchecker.anaken.one/", icon:null, imgIcon:FACTCHECK_ICON, tag:"tool", index:"01" },
  { name:"promptVault", tagline:"Your personal prompt engineering HQ.", description:"Build, store, and organize your best prompts. Optimized for iterative AI workflows.", url:"https://promptvault.anaken.one/", icon:null, imgIcon:PROMPT_VAULT_ICON, tag:"tool", index:"02" },
  { name:"Simple Snake", tagline:"Classic snake game, built with you.", description:"A clean browser-based snake game. Use arrow keys or swipe to play — how high can you score?", url:"https://simple-snake.anaken.one/", icon:null, imgIcon:SNAKE_ICON, tag:"game", index:"03" },
];


// ─── Project icons ────────────────────────────────────────────────────────────

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
const TAB_ICONS = { intro:"⌂", news:"◉", articles:"✦", projects:"⊞", contact:"✉" };
const TAB_LABELS = { intro:"Home", news:"News", articles:"Articles", projects:"Projects", contact:"Contact" };

const ARTICLES = [
  {
    slug: "use-of-ai-then-and-now",
    title: "The Use of AI, Then and Now — How to Stay Relevant",
    date: "2026-03-09",
    description: "AI didn’t arrive overnight. But the pressure to adapt feels like it did. Here’s an honest look at how AI evolved, what changed for everyday people, and how to stay sharp in a world where the tools keep moving.",
    content: [
      { type:"p", text:"There’s a version of this article that starts with ‘AI is changing everything.’ You’ve read that version fifty times. This isn’t that. This is about something more practical — where AI actually came from, what quietly shifted in the last few years, and what you can do today to not feel like you’re always one step behind." },
      { type:"h2", text:"AI Before It Was Everywhere" },
      { type:"p", text:"For most of computing history, AI was a research problem. It lived in university labs, DARPA grant proposals, and overhyped magazine covers that never quite delivered. The early breakthroughs were narrow. IBM’s Deep Blue beat Garry Kasparov at chess in 1997 — a huge moment, mostly ignored by the average person because Deep Blue couldn’t do anything else. It couldn’t answer an email, recognize your face, or do anything except play chess better than any human alive." },
      { type:"p", text:"That narrowness defined AI for decades. Spam filters got smarter. Netflix learned what you liked to watch. Google Maps figured out traffic. These were all AI at work — but they were invisible, silently optimizing specific problems in the background. Nobody called it AI. Nobody felt the pressure to keep up." },
      { type:"h2", text:"The Shift That Changed Everything" },
      { type:"p", text:"The real rupture happened in two stages. The first was 2012, when a neural network called AlexNet demolished the competition in an image recognition contest by a margin that stunned researchers. Deep learning — a technique that had existed for decades — suddenly worked at scale. Within years, it was powering facial recognition, medical imaging, translation, and voice assistants." },
      { type:"p", text:"The second was 2022, when ChatGPT crossed into mainstream culture. This wasn’t just a better product launch. It was the first time a general-purpose AI felt genuinely useful to non-technical people — not for one task, but for many. Writing, summarizing, coding, explaining, brainstorming. Suddenly the AI wasn’t in the background. It was right there in the text box, waiting for you to tell it what to do. The gap between AI research and AI in your daily workflow collapsed almost overnight." },
      { type:"h2", text:"What That Means for You" },
      { type:"p", text:"Here’s the uncomfortable truth: the people who feel most threatened by AI are usually the ones who built their value entirely on access to information or execution of predictable tasks. AI is fast, broad, and tireless. It is also — for now — shallow in judgment, unreliable in nuance, and blind to context it hasn’t been given. The people who thrive are the ones who understand that dynamic and work with it rather than against it." },
      { type:"h2", text:"How to Stay Relevant — Practically" },
      { type:"h3", text:"1. Learn to direct it, not just use it" },
      { type:"p", text:"There’s a real skill gap between people who type a vague question into ChatGPT, and people who know how to give it context, constraints, examples, and a clear output format. That skill compounds quickly. You don’t need a course. You need deliberate practice." },
      { type:"h3", text:"2. Your judgment is the product" },
      { type:"p", text:"AI can draft. It can outline. It can generate options. But it can’t tell you which option is right for this specific situation, with these specific people, in this specific moment. That’s still yours. The most durable skill in any field right now is developed judgment — the accumulated, context-aware sense of what matters, what to trust, and when to push back." },
      { type:"h3", text:"3. Build things with it, not just queries" },
      { type:"p", text:"There’s a difference between using AI to answer a one-off question and building a workflow, a system, or a project with AI embedded in it. The second is where real leverage comes from. Even small projects — a personal site, a writing habit, an automated research pipeline — compound in ways that scattered AI chats don’t." },
      { type:"h3", text:"4. Stay close to what’s changing" },
      { type:"p", text:"You don’t need to follow every model release or benchmark. But you should have a rough sense of what the current tools can and can’t do — and update that mental model every few months. The best habit is simple: when you’re stuck on something, ask yourself if AI could help." },
      { type:"h3", text:"5. Double down on what makes you you" },
      { type:"p", text:"Your domain expertise, your network, your specific way of seeing problems — these are not things AI has. Use the tool to clear away the routine work. Then spend more time in the parts that actually need you." },
      { type:"h2", text:"The Honest Picture" },
      { type:"p", text:"AI is not going to stop developing. The next few years will almost certainly bring capabilities that make today’s tools look primitive. But the people who stayed relevant through every major technology shift — printing press, industrialization, the internet — weren’t the ones who predicted the future most accurately. They were the ones who stayed curious, kept adapting, and didn’t confuse the tool for the point. The point is still the work. AI is just the most interesting tool we’ve built yet." },
    ]
  },
];

// ─── Projects Carousel Component ─────────────────────────────────────────────
function ProjectsCarousel({ t, isMobile, carouselIdx, setCarouselIdx, carouselDir, setCarouselDir, carouselAnim, setCarouselAnim, carouselTouchX }) {
  const total = PROJECTS.length;

  const goCarousel = (next, direction) => {
    if (carouselAnim || next === carouselIdx) return;
    setCarouselDir(direction);
    setCarouselAnim(true);
    setTimeout(() => { setCarouselIdx(next); setCarouselAnim(false); setCarouselDir(null); }, 300);
  };
  const prevCard = () => goCarousel((carouselIdx - 1 + total) % total, "right");
  const nextCard = () => goCarousel((carouselIdx + 1) % total, "left");

  const p = PROJECTS[carouselIdx];
  const slideStyle = {
    transform: carouselAnim ? `translateX(${carouselDir === "left" ? "-56px" : "56px"})` : "translateX(0)",
    opacity: carouselAnim ? 0 : 1,
    transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease",
  };

  return (
    <section style={{ animation:"fadeIn 0.4s ease" }}>
      <div style={{ marginBottom:"24px" }}>
        <div style={{ fontSize:"11px",color:t.accentLabel,letterSpacing:"2px",marginBottom:"8px" }}>OUTPUT.REGISTRY / BUILDS</div>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end" }}>
          <h2 style={{ fontSize:isMobile?"22px":"28px",margin:0,color:t.textHead,fontWeight:"bold" }}>Projects</h2>
          <span style={{ fontSize:"11px",color:t.accentDim,letterSpacing:"3px" }}>{String(carouselIdx+1).padStart(2,"0")} / {String(total).padStart(2,"0")}</span>
        </div>
      </div>

      <div
        onTouchStart={(e) => { carouselTouchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (carouselTouchX.current === null) return;
          const dx = e.changedTouches[0].clientX - carouselTouchX.current;
          if (dx < -40) nextCard();
          else if (dx > 40) prevCard();
          carouselTouchX.current = null;
        }}
        style={{ border:`1px solid ${t.borderHover}`,background:t.bgCard,padding:isMobile?"24px":"32px",position:"relative",overflow:"hidden",minHeight:"280px",cursor:"grab",userSelect:"none",transition:"background 0.3s,border-color 0.3s" }}
      >
        <div style={{ position:"absolute",top:0,right:0,width:"48px",height:"48px",borderBottom:`1px solid ${t.accentDim}`,borderLeft:`1px solid ${t.accentDim}` }} />
        <div style={{ position:"absolute",bottom:0,left:0,width:"28px",height:"28px",borderTop:`1px solid ${t.border}`,borderRight:`1px solid ${t.border}` }} />

        <div style={slideStyle}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"20px" }}>
            <img src={p.imgIcon} alt={p.name} style={{ width:"52px",height:"52px",objectFit:"contain",filter:`drop-shadow(0 0 6px ${t.accentFaint})` }} />
            <span style={{ fontSize:"10px",color:t.accentDim,letterSpacing:"2px",border:`1px solid ${t.border}`,padding:"3px 10px" }}>{p.tag.toUpperCase()}</span>
          </div>
          <div style={{ fontSize:"10px",color:t.accentLabel,letterSpacing:"3px",marginBottom:"10px" }}>PROJECT_{p.index}</div>
          <h3 style={{ fontSize:isMobile?"18px":"22px",margin:"0 0 8px",color:t.accent,fontWeight:"bold",lineHeight:1.2 }}>{p.name}</h3>
          <p style={{ margin:"0 0 8px",fontSize:"13px",color:t.text,fontWeight:"bold" }}>{p.tagline}</p>
          <p style={{ margin:"0 0 24px",fontSize:"12px",color:t.textDim,lineHeight:"1.7" }}>{p.description}</p>
          <a href={p.url} target={p.url==="#"?"_self":"_blank"} rel="noopener noreferrer"
            style={{ display:"inline-block",fontSize:"11px",letterSpacing:"2px",color:t.accent,border:`1px solid ${t.accentMute}`,padding:"9px 20px",textDecoration:"none",background:t.accentFaint }}>
            {p.url==="#"?"YOU ARE HERE →":"OPEN PROJECT →"}
          </a>
        </div>
      </div>

      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"14px" }}>
        <button onClick={prevCard} style={{ background:"transparent",border:`1px solid ${t.border}`,color:t.accentDim,width:"44px",height:"44px",cursor:"pointer",fontSize:"18px",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s" }}>←</button>
        <div style={{ display:"flex",gap:"8px",alignItems:"center" }}>
          {PROJECTS.map((_,i) => (
            <button key={i} onClick={() => goCarousel(i, i > carouselIdx ? "left" : "right")}
              style={{ width:i===carouselIdx?"28px":"6px",height:"6px",background:i===carouselIdx?t.accent:t.border,border:"none",cursor:"pointer",padding:0,transition:"all 0.3s cubic-bezier(0.4,0,0.2,1)" }} />
          ))}
        </div>
        <button onClick={nextCard} style={{ background:"transparent",border:`1px solid ${t.border}`,color:t.accentDim,width:"44px",height:"44px",cursor:"pointer",fontSize:"18px",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s" }}>→</button>
      </div>
      <div style={{ textAlign:"center",marginTop:"12px",fontSize:"10px",color:t.textFaint,letterSpacing:"1px" }}>SWIPE · ARROW KEYS · DOTS</div>
    </section>
  );
}

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
  const [openArticle,setOpenArticle] = useState(null);
  const [carouselIdx,setCarouselIdx] = useState(0);
  const [carouselDir,setCarouselDir] = useState(null);
  const [carouselAnim,setCarouselAnim] = useState(false);
  const carouselTouchX = useRef(null);
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

  const sections = ["intro","news","articles","projects","contact"];

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



        {/* ── ARTICLES ── */}
        {activeSection==="articles" && (
          <section style={{ animation:"fadeIn 0.4s ease" }}>
            {openArticle ? (
              // ── ARTICLE DETAIL ──
              <div>
                <button onClick={()=>setOpenArticle(null)} style={{ background:"transparent",border:"none",color:t.accentDim,cursor:"pointer",fontSize:"11px",letterSpacing:"1.5px",padding:"0",marginBottom:"28px",display:"flex",alignItems:"center",gap:"6px" }}>← ALL ARTICLES</button>
                <div style={{ borderLeft:`2px solid ${t.accent}`,paddingLeft:"20px",marginBottom:"32px" }}>
                  <div style={{ fontSize:"10px",color:t.accentLabel,letterSpacing:"1px",marginBottom:"10px" }}>
                    {new Date(openArticle.date).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}
                  </div>
                  <h2 style={{ fontSize:isMobile?"20px":"26px",fontWeight:"bold",color:t.textHead,margin:"0 0 12px",lineHeight:1.3 }}>{openArticle.title}</h2>
                  <p style={{ fontSize:"14px",color:t.textDim,margin:0,lineHeight:"1.7" }}>{openArticle.description}</p>
                </div>
                <hr style={{ border:"none",borderTop:`1px solid ${t.border}`,marginBottom:"32px" }} />
                <div style={{ fontSize:isMobile?"14px":"15px",lineHeight:"1.85",color:t.textBody }}>
                  {openArticle.content.map((block,i)=>{
                    if(block.type==="h2") return <h3 key={i} style={{ fontSize:isMobile?"16px":"18px",fontWeight:"bold",color:t.textHead,margin:"2em 0 0.7em",borderLeft:`2px solid ${t.accent}`,paddingLeft:"14px" }}>{block.text}</h3>;
                    if(block.type==="h3") return <h4 key={i} style={{ fontSize:"14px",fontWeight:"bold",color:t.accent,margin:"1.6em 0 0.5em",letterSpacing:"0.5px" }}>{block.text}</h4>;
                    return <p key={i} style={{ margin:"0 0 1.3em",color:t.textBody }}>{block.text}</p>;
                  })}
                </div>
                <div style={{ marginTop:"48px",paddingTop:"20px",borderTop:`1px solid ${t.border}` }}>
                  <button onClick={()=>setOpenArticle(null)} style={{ background:"transparent",border:"none",color:t.accentDim,cursor:"pointer",fontSize:"11px",letterSpacing:"1.5px",padding:"0" }}>← ALL ARTICLES</button>
                </div>
              </div>
            ) : (
              // ── ARTICLE LISTING ──
              <div>
                <div style={{ marginBottom:"24px" }}>
                  <div style={{ fontSize:"11px",color:t.accentLabel,letterSpacing:"2px",marginBottom:"8px" }}>SIGNAL.LOG / WRITING</div>
                  <h2 style={{ fontSize:isMobile?"22px":"28px",margin:0,color:t.textHead,fontWeight:"bold" }}>Articles</h2>
                </div>
                <div style={{ display:"flex",flexDirection:"column",gap:"2px" }}>
                  {ARTICLES.map((article,i)=>(
                    <button key={i} onClick={()=>setOpenArticle(article)}
                      style={{ display:"block",width:"100%",textAlign:"left",background:t.bgCard,border:`1px solid ${t.border}`,padding:isMobile?"20px":"24px 28px",cursor:"pointer",transition:"all 0.2s",position:"relative",overflow:"hidden" }}>
                      <div style={{ position:"absolute",top:0,right:0,width:"32px",height:"32px",borderBottom:`1px solid ${t.accentDim}`,borderLeft:`1px solid ${t.accentDim}` }} />
                      <div style={{ fontSize:"10px",color:t.accentLabel,letterSpacing:"1px",marginBottom:"8px" }}>
                        {new Date(article.date).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}
                      </div>
                      <h3 style={{ fontSize:isMobile?"15px":"17px",fontWeight:"bold",color:t.textHead,margin:"0 0 8px",lineHeight:"1.4" }}>{article.title}</h3>
                      <p style={{ fontSize:"12px",color:t.textDim,margin:"0 0 12px",lineHeight:"1.7" }}>{article.description}</p>
                      <span style={{ fontSize:"11px",letterSpacing:"1.5px",color:t.accentDim }}>READ →</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {activeSection==="projects" && <ProjectsCarousel t={t} isMobile={isMobile} carouselIdx={carouselIdx} setCarouselIdx={setCarouselIdx} carouselDir={carouselDir} setCarouselDir={setCarouselDir} carouselAnim={carouselAnim} setCarouselAnim={setCarouselAnim} carouselTouchX={carouselTouchX} />}
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
