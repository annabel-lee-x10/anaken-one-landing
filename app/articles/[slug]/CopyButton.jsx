"use client";
import { useState } from "react";

export default function CopyButton({ url }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      style={{
        background: "rgba(0,200,120,0.08)",
        border: "1px solid rgba(0,200,120,0.2)",
        color: "rgba(0,200,120,0.7)",
        padding: "5px 12px",
        fontSize: "10px",
        letterSpacing: "1px",
        cursor: "pointer",
        fontFamily: "'Courier New',monospace",
      }}>
      {copied ? "✓ COPIED" : "⎘ COPY"}
    </button>
  );
}
