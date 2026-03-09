import fs from "fs";
import path from "path";
import matter from "gray-matter";

const articlesDir = path.join(process.cwd(), "content/articles");

export function getAllArticles() {
  if (!fs.existsSync(articlesDir)) return [];
  return fs.readdirSync(articlesDir)
    .filter(f => f.endsWith(".md"))
    .map(filename => {
      const raw = fs.readFileSync(path.join(articlesDir, filename), "utf8");
      const { data } = matter(raw);
      return {
        slug: data.slug || filename.replace(".md", ""),
        title: data.title || "Untitled",
        date: data.date || "",
        description: data.description || "",
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getArticleBySlug(slug) {
  const filePath = path.join(articlesDir, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return { frontmatter: data, content };
}
