import type { Metadata } from "next";
import ProjectsClient from "./ProjectsClient";
import SectionTracker from "@/components/SectionTracker";
import { PROJECTS } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Tools and games I've built.",
};

export default function ProjectsPage() {
  return (
    <SectionTracker name="projects">
      <section className="section">
        <div className="container">
          <header style={{ marginBottom: "52px" }} className="fade-up">
            <p className="label-upper" style={{ marginBottom: "12px", color: "var(--accent-amber)" }}>Projects</p>
            <h1 style={{ color: "var(--accent-amber)" }}>Things I&apos;ve built</h1>
            <p style={{ fontSize: "17px", color: "var(--text-muted)", marginTop: "12px" }}>Tools and games. All live.</p>
          </header>
          <ProjectsClient projects={PROJECTS} />
        </div>
      </section>
    </SectionTracker>
  );
}
