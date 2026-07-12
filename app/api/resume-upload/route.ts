import { NextResponse } from "next/server";
import { getResumeFileValidationError } from "@/lib/resume-upload/validation";
import { parseResumeFile } from "@/lib/skillpath/resume-parser";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const resume = formData.get("resume");

  if (!(resume instanceof File)) {
    return NextResponse.json(
      { error: "Resume file is required." },
      { status: 400 }
    );
  }

  const validationError = getResumeFileValidationError(resume);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    const parsedResume = await parseResumeFile(resume);
    return NextResponse.json(parsedResume);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to parse the uploaded resume."
      },
      { status: 500 }
    );
  }
}
