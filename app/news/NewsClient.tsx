"use client";
import { useState, useEffect, useCallback } from "react";
import { trackEvent } from "@/lib/analytics";

type NewsItem = {
  title: string;
  summary: string;
  source: string;
  url: string;
  date: string;
};

type NewsResponse = {
  items: NewsItem[];
  source: "api" | "rss" | "fallback";
};

const SOURCE_LABELS: Record<string, string> = {
  api: "via newsdata.io",
  rss: "via RSS feeds",
  fallback: "cached headlines",
};

export default function NewsClient() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [dataSource, setDataSource] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error("fetch failed");
      const data: NewsResponse = await res.json();
      setNews(data.items ?? []);
      setDataSource(SOURCE_LABELS[data.source] ?? "");
    } catch {
      setNews([]);
      setDataSource("unavailable");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
        <div style={{
          width: "28px", height: "28px",
          border: "3px solid var(--border-mid)",
          borderTopColor: "var(--text-head)",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }} />
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="card" style={{ padding: "48px 32px", textAlign: "center" }}>
        <p style={{ fontSize: "17px", fontWeight: 600, color: "var(--text-head)", marginBottom: "8px" }}>No news available</p>
        <p style={{ fontSize: "15px", color: "var(--text-muted)" }}>Check back soon.</p>
      </div>
    );
  }

  return (
    <div>
      {dataSource && (
        <div style={{ marginBottom: "24px" }}>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{dataSource}</span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "12px" }}>
        {news.map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card card-hover"
            onClick={() => trackEvent("news_click", { article_title: item.title, source: item.source, link_url: item.url })}
            style={{
              display: "flex", flexDirection: "column",
              padding: "28px 24px", textDecoration: "none",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
                <span style={{
                  fontSize: "12px", fontWeight: 600, color: "var(--accent)",
                  background: "#EEF4FF", padding: "3px 10px", borderRadius: "20px",
                  letterSpacing: "0.04em", textTransform: "uppercase", flexShrink: 0,
                }}>
                  {item.source}
                </span>
                {item.date && (
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", flexShrink: 0 }}>{item.date}</span>
                )}
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: 600, color: "var(--text-head)", letterSpacing: "-0.02em", marginBottom: "8px", lineHeight: 1.35 }}>
                {item.title}
              </h3>
              {item.summary && (
                <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6 }}>
                  {item.summary.slice(0, 150)}{item.summary.length > 150 ? "\u2026" : ""}
                </p>
              )}
            </div>
            <p style={{ marginTop: "16px", fontSize: "13px", color: "var(--accent)", fontWeight: 500 }}>Read more &rarr;</p>
          </a>
        ))}
      </div>
    </div>
  );
}
