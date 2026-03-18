import Link from "next/link";

const LINKS = [
  { href: "/work",     label: "Work" },
  { href: "/articles", label: "Writing" },
  { href: "/now",      label: "About" },
  { href: "/contact",  label: "Contact" },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg-alt)" }}>
      <style>{`
        .footer-link {
          font-size: 14px;
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .footer-link:hover {
          color: var(--text-body);
        }
      `}</style>

      {/* Gradient top border */}
      <div style={{ height: "2px", background: "linear-gradient(90deg, #3366FF, #6644CC, #FF3355)" }} />

      <div className="container" style={{ padding: "52px 1.5rem 44px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "32px" }}>
        <div>
          <Link href="/" className="gradient-text" style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.04em", textDecoration: "none", display: "block", marginBottom: "10px" }}>
            Anaken
          </Link>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", maxWidth: "280px", lineHeight: 1.6 }}>
            Building at the intersection of AI tooling and creative technology.
          </p>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className="footer-link">{label}</Link>
          ))}
        </nav>
      </div>
      <div style={{ borderTop: "1px solid var(--border-mid)" }}>
        <div className="container" style={{ padding: "18px 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>&copy; {new Date().getFullYear()} Anaken</p>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", cursor: "default" }} title="a10101100 — where it started">a10101100</p>
        </div>
      </div>
    </footer>
  );
}
