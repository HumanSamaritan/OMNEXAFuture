import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import "./globals.css";

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
  alternates: {
    canonical: "/"
  },
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
        url: "/omnexa-logo.png",
        alt: "OMNeXa Pte. Ltd. — Where Consciousness Meets Intelligence"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "OMNeXa Pte. Ltd. | Where Consciousness Meets Intelligence",
    description:
      "Human-defined AI, robotics with human values, risk and governance, education, sustainability and conscious transformation.",
    images: ["/omnexa-logo.png"]
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

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "OMNeXa Pte. Ltd.",
  alternateName: "OMNeXa",
  url: siteUrl,
  logo: `${siteUrl}/omnexa-logo.png`,
  slogan: "Where Consciousness Meets Intelligence",
  description:
    "Singapore-based transformation and innovation ecosystem focused on responsible AI, human-defined automation, robotics with human values, risk and governance, education, sustainability and well-being.",
  founder: {
    "@type": "Person",
    "@id": `${siteUrl}/about#dhiraj-kumar`,
    name: "Dhiraj Kumar",
    jobTitle: "Founder & CEO",
    url: `${siteUrl}/about`,
    image: `${siteUrl}/dhiraj-founder.png`,
    sameAs: ["https://sg.linkedin.com/in/dhiraj-kumar-a9763616"]
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
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
