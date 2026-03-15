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
const IMG_RATIO = 0.25; // 25% of card height

export default function ProjectsClient({ projects }: { projects: Project[] }) {
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
              animate={{
                x,
                z,
                rotateY: -rotation,
              }}
              transition={{ type: "tween", duration: 0.5, ease: "easeOut" }}
              onClick={() => snapTo(i)}
              whileHover={{ scale: 1.15 }}
            >
              <Link
                href={`/projects/${p.slug}`}
                onClick={(e) => {
                  e.stopPropagation();
                  trackEvent("project_select", { project_name: p.name, project_id: p.id });
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
                {/* Image */}
                <div style={{
                  height: `${IMG_RATIO * 100}%`,
                  background: TYPE_COLORS[p.type] ?? "var(--accent)",
                  overflow: "hidden",
                  flexShrink: 0,
                }}>
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>

                {/* Content */}
                <div style={{ padding: "16px 20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                      <span style={{
                        fontSize: "11px", fontWeight: 600,
                        color: p.type === "Guide" ? "#333" : "#fff",
                        background: TYPE_COLORS[p.type] ?? "var(--accent)",
                        padding: "3px 9px", borderRadius: "20px",
                        letterSpacing: "0.04em", textTransform: "uppercase",
                      }}>
                        {p.type}
                      </span>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 500 }}>{p.id}</span>
                    </div>
                    <h3 style={{ fontSize: "16px", marginBottom: "6px" }}>{p.name}</h3>
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.5 }}>{p.tagline}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
