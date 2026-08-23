import { canonicalIssues } from "@/lib/publications";

const siteUrl = "https://www.omnexagoc.com";

const entries = [
  {
    page: `${siteUrl}/`,
    images: [`${siteUrl}/omnexa-driver-home.jpg`, `${siteUrl}/omnexa-logo.png`]
  },
  {
    page: `${siteUrl}/about`,
    images: [`${siteUrl}/omnexa-driver-home.jpg`, `${siteUrl}/omnexa-logo.png`]
  },
  {
    page: `${siteUrl}/dhiraj-kumar`,
    images: [`${siteUrl}/dhiraj-founder.png`]
  },
  {
    page: `${siteUrl}/media`,
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
  ...canonicalIssues.map((issue) => ({
    page: `${siteUrl}/convergence-brief/${issue.slug}`,
    images: [`${siteUrl}/convergence-brief/${issue.slug}/opengraph-image`]
  }))
];

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const urls = entries
    .map(
      ({ page, images }) => `  <url>
    <loc>${escapeXml(page)}</loc>
${images
  .map(
    (image) => `    <image:image>
      <image:loc>${escapeXml(image)}</image:loc>
    </image:image>`
  )
  .join("\n")}
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400"
    }
  });
}
