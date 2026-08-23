export type ConvergenceIssue = {
  issue: string;
  slug: string;
  title: string;
  summary: string;
  publishedAt?: string;
  themes?: string[];
  sections?: Array<{
    heading: string;
    body: string;
  }>;
  linkedinUrl?: string;
};

const linkedInArticlesHub =
  "https://www.linkedin.com/in/dhiraj-kumar-a9763616/recent-activity/articles/";

export const canonicalIssues: ConvergenceIssue[] = [
  {
    issue: "Issue 01",
    slug: "issue-01",
    title: "Are We Building Two Technology Universes?",
    publishedAt: "2026-08-15",
    summary:
      "A transformation perspective on duplicated effort across traditional technology and AI delivery, and how human capability can move toward higher-value AI-enabled work instead of treating automation as a simple headcount exercise.",
    themes: [
      "Enterprise technology transformation",
      "AI operating models",
      "Workforce capability",
      "Responsible automation"
    ],
    sections: [
      {
        heading: "The leadership question",
        body:
          "Enterprises already operate complex estates of applications, data, interfaces, testing environments and support structures. The arrival of AI creates a strategic choice: use intelligence to transform that estate, or add a second technology universe beside it."
      },
      {
        heading: "Why the distinction matters",
        body:
          "Parallel technology and AI structures can increase duplicated integration, testing, infrastructure, support and governance effort. The issue therefore examines transformation as an operating-model decision, not simply a new-tool decision."
      },
      {
        heading: "The human outcome",
        body:
          "When automation releases capacity, leadership should define how that capacity moves into judgement, customer value, controls, learning and higher-value work. Technology efficiency and human capability should be designed together."
      }
    ],
    linkedinUrl:
      process.env.OMNEXA_ISSUE_01_LINKEDIN_URL ||
      "https://www.linkedin.com/pulse/we-building-two-technology-universes-issue-01-dhiraj-kumar-kumar-m4svf"
  },
  {
    issue: "Issue 02",
    slug: "issue-02",
    title: "Who Defines the AI Loop?",
    summary:
      "A leadership and governance perspective on purpose, decision rights, escalation, accountability, employability and the human value choices that should be defined before intelligent systems scale.",
    themes: [
      "AI governance",
      "Decision rights",
      "Accountability and escalation",
      "Employability and human value"
    ],
    sections: [
      {
        heading: "Purpose before autonomy",
        body:
          "Human-in-the-Loop describes participation, but participation alone does not establish who defines the purpose, boundaries and acceptable outcomes of an intelligent system. Those choices should be explicit before autonomy scales."
      },
      {
        heading: "Decision rights and escalation",
        body:
          "A governed loop needs clear authority: what the system may decide, what requires human judgement, when activity must stop, who receives an escalation and who remains accountable for the outcome."
      },
      {
        heading: "Learning and human value",
        body:
          "The design of the loop also shapes work and employability. Leaders should decide how people learn, how released capacity is redirected and how technology strengthens rather than silently erodes human capability."
      }
    ],
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

  if (!feedUrl) return canonicalIssues;

  try {
    const response = await fetch(feedUrl, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) return canonicalIssues;

    const data: unknown = await response.json();
    if (!Array.isArray(data)) return canonicalIssues;

    const issues = data.filter(isIssue).map((issue) => {
      const canonical = canonicalIssues.find((item) => item.slug === issue.slug);
      return canonical ? { ...canonical, ...issue } : issue;
    });
    return issues.length ? issues : canonicalIssues;
  } catch {
    return canonicalIssues;
  }
}

export async function getConvergenceIssue(slug: string): Promise<ConvergenceIssue | undefined> {
  const issues = await getConvergenceIssues();
  return issues.find((issue) => issue.slug === slug);
}
