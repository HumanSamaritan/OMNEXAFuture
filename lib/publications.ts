export type ConvergenceQuestion = {
  question: string;
  answer: string;
};

export type ConvergenceIssue = {
  issue: string;
  slug: string;
  title: string;
  subtitle?: string;
  summary: string;
  publishedAt?: string;
  themes?: string[];
  seoKeywords?: string[];
  questions?: ConvergenceQuestion[];
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
  },
  {
    issue: "Issue 03",
    slug: "issue-03",
    title: "When the Screen Stops Being the Product",
    subtitle: "From fixed interfaces to agentic interaction and outcome-led experience",
    publishedAt: "2026-09-01",
    summary:
      "A practical perspective on how agentic AI changes the role of the user interface: people increasingly express intent while agents navigate systems, tools and workflows, making visibility, supervision, exception handling and outcome design more important than screen flow alone.",
    themes: [
      "Agentic AI interfaces",
      "Human-agent interaction",
      "AI user experience",
      "Outcome-led design",
      "Human-machine collaboration"
    ],
    seoKeywords: [
      "agentic AI interface",
      "AI user interface",
      "human agent interaction",
      "agentic UX",
      "AI agents and user experience",
      "outcome based interface",
      "human machine collaboration"
    ],
    questions: [
      {
        question: "What happens to software interfaces when AI agents can act for users?",
        answer:
          "The screen does not disappear, but it stops being the only place where work happens. Users can express intent while agents navigate systems and tools, so product design must also cover supervision, exceptions, evidence and outcomes."
      },
      {
        question: "Does agentic AI make user interfaces unnecessary?",
        answer:
          "No. Interfaces remain important for judgement, comparison, approval, explanation and exception handling. The change is that the interface becomes one control surface within a wider human-agent operating model."
      },
      {
        question: "How should teams test an agentic interface?",
        answer:
          "Testing should cover not only screens and clicks but also intent interpretation, state transitions, tool use, hand-offs, user visibility, exception paths and whether the intended outcome was achieved."
      }
    ],
    sections: [
      {
        heading: "From interface to intent",
        body:
          "Traditional software assumes that a person navigates a defined sequence of screens. Agentic systems can interpret a request, select tools and complete parts of the journey on the user's behalf. The design unit therefore starts moving from the screen toward intent, state, evidence and outcome."
      },
      {
        heading: "The human role does not disappear",
        body:
          "As execution becomes less visible, people need clearer ways to understand what the agent is doing, where it is uncertain, what changed, what requires approval and how an action can be corrected. Good agentic experience is therefore not simply fewer screens; it is better supervision and better exception design."
      },
      {
        heading: "A new test surface",
        body:
          "Product and quality teams must increasingly test the interaction between human intent, agent interpretation, tool execution and resulting business state. A technically elegant interface is not enough if the operating outcome is opaque or difficult to challenge."
      }
    ],
    linkedinUrl:
      process.env.OMNEXA_ISSUE_03_LINKEDIN_URL ||
      "https://www.linkedin.com/feed/update/urn:li:ugcPost:7500053384427900928/"
  },
  {
    issue: "Issue 04",
    slug: "issue-04",
    title: "The Defect Has a New Source",
    subtitle: "From Software Testing to Human-Agent Traceability",
    publishedAt: "2026-09-08",
    summary:
      "An agent-aware extension of software testing, quality engineering, assurance and defect prevention that follows human intent through agent interpretation, agent-to-agent hand-offs, tool execution and business outcome.",
    themes: [
      "AI testing",
      "Agentic AI testing",
      "Quality Engineering",
      "AI assurance",
      "Defect prevention",
      "Requirement traceability",
      "Human-agent alignment",
      "Agent-to-agent hand-offs",
      "Quality and controls"
    ],
    seoKeywords: [
      "AI testing",
      "testing AI agents",
      "agentic AI testing",
      "AI quality engineering",
      "quality engineering for AI",
      "AI defect prevention",
      "defect prevention for AI agents",
      "AI assurance",
      "AI quality control",
      "quality and controls for AI",
      "requirement traceability for AI",
      "human agent traceability",
      "agent to agent traceability",
      "AI software testing framework",
      "agentic software quality"
    ],
    questions: [
      {
        question: "How does software testing change for agentic AI?",
        answer:
          "Functional testing remains essential, but the test surface expands. Teams also need to verify what the agent understood, which evidence it used, what authority it had, what action it took, what business state changed and whether the action can be reconstructed or recovered."
      },
      {
        question: "What is human-agent traceability?",
        answer:
          "Human-agent traceability follows a requirement from human intent through agent interpretation, delegation, tool execution, test evidence and business outcome so reviewers can see where meaning, context or authority changed."
      },
      {
        question: "Can an AI-related defect be introduced before code is changed?",
        answer:
          "Requirements defects have always existed before coding. Agentic systems add more interpretation and hand-off transitions where intent can be misunderstood, compressed, expanded or delegated before a technical action occurs."
      },
      {
        question: "What is requirement-to-outcome traceability?",
        answer:
          "It extends a conventional requirement-to-test trace beyond the test case by linking the requirement to human-agent alignment, agent tasks and hand-offs, tool or code execution, test evidence and the resulting business outcome."
      },
      {
        question: "What should AI testing verify beyond functional correctness?",
        answer:
          "AI testing should also challenge ambiguity, context quality, decision authority, agent-to-agent hand-offs, tool parameters, side effects, business-state reconciliation, reversibility and recovery."
      },
      {
        question: "How does defect prevention apply to AI agents?",
        answer:
          "A defect should be closed with a prevention change, not only a code fix. The root cause may sit in requirement capture, human-agent alignment, context and evidence, delegation, execution, integration, outcome verification or recovery."
      }
    ],
    sections: [
      {
        heading: "This is the next convergence",
        body:
          "Issue 01 looked at the risk of building a parallel AI technology universe. Issue 02 moved to decision rights: who defines the AI loop? Issue 03 turned to the interface: what happens when the screen stops being the product? Issue 04 moves into assurance and defect prevention: once human intent can pass through agents before becoming action, how do we preserve meaning, trace the path of interpretation and execution, and verify that the business outcome still matches the original requirement?"
      },
      {
        heading: "The unit of assurance is changing",
        body:
          "For years, software testing asked a familiar question: did the system do what we built it to do? Agentic AI adds a harder one: should the system have been allowed to do it, and can we prove why? Quality Engineering remains foundational, but the unit of assurance expands from software behaviour toward intent, evidence, authority, action, business outcome and recovery as one connected chain."
      },
      {
        heading: "A simple example exposes the gap",
        body:
          "Ask an enterprise agent to close an activity. A functional test may prove that the status changed correctly, yet the important questions begin after that test passes. Did close mean complete, cancel or archive? Was the user authorised? Were unresolved dependencies present? Should another person have been informed? Is the action reversible? A technically correct action can still produce the wrong business outcome."
      },
      {
        heading: "Trace the requirement, not just the code",
        body:
          "A conventional traceability matrix links business requirement, functional requirement, test case and defect. Agent-run applications add human-agent and agent-to-agent transitions where meaning, context and authority can change. The trace therefore needs to extend through those transitions to the resulting business state."
      },
      {
        heading: "A tester's new unit of assurance",
        body:
          "OMNeXa uses a practitioner shorthand: INTENT → EVIDENCE → AUTHORITY → ACTION → OUTCOME → RECOVERY. What did the human or system mean? Is context permitted, current and attributable? Who may decide or execute? Was the correct tool, target and parameter used? Did the intended business state change? Can the action be reconstructed, challenged or rolled back?"
      },
      {
        heading: "HMS: a small system, a larger pattern",
        body:
          "OMNeXa's internal HumanMachineSadhana delivery review surfaced the pattern at small scale. Rework clustered where requirement ambiguity met application state, user correction authority, privacy or identity boundaries and integration sequencing. HMS is not evidence of enterprise-scale prevalence; it is a practical story point showing how additional human-agent-code transitions can create additional places for intent to drift."
      },
      {
        heading: "Close defects with prevention",
        body:
          "The defect-prevention lens asks where the requirement changed meaning and which transition allowed the divergence. Root causes may sit in requirement capture, human-agent alignment, agent hand-off, context and evidence, tool or code execution, integration, outcome verification or recovery. The goal is to change the control that allowed recurrence, not merely repair the immediate symptom."
      }
    ],
    linkedinUrl:
      process.env.OMNEXA_ISSUE_04_LINKEDIN_URL ||
      "https://www.linkedin.com/feed/update/urn:li:ugcPost:7503022929857626112/"
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

    const feedIssues = data.filter(isIssue);
    if (!feedIssues.length) return canonicalIssues;

    const mergedCanonical = canonicalIssues.map((canonical) => {
      const feedIssue = feedIssues.find((item) => item.slug === canonical.slug);
      return feedIssue ? { ...canonical, ...feedIssue } : canonical;
    });
    const feedOnly = feedIssues.filter(
      (issue) => !canonicalIssues.some((canonical) => canonical.slug === issue.slug)
    );

    return [...mergedCanonical, ...feedOnly];
  } catch {
    return canonicalIssues;
  }
}

export async function getConvergenceIssue(slug: string): Promise<ConvergenceIssue | undefined> {
  const issues = await getConvergenceIssues();
  return issues.find((issue) => issue.slug === slug);
}
