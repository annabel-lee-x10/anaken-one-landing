"use client";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

type Project = { id: string; type: string; name: string; tagline: string; description: string; url: string; };

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const [touch, setTouch] = useState<number | null>(null);

  const prev = () => setActive(a => (a - 1 + projects.length) % projects.length);
  const next = () => setActive(a => (a + 1) % projects.length);

  return (
    <div>
      {/* Card grid — show all, highlight active */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px", marginBottom: "24px" }}
        onTouchStart={e => setTouch(e.touches[0].clientX)}
        onTouchEnd={e => {
          if (touch === null) return;
          const dx = e.changedTouches[0].clientX - touch;
          if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
          setTouch(null);
        }}
      >
        {projects.map((p, i) => (
          <div
            key={p.id}
            onClick={() => { setActive(i); trackEvent("project_select", { project_name: p.name, project_id: p.id }); }}
            style={{
              padding: "28px 24px",
              borderRadius: "var(--radius)",
              background: i === active ? "var(--bg-card)" : "var(--bg-alt)",
              boxShadow: i === active ? "var(--shadow-lift)" : "var(--shadow-card)",
              border: i === active ? "1.5px solid var(--border-mid)" : "1px solid var(--border)",
              cursor: "pointer",
              transition: "all var(--t) var(--ease)",
              transform: i === active ? "translateY(-2px)" : "none",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <span style={{
                fontSize: "12px", fontWeight: 600, color: i === active ? "var(--accent)" : "var(--text-muted)",
                background: i === active ? "var(--badge-active-bg)" : "var(--border)",
                padding: "4px 10px", borderRadius: "20px",
                letterSpacing: "0.04em", textTransform: "uppercase",
                transition: "all var(--t) var(--ease)",
              }}>
                {p.type}
              </span>
              <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500 }}>{p.id}</span>
            </div>
            <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>{p.name}</h3>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6 }}>{p.tagline}</p>

            {i === active && (
              <div style={{ marginTop: "16px" }}>
                <p style={{ fontSize: "14px", color: "var(--text-body)", lineHeight: 1.7, marginBottom: "20px" }}>{p.description}</p>
                <a
                  href={p.url} target="_blank" rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ textDecoration: "none" }}
                  onClick={e => { e.stopPropagation(); trackEvent("project_visit", { project_name: p.name, project_url: p.url }); }}
                >
                  Visit Project &rarr;
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dots */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "8px" }}>
        {projects.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            width: i === active ? "24px" : "8px", height: "8px",
            borderRadius: "4px", border: "none", cursor: "pointer",
            background: i === active ? "var(--text-head)" : "var(--border-mid)",
            transition: "all var(--t) var(--ease)",
          }} />
        ))}
      </div>
    </div>
  );
}
