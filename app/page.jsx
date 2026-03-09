import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import ClientApp from "./ClientApp";

export default function Page() {
  // Load all articles + their content at build time — passed as props to client SPA
  const articleMeta = getAllArticles();
  const articles = articleMeta.map(meta => {
    try {
      const { frontmatter, content } = getArticleBySlug(meta.slug);
      // Convert markdown to simple content blocks for the SPA renderer
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

  return <ClientApp articles={articles} />;
}
