type RecordingState =
  | "idle"
  | "requesting-permission"
  | "recording"
  | "stopped"
  | "processing"
  | "error"
  | "unsupported";

type SessionState = "idle" | "active" | "feedback";

type MicButtonProps = {
  sessionState: SessionState;
  recordingState: RecordingState;
  onClick: () => void;
  disabled?: boolean;
  hasRole: boolean;
  timerLabel: string;
  canUseMicrophone: boolean;
  hasTranscript: boolean;
};

export function MicButton({
  sessionState,
  recordingState,
  onClick,
  disabled = false,
  hasRole,
  timerLabel,
  canUseMicrophone,
  hasTranscript
}: MicButtonProps) {
  const isRecording = recordingState === "recording";
  const isBusy =
    recordingState === "requesting-permission" || recordingState === "processing";

  const label =
    sessionState === "idle"
      ? hasRole
        ? "Start interview"
        : "Select a role first"
      : sessionState === "feedback"
        ? "Practice next question"
        : recordingState === "requesting-permission"
          ? "Allow microphone access"
          : recordingState === "recording"
            ? "Stop recording"
            : recordingState === "processing"
              ? "Transcribing answer"
              : recordingState === "stopped"
                ? "Review feedback"
                : recordingState === "unsupported"
                  ? hasTranscript
                    ? "Review feedback"
                    : "Use text fallback"
                  : hasTranscript
                    ? "Review feedback"
                    : "Start recording";

  const description =
    sessionState === "idle"
      ? hasRole
        ? "Pick your setup and begin when you are ready."
        : "Select a role from Skill Match or choose one here to unlock the interview flow."
      : sessionState === "feedback"
        ? "Feedback is ready. Move to the next question whenever you want to keep practicing."
        : recordingState === "requesting-permission"
          ? "Your browser is requesting microphone access so we can capture your spoken answer."
          : recordingState === "recording"
            ? "Recording live now. Speak naturally, then stop when your answer is complete."
            : recordingState === "processing"
              ? "We are transcribing your recording and preparing the transcript for review."
              : recordingState === "stopped"
                ? "Your transcript is ready. Review or edit it, then generate interview feedback."
                : recordingState === "unsupported"
                  ? "This browser cannot record audio here. You can still type your answer in the transcript panel."
                  : recordingState === "error"
                    ? "Microphone capture hit a problem. You can retry or use the text fallback in the transcript panel."
                    : canUseMicrophone
                      ? "Use your microphone to answer out loud, then review the transcript before scoring."
                      : "Microphone capture is unavailable here, but text fallback is still ready.";

  return (
    <div className="surface-panel flex flex-col items-center justify-center p-6 text-center sm:p-8">
      <button
        type="button"
        onClick={onClick}
        aria-pressed={isRecording}
        disabled={disabled || isBusy}
        className={`relative inline-flex h-28 w-28 items-center justify-center rounded-full text-white shadow-soft transition duration-200 ease-out ${
          isRecording
            ? "bg-gradient-to-br from-rose-400 to-fuchsia-400"
            : "bg-gradient-to-br from-slate-900 to-slate-700"
        } disabled:cursor-not-allowed disabled:opacity-70`}
      >
        {isRecording ? (
          <span className="absolute inset-0 rounded-full border-8 border-rose-200/60 animate-ping" />
        ) : null}
        <span className="relative text-3xl">{isRecording ? "●" : "O"}</span>
      </button>

      <p className="mt-5 text-lg font-semibold text-slate-900">{label}</p>
      <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
        {sessionState === "active" ? timerLabel : "Ready"}
      </p>
      <p className="mt-2 max-w-xs text-sm leading-7 text-slate-500">
        {description}
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span
          className={`state-chip ${
            isRecording
              ? "bg-rose-100 text-rose-600"
              : recordingState === "processing"
                ? "bg-lavender/70 text-slate-700"
                : "bg-mist text-slate-700"
          }`}
        >
          {recordingState.replace("-", " ")}
        </span>
        {!canUseMicrophone ? (
          <span className="state-chip bg-white text-slate-600">text fallback</span>
        ) : null}
      </div>
    </div>
  );
}
