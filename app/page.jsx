import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import ClientApp from "./ClientApp";

export const metadata = {
  title: "Anaken — Workflows, Tools & AI",
  description: "Ageless hobbyist. I love learning workflows and processes — then taking them apart to make them faster, leaner, and smarter.",
  alternates: { canonical: "https://anaken.one" },
  openGraph: {
    title: "Anaken — Workflows, Tools & AI",
    description: "Ageless hobbyist. Workflows, tools, and AI.",
    url: "https://anaken.one",
  },
};

export default function Page() {
  const articleMeta = getAllArticles();
  const articles = articleMeta.map(meta => {
    try {
      const { frontmatter, content } = getArticleBySlug(meta.slug);
      const contentBlocks = content.split("\n").reduce((acc, line) => {
        if (line.startsWith("### ")) return [...acc, { type:"h3", text:line.slice(4).trim() }];
        if (line.startsWith("## "))  return [...acc, { type:"h2", text:line.slice(3).trim() }];
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) return [...acc, { type:"p", text:trimmed }];
        return acc;
      }, []);
      return {
        slug: meta.slug,
        title: frontmatter.title || meta.title,
        date: frontmatter.date || meta.date,
        description: frontmatter.description || meta.description,
        contentBlocks,
      };
    } catch {
      return { ...meta, contentBlocks:[] };
    }
  });

  return (
    <>
      {/* SSR content for crawlers — hidden visually, readable by search engines */}
      <div aria-hidden="true" style={{ position:"absolute", width:"1px", height:"1px", overflow:"hidden", opacity:0, pointerEvents:"none" }}>
        <h1>Anaken / u18181188</h1>
        <p>Ageless hobbyist. I love learning workflows and processes — then taking them apart to make them faster, leaner, and smarter.</p>
        <h2>Projects</h2>
        <ul>
          <li><a href="https://aifactchecker.anaken.one/">AI Fact-Check Engine — Verify AI-generated claims in real time.</a></li>
          <li><a href="https://promptvault.anaken.one/">promptVault — Your personal prompt engineering HQ.</a></li>
          <li><a href="https://space-commanders-classic.anaken.one/">Space Commanders — Classic arcade shooter, rebuilt for the browser.</a></li>
          <li><a href="https://simple-snake.anaken.one/">Simple Snake — Classic snake game, built with you.</a></li>
        </ul>
        <h2>Articles</h2>
        <ul>
          {articles.map(a => (
            <li key={a.slug}><a href={`/articles/${a.slug}`}>{a.title} — {a.description}</a></li>
          ))}
        </ul>
      </div>
      <ClientApp articles={articles} />
    </>
  );
}
