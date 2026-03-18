import type { Metadata } from "next";
import SectionTracker from "@/components/SectionTracker";
import { SHIPPED_PROJECTS } from "@/lib/projects";
import WorkClient from "./WorkClient";

export const metadata: Metadata = {
  title: "Work",
  description: "Tools, games, and experiments I've shipped — built at the intersection of AI tooling and creative technology.",
};

export default function WorkPage() {
  return (
    <SectionTracker name="work">
      <section className="section">
        <div className="container">
          <header style={{ marginBottom: "52px" }} className="fade-up">
            <p className="label-upper" style={{ marginBottom: "12px", color: "var(--accent)" }}>Work</p>
            <h1>Things I&apos;ve shipped</h1>
            <p style={{ fontSize: "17px", color: "var(--text-muted)", marginTop: "12px", lineHeight: 1.6 }}>
              Tools, games, and experiments — built at the intersection of AI tooling and creative technology.
            </p>
          </header>
          <WorkClient projects={SHIPPED_PROJECTS} />
        </div>
      </section>
    </SectionTracker>
  );
}
