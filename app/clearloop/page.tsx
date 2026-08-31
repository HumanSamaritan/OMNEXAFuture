import type { Metadata } from "next";
import ClearLoopClient from "./ClearLoopClient";

const siteUrl = "https://www.omnexagoc.com";

export const metadata: Metadata = {
  title: "ClearLoop | Private Vape-Free Companion | OMNeXa",
  description:
    "ClearLoop is OMNeXa's privacy-first, local-device companion for understanding vaping, managing cravings, tracking progress and building healthier routines without creating a personal cloud profile.",
  alternates: { canonical: `${siteUrl}/clearloop` },
  openGraph: {
    title: "ClearLoop | OMNeXa",
    description:
      "A private, human-led companion for managing vape cravings and building a vape-free life. No account. Personal journey stored on your device.",
    url: `${siteUrl}/clearloop`,
    type: "website"
  }
};

export default function ClearLoopPage() {
  return <ClearLoopClient />;
}
