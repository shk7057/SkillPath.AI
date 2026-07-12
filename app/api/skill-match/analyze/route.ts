import { NextResponse } from "next/server";
import { enhanceText } from "@/lib/skillpath/ai";
import { analyzeSkillMatch } from "@/lib/skillpath/engine";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    manualSkills?: string[];
    resumeText?: string;
  };

  const analysis = analyzeSkillMatch({
    manualSkills: body.manualSkills ?? [],
    resumeText: body.resumeText ?? ""
  });

  let summary = analysis.summary;
  let roadmapExplanation = analysis.roadmapExplanation;

  const topRole = analysis.matchedRoles[0];

  if (topRole) {
    const enhancedSummary = await enhanceText(
      `You are helping a career-prep product. Rewrite this guidance in 2 concise sentences, keep it grounded in the deterministic result, and do not invent skills or roles.\n\nRole: ${topRole.role}\nCombined skills: ${analysis.combinedSkills.join(", ")}\nMissing skills: ${topRole.missingSkills.join(", ")}\nCurrent summary: ${analysis.summary}`
    );

    const enhancedRoadmap = await enhanceText(
      `Turn this roadmap explanation into 2 concise product-friendly sentences. Stay grounded in the given role and gaps.\n\nRole: ${topRole.role}\nRoadmap steps: ${topRole.roadmap.join(" | ")}\nCurrent explanation: ${analysis.roadmapExplanation}`
    );

    summary = enhancedSummary ?? summary;
    roadmapExplanation = enhancedRoadmap ?? roadmapExplanation;
  }

  return NextResponse.json({
    ...analysis,
    summary,
    roadmapExplanation
  });
}
