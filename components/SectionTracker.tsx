"use client";
import { useEffect, useRef } from "react";

export default function SectionTracker({ name, children }: { name: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const tracked = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !tracked.current) {
          tracked.current = true;
          if (typeof window.gtag === "function") {
            window.gtag("event", "section_view", {
              section_name: name,
              page_path: window.location.pathname,
            });
          }
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [name]);

  return <div ref={ref}>{children}</div>;
}
