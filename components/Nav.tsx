"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

const LINKS = [
  { href: "/articles", label: "Articles" },
  { href: "/news",     label: "News"     },
  { href: "/projects", label: "Projects" },
  { href: "/lab",      label: "Lab"      },
  { href: "/now",      label: "Now"      },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0,
        height: "60px", zIndex: 200,
        display: "flex", alignItems: "center",
        background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border-mid)" : "1px solid transparent",
        transition: "background 200ms ease, border-color 200ms ease",
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          {/* Logo */}
          <Link href="/" onClick={() => trackEvent("nav_click", { link_label: "Anaken", link_url: "/", from_page: pathname })} style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-head)", letterSpacing: "-0.04em", textDecoration: "none" }}>
            Anaken
          </Link>

          {/* Desktop links */}
          <nav className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {LINKS.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => trackEvent("nav_click", { link_label: label, link_url: href, from_page: pathname })} style={{
                fontSize: "15px", fontWeight: 500,
                color: isActive(href) ? "var(--text-head)" : "var(--text-muted)",
                padding: "6px 12px", borderRadius: "8px",
                textDecoration: "none",
                transition: "color var(--t-fast) ease, background var(--t-fast) ease",
                background: isActive(href) ? "var(--bg-alt)" : "transparent",
              }}>{label}</Link>
            ))}
          </nav>

          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Link href="/contact" onClick={() => trackEvent("nav_click", { link_label: "Contact", link_url: "/contact", from_page: pathname })} className="btn btn-primary btn-sm" style={{ textDecoration: "none" }}>
              Contact
            </Link>
            {/* Hamburger */}
            <button
              className="hamburger"
              onClick={() => setOpen(o => !o)}
              aria-label="Menu"
              style={{
                display: "none", background: "none", border: "none",
                cursor: "pointer", padding: "6px", color: "var(--text-head)",
                fontSize: "20px", lineHeight: 1,
              }}
            >
              {open ? "\u2715" : "\u2630"}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {open && (
        <div style={{
          position: "fixed", top: "60px", left: 0, right: 0, bottom: 0,
          background: "var(--bg)", zIndex: 199,
          display: "flex", flexDirection: "column", padding: "24px 1.5rem",
          gap: "4px",
        }}>
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => trackEvent("nav_click", { link_label: label, link_url: href, from_page: pathname })} style={{
              fontSize: "20px", fontWeight: 500,
              color: isActive(href) ? "var(--text-head)" : "var(--text-body)",
              padding: "14px 0",
              textDecoration: "none",
              borderBottom: "1px solid var(--border)",
            }}>{label}</Link>
          ))}
          <Link href="/contact" onClick={() => trackEvent("nav_click", { link_label: "Contact", link_url: "/contact", from_page: pathname })} className="btn btn-primary" style={{ marginTop: "24px", textDecoration: "none", justifyContent: "center" }}>
            Contact
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 720px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
