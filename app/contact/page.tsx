import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import SectionTracker from "@/components/SectionTracker";

export const metadata: Metadata = { title: "Contact", description: "Have a question, idea, or collaboration in mind? Reach out — I read and respond to every message." };

export default function ContactPage() {
  return (
    <SectionTracker name="contact-form">
      <section className="section">
        <div className="container-narrow">
          <header style={{ marginBottom: "48px" }} className="fade-up">
            <p className="label-upper" style={{ marginBottom: "12px", color: "var(--accent-green)" }}>Contact</p>
            <h1 style={{ color: "var(--accent-green)" }}>Get in Touch</h1>
            <p style={{ fontSize: "17px", color: "var(--text-muted)", marginTop: "12px", lineHeight: 1.65, maxWidth: "480px" }}>
              Whether it's a question about something I've written, an idea for a collaboration, or a bug you've spotted — I'd like to hear it. I read and reply to every message.
            </p>
          </header>
          <ContactForm />
        </div>
      </section>
    </SectionTracker>
  );
}
