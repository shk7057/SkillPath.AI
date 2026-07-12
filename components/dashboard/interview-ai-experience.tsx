"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { saveInterviewSnapshot } from "@/lib/client/career-state";
import {
  getSelectedRoleFromStorage,
  saveSelectedRoleToStorage
} from "@/lib/client/selected-role";
import { getRoleNames } from "@/lib/skillpath/catalog";
import type {
  InterviewAnswerResponse,
  InterviewStartResponse,
  InterviewTranscriptionResponse
} from "@/lib/skillpath/types";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { FeedbackCard } from "@/components/dashboard/interview-ai/feedback-card";
import { InterviewHeader } from "@/components/dashboard/interview-ai/interview-header";
import { InterviewerCard } from "@/components/dashboard/interview-ai/interviewer-card";
import { MicButton } from "@/components/dashboard/interview-ai/mic-button";
import { ScoreCard } from "@/components/dashboard/interview-ai/score-card";
import { TranscriptPanel } from "@/components/dashboard/interview-ai/transcript-panel";

type SessionState = "idle" | "active" | "feedback";
type RecordingState =
  | "idle"
  | "requesting-permission"
  | "recording"
  | "stopped"
  | "processing"
  | "error"
  | "unsupported";

const roles = getRoleNames();
const languages = ["English", "Hindi", "English + Hindi"];
const difficulties = ["Easy", "Medium", "Advanced"];

function formatTimer(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function mimeExtension(type: string) {
  const normalizedType = type.split(";")[0]?.trim().toLowerCase() ?? "";

  if (normalizedType.includes("wav")) {
    return "wav";
  }

  if (normalizedType.includes("ogg")) {
    return "ogg";
  }

  if (normalizedType.includes("mp4")) {
    return "mp4";
  }

  if (normalizedType.includes("mpeg") || normalizedType.includes("mp3")) {
    return "mp3";
  }

  return "webm";
}

function normalizeAudioMimeType(type: string) {
  return type.split(";")[0]?.trim().toLowerCase() ?? "";
}

function getPreferredMimeType() {
  if (typeof MediaRecorder === "undefined") {
    return "";
  }

  const preferred = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus"
  ];

  return preferred.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
}

function getLanguageCode(language: string) {
  if (language === "English") {
    return "en";
  }

  if (language === "Hindi") {
    return "hi";
  }

  return "";
}

async function readJsonSafely<T>(response: Response) {
  const rawText = await response.text();
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const statusPrefix = `Request failed with HTTP ${response.status}.`;

  if (!rawText) {
    return {
      data: null as T | null,
      errorMessage: response.ok
        ? "The server returned an empty response."
        : `${statusPrefix} The server returned an empty error response.`
    };
  }

  if (!isJson) {
    return {
      data: null as T | null,
      errorMessage: response.ok
        ? "The server returned an unexpected response format."
        : `${statusPrefix} The server returned HTML or another non-JSON error response.`
    };
  }

  try {
    return {
      data: JSON.parse(rawText) as T,
      errorMessage: ""
    };
  } catch {
    return {
      data: null as T | null,
      errorMessage: "The server returned invalid JSON."
    };
  }
}

export function InterviewAiExperience() {
  const [role, setRole] = useState("");
  const [language, setLanguage] = useState("English");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Advanced">(
    "Medium"
  );
  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [currentQuestion, setCurrentQuestion] = useState(
    "Choose a role to unlock dynamic interview questions."
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [interviewerName, setInterviewerName] = useState("Mira");
  const [nextQuestion, setNextQuestion] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [supportsMicrophone, setSupportsMicrophone] = useState(true);
  const [transcript, setTranscript] = useState<{ speaker: string; text: string }[]>(
    []
  );
  const [feedback, setFeedback] = useState<InterviewAnswerResponse | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const canUseMic =
      typeof window !== "undefined" &&
      typeof navigator !== "undefined" &&
      typeof MediaRecorder !== "undefined" &&
      Boolean(navigator.mediaDevices?.getUserMedia);

    setSupportsMicrophone(canUseMic);

    if (!canUseMic) {
      setRecordingState("unsupported");
    }
  }, []);

  useEffect(() => {
    const syncSelectedRole = () => {
      const savedRole = getSelectedRoleFromStorage();
      setRole(savedRole);

      if (!savedRole) {
        setCurrentQuestion("Choose a role to unlock dynamic interview questions.");
      }
    };

    syncSelectedRole();
    window.addEventListener("skillpath:selected-role-change", syncSelectedRole);
    window.addEventListener("storage", syncSelectedRole);

    return () => {
      window.removeEventListener("skillpath:selected-role-change", syncSelectedRole);
      window.removeEventListener("storage", syncSelectedRole);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }

      mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const scoreItems = useMemo(
    () => [
      {
        label: "Relevance",
        score: feedback?.scores.relevance ?? null,
        accent: "sky" as const
      },
      {
        label: "Confidence",
        score: feedback?.scores.confidence ?? null,
        accent: "lavender" as const
      },
      {
        label: "Clarity",
        score: feedback?.scores.clarity ?? null,
        accent: "sky" as const
      },
      {
        label: "Communication",
        score: feedback?.scores.communication ?? null,
        accent: "lavender" as const
      }
    ],
    [feedback]
  );

  const timerLabel = useMemo(() => formatTimer(recordingSeconds), [recordingSeconds]);

  const stopTracks = () => {
    mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaRecorderRef.current = null;
    mediaStreamRef.current = null;
  };

  const stopTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    stopTimer();
    setRecordingSeconds(0);
    timerRef.current = window.setInterval(() => {
      setRecordingSeconds((current) => current + 1);
    }, 1000);
  };

  const handleStart = async () => {
    if (!role) {
      setError("Choose a suggested role before starting the interview.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/interview/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          role,
          difficulty
        })
      });

      const { data, errorMessage } = await readJsonSafely<
        InterviewStartResponse | { error: string }
      >(response);

      if (!response.ok || !data || "error" in data) {
        throw new Error(
          data && "error" in data
            ? data.error
            : errorMessage || "Unable to start the interview right now."
        );
      }

      saveSelectedRoleToStorage(role);
      setCurrentQuestion(data.question);
      setQuestionIndex(data.questionIndex);
      setInterviewerName(data.interviewerName);
      setTranscript([{ speaker: "AI", text: data.question }]);
      setAnswer("");
      setFeedback(null);
      setNextQuestion(null);
      setRecordingSeconds(0);
      setSessionState("active");
      setRecordingState(supportsMicrophone ? "idle" : "unsupported");
    } catch (startError) {
      setError(
        startError instanceof Error
          ? startError.message
          : "Unable to start the interview right now."
      );
    } finally {
      setLoading(false);
    }
  };

  const transcribeRecording = async (audioBlob: Blob) => {
    setLoading(true);
    setRecordingState("processing");
    setError("");

    try {
      const normalizedType = normalizeAudioMimeType(audioBlob.type || "audio/webm");
      const extension = mimeExtension(normalizedType || "audio/webm");
      const audioFile = new File([audioBlob], `interview-answer.${extension}`, {
        type: normalizedType || "audio/webm"
      });
      const formData = new FormData();
      formData.append("audio", audioFile);

      const languageCode = getLanguageCode(language);

      if (languageCode) {
        formData.append("language", languageCode);
      }

      const response = await fetch("/api/interview/transcribe", {
        method: "POST",
        body: formData
      });

      const { data, errorMessage } = await readJsonSafely<
        InterviewTranscriptionResponse | { error: string }
      >(response);

      if (!response.ok || !data || "error" in data || !data.success) {
        throw new Error(
          data && "error" in data
            ? data.error
            : errorMessage ||
              "We couldn't transcribe that recording right now. Please try again."
        );
      }

      setAnswer(data.transcript);
      setTranscript([
        { speaker: "AI", text: currentQuestion },
        { speaker: "You", text: data.transcript }
      ]);
      setRecordingState("stopped");
      setRecordingSeconds(data.durationSeconds ?? recordingSeconds);
    } catch (transcriptionError) {
      setRecordingState(supportsMicrophone ? "error" : "unsupported");
      setError(
        transcriptionError instanceof Error
          ? transcriptionError.message
          : "Unable to transcribe your recording right now."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStartRecording = async () => {
    if (!supportsMicrophone) {
      setRecordingState("unsupported");
      setError(
        "Microphone capture is not available in this browser. Use the text fallback instead."
      );
      return;
    }

    setError("");
    setAnswer("");
    setTranscript([{ speaker: "AI", text: currentQuestion }]);
    setRecordingState("requesting-permission");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferredMimeType = getPreferredMimeType();
      const mediaRecorder = preferredMimeType
        ? new MediaRecorder(stream, { mimeType: preferredMimeType })
        : new MediaRecorder(stream);

      audioChunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;
      mediaStreamRef.current = stream;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onerror = () => {
        stopTimer();
        stopTracks();
        setRecordingState("error");
        setError(
          "Recording hit an unexpected issue. Please try again or use the text fallback."
        );
      };

      mediaRecorder.onstop = async () => {
        stopTimer();
        stopTracks();

        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || preferredMimeType || "audio/webm"
        });
        audioChunksRef.current = [];

        if (audioBlob.size === 0) {
          setRecordingState("error");
          setError("The recording was empty. Please try speaking again.");
          return;
        }

        await transcribeRecording(audioBlob);
      };

      mediaRecorder.start(250);
      startTimer();
      setRecordingState("recording");
    } catch (recordingError) {
      stopTimer();
      stopTracks();

      if (
        recordingError instanceof DOMException &&
        recordingError.name === "NotAllowedError"
      ) {
        setError(
          "Microphone permission was denied. Allow access and try again, or use the text fallback."
        );
      } else if (
        recordingError instanceof DOMException &&
        recordingError.name === "NotFoundError"
      ) {
        setError(
          "No microphone was found on this device. Use the text fallback to continue."
        );
      } else {
        setError(
          recordingError instanceof Error
            ? recordingError.message
            : "Unable to start recording right now."
        );
      }

      setRecordingState(supportsMicrophone ? "error" : "unsupported");
    }
  };

  const handleStopRecording = () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== "recording") {
      return;
    }

    mediaRecorderRef.current.stop();
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      setError("Record or type an answer transcript before requesting feedback.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/interview/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          role,
          answer,
          questionIndex,
          difficulty
        })
      });

      const { data, errorMessage } = await readJsonSafely<
        InterviewAnswerResponse | { error: string }
      >(response);

      if (!response.ok || !data || "error" in data) {
        throw new Error(
          data && "error" in data
            ? data.error
            : errorMessage || "Unable to review your answer right now."
        );
      }

      setFeedback(data);
      setNextQuestion(data.nextQuestion);
      setTranscript([
        { speaker: "AI", text: currentQuestion },
        { speaker: "You", text: answer },
        { speaker: "AI", text: data.summary }
      ]);
      setCurrentQuestion(
        data.nextQuestion ??
          "Start a new round whenever you want another role-based question."
      );
      setSessionState("feedback");
      setRecordingState(supportsMicrophone ? "idle" : "unsupported");
      saveInterviewSnapshot({
        role: data.role,
        questionIndex: data.questionIndex,
        summary: data.summary,
        strengths: data.strengths,
        improvements: data.improvements,
        scores: data.scores
      });
    } catch (answerError) {
      setError(
        answerError instanceof Error
          ? answerError.message
          : "Unable to review your answer right now."
      );
      setRecordingState(answer.trim() ? "stopped" : supportsMicrophone ? "error" : "unsupported");
    } finally {
      setLoading(false);
    }
  };

  const handleAdvanceQuestion = async () => {
    if (!nextQuestion) {
      await handleStart();
      return;
    }

    setTranscript([{ speaker: "AI", text: nextQuestion }]);
    setCurrentQuestion(nextQuestion);
    setQuestionIndex((current) => current + 1);
    setAnswer("");
    setError("");
    setFeedback(null);
    setNextQuestion(null);
    setRecordingSeconds(0);
    setSessionState("active");
    setRecordingState(supportsMicrophone ? "idle" : "unsupported");
  };

  const handleMicClick = async () => {
    if (sessionState === "idle") {
      await handleStart();
      return;
    }

    if (sessionState === "feedback") {
      await handleAdvanceQuestion();
      return;
    }

    if (recordingState === "requesting-permission" || recordingState === "processing") {
      return;
    }

    if (recordingState === "recording") {
      handleStopRecording();
      return;
    }

    if (
      recordingState === "stopped" ||
      recordingState === "unsupported" ||
      recordingState === "error"
    ) {
      await handleSubmitAnswer();
      return;
    }

    await handleStartRecording();
  };

  return (
    <div className="space-y-6">
      <InterviewHeader
        role={role}
        language={language}
        difficulty={difficulty}
        roles={roles}
        languages={languages}
        difficulties={difficulties}
        sessionState={sessionState}
        onRoleChange={(value) => {
          setRole(value);
          setError("");
          if (value) {
            saveSelectedRoleToStorage(value);
          }
        }}
        onLanguageChange={setLanguage}
        onDifficultyChange={(value) =>
          setDifficulty(value as "Easy" | "Medium" | "Advanced")
        }
        onStart={handleStart}
        startDisabled={
          loading ||
          !role ||
          recordingState === "requesting-permission" ||
          recordingState === "processing"
        }
        hint={
          role
            ? "This role is synced from Skill Match when available. You can still change it here before starting."
            : "No role has been selected from Skill Match yet. Choose one here or go back to Skill Match to select a suggested role."
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <InterviewerCard
            interviewerName={interviewerName}
            role={role || "No role selected"}
            difficulty={difficulty}
            sessionState={sessionState}
            currentQuestion={currentQuestion}
          />

          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <MicButton
              sessionState={sessionState}
              recordingState={recordingState}
              onClick={handleMicClick}
              disabled={loading || (!role && sessionState === "idle")}
              hasRole={Boolean(role)}
              timerLabel={timerLabel}
              canUseMicrophone={supportsMicrophone}
              hasTranscript={Boolean(answer.trim())}
            />
            <TranscriptPanel
              sessionState={sessionState}
              recordingState={recordingState}
              transcript={transcript}
              answer={answer}
              onAnswerChange={(value) => {
                setAnswer(value);
                setError("");
                if (sessionState === "active" && value.trim()) {
                  setRecordingState(supportsMicrophone ? "stopped" : "unsupported");
                }
              }}
              disabled={loading || recordingState === "requesting-permission"}
              error={error}
              hasRole={Boolean(role)}
              supportsMicrophone={supportsMicrophone}
              timerLabel={timerLabel}
            />
          </div>
        </div>

        <div className="space-y-6">
          <DashboardCard
            title="Session Context"
            description="This setup now follows the role selected in Skill Match and supports live recording, transcription, and role-specific question logic."
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl bg-mist p-4">
                <p className="text-sm font-semibold text-slate-900">Role</p>
                <p className="mt-2 text-sm leading-7 text-slate-500">
                  {role || "Waiting for selected role"}
                </p>
              </div>
              <div className="rounded-2xl bg-lavender/45 p-4">
                <p className="text-sm font-semibold text-slate-900">Language</p>
                <p className="mt-2 text-sm leading-7 text-slate-500">
                  {language}
                </p>
              </div>
              <div className="rounded-2xl bg-mist p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Difficulty
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-500">
                  {difficulty}
                </p>
              </div>
              <div className="rounded-2xl bg-lavender/45 p-4">
                <p className="text-sm font-semibold text-slate-900">Mic Mode</p>
                <p className="mt-2 text-sm leading-7 text-slate-500">
                  {supportsMicrophone ? "Live browser recording" : "Text fallback"}
                </p>
              </div>
              <div className="rounded-2xl bg-mist p-4">
                <p className="text-sm font-semibold text-slate-900">Recording</p>
                <p className="mt-2 text-sm leading-7 text-slate-500">
                  {timerLabel}
                </p>
              </div>
              <div className="rounded-2xl bg-lavender/45 p-4">
                <p className="text-sm font-semibold text-slate-900">State</p>
                <p className="mt-2 text-sm leading-7 text-slate-500">
                  {recordingState.replace("-", " ")}
                </p>
              </div>
            </div>
          </DashboardCard>

          <FeedbackCard
            sessionState={sessionState === "active" ? "recording" : sessionState}
            strengths={feedback?.strengths ?? []}
            improvements={feedback?.improvements ?? []}
            summary={
              feedback?.summary ??
              "Dynamic feedback will appear here after you record or type an answer and submit it for review."
            }
          />
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {scoreItems.map((item) => (
          <ScoreCard key={item.label} {...item} />
        ))}
      </section>
    </div>
  );
}
