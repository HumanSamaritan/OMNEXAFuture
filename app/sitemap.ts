import type { MetadataRoute } from "next";
import { canonicalIssues } from "@/lib/publications";
import { products } from "@/lib/product-data";

const siteUrl = "https://www.omnexagoc.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    {
      path: "",
      priority: 1.0,
      changeFrequency: "weekly" as const,
      images: [`${siteUrl}/omnexa-driver-home.jpg`, `${siteUrl}/omnexa-logo.png`]
    },
    {
      path: "/knowledge",
      priority: 1.0,
      changeFrequency: "weekly" as const,
      images: [`${siteUrl}/omnexa-driver-home.jpg`]
    },
    { path: "/ovia", priority: 0.95, changeFrequency: "monthly" as const, images: [] },
    {
      path: "/about",
      priority: 0.95,
      changeFrequency: "monthly" as const,
      images: [`${siteUrl}/omnexa-driver-home.jpg`, `${siteUrl}/omnexa-logo.png`]
    },
    {
      path: "/dhiraj-kumar",
      priority: 0.95,
      changeFrequency: "monthly" as const,
      images: [`${siteUrl}/dhiraj-founder.png`]
    },
    {
      path: "/media",
      priority: 0.9,
      changeFrequency: "monthly" as const,
      images: [
        `${siteUrl}/dhiraj-founder.png`,
        `${siteUrl}/omnexa-logo.png`,
        `${siteUrl}/omnexa-mark.svg`,
        `${siteUrl}/omnexa-driver-home.jpg`,
        ...canonicalIssues.map(
          (issue) => `${siteUrl}/convergence-brief/${issue.slug}/opengraph-image`
        )
      ]
    },
    { path: "/ai-readiness", priority: 0.9, changeFrequency: "monthly" as const, images: [] },
    { path: "/humans-defining-the-loop", priority: 0.9, changeFrequency: "monthly" as const, images: [] },
    { path: "/robotics-with-human-values", priority: 0.9, changeFrequency: "monthly" as const, images: [] },
    { path: "/convergence-brief", priority: 0.95, changeFrequency: "weekly" as const, images: [] },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" as const, images: [] },
    { path: "/work", priority: 0.95, changeFrequency: "weekly" as const, images: [`${siteUrl}/omnexa-driver-home.jpg`] },
    { path: "/contact", priority: 0.6, changeFrequency: "monthly" as const, images: [] }
  ];

  const siteLastModified = new Date("2026-09-09T00:00:00Z");

  const issuePages = canonicalIssues.map((issue) => ({
    url: `${siteUrl}/convergence-brief/${issue.slug}`,
    lastModified: issue.publishedAt ? new Date(`${issue.publishedAt}T00:00:00Z`) : siteLastModified,
    changeFrequency: "monthly" as const,
    priority: issue.slug === "issue-04" ? 0.95 : issue.slug === "issue-03" ? 0.9 : 0.85,
    images: [`${siteUrl}/convergence-brief/${issue.slug}/opengraph-image`]
  }));

  const productPages = products.map((product) => ({
    url: `${siteUrl}/work/${product.slug}`,
    lastModified: siteLastModified,
    changeFrequency: "weekly" as const,
    priority: product.slug === "human-machine-sadhana" ? 0.95 : 0.85,
    images: [`${siteUrl}/omnexa-driver-home.jpg`]
  }));

  return [
    ...pages.map((page) => ({
      url: `${siteUrl}${page.path}`,
      lastModified: siteLastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      images: page.images
    })),
    ...issuePages,
    ...productPages
  ];
}
