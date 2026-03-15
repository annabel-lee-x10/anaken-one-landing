import type { Metadata } from "next";
import ProjectsClient from "./ProjectsClient";
import SectionTracker from "@/components/SectionTracker";
import { PROJECTS } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Live tools, games, and guides — built to explore AI workflows, browser-native development, and practical problem-solving.",
};

export default function ProjectsPage() {
  return (
    <SectionTracker name="projects">
      <section className="section">
        <div className="container">
          <header style={{ marginBottom: "52px" }} className="fade-up">
            <p className="label-upper" style={{ marginBottom: "12px", color: "var(--accent-amber)" }}>Projects</p>
            <h1 style={{ color: "var(--accent-amber)" }}>Things I&apos;ve built</h1>
            <p style={{ fontSize: "17px", color: "var(--text-muted)", marginTop: "12px", lineHeight: 1.6 }}>Tools for AI workflows, games for the browser, and guides for the curious. Everything here is live and free to use.</p>
          </header>
          <ProjectsClient projects={PROJECTS} />
        </div>
      </section>
    </SectionTracker>
  );
}
