export const metadata = {
  title: { default: "Anaken", template: "%s — Anaken" },
  description: "Ageless hobbyist. I love learning workflows and processes — then taking them apart to make them faster, leaner, and smarter.",
  metadataBase: new URL("https://anaken.one"),
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: "website",
    url: "https://anaken.one",
    title: "Anaken",
    description: "Ageless hobbyist. Workflows, tools, and AI.",
    siteName: "Anaken",
  },
  twitter: {
    card: "summary",
    title: "Anaken",
    description: "Ageless hobbyist. Workflows, tools, and AI.",
  },
  alternates: { canonical: "https://anaken.one" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-9MV11ZZK39" />
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-9MV11ZZK39');` }} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#080c0f" }}>
        {children}
      </body>
    </html>
  );
}
