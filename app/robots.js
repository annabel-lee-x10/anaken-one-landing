export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://anaken.one/sitemap.xml",
    host: "https://anaken.one",
  };
}
