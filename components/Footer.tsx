import Link from "next/link";

const EXPLORE = [
  { href: "/articles", label: "Articles" },
  { href: "/news",     label: "News" },
  { href: "/projects", label: "Projects" },
  { href: "/lab",      label: "Lab" },
];

const CONNECT = [
  { href: "/now",     label: "Now" },
  { href: "/contact", label: "Contact" },
];

const columnHeaderStyle: React.CSSProperties = {
  color: "var(--text-head)",
  fontWeight: 600,
  fontSize: "13px",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: "14px",
};

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
      <div style={{ height: "2px", background: "linear-gradient(90deg, #3366FF, #FF3355, #FFCC00, #00CC66)" }} />

      <div className="container" style={{ padding: "52px 1.5rem 44px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "32px" }}>
        <div>
          <Link href="/" className="gradient-text" style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.04em", textDecoration: "none", display: "block", marginBottom: "10px" }}>
            Anaken
          </Link>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", maxWidth: "240px", lineHeight: 1.65 }}>
            ideate. innovate. iterate.
          </p>
        </div>
        <nav style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p style={columnHeaderStyle}>Explore</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {EXPLORE.map(({ href, label }) => (
                <Link key={href} href={href} className="footer-link">{label}</Link>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p style={columnHeaderStyle}>Connect</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {CONNECT.map(({ href, label }) => (
                <Link key={href} href={href} className="footer-link">{label}</Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
      <div style={{ borderTop: "1px solid var(--border-mid)" }}>
        <div className="container" style={{ padding: "18px 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>&copy; {new Date().getFullYear()} Anaken</p>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", cursor: "default" }} title="you can call me a10101100 if you wished">u18181188</p>
        </div>
      </div>
    </footer>
  );
}
