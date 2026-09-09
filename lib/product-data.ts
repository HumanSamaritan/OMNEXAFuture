export type ServiceSegment = {
  slug: string;
  title: string;
  shortTitle: string;
  href: string;
  description: string;
};

export type ProductEntry = {
  slug: string;
  name: string;
  alternateNames: string[];
  serviceSlug: string;
  status: "Currently under construction";
  externalUrl: string;
  oneLiner: string;
  description: string;
  problem: string;
  whyHere: string;
  capabilities: string[];
  audiences: string[];
  seoTerms: string[];
  visualKicker: string;
  visualTitle: string;
  visualItems: string[];
};

export const serviceSegments: ServiceSegment[] = [
  {
    slug: "career-education-purpose-led-growth",
    title: "Career, education and purpose-led growth",
    shortTitle: "Career & education",
    href: "/services#career-education-purpose-led-growth",
    description:
      "Education pathways, future skills, employability and purpose-led growth for students, parents, professionals and institutions."
  },
  {
    slug: "banking-transformation-risk-control",
    title: "Banking transformation, risk and control advisory",
    shortTitle: "Banking, risk & controls",
    href: "/services#banking-transformation-risk-control",
    description:
      "Execution-focused transformation across payments, onboarding, AML/KYC, sanctions, governance, controls and regulatory change."
  },
  {
    slug: "sustainability-esg-corporate-alignment",
    title: "Sustainability and ESG corporate alignment",
    shortTitle: "Sustainability & ESG",
    href: "/services#sustainability-esg-corporate-alignment",
    description:
      "Practical participation, culture activation and measurable sustainability engagement for organisations and communities."
  },
  {
    slug: "ai-technology-responsible-innovation",
    title: "AI, technology and responsible innovation",
    shortTitle: "AI & responsible innovation",
    href: "/services#ai-technology-responsible-innovation",
    description:
      "Human-centred digital products, responsible automation and practical AI-enabled experiences with trust, privacy and accountability built in."
  },
  {
    slug: "well-being-conscious-leadership",
    title: "Well-being and conscious leadership",
    shortTitle: "Well-being & conscious leadership",
    href: "/services#well-being-conscious-leadership",
    description:
      "Tools and experiences that support awareness, resilience, intentional action, recovery and sustainable human performance."
  }
];

export const products: ProductEntry[] = [
  {
    slug: "sahaay-setu",
    name: "Sahaay-Setu",
    alternateNames: ["Sahaay Setu", "OMNeXa Sahaay-Setu"],
    serviceSlug: "ai-technology-responsible-innovation",
    status: "Currently under construction",
    externalUrl: "https://sahaay-setu.omnexagoc.com",
    oneLiner: "A digital support-coordination bridge for seniors, families, caregivers and trusted service ecosystems.",
    description:
      "Sahaay-Setu is being developed as a human-centred coordination layer to make everyday support easier to discover, request and organise for seniors, families and caregivers while keeping consent, trust and human oversight visible.",
    problem:
      "Support is often fragmented across people, phone calls, service providers and informal follow-ups, leaving families with coordination burden precisely when clarity matters most.",
    whyHere:
      "The core challenge is responsible digital coordination: technology can reduce friction, but sensitive support decisions still require privacy, consent, traceability and human judgement. That makes Sahaay-Setu a natural fit for AI, technology and responsible innovation.",
    capabilities: [
      "Support discovery and request coordination",
      "Caregiver and family visibility",
      "Trusted partner and service hand-offs",
      "Human confirmation for sensitive actions"
    ],
    audiences: ["Seniors", "Families", "Caregivers", "Support partners"],
    seoTerms: ["senior support platform", "caregiver coordination", "family support technology", "responsible AI for care"],
    visualKicker: "CARE COORDINATION",
    visualTitle: "Support should feel connected.",
    visualItems: ["Request help", "Coordinate", "Confirm"]
  },
  {
    slug: "swayamitr",
    name: "SwayamITR",
    alternateNames: ["Swayam ITR", "OMNeXa SwayamITR"],
    serviceSlug: "ai-technology-responsible-innovation",
    status: "Currently under construction",
    externalUrl: "https://swayamitr.omnexagoc.com",
    oneLiner: "A guided tax-preparation experience designed to make Indian income-tax filing easier to understand and navigate.",
    description:
      "SwayamITR is being developed as a guided digital workflow for common Indian income-tax return journeys, with structured questions, clearer explanations and human confirmation around important inputs and decisions.",
    problem:
      "Tax filing can be difficult to navigate for people who do not work with tax forms every day, particularly when terminology, eligibility and supporting information are spread across multiple steps.",
    whyHere:
      "SwayamITR handles high-trust financial information, so explainability, data privacy, secure design and explicit user confirmation matter as much as automation. Its primary value is responsible technology applied to a complex citizen workflow.",
    capabilities: [
      "Guided ITR preparation journeys",
      "Plain-language explanations of inputs",
      "Structured document and data checkpoints",
      "Human review before important submissions"
    ],
    audiences: ["Individual taxpayers", "NRIs", "Older users", "Families supporting tax filing"],
    seoTerms: ["AI tax assistant India", "ITR filing guidance", "NRI tax filing support", "digital tax preparation"],
    visualKicker: "GUIDED TAX JOURNEY",
    visualTitle: "Complex forms. Clearer decisions.",
    visualItems: ["Understand", "Prepare", "Review"]
  },
  {
    slug: "educareer",
    name: "OMNeXa EduCareer",
    alternateNames: ["EduCareer", "OMNeXa Edu Career"],
    serviceSlug: "career-education-purpose-led-growth",
    status: "Currently under construction",
    externalUrl: "https://educareer.omnexagoc.com",
    oneLiner: "An education, skills and work orchestration layer built around the person rather than a single admission, course or job transaction.",
    description:
      "EduCareer is being developed to connect education pathways, skill evidence, opportunity discovery and partner ecosystems so learners and professionals can move from education choices to capabilities, experience and future-ready work.",
    problem:
      "Education, skills, internships and jobs are usually treated as separate searches even though the person experiences them as one connected journey.",
    whyHere:
      "EduCareer directly supports pathway clarity, skills readiness, employability and purposeful career progression, which are the core outcomes of OMNeXa's career, education and purpose-led growth service segment.",
    capabilities: [
      "Education and admissions pathways",
      "Skills assessment and evolving skills passport",
      "Jobs, internships and opportunity discovery",
      "Partner-supported next steps and referrals"
    ],
    audiences: ["Students", "Parents", "Professionals", "Education partners", "Employers"],
    seoTerms: ["education and career platform", "future skills", "career pathway guidance", "skills passport", "AI career guidance"],
    visualKicker: "EDUCATION → SKILLS → WORK",
    visualTitle: "One journey around the person.",
    visualItems: ["Discover", "Assess", "Act"]
  },
  {
    slug: "psle-practice-space",
    name: "OMNeXa PSLE Practice Space",
    alternateNames: ["PSLE Practice Space", "OMNeXa PSLE"],
    serviceSlug: "career-education-purpose-led-growth",
    status: "Currently under construction",
    externalUrl: "https://psle.omnexagoc.com",
    oneLiner: "A practice and error-regression workspace designed to turn school papers into clearer learning feedback for students.",
    description:
      "The PSLE Practice Space is being developed to let students work through uploaded practice papers, record answers, compare responses with answer keys and revisit recurring mistakes through an error-regression view.",
    problem:
      "Completing more papers does not automatically improve performance if mistakes are not classified, revisited and converted into targeted practice.",
    whyHere:
      "The product is fundamentally about learning quality, student self-awareness and targeted academic progress, making it a direct extension of career, education and purpose-led growth.",
    capabilities: [
      "Practice-paper upload and answer capture",
      "Answer-key comparison",
      "Wrong-answer and error-regression review",
      "School and paper-based practice history"
    ],
    audiences: ["Primary students", "Parents", "Tutors", "Schools"],
    seoTerms: ["PSLE practice platform", "PSLE paper practice", "student error analysis", "Singapore primary education technology"],
    visualKicker: "PRACTICE WITH FEEDBACK",
    visualTitle: "Do the paper. Learn from the pattern.",
    visualItems: ["Attempt", "Check", "Improve"]
  },
  {
    slug: "lotus-karmic-balance",
    name: "Lotus Karmic Balance",
    alternateNames: ["LotusKarmicBalance", "OMNeXa Lotus Karmic Balance"],
    serviceSlug: "sustainability-esg-corporate-alignment",
    status: "Currently under construction",
    externalUrl: "https://lotuskarmicbalance.omnexagoc.com",
    oneLiner: "A participation concept connecting positive action, recognition and tangible sustainability engagement.",
    description:
      "Lotus Karmic Balance is being developed as a simple participation mechanism that can connect individual or community actions with recognition and sustainability-oriented outcomes, helping make environmental engagement more visible and repeatable.",
    problem:
      "Sustainability strategies often struggle to become everyday participation because people cannot easily see how small actions connect to a broader outcome.",
    whyHere:
      "The concept translates sustainability intent into participation, activation and observable action — directly supporting OMNeXa's sustainability and ESG corporate alignment work.",
    capabilities: [
      "Action and participation recognition",
      "QR-enabled engagement concepts",
      "Community or employee activation",
      "Connection to sustainability outcomes"
    ],
    audiences: ["Corporates", "Employees", "Communities", "NGOs", "Sustainability partners"],
    seoTerms: ["employee sustainability engagement", "ESG participation", "green champion platform", "sustainability rewards"],
    visualKicker: "ACTION → IMPACT",
    visualTitle: "Make participation visible.",
    visualItems: ["Act", "Recognise", "Regenerate"]
  },
  {
    slug: "human-machine-sadhana",
    name: "HumanMachineSadhana",
    alternateNames: ["Human Machine Sadhana", "HMS", "HumanMachineSadhana by OMNeXa"],
    serviceSlug: "well-being-conscious-leadership",
    status: "Currently under construction",
    externalUrl: "https://humanmachinesadhana.omnexagoc.com",
    oneLiner: "An AI-enabled wellness and human-readiness platform designed to strengthen awareness without replacing human choice.",
    description:
      "HumanMachineSadhana (HMS) is being developed to help people notice patterns across sleep, movement, food, mood, stress, relationships and reflection, using machine intelligence to support awareness while the human remains in charge.",
    problem:
      "More data, more convenience and potentially longer lives do not automatically create better wellbeing; people still need a way to understand patterns and convert awareness into healthier choices.",
    whyHere:
      "HMS is centred on wellbeing, reflection, resilience and conscious decision-making. Its defining principle — the machine helps you notice, the human decides — directly supports conscious leadership and sustainable human performance.",
    capabilities: [
      "Daily wellbeing rhythm and reflection",
      "Pattern awareness across lifestyle signals",
      "AI-assisted observations and guidance",
      "Human decision authority and correction"
    ],
    audiences: ["Individuals", "Professionals", "Wellness practitioners", "Employers", "Wellbeing partners"],
    seoTerms: ["Human Machine Sadhana", "HumanMachineSadhana", "AI wellness", "future of wellness", "longevity and wellbeing", "human AI wellness"],
    visualKicker: "HUMAN × MACHINE",
    visualTitle: "Notice more. Decide consciously.",
    visualItems: ["Sleep", "Move", "Reflect"]
  },
  {
    slug: "nexakriya",
    name: "NeXaKriya",
    alternateNames: ["NeXa Kriya", "NeXaKriya by OMNeXa", "ActionLoop"],
    serviceSlug: "well-being-conscious-leadership",
    status: "Currently under construction",
    externalUrl: "https://nexakriya.omnexagoc.com",
    oneLiner: "An intentional action and follow-through companion designed to reduce cognitive load and keep commitments visible.",
    description:
      "NeXaKriya is being developed as an action-management companion connecting tasks, follow-ups and calendar context while keeping user permissions, intentional action and recovery from missed commitments explicit.",
    problem:
      "People often lose energy not because they lack tasks, but because commitments are scattered across calendars, messages and memory with no coherent way to close the loop.",
    whyHere:
      "Although it uses technology and automation, NeXaKriya's primary outcome is human: clearer intention, reduced mental load and more reliable follow-through. That places it within well-being and conscious leadership rather than enterprise automation alone.",
    capabilities: [
      "Action and follow-up management",
      "Calendar-aware coordination",
      "Permission-conscious integrations",
      "Reopen and recovery guardrails"
    ],
    audiences: ["Professionals", "Families", "Teams", "People managing complex commitments"],
    seoTerms: ["AI task companion", "calendar action management", "intentional productivity", "personal follow up app"],
    visualKicker: "INTENTION → ACTION",
    visualTitle: "Close the loop without losing yourself.",
    visualItems: ["Capture", "Act", "Close"]
  },
  {
    slug: "nexavirama",
    name: "NeXaVirama",
    alternateNames: ["NeXa Virama", "NeXaVirama by OMNeXa", "ClearLoop"],
    serviceSlug: "well-being-conscious-leadership",
    status: "Currently under construction",
    externalUrl: "https://nexavirama.omnexagoc.com",
    oneLiner: "A digital pause-and-reset experience focused on creating space between overload and the next action.",
    description:
      "NeXaVirama is being developed around intentional pause, recovery and reset — helping people step out of repetitive digital or work patterns and return with greater awareness rather than simply adding another productivity demand.",
    problem:
      "Modern work rarely stops when the task ends; attention continues to carry unfinished loops, notifications and mental residue into rest and relationships.",
    whyHere:
      "NeXaVirama is explicitly about pause, recovery, emotional space and conscious re-entry. Those outcomes sit directly within well-being and conscious leadership.",
    capabilities: [
      "Intentional pause and reset flows",
      "Reflection before re-entry",
      "Digital wellbeing prompts",
      "Awareness-oriented routines"
    ],
    audiences: ["Professionals", "Leaders", "Teams", "People managing digital overload"],
    seoTerms: ["digital wellbeing", "AI stress management", "work recovery", "mindful productivity", "pause and reset app"],
    visualKicker: "PAUSE → RESET",
    visualTitle: "Make space before the next move.",
    visualItems: ["Pause", "Reset", "Return"]
  }
];

export function getServiceSegment(slug: string) {
  return serviceSegments.find((segment) => segment.slug === slug);
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductsByService(slug: string) {
  return products.filter((product) => product.serviceSlug === slug);
}
