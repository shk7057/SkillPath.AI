import { NextResponse } from "next/server";
import { enhanceText } from "@/lib/skillpath/ai";
import { startInterview } from "@/lib/skillpath/engine";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    role?: string;
    difficulty?: "Easy" | "Medium" | "Advanced";
  };

  if (!body.role) {
    return NextResponse.json(
      { error: "A selected role is required to start the interview." },
      { status: 400 }
    );
  }

  const difficulty = body.difficulty ?? "Medium";
  const interview = startInterview({
    role: body.role,
    difficulty
  });

  const enhancedQuestion = await enhanceText(
    `Rewrite this interview question for a ${difficulty.toLowerCase()} ${body.role} mock interview. Keep it concise, role-specific, and practical.\n\n${interview.question}`
  );

  return NextResponse.json({
    ...interview,
    question: enhancedQuestion ?? interview.question
  });
}
