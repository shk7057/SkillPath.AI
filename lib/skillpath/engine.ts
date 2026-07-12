import {
  COMMON_RESUME_KEYWORDS,
  COMMON_RESUME_SECTIONS,
  KNOWN_SKILLS,
  ROLE_DEFINITIONS
} from "@/lib/skillpath/catalog";
import {
  getJobRoleByTitle,
  matchRoleByTitle,
  matchRoles,
  normalizeSkills
} from "@/lib/skillpath/matchRoles";
import type {
  AtsCheckResponse,
  InterviewAnswerResponse,
  InterviewStartResponse,
  MatchedRoleResult,
  SkillMatchAnalysisResponse
} from "@/lib/skillpath/types";

function normalizeValue(value: string) {
  return value.toLowerCase().trim();
}

function normalizeForMatch(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}

export function extractSkillsFromText(text: string) {
  const normalizedText = ` ${normalizeForMatch(text)} `;

  return KNOWN_SKILLS.filter(
    (skill) =>
      normalizedText.includes(` ${normalizeForMatch(skill.name)} `) ||
      skill.aliases.some((alias) =>
        normalizedText.includes(` ${normalizeForMatch(alias)} `)
      )
  ).map((skill) => skill.name);
}

export function detectResumeSections(text: string) {
  const normalizedText = normalizeValue(text);

  return COMMON_RESUME_SECTIONS.filter((section) =>
    section.aliases.some((alias) => normalizedText.includes(alias))
  ).map((section) => section.name);
}

function buildSkillMatchSummary(
  combinedSkills: string[],
  topRole: MatchedRoleResult | undefined
) {
  if (!topRole) {
    return "Add a few skills or upload a resume to see which job paths fit you best.";
  }

  if (combinedSkills.length === 0) {
    return "We need skill signals before we can suggest roles with confidence.";
  }

  const strongestSignals = combinedSkills.slice(0, 4).join(", ");
  const gapPreview =
    topRole.missingSkills.length > 0
      ? `The biggest gap to close is ${topRole.missingSkills
          .slice(0, 2)
          .join(" and ")}.`
      : "Your current skill set already covers the main expectations for this role.";

  return `${topRole.role} is your strongest match right now based on ${strongestSignals}. ${gapPreview}`;
}

export function analyzeSkillMatch(input: {
  manualSkills: string[];
  resumeText?: string;
}) {
  const manualSkills = normalizeSkills(input.manualSkills);
  const extractedSkills = input.resumeText
    ? extractSkillsFromText(input.resumeText)
    : [];
  const combinedSkills = normalizeSkills([...manualSkills, ...extractedSkills]);
  const matchedRoles = matchRoles(combinedSkills);
  const selectedRole = matchedRoles[0]?.role ?? null;
  const summary = buildSkillMatchSummary(combinedSkills, matchedRoles[0]);
  const roadmapExplanation = matchedRoles[0]
    ? `Your roadmap is built around the missing skills for ${matchedRoles[0].role}. Focus on the first step, then update your resume and interview examples as you close each gap.`
    : "Once we detect a few skills, we will generate a focused roadmap for the closest-fit role.";

  return {
    extractedSkills,
    combinedSkills,
    matchedRoles,
    selectedRole,
    summary,
    roadmapExplanation
  } satisfies SkillMatchAnalysisResponse;
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function countBullets(text: string) {
  return (text.match(/(^|\n)\s*(?:[-*]|\u2022|\d+\.)\s+/g) ?? []).length;
}

const ACTION_VERBS = [
  "built",
  "created",
  "developed",
  "designed",
  "led",
  "launched",
  "implemented",
  "optimized",
  "improved",
  "automated",
  "delivered",
  "owned",
  "analyzed",
  "managed"
];

function countQuantifiedAchievements(text: string) {
  return (
    text.match(/\b\d+(?:\.\d+)?%?\b|\b(?:one|two|three|four|five|six|seven|eight|nine|ten)\b/gi) ??
    []
  ).length;
}

function countActionVerbHits(text: string) {
  const normalizedText = normalizeValue(text);

  return ACTION_VERBS.filter((verb) => normalizedText.includes(verb)).length;
}

function splitResumeStatements(text: string) {
  return text
    .split(/(?:\r?\n|[\u2022\u00b7]|(?<=[.!?])\s+)/)
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter((item) => item.split(/\s+/).length >= 5);
}

function getSectionSnippets(text: string) {
  const normalizedText = normalizeValue(text);
  const locatedSections = COMMON_RESUME_SECTIONS.map((section) => {
    const positions = section.aliases
      .map((alias) => normalizedText.indexOf(alias))
      .filter((position) => position >= 0);
    const start = positions.length > 0 ? Math.min(...positions) : -1;

    return {
      name: section.name,
      start
    };
  })
    .filter((section) => section.start >= 0)
    .sort((left, right) => left.start - right.start);

  return locatedSections.map((section, index) => {
    const end =
      index < locatedSections.length - 1
        ? locatedSections[index + 1].start
        : normalizedText.length;

    return {
      section: section.name,
      snippet: text.slice(section.start, end).trim()
    };
  });
}

function buildSectionHeatmap(text: string, extractedSkills: string[]) {
  const snippets = getSectionSnippets(text);
  const snippetMap = new Map(snippets.map((item) => [item.section, item.snippet]));

  return COMMON_RESUME_SECTIONS.map((section) => {
    const snippet = snippetMap.get(section.name);

    if (!snippet) {
      return {
        section: section.name,
        status: "Missing" as const,
        note: `Add a clear ${section.name.toLowerCase()} section so ATS tools can identify it quickly.`
      };
    }

    const words = snippet.split(/\s+/).filter(Boolean).length;
    const quantifiedHits = countQuantifiedAchievements(snippet);
    const actionHits = countActionVerbHits(snippet);

    if (section.name === "Skills") {
      const strong = extractedSkills.length >= 6 || words >= 12;

      return {
        section: section.name,
        status: strong ? ("Strong" as const) : ("Needs Work" as const),
        note: strong
          ? "Skill coverage is visible and likely easy for recruiters and ATS tools to scan."
          : "Add more role-relevant tools, frameworks, and platforms to strengthen skill coverage."
      };
    }

    if (section.name === "Experience" || section.name === "Projects") {
      const strong = words >= 28 && (quantifiedHits > 0 || actionHits >= 2);

      return {
        section: section.name,
        status: strong ? ("Strong" as const) : ("Needs Work" as const),
        note: strong
          ? "This section shows enough detail and impact signals to support ATS and recruiter review."
          : "Add clearer outcomes, action verbs, and measurable impact so this section feels stronger."
      };
    }

    const strong = words >= (section.name === "Summary" ? 18 : 8);

    return {
      section: section.name,
      status: strong ? ("Strong" as const) : ("Needs Work" as const),
      note: strong
        ? "This section is present and provides enough context for a solid ATS scan."
        : "This section exists, but it needs a little more clarity or detail to score better."
    };
  });
}

function createWeakBulletRewrites(text: string) {
  const statements = splitResumeStatements(text);

  return statements
    .filter((statement) => {
      const quantifiedHits = countQuantifiedAchievements(statement);
      const actionHits = countActionVerbHits(statement);

      return quantifiedHits === 0 || actionHits === 0;
    })
    .slice(0, 3)
    .map((statement) => {
      const cleaned = statement.replace(/[.]+$/, "").trim();

      return {
        original: cleaned,
        improved:
          countQuantifiedAchievements(cleaned) > 0
            ? `${cleaned}, tying the work to a clearer business result and stronger ownership language.`
            : `${cleaned}, driving a measurable result such as a 25% efficiency gain, faster delivery cycle, or stronger user engagement.`
      };
    });
}

function createPriorityKeywordGaps(
  text: string,
  targetRole: string | null,
  topRole: MatchedRoleResult | undefined
) {
  const normalizedText = normalizeValue(text);
  const roleDefinition = targetRole ? getJobRoleByTitle(targetRole) : null;
  const high = topRole?.missingSkills.slice(0, 4) ?? [];
  const medium = (roleDefinition?.optionalSkills ?? [])
    .filter((skill) => !high.includes(skill))
    .filter((skill) => !normalizedText.includes(normalizeValue(skill)))
    .slice(0, 4);
  const low = COMMON_RESUME_KEYWORDS.filter(
    (keyword) =>
      !high.includes(keyword) &&
      !medium.includes(keyword) &&
      !normalizedText.includes(normalizeValue(keyword))
  ).slice(0, 4);

  return {
    high,
    medium,
    low
  };
}

function createRoleAwareMissingKeywords(
  priorityKeywordGaps: ReturnType<typeof createPriorityKeywordGaps>
) {
  return unique([
    ...priorityKeywordGaps.high,
    ...priorityKeywordGaps.medium,
    ...priorityKeywordGaps.low
  ]).slice(0, 10);
}

function createAtsSuggestions(
  missingSections: string[],
  missingKeywords: string[],
  topRole: MatchedRoleResult | undefined,
  wordCount: number
) {
  const suggestions: string[] = [];

  if (missingSections.length > 0) {
    suggestions.push(
      `Add clear ${missingSections
        .slice(0, 2)
        .join(" and ")
        .toLowerCase()} sections so recruiters and ATS tools can scan your resume more reliably.`
    );
  }

  if (missingKeywords.length > 0) {
    suggestions.push(
      `Work role-specific keywords like ${missingKeywords
        .slice(0, 3)
        .join(", ")} into project and experience bullets naturally.`
    );
  }

  if (wordCount < 180) {
    suggestions.push(
      "Add more concrete project detail and measurable impact so the resume does not feel too thin."
    );
  }

  if (topRole && topRole.matchedSkills.length > 0) {
    suggestions.push(
      `Make your strongest ${topRole.role.toLowerCase()} signals more explicit by highlighting ${topRole.matchedSkills
        .slice(0, 2)
        .join(" and ")} near the top.`
    );
  }

  return suggestions.slice(0, 4);
}

export function analyzeAts(input: { resumeText: string; targetRole?: string | null }) {
  const text = input.resumeText;
  const extractedSkills = extractSkillsFromText(text);
  const detectedSections = detectResumeSections(text);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const bulletCount = countBullets(text);
  const statements = splitResumeStatements(text);
  const matchedRoles = matchRoles(extractedSkills);
  const focusedRole =
    input.targetRole?.trim()
      ? matchRoleByTitle(extractedSkills, input.targetRole.trim())
      : null;
  const topRole = focusedRole ?? matchedRoles[0];
  const targetRole = focusedRole?.role ?? input.targetRole?.trim() ?? null;
  const suggestedRole = topRole?.role ?? null;
  const missingSections = COMMON_RESUME_SECTIONS.map((section) => section.name).filter(
    (section) => !detectedSections.includes(section)
  );
  const sectionHeatmap = buildSectionHeatmap(text, extractedSkills);
  const quantifiedHits = countQuantifiedAchievements(text);
  const actionHits = countActionVerbHits(text);
  const priorityKeywordGaps = createPriorityKeywordGaps(text, targetRole, topRole);
  const missingKeywords = createRoleAwareMissingKeywords(priorityKeywordGaps);

  const keywordMatch = clampScore(
    topRole ? topRole.percentage : extractedSkills.length === 0 ? 18 : 30 + extractedSkills.length * 8
  );
  const formatting = clampScore(
    92 -
      missingSections.length * 10 -
      (bulletCount === 0 ? 8 : 0) -
      (wordCount < 180 ? 10 : 0) +
      (bulletCount >= 4 ? 4 : 0)
  );
  const content = clampScore(
    28 +
      Math.min(actionHits * 7, 24) +
      Math.min(quantifiedHits * 8, 24) +
      (detectedSections.includes("Projects") ? 10 : 0) +
      (detectedSections.includes("Experience") ? 10 : 0) -
      (statements.length < 3 ? 12 : 0)
  );
  const averageSentenceLength =
    statements.length > 0 ? wordCount / statements.length : wordCount;
  const readability = clampScore(
    82 -
      (averageSentenceLength > 28 ? 12 : 0) -
      (wordCount > 750 ? 10 : 0) -
      (wordCount < 180 ? 8 : 0) +
      (statements.length >= 4 ? 6 : 0)
  );
  const roleFit = clampScore(topRole?.percentage ?? 24);
  const score = clampScore(
    formatting * 0.22 +
      keywordMatch * 0.24 +
      content * 0.22 +
      readability * 0.16 +
      roleFit * 0.16
  );

  const summaryItems = [
    extractedSkills.length > 0
      ? `Detected ${extractedSkills.length} recognized skills, including ${extractedSkills
          .slice(0, 3)
          .join(", ")}.`
      : "Very few recognizable job-ready skills were detected in the current resume text.",
    missingSections.length > 0
      ? `Missing sections reduce ATS clarity: ${missingSections.join(", ")}.`
      : "Core resume sections are present and easy to scan.",
    topRole
      ? `${topRole.role} is the closest-fit role right now at ${topRole.percentage}%.`
      : "A stronger skill signal will help map this resume to the right role."
  ];

  const improvementSuggestions = createAtsSuggestions(
    missingSections,
    missingKeywords,
    topRole,
    wordCount
  );
  const weakBulletRewrites = createWeakBulletRewrites(text);

  return {
    score,
    keywordMatch,
    formatting,
    content,
    readability,
    roleFit,
    headline: topRole
      ? `${topRole.role} is currently the best-fit path, but ATS clarity will improve once the missing sections and keywords are addressed.`
      : "The resume needs stronger structure and clearer skill signals before ATS matching can improve.",
    targetRole,
    suggestedRole,
    missingSections,
    missingKeywords,
    summaryItems,
    improvementSuggestions,
    breakdown: {
      formatting,
      keywords: keywordMatch,
      content,
      readability,
      roleFit
    },
    priorityKeywordGaps,
    sectionHeatmap,
    weakBulletRewrites
  } satisfies AtsCheckResponse;
}

function getQuestionBank(role: string, difficulty: "Easy" | "Medium" | "Advanced") {
  return (
    ROLE_DEFINITIONS.find((item) => item.name === role)?.questionBank[difficulty] ??
    []
  ).filter((question): question is string => Boolean(question && question.trim()));
}

export function startInterview(input: {
  role: string;
  difficulty: "Easy" | "Medium" | "Advanced";
}) {
  const questions = getQuestionBank(input.role, input.difficulty);
  const fallbackQuestion = "Tell me about your strongest project and the impact it created.";
  const question = (questions[0] ?? fallbackQuestion).trim().replace(/^['"`]+|['"`]+$/g, "");

  return {
    role: input.role,
    question,
    questionIndex: 0,
    interviewerName: "Mira",
    introduction: `We will focus on ${input.role.toLowerCase()} questions with ${input.difficulty.toLowerCase()} difficulty.`
  } satisfies InterviewStartResponse;
}

function roundTenScale(value: number) {
  return Math.max(1, Math.min(10, Math.round(value * 10) / 10));
}

function keywordHits(answer: string, keywords: string[]) {
  const normalizedAnswer = normalizeValue(answer);

  return keywords.filter((keyword) =>
    normalizedAnswer.includes(normalizeValue(keyword))
  ).length;
}

export function evaluateInterviewAnswer(input: {
  role: string;
  answer: string;
  questionIndex: number;
  difficulty: "Easy" | "Medium" | "Advanced";
}) {
  const roleDefinition = ROLE_DEFINITIONS.find((role) => role.name === input.role);
  const currentBank = getQuestionBank(input.role, input.difficulty);
  const nextQuestion = currentBank[input.questionIndex + 1] ?? null;
  const answerWordCount = input.answer.split(/\s+/).filter(Boolean).length;
  const matchedSkillHits = keywordHits(
    input.answer,
    roleDefinition?.requiredSkills ?? []
  );
  const relevance = roundTenScale(
    4.8 + matchedSkillHits * 0.45 + Math.min(answerWordCount / 45, 2.2)
  );
  const confidenceSignal = keywordHits(input.answer, [
    "i built",
    "i led",
    "i owned",
    "i improved",
    "i delivered",
    "i designed"
  ]);
  const fillerSignal = keywordHits(input.answer, [
    "maybe",
    "kind of",
    "sort of",
    "um"
  ]);
  const confidence = roundTenScale(
    5.2 + confidenceSignal * 0.7 - fillerSignal * 0.4
  );
  const sentenceCount = input.answer.split(/[.!?]+/).filter(Boolean).length;
  const clarity = roundTenScale(
    5.4 +
      (sentenceCount >= 2 ? 1 : 0) +
      (answerWordCount >= 45 ? 1.1 : 0) -
      (answerWordCount > 220 ? 1 : 0)
  );
  const communicationKeywords = keywordHits(input.answer, [
    "because",
    "result",
    "impact",
    "then",
    "after",
    "so that"
  ]);
  const communication = roundTenScale(
    5 + communicationKeywords * 0.65 + sentenceCount * 0.2
  );

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (matchedSkillHits > 0) {
    strengths.push(
      `You connected your answer to ${matchedSkillHits} role-relevant skill signal${
        matchedSkillHits > 1 ? "s" : ""
      }.`
    );
  }

  if (answerWordCount >= 45) {
    strengths.push("Your answer had enough detail to feel substantive and interview-ready.");
  }

  if (communicationKeywords > 0) {
    strengths.push(
      "You used cause-and-effect language that made your thinking easier to follow."
    );
  }

  if (matchedSkillHits === 0) {
    improvements.push(
      "Use more role-specific language so the interviewer can clearly connect your answer to the target job."
    );
  }

  if (answerWordCount < 40) {
    improvements.push(
      "Add more context, actions, and results so the answer feels complete instead of too short."
    );
  }

  if (fillerSignal > 0) {
    improvements.push(
      "Tighten uncertain wording and replace filler phrases with more direct, confident language."
    );
  }

  if (strengths.length === 0) {
    strengths.push(
      "You gave a usable starting answer that can be refined into a stronger interview story."
    );
  }

  if (improvements.length === 0) {
    improvements.push(
      "Add one metric or concrete outcome to make the answer even more persuasive."
    );
  }

  return {
    role: input.role,
    questionIndex: input.questionIndex,
    nextQuestion,
    summary: `Your answer is tracking best on ${
      relevance >= confidence ? "relevance" : "confidence"
    }, and the next lift is making outcomes more concrete for a stronger ${input.role.toLowerCase()} interview story.`,
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
    scores: {
      relevance,
      confidence,
      clarity,
      communication
    }
  } satisfies InterviewAnswerResponse;
}
