type InterviewerCardProps = {
  interviewerName: string;
  role: string;
  difficulty: string;
  sessionState: "idle" | "active" | "feedback";
  currentQuestion: string;
};

export function InterviewerCard({
  interviewerName,
  role,
  difficulty,
  sessionState,
  currentQuestion
}: InterviewerCardProps) {
  const statusLabel =
    sessionState === "idle"
      ? "Waiting to begin"
      : sessionState === "active"
        ? "Listening now"
        : "Review ready";

  return (
    <div className="panel-dark p-6 sm:p-7">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(233,226,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(220,235,255,0.16),transparent_40%)]" />
      <div className="relative">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-white/10 text-xl font-semibold">
              AI
            </div>
            <div>
              <p className="text-lg font-semibold">{interviewerName}</p>
              <p className="mt-1 text-sm text-white/65">{role} mock interviewer</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              {difficulty}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              {statusLabel}
            </span>
          </div>
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/55">
            Current Question
          </p>
          <p className="mt-4 text-xl leading-9 text-white/90 sm:text-2xl">
            {currentQuestion}
          </p>
        </div>
      </div>
    </div>
  );
}
