import Link from "next/link";

const LINKS = [
  { href: "/articles", label: "Articles" },
  { href: "/news",     label: "News"     },
  { href: "/projects", label: "Projects" },
  { href: "/lab",      label: "Lab"      },
  { href: "/now",      label: "Now"      },
  { href: "/contact",  label: "Contact"  },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg-alt)", borderTop: "1px solid var(--border-mid)" }}>
      <div className="container" style={{ padding: "52px 1.5rem 44px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "32px" }}>
        <div>
          <Link href="/" style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-head)", letterSpacing: "-0.04em", textDecoration: "none", display: "block", marginBottom: "10px" }}>
            Anaken
          </Link>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", maxWidth: "240px", lineHeight: 1.65 }}>
            Ageless hobbyist. Workflows, tools, and AI.
          </p>
        </div>
        <nav style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
          {[LINKS.slice(0, 4), LINKS.slice(4)].map((group, gi) => (
            <div key={gi} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {group.map(({ href, label }) => (
                <Link key={href} href={href} style={{ fontSize: "14px", color: "var(--text-muted)", textDecoration: "none" }}>{label}</Link>
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
