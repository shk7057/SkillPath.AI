import { KNOWN_SKILLS } from "@/lib/skillpath/catalog";
import { JOB_ROLES, type JobRole } from "@/lib/skillpath/jobRoles";
import type { MatchedRoleResult } from "@/lib/skillpath/types";

const ROLE_RESULT_LIMIT = 6;

function normalizeForMatch(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}

export function normalizeSkills(skills: string[]) {
  const matchedSkills = skills
    .map((skill) => {
      const normalized = normalizeForMatch(skill);

      const knownSkill = KNOWN_SKILLS.find(
        (item) =>
          normalizeForMatch(item.name) === normalized ||
          item.aliases.some((alias) => normalizeForMatch(alias) === normalized)
      );

      return knownSkill?.name ?? skill.trim();
    })
    .filter(Boolean);

  return unique(matchedSkills);
}

function buildRoadmap(role: JobRole, missingSkills: string[]) {
  if (missingSkills.length === 0) {
    return [
      `Document two outcomes that prove your ${role.title.toLowerCase()} readiness.`,
      "Tighten your portfolio or resume bullets so the impact is easy to spot.",
      "Practice concise examples that show how you solve real problems with confidence."
    ];
  }

  return [
    `Prioritize ${missingSkills[0]} first so your ${role.category.toLowerCase()} profile gets stronger quickly.`,
    `Create one focused project or case study that demonstrates ${missingSkills.slice(0, 2).join(" and ")} in practice.`,
    `Update your resume and interview stories with evidence of ${missingSkills[0]} once you close that gap.`
  ];
}

function calculateRoleMatch(
  role: JobRole,
  normalizedSkills: string[],
  options?: {
    allowZeroMatch?: boolean;
  }
): MatchedRoleResult | null {
  const normalizedSkillSet = new Set(
    normalizedSkills.map((skill) => normalizeForMatch(skill))
  );
  const requiredMatched = role.requiredSkills.filter((skill) =>
    normalizedSkillSet.has(normalizeForMatch(skill))
  );
  const optionalMatched = role.optionalSkills.filter((skill) =>
    normalizedSkillSet.has(normalizeForMatch(skill))
  );
  const totalMatched = requiredMatched.length + optionalMatched.length;

  if (totalMatched === 0 && !options?.allowZeroMatch) {
    return null;
  }

  const requiredScore =
    role.requiredSkills.length > 0
      ? requiredMatched.length / role.requiredSkills.length
      : 0;
  const optionalScore =
    role.optionalSkills.length > 0
      ? optionalMatched.length / role.optionalSkills.length
      : 0;
  const percentage = Math.max(
    1,
    Math.round(requiredScore * 85 + optionalScore * 15)
  );
  const missingSkills = role.requiredSkills.filter(
    (skill) => !normalizedSkillSet.has(normalizeForMatch(skill))
  );

  return {
    role: role.title,
    percentage,
    description: role.description,
    matchedSkills: unique([...requiredMatched, ...optionalMatched]),
    missingSkills,
    roadmap: buildRoadmap(role, missingSkills.slice(0, 3))
  };
}

export function matchRoles(skills: string[]) {
  const normalizedSkills = normalizeSkills(skills);

  return JOB_ROLES.map((role) => calculateRoleMatch(role, normalizedSkills))
    .filter((role): role is MatchedRoleResult => Boolean(role))
    .sort((left, right) => {
      if (right.percentage !== left.percentage) {
        return right.percentage - left.percentage;
      }

      if (right.matchedSkills.length !== left.matchedSkills.length) {
        return right.matchedSkills.length - left.matchedSkills.length;
      }

      return left.missingSkills.length - right.missingSkills.length;
    })
    .slice(0, ROLE_RESULT_LIMIT);
}

export function getJobRoleByTitle(title: string) {
  return JOB_ROLES.find((role) => role.title === title) ?? null;
}

export function matchRoleByTitle(skills: string[], title: string) {
  const role = getJobRoleByTitle(title);

  if (!role) {
    return null;
  }

  return calculateRoleMatch(role, normalizeSkills(skills), {
    allowZeroMatch: true
  });
}
