type EventMap = {
  section_view: { section_name: string; page_path: string };
  nav_click: { link_label: string; link_url: string; from_page: string };
  contact_submit: { category: string };
  share_click: { method: string; article_slug: string };
  project_select: { project_name: string; project_id: string };
  project_visit: { project_name: string; project_url: string };
  news_click: { article_title: string; source: string; link_url: string };
};

export function trackEvent<K extends keyof EventMap>(name: K, params: EventMap[K]) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}
