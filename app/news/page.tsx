import type { Metadata } from "next";
import NewsClient from "./NewsClient";
import SectionTracker from "@/components/SectionTracker";

export const metadata: Metadata = {
  title: "News",
  description: "Latest AI and technology news from around the web.",
};

export default function NewsPage() {
  return (
    <SectionTracker name="news-feed">
    <section className="section">
      <div className="container">
        <header style={{ marginBottom: "48px" }} className="fade-up">
          <p className="label-upper" style={{ marginBottom: "12px", color: "var(--accent-green)" }}>News</p>
          <h1 style={{ color: "var(--accent-green)" }}>AI &amp; Tech News</h1>
          <p style={{ fontSize: "17px", color: "var(--text-muted)", marginTop: "12px", lineHeight: 1.6 }}>
            Latest headlines from top sources. Updated every 8 hours.
          </p>
        </header>
        <NewsClient />
      </div>
    </section>
    </SectionTracker>
  );
}
