type TranscriptLine = {
  speaker: string;
  text: string;
};

type RecordingState =
  | "idle"
  | "requesting-permission"
  | "recording"
  | "stopped"
  | "processing"
  | "error"
  | "unsupported";

type TranscriptPanelProps = {
  sessionState: "idle" | "active" | "feedback";
  recordingState: RecordingState;
  transcript: TranscriptLine[];
  answer: string;
  onAnswerChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  hasRole: boolean;
  supportsMicrophone: boolean;
  timerLabel: string;
};

export function TranscriptPanel({
  sessionState,
  recordingState,
  transcript,
  answer,
  onAnswerChange,
  disabled = false,
  error,
  hasRole,
  supportsMicrophone,
  timerLabel
}: TranscriptPanelProps) {
  const showEditor = sessionState !== "idle";

  return (
    <div className="surface-panel p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Transcript</h3>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            Voice answers appear here after transcription, and you can still edit the text before feedback is generated.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="state-chip bg-mist text-slate-700">
            {recordingState.replace("-", " ")}
          </span>
          {showEditor ? (
            <span className="state-chip bg-white text-slate-600">
              {timerLabel}
            </span>
          ) : null}
        </div>
      </div>

      {sessionState === "idle" ? (
        <div className="rounded-[1.5rem] bg-mist p-5 text-sm leading-7 text-slate-500">
          {hasRole
            ? "Your transcript and answer draft will appear here once the interview starts."
            : "Choose a role in Skill Match or from the selector above to begin the interview flow."}
        </div>
      ) : (
        <div className="space-y-4">
          {transcript.map((line, index) => (
            <div
              key={`${line.speaker}-${index}`}
              className={`rounded-2xl p-4 text-sm leading-7 ${
                line.speaker === "You"
                  ? "bg-lavender/45 text-slate-700"
                  : "bg-mist text-slate-700"
              }`}
            >
              <span className="mr-2 font-semibold text-slate-900">
                {line.speaker}:
              </span>
              {line.text}
            </div>
          ))}

          {!supportsMicrophone ? (
            <div className="state-note">
              Microphone capture is not available in this browser, so text input mode is enabled automatically.
            </div>
          ) : recordingState === "requesting-permission" ? (
            <div className="state-note">
              Waiting for microphone permission. Allow access in your browser prompt to start recording.
            </div>
          ) : recordingState === "recording" ? (
            <div className="state-note">
              Recording live now. Stop recording when you finish speaking and we&apos;ll transcribe the answer automatically.
            </div>
          ) : recordingState === "processing" ? (
            <div className="state-note">
              Transcribing your answer now. This usually takes a moment.
            </div>
          ) : null}

          <div>
            <label htmlFor="interview-answer" className="field-label">
              Your answer transcript
            </label>
            <textarea
              id="interview-answer"
              value={answer}
              onChange={(event) => onAnswerChange(event.target.value)}
              disabled={disabled}
              rows={6}
              className="field-input min-h-36 resize-y"
              placeholder={
                supportsMicrophone
                  ? "Your recording will populate here after transcription. You can also type or edit the answer before reviewing feedback."
                  : "Type your answer here to continue without microphone recording."
              }
            />
            {error ? (
              <p role="alert" className="mt-3 text-sm font-medium text-rose-500">
                {error}
              </p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
