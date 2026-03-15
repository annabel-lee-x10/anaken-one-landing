"use client";
import { useState, useRef, useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const slug = url.split("/articles/")[1] || url;
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [open]);

  const shareButton: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: "34px",
    padding: "0 14px",
    background: "var(--bg-btn-sec)",
    border: "1px solid var(--border-mid)",
    borderRadius: "var(--radius)",
    color: "var(--text-muted)",
    fontSize: "13px",
    fontWeight: 500,
    fontFamily: "var(--font)",
    cursor: "pointer",
    transition: "background var(--t-fast) ease, color var(--t-fast) ease, border-color var(--t-fast) ease",
  };

  const shareItem: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "10px 14px",
    fontSize: "13px",
    fontWeight: 500,
    fontFamily: "var(--font)",
    color: "var(--text-head)",
    cursor: "pointer",
    transition: "background var(--t-fast) ease, color var(--t-fast) ease",
    textDecoration: "none",
    border: "none",
    background: "transparent",
    width: "100%",
    textAlign: "left",
  };

  const popoverStyle: React.CSSProperties = {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: "0",
    background: "var(--bg-card)",
    border: "1px solid var(--border-mid)",
    borderRadius: "var(--radius)",
    boxShadow: "var(--shadow-lift)",
    zIndex: 1000,
    minWidth: "140px",
    overflow: "hidden",
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    trackEvent("share_click", { method: "copy_link", article_slug: slug });
    setTimeout(() => setCopied(false), 2000);
    setOpen(false);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        style={shareButton}
        onMouseEnter={(e) => {
          if (!open) {
            e.currentTarget.style.background = "var(--bg-btn-sec)";
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.color = "var(--text-head)";
          }
        }}
        onMouseLeave={(e) => {
          if (!open) {
            e.currentTarget.style.background = "var(--bg-btn-sec)";
            e.currentTarget.style.borderColor = "var(--border-mid)";
            e.currentTarget.style.color = "var(--text-muted)";
          }
        }}
      >
        Share
      </button>

      {open && (
        <div ref={popoverRef} style={popoverStyle}>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={shareItem}
            onClick={() => trackEvent("share_click", { method: "twitter", article_slug: slug })}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-btn-sec)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            𝕏 Twitter
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={shareItem}
            onClick={() => trackEvent("share_click", { method: "linkedin", article_slug: slug })}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-btn-sec)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            in LinkedIn
          </a>
          <button
            onClick={handleCopyLink}
            style={shareItem}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-btn-sec)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            {copied ? "✓ Copied" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}
