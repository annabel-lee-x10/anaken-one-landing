import { getAllArticles } from "@/lib/articles";

export default function sitemap() {
  const articles = getAllArticles();
  const articleUrls = articles.map(a => ({
    url: `https://anaken.one/articles/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    { url: "https://anaken.one", lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: "https://anaken.one/articles", lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    ...articleUrls,
  ];
}
