import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import Analytics from "@/components/Analytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Anaken", template: "%s — Anaken" },
  description: "Ageless hobbyist. I love learning workflows and processes — then taking them apart to make them faster, leaner, and smarter.",
  metadataBase: new URL("https://anaken.one"),
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "https://anaken.one",
    title: "Anaken",
    description: "Ageless hobbyist. Workflows, tools, and AI.",
    siteName: "Anaken",
  },
  twitter: { card: "summary", title: "Anaken", description: "Ageless hobbyist. Workflows, tools, and AI." },
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
