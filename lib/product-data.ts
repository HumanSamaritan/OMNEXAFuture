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
    name: "Sahaay Setu",
    alternateNames: ["Sahaay-Setu", "OMNeXa Sahaay Setu"],
    serviceSlug: "ai-technology-responsible-innovation",
    status: "Currently under construction",
    externalUrl: "https://sahaay-setu.omnexagoc.com",
    oneLiner: "A human-centred way for seniors, families and caregivers to coordinate everyday support.",
    description:
      "Sahaay-Setu is being developed as a human-centred coordination layer to make everyday support easier to discover, request and organise for seniors, families and caregivers while keeping consent, trust and human oversight visible.",
    problem:
      "Support is often fragmented across people, phone calls, service providers and informal follow-ups, leaving families with coordination burden precisely when clarity matters most.",
    whyHere:
      "The core challenge is responsible digital coordination: technology can reduce friction, but sensitive support decisions still require privacy, consent, traceability and human judgement. That makes Sahaay-Setu a natural fit for AI, technology and responsible innovation.",
    capabilities: ["Support discovery", "Family and caregiver coordination", "Human-centred follow-through"],
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
    oneLiner: "A guided experience to make common Indian income-tax preparation easier to understand.",
    description:
      "SwayamITR is being developed as a guided digital workflow for common Indian income-tax return journeys, with structured questions, clearer explanations and human confirmation around important inputs and decisions.",
    problem:
      "Tax filing can be difficult to navigate for people who do not work with tax forms every day, particularly when terminology, eligibility and supporting information are spread across multiple steps.",
    whyHere:
      "SwayamITR handles high-trust financial information, so explainability, data privacy, secure design and explicit user confirmation matter as much as automation. Its primary value is responsible technology applied to a complex citizen workflow.",
    capabilities: ["Tax preparation guidance", "Clear information at important steps", "User review before important actions"],
    audiences: ["Individual taxpayers", "NRIs", "Older users", "Families supporting tax filing"],
    seoTerms: ["AI tax assistant India", "ITR filing guidance", "NRI tax filing support", "digital tax preparation"],
    visualKicker: "GUIDED TAX JOURNEY",
    visualTitle: "Complex forms. Clearer decisions.",
    visualItems: ["Understand", "Prepare", "Review"]
  },
  {
    slug: "educareer",
    name: "NeXaCareer",
    alternateNames: ["OMNeXa EduCareer", "EduCareer", "NeXa Career"],
    serviceSlug: "career-education-purpose-led-growth",
    status: "Currently under construction",
    externalUrl: "",
    oneLiner: "A learner-centred bridge between education, skills and future work.",
    description:
      "NeXaCareer is being developed to help learners and professionals connect education choices, skill development and work goals as their interests evolve.",
    problem:
      "Education, skills and employment decisions are often treated separately, even when people experience them as one connected journey.",
    whyHere:
      "NeXaCareer aligns with OMNeXa’s career and education work by helping people consider learning and work pathways together.",
    capabilities: ["Explore learning and work pathways", "Reflect on strengths and skills", "Consider relevant next steps"],
    audiences: ["Students", "Parents", "Professionals", "Education partners", "Employers"],
    seoTerms: ["education and career guidance", "future skills", "learning pathways", "career development"],
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
    oneLiner: "A learning workspace that turns practice into clearer feedback on recurring mistakes.",
    description:
      "The PSLE Practice Space is being developed to let students work through uploaded practice papers, record answers, compare responses with answer keys and revisit recurring mistakes through an error-regression view.",
    problem:
      "Completing more papers does not automatically improve performance if mistakes are not classified, revisited and converted into targeted practice.",
    whyHere:
      "The product is fundamentally about learning quality, student self-awareness and targeted academic progress, making it a direct extension of career, education and purpose-led growth.",
    capabilities: ["Learning from practice", "Clear review and feedback", "Focused improvement"],
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
    oneLiner: "A sustainability initiative exploring how community participation can become visible and repeatable.",
    description:
      "Lotus Karmic Balance is being developed as a simple participation mechanism that can connect individual or community actions with recognition and sustainability-oriented outcomes, helping make environmental engagement more visible and repeatable.",
    problem:
      "Sustainability strategies often struggle to become everyday participation because people cannot easily see how small actions connect to a broader outcome.",
    whyHere:
      "The concept translates sustainability intent into participation, activation and observable action — directly supporting OMNeXa's sustainability and ESG corporate alignment work.",
    capabilities: ["Participation and recognition", "Community and employee engagement", "Connection to sustainability outcomes"],
    audiences: ["Corporates", "Employees", "Communities", "NGOs", "Sustainability partners"],
    seoTerms: ["employee sustainability engagement", "ESG participation", "green champion platform", "sustainability rewards"],
    visualKicker: "ACTION → IMPACT",
    visualTitle: "Make participation visible.",
    visualItems: ["Act", "Recognise", "Regenerate"]
  },
  {
    slug: "human-machine-sadhana",
    name: "Human Machine Sadhana",
    alternateNames: ["HumanMachineSadhana", "HMS", "OMNeXa Human Machine Sadhana"],
    serviceSlug: "well-being-conscious-leadership",
    status: "Currently under construction",
    externalUrl: "https://humanmachinesadhana.omnexagoc.com",
    oneLiner: "A guided wellbeing experience for noticing daily patterns and choosing manageable next steps.",
    description:
      "HumanMachineSadhana (HMS) is being developed to help people notice patterns across sleep, movement, food, mood, stress, relationships and reflection, using machine intelligence to support awareness while the human remains in charge.",
    problem:
      "More data, more convenience and potentially longer lives do not automatically create better wellbeing; people still need a way to understand patterns and convert awareness into healthier choices.",
    whyHere:
      "HMS is centred on wellbeing, reflection, resilience and conscious decision-making. Its defining principle — the machine helps you notice, the human decides — directly supports conscious leadership and sustainable human performance.",
    capabilities: ["Daily wellbeing reflection", "Patterns that support awareness", "Human-led choices and correction"],
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
    oneLiner: "A practical companion for capturing commitments, keeping follow-ups visible and closing the loop.",
    description:
      "NeXaKriya is being developed to help people keep everyday commitments visible and bring intention, follow-up and completion into a more connected experience.",
    problem:
      "People often lose energy not because they lack tasks, but because commitments are scattered across calendars, messages and memory with no coherent way to close the loop.",
    whyHere:
      "Although it uses technology and automation, NeXaKriya's primary outcome is human: clearer intention, reduced mental load and more reliable follow-through. That places it within well-being and conscious leadership rather than enterprise automation alone.",
    capabilities: ["Everyday action and follow-through", "Calendar context", "Manageable next steps"],
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
    oneLiner: "A digital pause-and-reset experience that helps people create space before the next action.",
    description:
      "NeXaVirama supports awareness, a brief reset and reflection before people return to the next activity.",
    problem:
      "Modern work rarely stops when the task ends; attention continues to carry unfinished loops, notifications and mental residue into rest and relationships.",
    whyHere:
      "NeXaVirama is explicitly about pause, recovery, emotional space and conscious re-entry. Those outcomes sit directly within well-being and conscious leadership.",
    capabilities: ["Intentional pause and reset", "Reflection before continuing", "Digital wellbeing awareness"],
    audiences: ["Professionals", "Leaders", "Teams", "People managing digital overload"],
    seoTerms: ["digital wellbeing", "AI stress management", "work recovery", "mindful productivity", "pause and reset app"],
    visualKicker: "PAUSE → RESET",
    visualTitle: "Make space before the next move.",
    visualItems: ["Pause", "Reset", "Return"]
  },
  {
    slug: "nexaaml",
    name: "NeXaAML",
    alternateNames: ["NeXa AML", "OMNeXa NeXaAML"],
    serviceSlug: "banking-transformation-risk-control",
    status: "Currently under construction",
    externalUrl: "",
    oneLiner: "A developing workspace for more structured source-of-wealth and KYC review.",
    description: "NeXaAML aims to help financial crime teams organise review context, supporting evidence and accountable decisions in a consistent way.",
    problem: "Source-of-wealth reviews can involve complex information and judgement, making it important to keep context and evidence clear.",
    whyHere: "NeXaAML applies OMNeXa’s banking and risk experience to better-governed review work, with people accountable for decisions.",
    capabilities: ["Structured review context", "Evidence and risk visibility", "Accountable human decisions"],
    audiences: ["KYC and financial crime teams", "Compliance professionals", "Business approvers"],
    seoTerms: ["AML and KYC review", "source of wealth", "financial crime controls", "responsible AI in banking"],
    visualKicker: "BANKING • RISK • REVIEW",
    visualTitle: "Keep evidence and judgement connected.",
    visualItems: ["Context", "Evidence", "Review"]
  },
  {
    slug: "nexalead",
    name: "NeXaLead",
    alternateNames: ["NeXa Lead", "OMNeXa NeXaLead"],
    serviceSlug: "career-education-purpose-led-growth",
    status: "Currently under construction",
    externalUrl: "",
    oneLiner: "Leadership and workplace learning for people working alongside AI agents.",
    description: "NeXaLead is being developed to help individuals and teams strengthen judgement, collaboration and accountability as AI agents become part of everyday work.",
    problem: "As work changes, people need practical ways to adapt their judgement, collaboration and leadership.",
    whyHere: "NeXaLead connects future-of-work learning with human capability and responsible technology adoption.",
    capabilities: ["Leadership and workplace learning", "Practical scenario-based practice", "Human judgement and accountability"],
    audiences: ["Students", "Employees", "Leaders", "Universities and companies"],
    seoTerms: ["future of work learning", "AI leadership training", "human agent collaboration", "workplace capability"],
    visualKicker: "PEOPLE + AGENTS",
    visualTitle: "Build judgement for work with agents.",
    visualItems: ["Learn", "Practise", "Reflect"]
  },
  {
    slug: "nexasetu",
    name: "NeXaSetu",
    alternateNames: ["NeXa Setu", "OMNeXa NeXaSetu"],
    serviceSlug: "ai-technology-responsible-innovation",
    status: "Currently under construction",
    externalUrl: "",
    oneLiner: "A developing assurance framework to keep agent-supported work connected to its intended outcomes.",
    description: "NeXaSetu is being developed to help teams review whether AI-supported work delivers the outcomes people intended, with human accountability kept visible.",
    problem: "When people and AI systems contribute to work over time, the original purpose and responsibility for the result can become harder to see.",
    whyHere: "NeXaSetu supports OMNeXa’s focus on responsible agent delivery and human-accountable outcomes.",
    capabilities: ["Intent and outcome alignment", "Evidence-led review", "Human accountability"],
    audiences: ["Project teams", "Developers and testers", "Educators", "Governance leads"],
    seoTerms: ["AI assurance framework", "agent delivery assurance", "human accountability", "responsible AI testing"],
    visualKicker: "INTENT → IMPACT",
    visualTitle: "Keep the intended outcome in view.",
    visualItems: ["Align", "Review", "Learn"]
  },
  {
    slug: "nexaforge",
    name: "NeXaForge",
    alternateNames: ["NeXa Forge", "OMNeXa NeXaForge"],
    serviceSlug: "ai-technology-responsible-innovation",
    status: "Currently under construction",
    externalUrl: "",
    oneLiner: "An early concept for helping teams coordinate agent-assisted work and review key decisions.",
    description: "NeXaForge is an early concept exploring how people can remain informed and involved as AI agents support work that continues over time.",
    problem: "Agent-assisted work may continue beyond a live conversation, making progress and decisions harder for people to follow.",
    whyHere: "NeXaForge explores practical human oversight as teams adopt agent-assisted ways of working.",
    capabilities: ["Work progress visibility", "Human review and decision points", "Responsible continuation of work"],
    audiences: ["Founders", "Product and delivery teams", "Teams using AI agents"],
    seoTerms: ["agent-assisted work", "AI agent oversight", "human review", "responsible automation"],
    visualKicker: "AGENT-ASSISTED WORK",
    visualTitle: "Stay informed as work moves forward.",
    visualItems: ["Follow", "Review", "Decide"]
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
