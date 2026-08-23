import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import "./globals.css";
import "./professional.css";
import "./refinement.css";

const siteUrl = "https://www.omnexagoc.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "OMNeXa Pte. Ltd. | Where Consciousness Meets Intelligence",
    template: "%s | OMNeXa Pte. Ltd."
  },
  description:
    "OMNeXa Pte. Ltd. is a Singapore-based transformation and innovation ecosystem founded by Dhiraj Kumar, focused on responsible AI, human-defined automation, robotics with human values, risk and governance, education, sustainability and well-being.",
  applicationName: "OMNeXa Pte. Ltd.",
  creator: "OMNeXa Pte. Ltd.",
  publisher: "OMNeXa Pte. Ltd.",
  openGraph: {
    title: "OMNeXa Pte. Ltd. | Where Consciousness Meets Intelligence",
    description:
      "Human-defined AI, robotics with human values, risk and governance, education, sustainability and conscious transformation.",
    url: siteUrl,
    siteName: "OMNeXa Pte. Ltd.",
    type: "website",
    locale: "en_SG",
    images: [
      {
        url: "/omnexa-driver-home.jpg",
        width: 1254,
        height: 1254,
        alt: "OMNeXa visual representing human capability, artificial intelligence and robotics guided by human values"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "OMNeXa Pte. Ltd. | Where Consciousness Meets Intelligence",
    description:
      "Human-defined AI, robotics with human values, risk and governance, education, sustainability and conscious transformation.",
    images: ["/omnexa-driver-home.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

const entityGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "OMNeXa Pte. Ltd.",
      legalName: "OMNeXa Pte. Ltd.",
      alternateName: ["OMNeXa"],
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        "@id": `${siteUrl}/#logo`,
        url: `${siteUrl}/omnexa-logo.png`,
        contentUrl: `${siteUrl}/omnexa-logo.png`,
        width: 1522,
        height: 852,
        caption: "OMNeXa Pte. Ltd. — Where Consciousness Meets Intelligence"
      },
      image: {
        "@type": "ImageObject",
        "@id": `${siteUrl}/#primary-image`,
        url: `${siteUrl}/omnexa-driver-home.jpg`,
        contentUrl: `${siteUrl}/omnexa-driver-home.jpg`,
        width: 1254,
        height: 1254,
        caption:
          "OMNeXa visual representing human capability, artificial intelligence and robotics guided by human values"
      },
      brand: { "@id": `${siteUrl}/#brand` },
      founder: { "@id": `${siteUrl}/dhiraj-kumar#person` },
      foundingDate: "2026-06-22",
      identifier: {
        "@type": "PropertyValue",
        propertyID: "Singapore UEN",
        value: "202628055R"
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Singapore",
        addressCountry: "SG"
      },
      slogan: "Where Consciousness Meets Intelligence",
      description:
        "Singapore-based transformation and innovation ecosystem focused on responsible AI, human-defined automation, robotics with human values, risk and governance, education, sustainability and well-being.",
      email: "dhiraj.kumar@omnexagoc.com",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "business enquiries",
        email: "dhiraj.kumar@omnexagoc.com",
        availableLanguage: ["English"]
      },
      knowsAbout: [
        "Responsible AI",
        "Human-in-the-Loop AI",
        "Humans Defining the Loop",
        "Robotics with Human Values",
        "AI governance",
        "Risk and controls",
        "AML/KYC and sanctions",
        "Education and employability",
        "Sustainability and ESG",
        "Human-machine collaboration"
      ],
      areaServed: "Global"
    },
    {
      "@type": "Brand",
      "@id": `${siteUrl}/#brand`,
      name: "OMNeXa",
      url: siteUrl,
      logo: `${siteUrl}/omnexa-logo.png`,
      slogan: "Where Consciousness Meets Intelligence",
      description:
        "OMNeXa is the brand of OMNeXa Pte. Ltd., a Singapore-based transformation and innovation ecosystem."
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: "OMNeXa",
      alternateName: "OMNeXa Pte. Ltd.",
      description:
        "Official website of OMNeXa Pte. Ltd., Singapore — Where Consciousness Meets Intelligence.",
      inLanguage: "en-SG",
      publisher: { "@id": `${siteUrl}/#organization` },
      about: { "@id": `${siteUrl}/#organization` }
    }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entityGraph) }}
        />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
