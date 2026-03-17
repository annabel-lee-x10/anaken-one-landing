import type { Metadata } from "next";
import ProjectsClient from "./ProjectsClient";
import SectionTracker from "@/components/SectionTracker";
import { TOOLS } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "AI workflow tools and useful apps — live and in progress.",
};

export default function ProjectsPage() {
  return (
    <SectionTracker name="projects">
      <section className="section">
        <div className="container">
          <header style={{ marginBottom: "52px" }} className="fade-up">
            <p className="label-upper" style={{ marginBottom: "12px", color: "var(--accent)" }}>Projects</p>
            <h1 style={{ color: "var(--accent)" }}>Tools & Products</h1>
            <p style={{ fontSize: "17px", color: "var(--text-muted)", marginTop: "12px", lineHeight: 1.6 }}>AI workflow tools and useful apps — live and in progress.</p>
          </header>
          <ProjectsClient projects={TOOLS} />
        </div>
      </section>
    </SectionTracker>
  );
}
