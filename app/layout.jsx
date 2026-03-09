export const metadata = {
  title: "Anaken",
  description: "Ageless hobbyist. Workflows, tools, and AI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-9MV11ZZK39" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-9MV11ZZK39');
            `,
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#080c0f" }}>
        {children}
      </body>
    </html>
  );
}
