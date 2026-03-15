import Link from "next/link";

const LINKS = [
  { href: "/articles", label: "Articles", color: "#3B8CF5" },
  { href: "/news",     label: "News",     color: "#EF5B4B" },
  { href: "/projects", label: "Projects", color: "#F5B731" },
  { href: "/lab",      label: "Lab",      color: "#3BD66B" },
  { href: "/now",      label: "Now",      color: "#5BB8F5" },
  { href: "/contact",  label: "Contact",  color: "#FF5310" },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg-alt)" }}>
      {/* Gradient top border */}
      <div style={{ height: "2px", background: "linear-gradient(90deg, #3B8CF5, #EF5B4B, #F5B731, #3BD66B)" }} />

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
          {[LINKS.slice(0, 4), LINKS.slice(4)].map((group, gi) => (
            <div key={gi} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {group.map(({ href, label, color }) => (
                <Link key={href} href={href} style={{ fontSize: "14px", color, textDecoration: "none" }}>{label}</Link>
              ))}
            </div>
          ))}
        </nav>
      </div>
      <div style={{ borderTop: "1px solid var(--border-mid)" }}>
        <div className="container" style={{ padding: "18px 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>&copy; {new Date().getFullYear()} Anaken</p>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>u18181188</p>
        </div>
      </div>
    </footer>
  );
}
