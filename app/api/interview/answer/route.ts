import { NextResponse } from "next/server";
import { enhanceList, enhanceText } from "@/lib/skillpath/ai";
import { evaluateInterviewAnswer } from "@/lib/skillpath/engine";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    role?: string;
    answer?: string;
    questionIndex?: number;
    difficulty?: "Easy" | "Medium" | "Advanced";
  };

  if (!body.role || !body.answer?.trim()) {
    return NextResponse.json(
      { error: "Role and answer transcript are required." },
      { status: 400 }
    );
  }

  const evaluation = evaluateInterviewAnswer({
    role: body.role,
    answer: body.answer,
    questionIndex: body.questionIndex ?? 0,
    difficulty: body.difficulty ?? "Medium"
  });

  const enhancedSummary = await enhanceText(
    `Refine this interview feedback summary in 2 concise sentences. Keep it grounded in the deterministic assessment.\n\n${evaluation.summary}`
  );

  const enhancedImprovements = await enhanceList(
    `Rewrite these interview improvement tips to sound polished and specific. Return one tip per line.\n\n${evaluation.improvements.map((item) => `- ${item}`).join("\n")}`,
    3
  );

  return NextResponse.json({
    ...evaluation,
    summary: enhancedSummary ?? evaluation.summary,
    improvements: enhancedImprovements ?? evaluation.improvements
  });
}
