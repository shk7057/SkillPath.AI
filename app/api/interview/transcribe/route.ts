import { NextResponse } from "next/server";
import { transcribeAudioWithGroq } from "@/lib/skillpath/ai";
import type { InterviewTranscriptionResponse } from "@/lib/skillpath/types";

export const runtime = "nodejs";

const SUPPORTED_AUDIO_TYPES = new Set([
  "audio/webm",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/mp4",
  "audio/mpeg",
  "audio/mp3",
  "audio/ogg",
  "audio/ogg;codecs=opus",
  "audio/webm;codecs=opus",
  "audio/m4a"
]);

function normalizeAudioMimeType(type: string) {
  return type.split(";")[0]?.trim().toLowerCase() ?? "";
}

function getClientFacingError(reason: string) {
  const normalizedReason = reason.toLowerCase();

  if (normalizedReason.includes("invalid api key") || normalizedReason.includes("invalid_api_key")) {
    return "The configured GROQ_API_KEY was rejected by Groq. Update it in .env.local and restart the dev server.";
  }

  if (normalizedReason.includes("rate limit")) {
    return "The transcription service is temporarily rate-limited. Please try again in a moment or use the text fallback.";
  }

  if (normalizedReason.includes("unsupported")) {
    return "That audio format was rejected by the transcription service. Please try recording again.";
  }

  if (normalizedReason.includes("empty transcription")) {
    return "We couldn't detect speech in that recording. Please try a slightly longer answer.";
  }

  return "We couldn't transcribe that recording right now. Please try a slightly longer answer or use the text fallback.";
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audio = formData.get("audio");
    const languageValue = formData.get("language");

    if (!(audio instanceof File)) {
      return NextResponse.json(
        { error: "Recorded audio is required for transcription." },
        { status: 400 }
      );
    }

    if (audio.size === 0) {
      return NextResponse.json(
        { error: "The recorded audio file is empty." },
        { status: 400 }
      );
    }

    const normalizedType = normalizeAudioMimeType(audio.type);

    if (normalizedType && !SUPPORTED_AUDIO_TYPES.has(normalizedType)) {
      return NextResponse.json(
        {
          error:
            "Unsupported audio format. Please record in WebM, WAV, MP3, MP4, M4A, or OGG."
        },
        { status: 400 }
      );
    }

    const transcription = await transcribeAudioWithGroq({
      file: audio,
      language:
        typeof languageValue === "string" && languageValue.trim()
          ? languageValue.trim()
          : undefined
    });

    if (!transcription.ok) {
      console.error("Groq transcription failed", {
        status: transcription.status ?? null,
        reason: transcription.reason,
        fileName: audio.name,
        fileSize: audio.size,
        mimeType: audio.type || normalizedType || null
      });

      return NextResponse.json(
        {
          error:
            process.env.GROQ_API_KEY
              ? getClientFacingError(transcription.reason)
              : "GROQ_API_KEY is missing. Add it in .env.local to enable voice transcription."
        },
        { status: process.env.GROQ_API_KEY ? 502 : 503 }
      );
    }

    return NextResponse.json({
      success: true,
      transcript: transcription.text,
      language: transcription.language,
      durationSeconds: transcription.durationSeconds
    } satisfies InterviewTranscriptionResponse);
  } catch (error) {
    console.error("Interview transcription route error", error);
    return NextResponse.json(
      {
        error:
          "We couldn't process that audio upload. Please try again or use the text fallback."
      },
      { status: 500 }
    );
  }
}
