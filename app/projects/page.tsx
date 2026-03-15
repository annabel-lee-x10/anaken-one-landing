import type { Metadata } from "next";
import ProjectsClient from "./ProjectsClient";
import SectionTracker from "@/components/SectionTracker";

export const metadata: Metadata = {
  title: "Projects",
  description: "Tools and games I've built.",
};

const PROJECTS = [
  { id: "01", type: "Tool", name: "AI Fact-Check Engine", tagline: "Verify AI-generated claims in real time.", description: "Paste any text and get a structured breakdown of claims, sources, and confidence scores. Built to cut through AI hallucination at speed.", url: "https://aifactchecker.anaken.one/" },
  { id: "02", type: "Tool", name: "promptVault",          tagline: "Your personal prompt engineering HQ.",    description: "A local-first prompt library. Organize, tag, iterate, and recall your best prompts across models and use cases.", url: "https://promptvault.anaken.one/" },
  { id: "03", type: "Game", name: "Space Commanders",     tagline: "Classic arcade shooter for the browser.", description: "A top-down space shooter with progressive difficulty and powerups. No dependencies, pure browser.", url: "https://space-commanders-classic.anaken.one/" },
  { id: "04", type: "Game", name: "Simple Snake",         tagline: "Classic snake game, built with you.",     description: "Snake, rebuilt collaboratively. Touch-friendly, keyboard-playable, intentionally minimal.", url: "https://simple-snake.anaken.one/" },
  { id: "05", type: "Game", name: "Where's Munki",        tagline: "Find the hidden cat in a bustling city.",  description: "A Where's Wally-style browser game. Hunt for Munki, a sneaky golden kitten hiding in busy illustrated scenes. 10 levels, 3 difficulties, hints, and multiplayer challenges.", url: "https://wheresmunki.anaken.one/" },
  { id: "06", type: "Guide", name: "Solo in Seoul",       tagline: "A solo traveller's guide to Seoul.",       description: "A curated single-page guide for solo travellers in Seoul. Browse venues by type or area, with hand-picked recommendations for cafes, restaurants, and more.", url: "https://soloinseoul.anaken.one/" },
];

export default function ProjectsPage() {
  return (
    <SectionTracker name="projects">
      <section className="section">
        <div className="container">
          <header style={{ marginBottom: "52px" }} className="fade-up">
            <p className="label-upper" style={{ marginBottom: "12px" }}>Projects</p>
            <h1>Things I&apos;ve built</h1>
            <p style={{ fontSize: "17px", color: "var(--text-muted)", marginTop: "12px" }}>Tools and games. All live.</p>
          </header>
          <ProjectsClient projects={PROJECTS} />
        </div>
      </section>
    </SectionTracker>
  );
}
