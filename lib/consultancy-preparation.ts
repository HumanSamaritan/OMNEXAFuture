export type PreparationQuestion = { id: string; label: string; hint: string };
export const preparationQuestions: Record<string, PreparationQuestion[]> = {
  "practical-ai-workflow": [
    { id: "task", label: "Which recurring task would you like to improve?", hint: "Describe the current steps and roughly how much time it takes." },
    { id: "tools", label: "Which AI tools can you use, and how confident are you with them?", hint: "Include any workplace restrictions. Do not provide passwords." },
    { id: "success", label: "What would make this workflow useful to you?", hint: "For example, less time drafting a report or a more consistent research checklist." }
  ],
  "ai-prototype-roadmap": [
    { id: "problem", label: "Who is the intended user and what problem do they face?", hint: "Give one concrete situation rather than a list of features." },
    { id: "stage", label: "What have you already built or tested?", hint: "Mention your technical experience, available tools and non-confidential feedback." },
    { id: "constraints", label: "What are your timeline, budget range and main constraints?", hint: "We will use these to keep the roadmap achievable." }
  ],
  "responsible-ai-oversight": [
    { id: "usecase", label: "What does your AI workflow do, and who uses its outputs?", hint: "Describe one assistant, agent or business process." },
    { id: "risk", label: "Which actions, data or decisions concern you most?", hint: "Describe data categories only. Do not upload confidential records." },
    { id: "controls", label: "What human approvals or checks already exist?", hint: "Mention the stage of the pilot and the decision you need to make next." }
  ],
  "ai-career-readiness": [
    { id: "background", label: "What is your current role or study background?", hint: "Include your relevant experience and AI learning so far." },
    { id: "direction", label: "What role or capability would you like to move towards?", hint: "Name one direction or decision you want help with." },
    { id: "plan", label: "What is your main obstacle and how much learning time can you commit?", hint: "You may paste a short CV summary or public LinkedIn URL; no private documents are needed." }
  ],
  "wellbeing-hms": [
    { id: "pattern", label: "Which everyday habit, focus or routine would you like to explore?", hint: "Keep this to a non-clinical development goal." },
    { id: "pause", label: "When do you notice the pattern and what happens when you pause?", hint: "Describe one recent everyday example without medical or intimate details." },
    { id: "experiment", label: "What small change would you like to practise over the next week?", hint: "Mention what you have tried and what makes follow-through difficult." }
  ],
  "sustainability-action": [
    { id: "context", label: "Where would you like to make a sustainability change?", hint: "For example, home, a team, a school or a small business." },
    { id: "issue", label: "Which resource-use or participation pattern needs attention?", hint: "Choose one issue such as waste, energy, consumption or employee involvement." },
    { id: "action", label: "What can you influence, and what could you measure in 30 days?", hint: "Mention existing actions, available evidence and the people who would take part." }
  ],
  "aml-kyc-training": [
    { id: "level", label: "What is your AML/KYC experience and work context?", hint: "New entrant, analyst or practitioner? Include industry and jurisdiction." },
    { id: "track", label: "Which focus should we prioritise?", hint: "Choose training, a NeXaAML demonstration or Australian Tranche 2 operational change." },
    { id: "priority", label: "What question or workflow should the session help you understand?", hint: "For example, source of wealth, due diligence, evidence, review roles or a change backlog. Use fictional examples." }
  ]
};
export function preparationFocus(serviceId: string, focus: string, raw: unknown) {
  const questions = preparationQuestions[serviceId];
  if (!questions || !raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("INVALID_PREPARATION");
  const values = raw as Record<string, unknown>;
  const answers = questions.map(question => {
    const value = values[question.id];
    if (typeof value !== "string" || value.trim().length < 3 || value.length > 180) throw new Error("INVALID_PREPARATION");
    return `${question.label}\n${value.trim()}`;
  });
  if (focus.trim().length < 10 || focus.length > 400) throw new Error("INVALID_PREPARATION");
  return [`Session goal: ${focus.trim()}`, ...answers].join("\n\n");
}
