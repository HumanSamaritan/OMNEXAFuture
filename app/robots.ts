import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: [
      "https://www.omnexagoc.com/sitemap.xml",
      "https://www.omnexagoc.com/image-sitemap.xml"
    ],
    host: "https://www.omnexagoc.com"
  };
}
