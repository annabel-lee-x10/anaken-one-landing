"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { trackEvent } from "@/lib/analytics";
import { TYPE_COLORS } from "@/lib/projects";
import type { Project } from "@/lib/projects";

const Z_DEPTH = 350;
const CARD_SIZE = 280;
const BORDER_RADIUS = 12;
const ANGLE_SPEED = 0.5;
const IMG_RATIO = 0.25;

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      onClick={() => {
        trackEvent("project_select", { project_name: project.name, project_id: project.id });
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        borderRadius: `${BORDER_RADIUS}px`,
        background: "var(--bg-card)",
        boxShadow: "var(--shadow-lift)",
        border: "1px solid var(--border-mid)",
        textDecoration: "none",
        color: "inherit",
        overflow: "hidden",
      }}
    >
      <div style={{
        height: `${IMG_RATIO * 100}%`,
        minHeight: "70px",
        background: TYPE_COLORS[project.type] ?? "var(--accent)",
        overflow: "hidden",
        flexShrink: 0,
      }}>
        <img
          src={project.image}
          alt={project.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
      <div style={{ padding: "16px 20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            <span style={{
              fontSize: "11px", fontWeight: 600,
              color: project.type === "Guide" ? "#333" : "#fff",
              background: TYPE_COLORS[project.type] ?? "var(--accent)",
              padding: "3px 9px", borderRadius: "20px",
              letterSpacing: "0.04em", textTransform: "uppercase",
            }}>
              {project.type}
            </span>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 500 }}>{project.id}</span>
          </div>
          <h3 style={{ fontSize: "16px", marginBottom: "6px" }}>{project.name}</h3>
        </div>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.5 }}>{project.tagline}</p>
      </div>
    </Link>
  );
}

function CarouselView({ projects }: { projects: Project[] }) {
  const [rotation, setRotation] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const numItems = projects.length;
  const angleSlice = 360 / numItems;

  useEffect(() => {
    if (isHovering) return;
    const interval = setInterval(() => {
      setRotation(prev => (prev + ANGLE_SPEED) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isHovering]);

  const snapTo = (index: number) => {
    setRotation(-index * angleSlice);
  };

  return (
    <div
      style={{
        perspective: "1200px",
        height: "480px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <motion.div
        style={{
          position: "relative",
          width: CARD_SIZE * 2,
          height: CARD_SIZE,
          transformStyle: "preserve-3d",
        }}
        animate={{ rotateY: rotation }}
        transition={{ type: "tween", duration: 0.5, ease: "easeOut" }}
      >
        {projects.map((p, i) => {
          const angle = (i * angleSlice * Math.PI) / 180;
          const x = Math.cos(angle) * Z_DEPTH;
          const z = Math.sin(angle) * Z_DEPTH;

          return (
            <motion.div
              key={p.id}
              style={{
                position: "absolute",
                width: CARD_SIZE,
                height: CARD_SIZE,
                left: "50%",
                top: "50%",
                marginLeft: -CARD_SIZE / 2,
                marginTop: -CARD_SIZE / 2,
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                cursor: "pointer",
              }}
              animate={{ x, z, rotateY: -rotation }}
              transition={{ type: "tween", duration: 0.5, ease: "easeOut" }}
              onClick={() => snapTo(i)}
              whileHover={{ scale: 1.15 }}
            >
              <ProjectCard project={p} />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const [view, setView] = useState<"carousel" | "grid">("grid");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 720);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const activeView = isMobile ? "grid" : view;

  return (
    <div>
      {!isMobile && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px", gap: "4px" }}>
          <button
            onClick={() => setView("grid")}
            style={{
              padding: "6px 14px", fontSize: "13px", fontWeight: 500, fontFamily: "var(--font)",
              border: "1px solid var(--border-mid)", borderRadius: "6px 0 0 6px",
              background: activeView === "grid" ? "var(--bg-dark)" : "var(--bg-card)",
              color: activeView === "grid" ? "var(--text-inv)" : "var(--text-muted)",
              cursor: "pointer", transition: "all var(--t-fast) ease",
            }}
          >
            Grid
          </button>
          <button
            onClick={() => setView("carousel")}
            style={{
              padding: "6px 14px", fontSize: "13px", fontWeight: 500, fontFamily: "var(--font)",
              border: "1px solid var(--border-mid)", borderRadius: "0 6px 6px 0",
              background: activeView === "carousel" ? "var(--bg-dark)" : "var(--bg-card)",
              color: activeView === "carousel" ? "var(--text-inv)" : "var(--text-muted)",
              cursor: "pointer", transition: "all var(--t-fast) ease",
            }}
          >
            Carousel
          </button>
        </div>
      )}

      {activeView === "grid" ? (
        <div className="projects-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}>
          <style>{`
            @media (max-width: 900px) {
              .projects-grid { grid-template-columns: repeat(2, 1fr) !important; }
            }
            @media (max-width: 540px) {
              .projects-grid { grid-template-columns: 1fr !important; }
            }
            .project-grid-card {
              transition: transform var(--t) var(--ease), box-shadow var(--t) var(--ease);
            }
            .project-grid-card:hover {
              transform: translateY(-4px);
            }
            .project-grid-card:hover > a {
              box-shadow: var(--shadow-lift-hv) !important;
            }
          `}</style>
          {projects.map(p => (
            <div key={p.id} className="project-grid-card" style={{ height: "280px" }}>
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      ) : (
        <CarouselView projects={projects} />
      )}
    </div>
  );
}
