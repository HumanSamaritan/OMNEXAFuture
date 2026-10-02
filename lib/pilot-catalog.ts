import { products, serviceSegments } from "./product-data";

export type PilotAudience = "B2C" | "B2B";
export type PilotProduct = {
  slug: string;
  name: string;
  initiativeSlug: string;
  initiativeName: string;
  audience: PilotAudience;
};

// Explicit eligibility: new products must be classified before accepting applications.
const audiences: Record<string, PilotAudience> = {
  "sahaay-setu": "B2C",
  swayamitr: "B2C",
  educareer: "B2C",
  "psle-practice-space": "B2C",
  "human-machine-sadhana": "B2C",
  nexakriya: "B2C",
  nexavirama: "B2C",
  "lotus-karmic-balance": "B2B",
  nexaaml: "B2B",
  nexalead: "B2B",
  nexasetu: "B2B",
  nexaforge: "B2B"
};

export const pilotProducts: PilotProduct[] = products
  .filter((product) => audiences[product.slug])
  .map((product) => ({
    slug: product.slug,
    name: product.name,
    initiativeSlug: product.serviceSlug,
    initiativeName: serviceSegments.find((segment) => segment.slug === product.serviceSlug)!.shortTitle,
    audience: audiences[product.slug]
  }));
