export type ResumeParseResult = {
  fileName: string;
  resumeText: string;
  extractedSkills: string[];
  detectedSections: string[];
  wordCount: number;
};

export type MatchedRoleResult = {
  role: string;
  percentage: number;
  description: string;
  matchedSkills: string[];
  missingSkills: string[];
  roadmap: string[];
};

export type SkillMatchAnalysisResponse = {
  extractedSkills: string[];
  combinedSkills: string[];
  matchedRoles: MatchedRoleResult[];
  selectedRole: string | null;
  summary: string;
  roadmapExplanation: string;
};

export type AtsCheckResponse = {
  score: number;
  keywordMatch: number;
  formatting: number;
  content: number;
  readability: number;
  roleFit: number;
  headline: string;
  targetRole: string | null;
  suggestedRole: string | null;
  missingSections: string[];
  missingKeywords: string[];
  summaryItems: string[];
  improvementSuggestions: string[];
  breakdown: {
    formatting: number;
    keywords: number;
    content: number;
    readability: number;
    roleFit: number;
  };
  priorityKeywordGaps: {
    high: string[];
    medium: string[];
    low: string[];
  };
  sectionHeatmap: Array<{
    section: string;
    status: "Strong" | "Needs Work" | "Missing";
    note: string;
  }>;
  weakBulletRewrites: Array<{
    original: string;
    improved: string;
  }>;
};

export type InterviewStartResponse = {
  role: string;
  question: string;
  questionIndex: number;
  interviewerName: string;
  introduction: string;
};

export type InterviewAnswerResponse = {
  role: string;
  questionIndex: number;
  nextQuestion: string | null;
  summary: string;
  strengths: string[];
  improvements: string[];
  scores: {
    relevance: number;
    confidence: number;
    clarity: number;
    communication: number;
  };
};

export type InterviewTranscriptionResponse = {
  success: true;
  transcript: string;
  language: string | null;
  durationSeconds: number | null;
};
