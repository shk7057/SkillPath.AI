import { NextResponse } from "next/server";
import { enhanceList, enhanceText } from "@/lib/skillpath/ai";
import { analyzeAts } from "@/lib/skillpath/engine";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    resumeText?: string;
    targetRole?: string | null;
  };

  if (!body.resumeText?.trim()) {
    return NextResponse.json(
      { error: "Parsed resume text is required for ATS analysis." },
      { status: 400 }
    );
  }

  const analysis = analyzeAts({
    resumeText: body.resumeText,
    targetRole: body.targetRole ?? null
  });

  const enhancedHeadline = await enhanceText(
    `Rewrite this ATS summary in 2 concise sentences for a premium SaaS UI. Stay grounded in the deterministic analysis.\n\nHeadline: ${analysis.headline}\nMissing sections: ${analysis.missingSections.join(", ")}\nMissing keywords: ${analysis.missingKeywords.join(", ")}\nSuggested role: ${analysis.suggestedRole ?? "none"}`
  );

  const enhancedSuggestions = await enhanceList(
    `Improve these ATS resume suggestions while keeping them practical and concise. Return one suggestion per line and stay grounded in the provided gaps.\n\nCurrent suggestions:\n${analysis.improvementSuggestions.map((item) => `- ${item}`).join("\n")}`,
    4
  );

  const enhancedBulletRewrites = await enhanceList(
    `Rewrite these weak resume bullets into stronger, quantified bullets. Return one improved bullet per line and keep them realistic.\n\nOriginal bullets:\n${analysis.weakBulletRewrites.map((item) => `- ${item.original}`).join("\n")}`,
    analysis.weakBulletRewrites.length || 3
  );

  return NextResponse.json({
    ...analysis,
    headline: enhancedHeadline ?? analysis.headline,
    improvementSuggestions: enhancedSuggestions ?? analysis.improvementSuggestions,
    weakBulletRewrites:
      enhancedBulletRewrites && enhancedBulletRewrites.length > 0
        ? analysis.weakBulletRewrites.map((item, index) => ({
            ...item,
            improved: enhancedBulletRewrites[index] ?? item.improved
          }))
        : analysis.weakBulletRewrites
  });
}
