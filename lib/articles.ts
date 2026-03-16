import fs from "fs";
import path from "path";
import matter from "gray-matter";

const articlesDir = path.join(process.cwd(), "content", "articles");

export type ArticleMeta = {
  slug: string;
  title: string;
  date: string;
  description: string;
  publishDate?: string;
};

function isPublished(publishDate?: string): boolean {
  if (!publishDate) return true;
  return new Date(publishDate) <= new Date();
}

export function getAllArticles(): ArticleMeta[] {
  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith(".md"));
  const articles = files.map(file => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(articlesDir, file), "utf-8");
    const { data } = matter(raw);
    const publishDate = (data.publishDate as string) || undefined;
    return {
      slug,
      title: (data.title as string) || slug,
      date: publishDate || (data.date as string) || "",
      description: (data.description as string) || "",
      publishDate,
    };
  });
  return articles
    .filter(a => isPublished(a.publishDate))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getArticleBySlug(slug: string) {
  const filePath = path.join(articlesDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) throw new Error(`Article not found: ${slug}`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  if (!isPublished(data.publishDate as string | undefined)) {
    throw new Error(`Article not found: ${slug}`);
  }
  return {
    frontmatter: {
      ...data,
      title: (data.title as string) || slug,
      date: (data.publishDate as string) || (data.date as string) || "",
      description: (data.description as string) || "",
    },
    content,
  };
}
