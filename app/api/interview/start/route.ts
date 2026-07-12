import { NextResponse } from "next/server";
import { rewriteInterviewQuestion } from "@/lib/skillpath/ai";
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

  const enhancedQuestion = await rewriteInterviewQuestion(
    interview.question,
    body.role,
    difficulty
  );

  return NextResponse.json({
    ...interview,
    question: enhancedQuestion
  });
}
