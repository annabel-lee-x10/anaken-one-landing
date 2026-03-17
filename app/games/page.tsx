import type { Metadata } from "next";
import SectionTracker from "@/components/SectionTracker";
import { GAMES } from "@/lib/projects";
import ProjectsClient from "../projects/ProjectsClient";

export const metadata: Metadata = {
  title: "Games & Side Projects",
  description: "Browser games and side projects — built for fun, or because I couldn't help it.",
};

export default function GamesPage() {
  return (
    <SectionTracker name="games">
      <section className="section">
        <div className="container">
          <header style={{ marginBottom: "52px" }} className="fade-up">
            <p className="label-upper" style={{ marginBottom: "12px", color: "var(--accent-coral)" }}>Games & Side Projects</p>
            <h1 style={{ color: "var(--accent-coral)" }}>Built for fun</h1>
            <p style={{ fontSize: "17px", color: "var(--text-muted)", marginTop: "12px", lineHeight: 1.6 }}>Things I build because I couldn't help it.</p>
          </header>
          <ProjectsClient projects={GAMES} />
        </div>
      </section>
    </SectionTracker>
  );
}
