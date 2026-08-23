import type { Metadata } from "next";
import Image from "next/image";
import { canonicalIssues } from "@/lib/publications";

const siteUrl = "https://www.omnexagoc.com";

export const metadata: Metadata = {
  title: "Official Media & Brand Assets",
  description:
    "Official OMNeXa Pte. Ltd. logo, founder photograph, brand assets, publication visuals and education-focused media coverage featuring founder Dhiraj Kumar.",
  alternates: { canonical: "/media" },
  openGraph: {
    title: "Official OMNeXa Media & Brand Assets",
    description:
      "Official visual assets and accurate identity guidance for OMNeXa Pte. Ltd. and founder Dhiraj Kumar.",
    url: `${siteUrl}/media`,
    type: "website",
    images: [
      {
        url: "/omnexa-driver-home.jpg",
        width: 1254,
        height: 1254,
        alt: "OMNeXa visual representing human capability, artificial intelligence and robotics guided by human values"
      }
    ]
  }
};

const brandAssets = [
  {
    name: "Dhiraj Kumar — official founder portrait",
    src: "/dhiraj-founder.png",
    width: 1254,
    height: 1254,
    alt: "Dhiraj Kumar, Founder and CEO of OMNeXa Pte. Ltd. in Singapore",
    caption: "Dhiraj Kumar, Founder & CEO, OMNeXa Pte. Ltd., Singapore",
    downloadName: "dhiraj-founder.png"
  },
  {
    name: "OMNeXa — official logo",
    src: "/omnexa-logo.png",
    width: 1522,
    height: 852,
    alt: "Official OMNeXa Pte. Ltd. logo",
    caption: "OMNeXa Pte. Ltd. — Where Consciousness Meets Intelligence",
    downloadName: "omnexa-logo.png"
  },
  {
    name: "OMNeXa — official brand mark",
    src: "/omnexa-mark.svg",
    width: 512,
    height: 512,
    alt: "Official OMNeXa brand mark",
    caption: "OMNeXa official brand mark",
    downloadName: "omnexa-mark.svg",
    unoptimized: true
  },
  {
    name: "OMNeXa — human capability and intelligent technology",
    src: "/omnexa-driver-home.jpg",
    width: 1254,
    height: 1254,
    alt: "OMNeXa visual representing human capability, artificial intelligence and robotics guided by human values",
    caption:
      "OMNeXa visual representing human capability, artificial intelligence and robotics guided by human values",
    downloadName: "omnexa-driver-home.jpg"
  }
];

const educationVideos = [
  {
    id: "AAXIhhUcIXw",
    title: "Future Plus Education festival — media coverage",
    sourceTitle: "ଫ୍ୟୁଚର ପ୍ଲସ ଏଜୁକେଶନ ର ଶିକ୍ଷା ମହୋତ୍ସବ",
    description:
      "Odia media coverage of the Future Plus Education festival and its focus on education, career awareness and community participation in Rourkela.",
    youtubeUrl: "https://www.youtube.com/watch?v=AAXIhhUcIXw"
  },
  {
    id: "4zQucrg7mc4",
    title: "Future Plus career-guidance event in Rourkela",
    sourceTitle: "राउरकेला में फ्यूचर प्लस एजुकेशन का भव्य करियर गाइडेंस इवेंट",
    description:
      "Hindi media coverage of the Future Plus Education career-guidance event in Rourkela, including Dhiraj Kumar’s participation and education-focused outreach.",
    youtubeUrl: "https://www.youtube.com/watch?v=4zQucrg7mc4"
  }
];

const imageObjects = [
  ...brandAssets.map((asset) => ({
    "@type": "ImageObject",
    name: asset.name,
    contentUrl: `${siteUrl}${asset.src}`,
    url: `${siteUrl}${asset.src}`,
    width: asset.width,
    height: asset.height,
    caption: asset.caption
  })),
  ...canonicalIssues.map((issue) => ({
    "@type": "ImageObject",
    name: `${issue.title} — ${issue.issue}`,
    contentUrl: `${siteUrl}/convergence-brief/${issue.slug}/opengraph-image`,
    url: `${siteUrl}/convergence-brief/${issue.slug}/opengraph-image`,
    width: 1200,
    height: 630,
    caption: `${issue.title} — ${issue.issue} of The Convergence Brief by OMNeXa`
  }))
];

const mediaSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${siteUrl}/media#collection`,
  url: `${siteUrl}/media`,
  name: "Official OMNeXa Media & Brand Assets",
  description:
    "Official images, video coverage and identity guidance for OMNeXa Pte. Ltd. and founder Dhiraj Kumar.",
  isPartOf: { "@id": `${siteUrl}/#website` },
  about: { "@id": `${siteUrl}/#organization` },
  primaryImageOfPage: { "@id": `${siteUrl}/#primary-image` },
  hasPart: imageObjects,
  inLanguage: "en-SG",
  dateModified: "2026-08-23"
};

export default function MediaPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mediaSchema) }}
      />

      <section className="page-hero section-shell aligned-section">
        <p className="eyebrow">Official visual source</p>
        <h1>OMNeXa media and brand assets.</h1>
        <p>
          Use these assets when referring to OMNeXa Pte. Ltd. or its founder. The captions below preserve
          the correct company identity, name spelling and relationship between Dhiraj Kumar and OMNeXa.
        </p>
      </section>

      <section className="section-shell media-guidance aligned-section">
        <div>
          <p className="eyebrow">Accurate naming</p>
          <h2>Keep the entity signals consistent.</h2>
        </div>
        <dl>
          <div><dt>Legal entity</dt><dd>OMNeXa Pte. Ltd.</dd></div>
          <div><dt>Brand</dt><dd>OMNeXa</dd></div>
          <div><dt>Founder</dt><dd>Dhiraj Kumar</dd></div>
          <div><dt>Location</dt><dd>Singapore</dd></div>
          <div><dt>Tagline</dt><dd>Where Consciousness Meets Intelligence</dd></div>
        </dl>
      </section>

      <section className="band">
        <div className="section-shell aligned-section">
          <div className="section-heading">
            <p className="eyebrow">Core assets</p>
            <h2>Founder, logo and brand visuals.</h2>
            <p>Each image is presented beside descriptive, reusable caption text.</p>
          </div>
          <div className="media-grid">
            {brandAssets.map((asset) => (
              <figure className="media-card" key={asset.src}>
                <div className="media-image-wrap">
                  <Image
                    src={asset.src}
                    alt={asset.alt}
                    width={asset.width}
                    height={asset.height}
                    sizes="(max-width: 720px) 100vw, 50vw"
                    unoptimized={asset.unoptimized}
                  />
                </div>
                <figcaption>
                  <strong>{asset.name}</strong>
                  <span>{asset.caption}</span>
                  <a href={asset.src} download={asset.downloadName}>Download asset</a>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell aligned-section preview-section">
        <div className="section-heading">
          <p className="eyebrow">Editorial visuals</p>
          <h2>The Convergence Brief.</h2>
          <p>Each issue has a distinct, indexable editorial image and a dedicated article landing page.</p>
        </div>
        <div className="media-grid editorial-media-grid">
          {canonicalIssues.map((issue) => {
            const imageUrl = `/convergence-brief/${issue.slug}/opengraph-image`;
            return (
              <figure className="media-card" key={issue.slug}>
                <div className="media-image-wrap editorial-image-wrap">
                  <Image
                    src={imageUrl}
                    alt={`${issue.title} — ${issue.issue} of The Convergence Brief by OMNeXa`}
                    width={1200}
                    height={630}
                    sizes="(max-width: 720px) 100vw, 50vw"
                    unoptimized
                  />
                </div>
                <figcaption>
                  <strong>{issue.title}</strong>
                  <span>{issue.issue} · The Convergence Brief · OMNeXa Pte. Ltd.</span>
                  <a href={`/convergence-brief/${issue.slug}`}>Open issue page</a>
                  <a href={imageUrl} download={`${issue.slug}-the-convergence-brief.png`}>Download editorial image</a>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </section>

      <section className="band education-media-section">
        <div className="section-shell aligned-section">
          <div className="section-heading education-media-heading">
            <p className="eyebrow">Education and community media</p>
            <h2>Future Plus event highlights.</h2>
            <p>
              Dhiraj Kumar, Founder &amp; CEO of OMNeXa Pte. Ltd., participated in Future Plus Education’s
              outreach in Rourkela and spoke with media about education, career guidance and related social
              challenges. OMNeXa supported the campaign strategy, marketing and digital communications
              surrounding the event.
            </p>
            <p className="education-media-credit">
              Future Plus community moments and event communications — created, marketed and powered by OMNeXa.
            </p>
          </div>

          <div className="video-media-grid">
            {educationVideos.map((video) => (
              <article className="video-media-card" key={video.id}>
                <div className="video-frame">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                    title={video.title}
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className="video-media-copy">
                  <p className="publication-meta">Independent media coverage</p>
                  <h3>{video.title}</h3>
                  <p>{video.description}</p>
                  <span>{video.sourceTitle}</span>
                  <a href={video.youtubeUrl} target="_blank" rel="noreferrer">Watch on YouTube</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell split-section aligned-section">
        <div>
          <p className="eyebrow">Usage note</p>
          <h2>Use the assets accurately and in context.</h2>
        </div>
        <div className="copy-stack">
          <p>
            Do not imply an endorsement, partnership or client relationship that OMNeXa has not confirmed.
            Do not alter the founder’s identity or use the assets to represent unrelated companies using a
            similar name.
          </p>
          <p>
            For media, event or partnership enquiries, contact OMNeXa before publication if additional
            permissions, formats or context are required.
          </p>
          <a href="/contact">Contact OMNeXa</a>
        </div>
      </section>
    </main>
  );
}
