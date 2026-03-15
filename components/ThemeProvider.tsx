"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface NavigatorUA {
  getHighEntropyValues(hints: string[]): Promise<{ manufacturer?: string; model?: string }>;
}

declare global {
  interface Navigator {
    userAgentData?: NavigatorUA;
  }
}

type Theme = "light" | "dark";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

async function isSamsungDevice(): Promise<boolean> {
  if (typeof navigator === "undefined") return false;

  // Modern Chrome strips device model from UA (UA reduction).
  // Use High Entropy UA Client Hints API to get the real model/manufacturer.
  if (navigator.userAgentData) {
    try {
      const hints = await navigator.userAgentData.getHighEntropyValues(["model", "manufacturer"]);
      const maker = (hints.manufacturer || "").toLowerCase();
      const model = (hints.model || "").toLowerCase();
      if (maker.includes("samsung") || model.startsWith("sm-")) return true;
    } catch { /* denied — fall through to UA sniff */ }
  }

  // Fallback: legacy UA string (Samsung Internet, older Chrome builds)
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes("samsungbrowser") || ua.includes("samsung") || ua.includes("sm-") || ua.includes("gt-");
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initial = stored || preferred;
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);

    // Samsung AMOLED devices get pure black, others get gray tinge
    isSamsungDevice().then((isSamsung) => {
      const displayType = isSamsung ? "amoled" : "lcd";
      document.documentElement.setAttribute("data-display", displayType);
    });

    setMounted(true);
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle: mounted ? toggle : () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}
