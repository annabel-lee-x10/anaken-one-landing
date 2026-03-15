import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  return [
    { url: "https://anaken.one",           lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: "https://anaken.one/articles",   lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: "https://anaken.one/news",       lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: "https://anaken.one/projects",   lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://anaken.one/contact",    lastModified: new Date(), changeFrequency: "yearly",  priority: 0.5 },
    { url: "https://anaken.one/lab",        lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: "https://anaken.one/now",        lastModified: new Date(), changeFrequency: "weekly",  priority: 0.6 },
    ...articles.map(a => ({
      url: `https://anaken.one/articles/${a.slug}`,
      lastModified: new Date(a.date),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
