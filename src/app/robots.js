export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/private", "/api"],
      },
    ],
    sitemap: "https://immindia.edu.in/sitemap.xml",
  };
}
