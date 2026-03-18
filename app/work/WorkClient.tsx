"use client";
import { useState } from "react";
import ProjectsClient from "../projects/ProjectsClient";
import type { Project } from "@/lib/projects";

const FILTERS = ["All", "Tool", "Game", "Guide"] as const;

export default function WorkClient({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<string>("All");

  const filtered = active === "All"
    ? projects
    : projects.filter(p => p.type === active);

  return (
    <>
      <div style={{ display: "flex", gap: "8px", marginBottom: "40px", flexWrap: "wrap" }}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActive(f)}
            style={{
              fontSize: "14px",
              fontWeight: 600,
              padding: "8px 20px",
              borderRadius: "32px",
              border: "1px solid var(--border-mid)",
              background: active === f ? "var(--text-head)" : "var(--bg-card)",
              color: active === f ? "#fff" : "var(--text-muted)",
              cursor: "pointer",
              transition: "all 100ms ease",
            }}
          >
            {f}
          </button>
        ))}
      </div>
      <ProjectsClient projects={filtered} />
    </>
  );
}
