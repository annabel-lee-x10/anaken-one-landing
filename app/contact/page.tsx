import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import SectionTracker from "@/components/SectionTracker";

export const metadata: Metadata = { title: "Contact", description: "Get in touch." };

export default function ContactPage() {
  return (
    <SectionTracker name="contact-form">
      <section className="section">
        <div className="container-narrow">
          <header style={{ marginBottom: "48px" }} className="fade-up">
            <p className="label-upper" style={{ marginBottom: "12px", color: "var(--accent-coral)" }}>Contact</p>
            <h1 style={{ color: "var(--accent-coral)" }}>Get in Touch</h1>
            <p style={{ fontSize: "17px", color: "var(--text-muted)", marginTop: "12px", lineHeight: 1.65 }}>
              Feedback, ideas, bugs, or just saying hello.
            </p>
          </header>
          <ContactForm />
        </div>
      </section>
    </SectionTracker>
  );
}
