"use client";
import { useState, FormEvent } from "react";
import { trackEvent } from "@/lib/analytics";

type Status = "idle" | "sending" | "sent" | "error";
const CATEGORIES = ["Feedback", "Bug", "Request", "Others"];

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", category: "Feedback", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.email.trim())   e.email   = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) {
        trackEvent("contact_submit", { category: form.category });
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch { setStatus("error"); }
  };

  if (status === "sent") {
    return (
      <div className="card" style={{ padding: "48px 32px", textAlign: "center" }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "20px" }}>✓</div>
        <p style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-head)", marginBottom: "8px" }}>Message sent!</p>
        <p style={{ fontSize: "15px", color: "var(--text-muted)" }}>I&apos;ll get back to you soon.</p>
      </div>
    );
  }

  const fieldStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    background: "#fff",
    border: `1.5px solid ${errors[field] ? "#ef4444" : "var(--border-mid)"}`,
    borderRadius: "var(--radius-sm)",
    color: "var(--text-body)",
    fontFamily: "var(--font)",
    fontSize: "15px",
    padding: "12px 14px",
    outline: "none",
    transition: "border-color var(--t-fast) ease",
  });

  return (
    <form onSubmit={submit} noValidate style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "560px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {[
          { id: "name",  label: "Name",  type: "text",  placeholder: "Your name"        },
          { id: "email", label: "Email", type: "email", placeholder: "you@example.com"  },
        ].map(({ id, label, type, placeholder }) => (
          <div key={id}>
            <label htmlFor={id} style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--text-head)", marginBottom: "6px" }}>{label}</label>
            <input id={id} type={type} placeholder={placeholder}
              value={form[id as "name" | "email"]}
              onChange={e => setForm(f => ({ ...f, [id]: e.target.value }))}
              style={fieldStyle(id)}
            />
            {errors[id] && <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px" }}>{errors[id]}</p>}
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="category" style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--text-head)", marginBottom: "6px" }}>Category</label>
        <select id="category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
          style={{ ...fieldStyle("category"), WebkitAppearance: "none", cursor: "pointer" }}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="message" style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--text-head)", marginBottom: "6px" }}>
          Message <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>({form.message.length}/1000)</span>
        </label>
        <textarea id="message" rows={6} maxLength={1000} placeholder="What's on your mind?"
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          style={{ ...fieldStyle("message"), resize: "vertical" }}
        />
        {errors.message && <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px" }}>{errors.message}</p>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button type="submit" disabled={status === "sending"} className="btn btn-primary"
          style={{ opacity: status === "sending" ? 0.65 : 1, cursor: status === "sending" ? "not-allowed" : "pointer" }}>
          {status === "sending" ? "Sending\u2026" : "Send Message"}
        </button>
        {status === "error" && <p style={{ fontSize: "13px", color: "#ef4444" }}>Something went wrong. Try again.</p>}
      </div>
    </form>
  );
}
