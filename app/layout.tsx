import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import Analytics from "@/components/Analytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Anaken", template: "%s — Anaken" },
  description: "ideate. innovate. iterate. — Exploring workflows, AI tooling, and systems optimization.",
  metadataBase: new URL("https://anaken.one"),
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "https://anaken.one",
    title: "Anaken",
    description: "ideate. innovate. iterate. — Workflows, AI tools, and optimization.",
    siteName: "Anaken",
  },
  twitter: { card: "summary", title: "Anaken", description: "ideate. innovate. iterate. — Workflows, AI tools, and optimization." },
  alternates: { canonical: "https://anaken.one" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ThemeProvider>
          <Analytics />
          <VercelAnalytics />
          <Nav />
          <main style={{ paddingTop: "60px" }}>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
