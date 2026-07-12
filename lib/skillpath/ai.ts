import "server-only";

type GroqTranscriptionResult = {
  ok: true;
  text: string;
  language: string | null;
  durationSeconds: number | null;
};

type GroqTranscriptionFailure = {
  ok: false;
  reason: string;
  status?: number;
};

function normalizeAudioMimeType(type: string) {
  return type.split(";")[0]?.trim().toLowerCase() ?? "";
}

function extensionForAudioType(type: string) {
  switch (normalizeAudioMimeType(type)) {
    case "audio/wav":
    case "audio/wave":
    case "audio/x-wav":
      return "wav";
    case "audio/mp3":
    case "audio/mpeg":
      return "mp3";
    case "audio/mp4":
    case "audio/m4a":
      return "m4a";
    case "audio/ogg":
      return "ogg";
    default:
      return "webm";
  }
}

async function callGemini(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        }),
        cache: "no-store"
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const parts = data.candidates?.[0]?.content?.parts;

    if (!Array.isArray(parts)) {
      return null;
    }

    return parts
      .map((part: { text?: string }) => part.text ?? "")
      .join("\n")
      .trim();
  } catch {
    return null;
  }
}

async function callGroq(prompt: string) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You improve deterministic product outputs. Keep responses concise, practical, and directly usable."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      }),
      cache: "no-store"
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() ?? null;
  } catch {
    return null;
  }
}

export async function transcribeAudioWithGroq(input: {
  file: File;
  language?: string;
}) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      reason: "GROQ_API_KEY is missing."
    } satisfies GroqTranscriptionFailure;
  }

  try {
    const normalizedType = normalizeAudioMimeType(input.file.type || "audio/webm");
    const extension = extensionForAudioType(normalizedType);
    const fileName =
      input.file.name?.includes(".")
        ? input.file.name
        : `interview-answer.${extension}`;
    const uploadFile = new File([await input.file.arrayBuffer()], fileName, {
      type: normalizedType || "audio/webm"
    });
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("model", "whisper-large-v3-turbo");
    formData.append("response_format", "json");
    formData.append("temperature", "0");

    if (input.language) {
      formData.append("language", input.language);
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`
        },
        body: formData,
        cache: "no-store"
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        ok: false,
        status: response.status,
        reason:
          errorText.trim() ||
          `Groq transcription request failed with HTTP ${response.status}.`
      } satisfies GroqTranscriptionFailure;
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (!contentType.includes("application/json")) {
      const unexpectedBody = await response.text();
      return {
        ok: false,
        status: response.status,
        reason: `Groq returned an unexpected response format: ${
          unexpectedBody.trim() || contentType || "unknown"
        }`
      } satisfies GroqTranscriptionFailure;
    }

    const data = (await response.json()) as {
      text?: string;
      language?: string;
      duration?: number;
    };

    if (!data.text?.trim()) {
      return {
        ok: false,
        status: response.status,
        reason: "Groq returned an empty transcription."
      } satisfies GroqTranscriptionFailure;
    }

    return {
      ok: true,
      text: data.text.trim(),
      language: data.language ?? null,
      durationSeconds:
        typeof data.duration === "number" ? Math.round(data.duration) : null
    } satisfies GroqTranscriptionResult;
  } catch (error) {
    return {
      ok: false,
      reason:
        error instanceof Error
          ? error.message
          : "Unexpected transcription error."
    } satisfies GroqTranscriptionFailure;
  }
}

function sanitizeInterviewQuestion(text: string | null) {
  if (!text) {
    return null;
  }

  const normalized = text
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return null;
  }

  const paragraphs = normalized
    .split(/\n\s*\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const firstParagraph = paragraphs[0] ?? normalized;
  const cleaned = firstParagraph
    .replace(/^[-*•\d.\s]+/, "")
    .replace(/^['"`]+|['"`]+$/g, "")
    .trim();

  if (!cleaned) {
    return null;
  }

  const looksLikeQuestion = /\?/.test(cleaned) && !/(here are|here's|options|choose|instructions|prompt|system)/i.test(cleaned);

  return looksLikeQuestion ? cleaned : null;
}

export async function enhanceText(prompt: string) {
  return (await callGemini(prompt)) ?? (await callGroq(prompt)) ?? null;
}

export async function rewriteInterviewQuestion(
  question: string,
  role: string,
  difficulty: string
) {
  const prompt = [
    "Rewrite the following interview question so it is concise, role-specific, and practical.",
    "Return only one interview question and nothing else.",
    "Do not include instructions, bullet points, or commentary.",
    `Role: ${role}`,
    `Difficulty: ${difficulty}`,
    `Question: ${question}`
  ].join("\n");

  const enhanced = await enhanceText(prompt);
  return sanitizeInterviewQuestion(enhanced) ?? question;
}

export async function enhanceList(prompt: string, maxItems = 4) {
  const text = await enhanceText(prompt);

  if (!text) {
    return null;
  }

  const items = text
    .split(/\n+/)
    .map((line: string) => line.replace(/^\s*(?:[-*]|\d+\.)\s*/, "").trim())
    .filter(Boolean)
    .slice(0, maxItems);

  return items.length > 0 ? items : null;
}
