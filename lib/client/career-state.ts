"use client";

import type {
  AtsCheckResponse,
  InterviewAnswerResponse,
  SkillMatchAnalysisResponse
} from "@/lib/skillpath/types";

export const CAREER_STATE_EVENT = "skillpath:career-state-change";

const SKILL_MATCH_STORAGE_KEY = "skillpath:skill-match-snapshot";
const ATS_STORAGE_KEY = "skillpath:ats-snapshot";
const INTERVIEW_STORAGE_KEY = "skillpath:interview-snapshot";
const ROADMAP_PROGRESS_STORAGE_KEY = "skillpath:roadmap-progress";

export type SkillMatchSnapshot = Pick<
  SkillMatchAnalysisResponse,
  | "combinedSkills"
  | "extractedSkills"
  | "matchedRoles"
  | "selectedRole"
  | "summary"
  | "roadmapExplanation"
> & {
  updatedAt: string;
};

export type AtsSnapshot = Pick<
  AtsCheckResponse,
  | "score"
  | "targetRole"
  | "suggestedRole"
  | "missingSections"
  | "missingKeywords"
  | "priorityKeywordGaps"
  | "improvementSuggestions"
  | "breakdown"
> & {
  updatedAt: string;
};

export type InterviewSnapshot = Pick<
  InterviewAnswerResponse,
  "role" | "questionIndex" | "summary" | "strengths" | "improvements" | "scores"
> & {
  updatedAt: string;
};

type RoadmapProgressSnapshot = {
  completedWeekIds: string[];
  updatedAt: string;
};

export type CareerStateSnapshot = {
  skillMatch: SkillMatchSnapshot | null;
  ats: AtsSnapshot | null;
  interview: InterviewSnapshot | null;
  completedWeekIds: string[];
};

function isBrowser() {
  return typeof window !== "undefined";
}

function emitCareerStateChange() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new Event(CAREER_STATE_EVENT));
}

function readStorage<T>(key: string): T | null {
  if (!isBrowser()) {
    return null;
  }

  const value = window.localStorage.getItem(key);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
  emitCareerStateChange();
}

export function getSkillMatchSnapshot() {
  return readStorage<SkillMatchSnapshot>(SKILL_MATCH_STORAGE_KEY);
}

export function saveSkillMatchSnapshot(snapshot: Omit<SkillMatchSnapshot, "updatedAt">) {
  writeStorage<SkillMatchSnapshot>(SKILL_MATCH_STORAGE_KEY, {
    ...snapshot,
    updatedAt: new Date().toISOString()
  });
}

export function getAtsSnapshot() {
  return readStorage<AtsSnapshot>(ATS_STORAGE_KEY);
}

export function saveAtsSnapshot(snapshot: Omit<AtsSnapshot, "updatedAt">) {
  writeStorage<AtsSnapshot>(ATS_STORAGE_KEY, {
    ...snapshot,
    updatedAt: new Date().toISOString()
  });
}

export function getInterviewSnapshot() {
  return readStorage<InterviewSnapshot>(INTERVIEW_STORAGE_KEY);
}

export function saveInterviewSnapshot(
  snapshot: Omit<InterviewSnapshot, "updatedAt">
) {
  writeStorage<InterviewSnapshot>(INTERVIEW_STORAGE_KEY, {
    ...snapshot,
    updatedAt: new Date().toISOString()
  });
}

export function getCompletedRoadmapWeekIds() {
  return (
    readStorage<RoadmapProgressSnapshot>(ROADMAP_PROGRESS_STORAGE_KEY)
      ?.completedWeekIds ?? []
  );
}

export function toggleCompletedRoadmapWeek(weekId: string) {
  const completedWeekIds = getCompletedRoadmapWeekIds();
  const nextIds = completedWeekIds.includes(weekId)
    ? completedWeekIds.filter((id) => id !== weekId)
    : [...completedWeekIds, weekId];

  writeStorage<RoadmapProgressSnapshot>(ROADMAP_PROGRESS_STORAGE_KEY, {
    completedWeekIds: nextIds,
    updatedAt: new Date().toISOString()
  });
}

export function getCareerStateSnapshot(): CareerStateSnapshot {
  return {
    skillMatch: getSkillMatchSnapshot(),
    ats: getAtsSnapshot(),
    interview: getInterviewSnapshot(),
    completedWeekIds: getCompletedRoadmapWeekIds()
  };
}
