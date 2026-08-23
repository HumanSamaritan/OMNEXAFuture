import type { MetadataRoute } from "next";

const siteUrl = "https://www.omnexagoc.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/knowledge", priority: 1.0, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/ai-readiness", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/humans-defining-the-loop", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/robotics-with-human-values", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/convergence-brief", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/services", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/portfolio", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.6, changeFrequency: "monthly" as const }
  ];

  const lastModified = new Date();

  return pages.map((page) => ({
    url: `${siteUrl}${page.path}`,
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority
  }));
}
