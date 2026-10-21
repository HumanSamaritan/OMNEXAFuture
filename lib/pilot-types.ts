export const EXPERIENCE_LEVELS = ["New to this area", "Personal or lived experience", "Less than 2 years professionally", "2–5 years professionally", "More than 5 years professionally"];
export const AVAILABILITY_OPTIONS = ["Up to 1 hour per week", "1–2 hours per week", "2–4 hours per week", "To be agreed"];

export type PilotApplication = {
  productSlug: string;
  initiativeSlug: string;
  fullName: string;
  email: string;
  country: string;
  organisation: string;
  role: string;
  experienceLevel: string;
  experience: string;
  goals: string;
  availability: string;
};
