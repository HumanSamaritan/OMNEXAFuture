export type ConvergenceIssue = {
  issue: string;
  slug: string;
  title: string;
  summary: string;
  linkedinUrl?: string;
};

const linkedInArticlesHub =
  "https://www.linkedin.com/in/dhiraj-kumar-a9763616/recent-activity/articles/";

const fallbackIssues: ConvergenceIssue[] = [
  {
    issue: "Issue 01",
    slug: "issue-01",
    title: "Are We Building Two Technology Universes?",
    summary:
      "A transformation perspective on duplicated effort across traditional technology and AI delivery, and how human capability can move toward higher-value AI-enabled work instead of treating automation as a simple headcount exercise.",
    linkedinUrl: process.env.OMNEXA_ISSUE_01_LINKEDIN_URL || linkedInArticlesHub
  },
  {
    issue: "Issue 02",
    slug: "issue-02",
    title: "Who Defines the AI Loop?",
    summary:
      "A leadership and governance perspective on purpose, decision rights, escalation, accountability, employability and the human value choices that should be defined before intelligent systems scale.",
    linkedinUrl: process.env.OMNEXA_ISSUE_02_LINKEDIN_URL || linkedInArticlesHub
  }
];

function isIssue(value: unknown): value is ConvergenceIssue {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.issue === "string" &&
    typeof item.slug === "string" &&
    typeof item.title === "string" &&
    typeof item.summary === "string"
  );
}

export async function getConvergenceIssues(): Promise<ConvergenceIssue[]> {
  const feedUrl = process.env.OMNEXA_PUBLICATIONS_FEED_URL;

  if (!feedUrl) return fallbackIssues;

  try {
    const response = await fetch(feedUrl, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) return fallbackIssues;

    const data: unknown = await response.json();
    if (!Array.isArray(data)) return fallbackIssues;

    const issues = data.filter(isIssue);
    return issues.length ? issues : fallbackIssues;
  } catch {
    return fallbackIssues;
  }
}
