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
  learningTopics: string[];
  practicalTasks: string[];
  miniProject: string;
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

function buildLearningTopics(role: JobRole, focusSkills: string[], phase: RoadmapPhaseLabel) {
  const topics = [...focusSkills];

  if (phase === "30-day roadmap") {
    topics.push(`${role.title} fundamentals`);
  } else if (phase === "60-day roadmap") {
    topics.push(`${role.category} project implementation`);
  } else {
    topics.push(`${role.title} interview proof and delivery`);
  }

  return unique(topics).slice(0, 3);
}

function buildPracticalTasks(
  role: JobRole,
  focusSkills: string[],
  week: number,
  phase: RoadmapPhaseLabel
) {
  const leadFocus = focusSkills[0] ?? role.requiredSkills[(week - 1) % role.requiredSkills.length];
  const supportFocus =
    focusSkills[1] ?? role.requiredSkills[week % role.requiredSkills.length];

  if (phase === "30-day roadmap") {
    return [
      `Study the core patterns behind ${leadFocus} and write short implementation notes.`,
      `Ship one focused practice task using ${leadFocus}${supportFocus ? ` and ${supportFocus}` : ""}.`,
      `Review your output and note one thing to improve before the next week.`
    ];
  }

  if (phase === "60-day roadmap") {
    return [
      `Turn ${leadFocus} into a production-style feature or workflow for a ${role.title.toLowerCase()} portfolio piece.`,
      `Connect the work to ${supportFocus} so the project feels closer to real role expectations.`,
      "Document one clear technical tradeoff or decision from the build."
    ];
  }

  return [
    `Polish the strongest project evidence for ${leadFocus} and make it recruiter-ready.`,
    `Practice explaining how ${leadFocus}${supportFocus ? ` and ${supportFocus}` : ""} created impact.`,
    "Prepare one application-ready proof point you can reuse in interviews and resume bullets."
  ];
}

function buildMiniProject(
  role: JobRole,
  focusSkills: string[],
  week: number
) {
  const ideaPool = categoryProjectIdeas[role.category];
  const leadFocus = focusSkills[0] ?? role.requiredSkills[(week - 1) % role.requiredSkills.length];
  const supportFocus =
    focusSkills[1] ?? role.optionalSkills[(week - 1) % Math.max(role.optionalSkills.length, 1)] ?? "real user value";
  const template = ideaPool[(week - 1) % ideaPool.length];

  return `${template} Focus the implementation on ${leadFocus} and ${supportFocus}.`;
}

function buildMockTarget(
  role: JobRole,
  interviewFocusQueue: string[],
  phase: RoadmapPhaseLabel,
  week: number
) {
  const roleTemplate =
    categoryInterviewTargets[role.category][(week - 1) % categoryInterviewTargets[role.category].length];
  const focus = interviewFocusQueue[(week - 1) % interviewFocusQueue.length];

  if (phase === "90-day roadmap") {
    return `${roleTemplate} End the week with one full mock round and review: ${focus}`;
  }

  return `${roleTemplate} This week, emphasize: ${focus}`;
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

    return {
      id: `${role.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-week-${week}`,
      week,
      phase,
      title: titleFromFocus(focusSkills, week, phase),
      learningTopics: buildLearningTopics(role, focusSkills, phase),
      practicalTasks: buildPracticalTasks(role, focusSkills, week, phase),
      miniProject: buildMiniProject(role, focusSkills, week),
      mockInterviewTarget: buildMockTarget(role, interviewFocusQueue, phase, week),
      resumeImprovement:
        resumeFocusQueue[(week - 1) % resumeFocusQueue.length] ??
        `Tailor one resume bullet more clearly for ${role.title}.`
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
