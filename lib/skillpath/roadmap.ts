import { JOB_ROLES, type JobRole, type JobRoleCategory } from "@/lib/skillpath/jobRoles";
import type {
  AtsSnapshot,
  InterviewSnapshot,
  SkillMatchSnapshot
} from "@/lib/client/career-state";

export type RoadmapPhaseLabel = "30-day roadmap" | "60-day roadmap" | "90-day roadmap";

export type RoadmapWeek = {
  id: string;
  week: number;
  phase: RoadmapPhaseLabel;
  title: string;
  learningGoal: string;
  learningTopics: string[];
  theoryTopics: string[];
  practicalTasks: string[];
  handsOnTasks: string[];
  miniProject: string;
  practiceQuestions: string[];
  resources: string[];
  completionCriteria: string[];
  mockInterviewTarget: string;
  resumeImprovement: string;
};

export type GeneratedRoadmap = {
  role: string;
  category: JobRoleCategory;
  overview: string;
  topPriorities: string[];
  estimatedJobReadinessScore: number;
  phases: Array<{
    label: RoadmapPhaseLabel;
    summary: string;
    weeks: RoadmapWeek[];
  }>;
};

type RoadmapInput = {
  selectedRole: string;
  skillMatch: SkillMatchSnapshot | null;
  ats: AtsSnapshot | null;
  interview: InterviewSnapshot | null;
};

const phaseLabels: RoadmapPhaseLabel[] = [
  "30-day roadmap",
  "60-day roadmap",
  "90-day roadmap"
];

const phaseSummaries: Record<RoadmapPhaseLabel, string> = {
  "30-day roadmap":
    "Build confidence around the highest-impact foundations and close the first role-critical gaps.",
  "60-day roadmap":
    "Turn those foundations into applied project work, stronger resume evidence, and sharper interview answers.",
  "90-day roadmap":
    "Package your progress into portfolio-ready proof, tighter ATS alignment, and interview consistency."
};

const categoryProjectIdeas: Record<JobRoleCategory, string[]> = {
  Frontend: [
    "Build a responsive portfolio page that highlights your strongest project story.",
    "Create a dashboard interface with reusable components and polished states.",
    "Ship a small React app with loading, error, and empty states.",
    "Refactor a UI flow for accessibility and performance polish."
  ],
  Backend: [
    "Build a REST API with validation, persistence, and structured error handling.",
    "Create a service that exposes one clean business workflow end to end.",
    "Implement authentication, logging, and a role-aware data layer.",
    "Document a backend project with architecture notes and API examples."
  ],
  "Full Stack": [
    "Launch a small product that includes auth, CRUD flows, and a polished frontend.",
    "Build an end-to-end app with one clear user journey and clean API integration.",
    "Add analytics, validation, and state handling to a full stack project.",
    "Deploy a project and document the product decisions behind it."
  ],
  Data: [
    "Analyze a public dataset and turn the insights into a decision-ready dashboard.",
    "Build a metrics notebook that cleans, explores, and visualizes the data.",
    "Create a role-specific SQL case study with business recommendations.",
    "Publish a small dashboard that explains one product or business trend."
  ],
  "AI/ML": [
    "Train a focused model and document how you evaluated the output.",
    "Build a lightweight inference app around one applied ML or LLM use case.",
    "Compare two modeling approaches and explain the tradeoffs clearly.",
    "Package a model workflow with preprocessing, evaluation, and deployment notes."
  ],
  Mobile: [
    "Build a mobile-first app flow with navigation, forms, and persistent state.",
    "Create a polished feature screen with strong UX states and input handling.",
    "Ship a cross-platform mini app and document the architecture decisions.",
    "Improve app performance or offline behavior in a focused mobile project."
  ],
  "DevOps/Cloud": [
    "Automate deployment for a small service with CI/CD and environment config.",
    "Provision infrastructure for one app using Docker and cloud primitives.",
    "Create monitoring plus alerting for a deployed service.",
    "Document a cloud architecture with reliability and rollback thinking."
  ],
  Cybersecurity: [
    "Build a small security lab that demonstrates detection or hardening workflows.",
    "Document a vulnerability assessment with clear findings and remediation steps.",
    "Create a hands-on project around logging, incident response, or access control.",
    "Publish a concise case study showing how you improved security posture."
  ],
  "Product/Design": [
    "Create a case study from problem framing through final UX decisions.",
    "Design and validate a feature flow with wireframes and usability notes.",
    "Build a lightweight design system sample with clear component reasoning.",
    "Turn product insights into a roadmap or experiment brief with metrics."
  ],
  "QA/IT Support": [
    "Create an automated regression pack for one product workflow.",
    "Document a support or troubleshooting playbook for recurring issues.",
    "Build a testing checklist with clear coverage for edge cases and APIs.",
    "Package a bug triage or QA workflow with evidence and resolution notes."
  ]
};

const categoryInterviewTargets: Record<JobRoleCategory, string[]> = {
  Frontend: [
    "Practice explaining UI decisions, accessibility tradeoffs, and performance wins.",
    "Record two answers about React architecture and responsive implementation."
  ],
  Backend: [
    "Practice describing API design, data flow, and reliability decisions.",
    "Record two answers about debugging, database tradeoffs, and backend ownership."
  ],
  "Full Stack": [
    "Practice one end-to-end product story that links frontend impact to backend design.",
    "Record answers that show how you balance shipping speed with maintainability."
  ],
  Data: [
    "Practice turning analysis into business recommendations with clear metrics.",
    "Record answers that explain your SQL logic, dashboards, and decision-making."
  ],
  "AI/ML": [
    "Practice explaining model choice, evaluation, and tradeoffs in plain language.",
    "Record one answer on experimentation and one on real-world AI constraints."
  ],
  Mobile: [
    "Practice describing navigation, performance, and user experience decisions.",
    "Record one answer on state handling and one on shipping a polished mobile flow."
  ],
  "DevOps/Cloud": [
    "Practice explaining deployment, observability, and rollback decisions.",
    "Record answers on reliability, automation, and cloud architecture tradeoffs."
  ],
  Cybersecurity: [
    "Practice explaining risk, remediation priority, and incident response clearly.",
    "Record answers that show structured security thinking under pressure."
  ],
  "Product/Design": [
    "Practice talking through user problems, tradeoffs, and success metrics.",
    "Record one answer on collaboration and one on design or product rationale."
  ],
  "QA/IT Support": [
    "Practice describing debugging discipline, edge-case coverage, and customer empathy.",
    "Record answers that show issue triage, ownership, and communication clarity."
  ]
};

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function normalizeForComparison(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function pickUniqueString(
  candidates: string[],
  usedSet: Set<string>,
  fallback: string
) {
  for (const candidate of candidates) {
    const key = normalizeForComparison(candidate);
    if (!key || usedSet.has(key)) {
      continue;
    }

    usedSet.add(key);
    return candidate;
  }

  const fallbackKey = normalizeForComparison(fallback);
  const uniqueFallback = fallbackKey
    ? `${fallback} (${usedSet.size + 1})`
    : `Next milestone ${usedSet.size + 1}`;

  usedSet.add(normalizeForComparison(uniqueFallback));
  return uniqueFallback;
}

function pickUniqueList(
  candidates: string[],
  usedSet: Set<string>,
  count: number,
  fallbackBuilder: (index: number) => string
) {
  const selected: string[] = [];

  for (const candidate of candidates) {
    if (selected.length >= count) {
      break;
    }

    const key = normalizeForComparison(candidate);
    if (!key || usedSet.has(key)) {
      continue;
    }

    usedSet.add(key);
    selected.push(candidate);
  }

  while (selected.length < count) {
    const fallback = fallbackBuilder(selected.length + 1);
    const key = normalizeForComparison(fallback);

    if (!key || !usedSet.has(key)) {
      usedSet.add(key);
      selected.push(fallback);
    }
  }

  return selected;
}

function titleFromFocus(focusSkills: string[], week: number, phase: RoadmapPhaseLabel) {
  if (focusSkills.length >= 2) {
    return `Week ${week}: Strengthen ${focusSkills[0]} + ${focusSkills[1]}`;
  }

  if (focusSkills.length === 1) {
    return `Week ${week}: Deepen ${focusSkills[0]}`;
  }

  if (phase === "60-day roadmap") {
    return `Week ${week}: Apply your skills in a real workflow`;
  }

  if (phase === "90-day roadmap") {
    return `Week ${week}: Package your proof for applications`;
  }

  return `Week ${week}: Build momentum with your next milestone`;
}

function getRoleDefinition(selectedRole: string) {
  return JOB_ROLES.find((role) => role.title === selectedRole) ?? null;
}

function buildMissingSkills(role: JobRole, skillMatch: SkillMatchSnapshot | null) {
  const selectedMatch = skillMatch?.matchedRoles.find(
    (match) => match.role === role.title
  );

  if (selectedMatch) {
    return unique(selectedMatch.missingSkills);
  }

  const currentSkills = skillMatch?.combinedSkills ?? [];
  return unique(
    role.requiredSkills.filter((skill) => !currentSkills.includes(skill))
  );
}

function buildSkillQueue(role: JobRole, skillMatch: SkillMatchSnapshot | null) {
  const currentSkills = skillMatch?.combinedSkills ?? [];
  const missingSkills = buildMissingSkills(role, skillMatch);
  const optionalGaps = role.optionalSkills.filter(
    (skill) => !currentSkills.includes(skill)
  );

  return unique([
    ...missingSkills,
    ...role.requiredSkills.filter((skill) => !currentSkills.includes(skill)),
    ...optionalGaps
  ]);
}

function buildResumeFocusQueue(
  role: JobRole,
  ats: AtsSnapshot | null
) {
  const tasks: string[] = [];

  if (ats) {
    tasks.push(
      ...ats.missingSections.map(
        (section) => `Add or strengthen your ${section} section for ${role.title}.`
      )
    );
    tasks.push(
      ...ats.priorityKeywordGaps.high.map(
        (keyword) => `Naturally add "${keyword}" to one resume bullet or project entry.`
      )
    );
    tasks.push(
      ...ats.priorityKeywordGaps.medium.map(
        (keyword) => `Reinforce ${keyword} with a short results-focused bullet.`
      )
    );

    if (ats.breakdown.content < 72) {
      tasks.push("Rewrite weak bullets with actions, scope, and one measurable outcome.");
    }

    if (ats.breakdown.formatting < 72) {
      tasks.push("Tighten layout consistency, section spacing, and bullet formatting.");
    }

    if (ats.breakdown.readability < 72) {
      tasks.push("Shorten dense bullets so each one carries a single clear impact statement.");
    }

    if (ats.breakdown.roleFit < 72) {
      tasks.push(`Mirror the language of ${role.title} requirements more clearly in your project bullets.`);
    }
  }

  if (tasks.length === 0) {
    tasks.push(
      `Refresh your summary and project bullets so they sound clearly aligned with ${role.title} roles.`,
      "Add one quantified achievement to your strongest project bullet.",
      "Make sure your most relevant skills appear in the top half of the resume."
    );
  }

  return unique(tasks);
}

function buildInterviewFocusQueue(
  role: JobRole,
  interview: InterviewSnapshot | null
) {
  const tasks: string[] = [];

  if (interview) {
    tasks.push(...interview.improvements);

    if (interview.scores.relevance < 7) {
      tasks.push(`Use more ${role.title}-specific language when explaining your work.`);
    }

    if (interview.scores.confidence < 7) {
      tasks.push("Practice speaking in shorter, more certain statements with clearer ownership.");
    }

    if (interview.scores.clarity < 7) {
      tasks.push("Structure answers with context, action, and result so the story feels easier to follow.");
    }

    if (interview.scores.communication < 7) {
      tasks.push("Use explicit impact language like result, because, improved, and delivered.");
    }
  }

  if (tasks.length === 0) {
    tasks.push(
      `Record two ${role.title} mock answers each week and review them for structure and specificity.`,
      "Practice one behavioral answer and one technical or project answer every week."
    );
  }

  return unique(tasks);
}

function buildLearningGoal(
  role: JobRole,
  focusSkills: string[],
  phase: RoadmapPhaseLabel,
  week: number,
  usedSet: Set<string>
) {
  const leadFocus = focusSkills[0] ?? role.requiredSkills[(week - 1) % role.requiredSkills.length];
  const concepts = [
    `Build confidence with ${leadFocus} by applying it to a realistic ${role.title.toLowerCase()} workflow.`,
    `Strengthen your grasp of ${leadFocus} enough to explain it clearly and use it in a small project.`,
    `Turn ${leadFocus} into a reusable skill by building evidence that you can talk about in interviews.`,
    `Move from theory to practice with ${leadFocus} and one adjacent ${role.category.toLowerCase()} concept.`
  ];

  if (phase === "60-day roadmap") {
    concepts.unshift(`Use ${leadFocus} in a more complete project flow that feels close to a real delivery loop.`);
  }

  if (phase === "90-day roadmap") {
    concepts.unshift(`Package your experience with ${leadFocus} so it reads clearly in portfolios, resumes, and mock interviews.`);
  }

  return pickUniqueString(concepts, usedSet, `Finish a focused ${leadFocus} milestone.`);
}

function buildTheoryTopics(
  role: JobRole,
  focusSkills: string[],
  phase: RoadmapPhaseLabel,
  week: number,
  usedSet: Set<string>
) {
  const leadFocus = focusSkills[0] ?? role.requiredSkills[(week - 1) % role.requiredSkills.length];
  const supportFocus = focusSkills[1] ?? role.optionalSkills[(week - 1) % Math.max(role.optionalSkills.length, 1)] ?? "delivery tradeoffs";
  const candidates = unique([
    `${leadFocus} fundamentals`,
    `${supportFocus} patterns`,
    `${role.title} workflow design`,
    `${role.category} implementation tradeoffs`,
    `${leadFocus} debugging strategies`,
    `${supportFocus} evaluation methods`
  ]);

  return pickUniqueList(candidates, usedSet, phase === "30-day roadmap" ? 3 : 4, (index) => `${role.title} concept ${index}`);
}

function buildPracticalTasks(
  role: JobRole,
  focusSkills: string[],
  week: number,
  phase: RoadmapPhaseLabel,
  usedSet: Set<string>
) {
  const leadFocus = focusSkills[0] ?? role.requiredSkills[(week - 1) % role.requiredSkills.length];
  const supportFocus =
    focusSkills[1] ?? role.requiredSkills[week % role.requiredSkills.length];

  const candidates = [
    `Study the core patterns behind ${leadFocus} and capture one implementation note you can reuse later.`,
    `Ship a small practice artifact using ${leadFocus}${supportFocus ? ` and ${supportFocus}` : ""}.`,
    `Review your output and write down one strength and one improvement before the next checkpoint.`,
    `Turn ${leadFocus} into a tiny feature that connects to a realistic ${role.title.toLowerCase()} use case.`,
    `Document one design or debugging decision you made while working with ${leadFocus}.`,
    `Refine one deliverable so it demonstrates ${leadFocus} more clearly than before.`,
    `Create a concise demo or walkthrough that explains your work on ${leadFocus}.`
  ];

  if (phase === "60-day roadmap") {
    candidates.unshift(`Build a more complete workflow around ${leadFocus} and ${supportFocus} instead of a toy example.`);
  }

  if (phase === "90-day roadmap") {
    candidates.unshift(`Package your strongest work on ${leadFocus} into something portfolio-ready and easy to explain.`);
  }

  return pickUniqueList(candidates, usedSet, 3, (index) => `${role.title} task ${index}`);
}

function buildMiniProject(
  role: JobRole,
  focusSkills: string[],
  week: number,
  usedSet: Set<string>
) {
  const leadFocus = focusSkills[0] ?? role.requiredSkills[(week - 1) % role.requiredSkills.length];
  const supportFocus =
    focusSkills[1] ?? role.optionalSkills[(week - 1) % Math.max(role.optionalSkills.length, 1)] ?? "real user value";
  const candidates = [
    `Calculator`,
    `Weather App`,
    `Authentication System`,
    `Analytics Dashboard`,
    `Task Board`,
    `Recommendation Console`,
    `Content Moderation Lab`,
    `Deployment Tracker`
  ];
  const baseProject = pickUniqueString(candidates, usedSet, `${role.title} project`);

  return `${baseProject} built around ${leadFocus} and ${supportFocus}.`;
}

function buildPracticeQuestions(
  role: JobRole,
  focusSkills: string[],
  phase: RoadmapPhaseLabel,
  week: number,
  usedSet: Set<string>
) {
  const leadFocus = focusSkills[0] ?? role.requiredSkills[(week - 1) % role.requiredSkills.length];
  const candidates = [
    `How would you explain ${leadFocus} to a teammate in plain language?`,
    `What tradeoff did you make when solving a ${leadFocus} problem?`,
    `How would you improve this work if you had one more iteration?`,
    `What evidence would you show to prove you understand ${leadFocus}?`,
    `How would you connect ${leadFocus} to a real user or business outcome?`
  ];

  if (phase === "90-day roadmap") {
    candidates.unshift(`How would you present your ${leadFocus} work in a portfolio or interview story?`);
  }

  return pickUniqueList(candidates, usedSet, 2, (index) => `${role.title} reflection ${index}`);
}

function buildResources(
  role: JobRole,
  focusSkills: string[],
  phase: RoadmapPhaseLabel,
  week: number,
  usedSet: Set<string>
) {
  const leadFocus = focusSkills[0] ?? role.requiredSkills[(week - 1) % role.requiredSkills.length];
  const candidates = [
    `Official ${leadFocus} documentation`,
    `A practical walkthrough on ${leadFocus} in a ${role.category.toLowerCase()} context`,
    `A small repository or case study that demonstrates ${leadFocus}`,
    `A short article or tutorial focused on ${leadFocus} tradeoffs`,
    `A project template for ${role.title.toLowerCase()} work`
  ];

  if (phase === "60-day roadmap") {
    candidates.unshift(`A deeper guide on implementation patterns for ${leadFocus}`);
  }

  if (phase === "90-day roadmap") {
    candidates.unshift(`A portfolio-style example showing ${leadFocus} in context`);
  }

  return pickUniqueList(candidates, usedSet, 3, (index) => `${role.title} resource ${index}`);
}

function buildCompletionCriteria(
  role: JobRole,
  focusSkills: string[],
  phase: RoadmapPhaseLabel,
  week: number,
  usedSet: Set<string>
) {
  const leadFocus = focusSkills[0] ?? role.requiredSkills[(week - 1) % role.requiredSkills.length];
  const candidates = [
    `You can explain ${leadFocus} clearly and connect it to one concrete example.`,
    `You completed a small artifact that demonstrates your understanding of ${leadFocus}.`,
    `You can describe one tradeoff or improvement you would make next.`,
    `You have a reusable note or demo you can bring into a resume or interview story.`
  ];

  if (phase === "90-day roadmap") {
    candidates.unshift(`You can present your work on ${leadFocus} as a clear portfolio or interview story.`);
  }

  return pickUniqueList(candidates, usedSet, 2, (index) => `${role.title} milestone ${index}`);
}

function buildMockTarget(
  role: JobRole,
  interviewFocusQueue: string[],
  phase: RoadmapPhaseLabel,
  week: number,
  usedSet: Set<string>
) {
  const roleTemplate =
    categoryInterviewTargets[role.category][(week - 1) % categoryInterviewTargets[role.category].length];
  const focus = interviewFocusQueue[(week - 1) % interviewFocusQueue.length];
  const candidates = [
    `${roleTemplate} This week, emphasize: ${focus}`,
    `${roleTemplate} End the week with one short mock answer on: ${focus}`,
    `${roleTemplate} Practice explaining your approach to: ${focus}`
  ];

  if (phase === "90-day roadmap") {
    candidates.unshift(`${roleTemplate} End the week with one full mock round and review: ${focus}`);
  }

  return pickUniqueString(candidates, usedSet, `${role.title} interview target`);
}

function deriveSkillCoverage(role: JobRole, skillMatch: SkillMatchSnapshot | null) {
  const selectedMatch = skillMatch?.matchedRoles.find(
    (match) => match.role === role.title
  );

  if (selectedMatch) {
    return selectedMatch.percentage;
  }

  const currentSkills = skillMatch?.combinedSkills ?? [];
  const overlap = role.requiredSkills.filter((skill) =>
    currentSkills.includes(skill)
  ).length;

  return clampScore((overlap / Math.max(role.requiredSkills.length, 1)) * 100);
}

function deriveInterviewReadiness(interview: InterviewSnapshot | null) {
  if (!interview) {
    return 50;
  }

  const average =
    (interview.scores.relevance +
      interview.scores.confidence +
      interview.scores.clarity +
      interview.scores.communication) /
    4;

  return clampScore(average * 10);
}

function deriveAtsReadiness(ats: AtsSnapshot | null) {
  return ats?.score ?? 52;
}

export function generateCareerRoadmap(input: RoadmapInput) {
  const role =
    getRoleDefinition(input.selectedRole) ??
    JOB_ROLES[0];
  const skillQueue = buildSkillQueue(role, input.skillMatch);
  const resumeFocusQueue = buildResumeFocusQueue(role, input.ats);
  const interviewFocusQueue = buildInterviewFocusQueue(role, input.interview);
  const skillCoverage = deriveSkillCoverage(role, input.skillMatch);
  const atsReadiness = deriveAtsReadiness(input.ats);
  const interviewReadiness = deriveInterviewReadiness(input.interview);
  const estimatedJobReadinessScore = clampScore(
    skillCoverage * 0.45 + atsReadiness * 0.3 + interviewReadiness * 0.25
  );

  const usedTitles = new Set<string>();
  const usedLearningGoals = new Set<string>();
  const usedTheoryTopics = new Set<string>();
  const usedTasks = new Set<string>();
  const usedProjects = new Set<string>();
  const usedPracticeQuestions = new Set<string>();
  const usedResources = new Set<string>();
  const usedCompletionCriteria = new Set<string>();
  const usedInterviewTargets = new Set<string>();
  const usedResumeImprovements = new Set<string>();

  const weeks = Array.from({ length: 12 }, (_, index) => {
    const week = index + 1;
    const phase =
      week <= 4
        ? "30-day roadmap"
        : week <= 8
          ? "60-day roadmap"
          : "90-day roadmap";
    const queueOffset = Math.min(index, Math.max(skillQueue.length - 1, 0));
    const focusSkills = unique(
      skillQueue.length > 0
        ? skillQueue.slice(queueOffset, queueOffset + (phase === "30-day roadmap" ? 2 : 1))
        : role.requiredSkills.slice(index % role.requiredSkills.length, (index % role.requiredSkills.length) + 2)
    ).slice(0, 2);

    const learningGoal = buildLearningGoal(role, focusSkills, phase, week, usedLearningGoals);
    const theoryTopics = buildTheoryTopics(role, focusSkills, phase, week, usedTheoryTopics);
    const practicalTasks = buildPracticalTasks(role, focusSkills, week, phase, usedTasks);
    const miniProject = buildMiniProject(role, focusSkills, week, usedProjects);
    const practiceQuestions = buildPracticeQuestions(role, focusSkills, phase, week, usedPracticeQuestions);
    const resources = buildResources(role, focusSkills, phase, week, usedResources);
    const completionCriteria = buildCompletionCriteria(role, focusSkills, phase, week, usedCompletionCriteria);
    const title = pickUniqueString(
      [titleFromFocus(focusSkills, week, phase)],
      usedTitles,
      `Week ${week}: Build a stronger ${role.title.toLowerCase()} foundation`
    );
    const mockInterviewTarget = buildMockTarget(role, interviewFocusQueue, phase, week, usedInterviewTargets);
    const resumeImprovement = pickUniqueString(
      resumeFocusQueue,
      usedResumeImprovements,
      `Tailor one resume bullet more clearly for ${role.title}.`
    );

    return {
      id: `${role.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-week-${week}`,
      week,
      phase,
      title,
      learningGoal,
      learningTopics: theoryTopics,
      theoryTopics,
      practicalTasks,
      handsOnTasks: practicalTasks,
      miniProject,
      practiceQuestions,
      resources,
      completionCriteria,
      mockInterviewTarget,
      resumeImprovement
    } satisfies RoadmapWeek;
  });

  const phases = phaseLabels.map((label) => ({
    label,
    summary: phaseSummaries[label],
    weeks: weeks.filter((week) => week.phase === label)
  }));

  const topPriorities = unique([
    ...(skillQueue.slice(0, 3).map((skill) => `Close the ${skill} gap`)),
    resumeFocusQueue[0],
    interviewFocusQueue[0]
  ]).slice(0, 4);

  return {
    role: role.title,
    category: role.category,
    overview: `This roadmap is tuned for ${role.title} using your current skill profile, ATS readiness, and interview feedback. The first month closes foundational gaps, the second turns them into proof, and the final stretch packages everything for applications.`,
    topPriorities,
    estimatedJobReadinessScore,
    phases
  } satisfies GeneratedRoadmap;
}

export function getRoadmapProgress(
  roadmap: GeneratedRoadmap,
  completedWeekIds: string[]
) {
  const allWeeks = roadmap.phases.flatMap((phase) => phase.weeks);
  const completedCount = allWeeks.filter((week) =>
    completedWeekIds.includes(week.id)
  ).length;
  const progressPercentage = clampScore(
    (completedCount / Math.max(allWeeks.length, 1)) * 100
  );
  const nextWeek = allWeeks.find((week) => !completedWeekIds.includes(week.id)) ?? null;
  const nextRecommendedTask = nextWeek?.practicalTasks[0] ?? "Review applications and keep momentum steady.";

  return {
    progressPercentage,
    completedCount,
    totalWeeks: allWeeks.length,
    nextRecommendedTask,
    nextWeek
  };
}
