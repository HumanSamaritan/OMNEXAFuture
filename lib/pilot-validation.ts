import { pilotProducts } from "./pilot-catalog";
import { EXPERIENCE_LEVELS, AVAILABILITY_OPTIONS, type PilotApplication } from "./pilot-types";

export class PilotInputError extends Error {}

export function validatePilotApplication(value: unknown): PilotApplication {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new PilotInputError("Please complete the application form.");
  const input = value as Record<string, unknown>;
  const field = (key: string, max: number, min = 0) => {
    if (typeof input[key] !== "string") throw new PilotInputError(`Please check the ${key} field.`);
    const text = (input[key] as string).trim();
    if (text.length < min || text.length > max || /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(text)) throw new PilotInputError(`Please check the ${key} field.`);
    return text;
  };
  const application: PilotApplication = {
    productSlug: field("productSlug", 100, 1), initiativeSlug: field("initiativeSlug", 100, 1),
    fullName: field("fullName", 100, 2), email: field("email", 254, 3).toLowerCase(),
    country: field("country", 80, 2), organisation: field("organisation", 160), role: field("role", 120, 2),
    experienceLevel: field("experienceLevel", 80, 1), experience: field("experience", 2000, 20),
    goals: field("goals", 1600, 20), availability: field("availability", 80, 1)
  };
  const product = pilotProducts.find((item) => item.slug === application.productSlug);
  if (!product || product.initiativeSlug !== application.initiativeSlug) throw new PilotInputError("Choose a valid initiative and product.");
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(application.email)) throw new PilotInputError("Enter a valid email address.");
  if (/[\r\n]/.test(application.fullName + application.country + application.organisation + application.role)) throw new PilotInputError("Use a single line for contact details.");
  if (!EXPERIENCE_LEVELS.includes(application.experienceLevel) || !AVAILABILITY_OPTIONS.includes(application.availability)) throw new PilotInputError("Choose your experience level and availability.");
  if (product.audience === "B2B" && application.organisation.length < 2) throw new PilotInputError("Enter your organisation for a B2B pilot.");
  return application;
}
