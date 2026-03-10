"use client";

function parseMarkdown(md) {
  return md
    .split(/\n\n+/)
    .map(block => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("## ")) return `<h2>${inlineMarkdown(trimmed.slice(3))}</h2>`;
      if (trimmed.startsWith("### ")) return `<h3>${inlineMarkdown(trimmed.slice(4))}</h3>`;
      if (trimmed.startsWith("> ")) return `<blockquote>${inlineMarkdown(trimmed.slice(2))}</blockquote>`;
      return `<p>${inlineMarkdown(trimmed.replace(/\n/g, " "))}</p>`;
    })
    .join("\n");
}

function inlineMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

export default function ArticleBody({ content }) {
  const html = parseMarkdown(content);
  return (
    <>
      <style>{`
        .article-body p { margin: 0 0 1.3em; color: var(--t-textBody); line-height: 1.85; font-size: 15px; }
        .article-body h2 { font-size: 18px; font-weight: bold; color: var(--t-textHead); margin: 2em 0 0.7em; border-left: 2px solid var(--t-accent); padding-left: 14px; }
        .article-body h3 { font-size: 14px; font-weight: bold; color: var(--t-accent); margin: 1.6em 0 0.5em; letter-spacing: 0.5px; }
        .article-body a { color: var(--t-accent); text-decoration: underline; }
        .article-body blockquote { border-left: 2px solid var(--t-accentDim); padding-left: 16px; margin: 1.5em 0; color: var(--t-textDim); font-style: italic; }
        .article-body code { background: var(--t-accentFaint); border: 1px solid var(--t-border); padding: 2px 6px; font-size: 13px; color: var(--t-accent); }
      `}</style>
      <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
