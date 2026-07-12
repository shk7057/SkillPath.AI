type FeedbackCardProps = {
  sessionState: "idle" | "recording" | "feedback";
  strengths: string[];
  improvements: string[];
  summary: string;
};

export function FeedbackCard({
  sessionState,
  strengths,
  improvements,
  summary
}: FeedbackCardProps) {
  const showFeedback = sessionState === "feedback";

  return (
    <div className="surface-panel p-5 sm:p-6">
      <h3 className="text-lg font-semibold text-slate-900">AI Feedback</h3>
      <p className="mt-2 text-sm leading-7 text-slate-500">
        Feedback becomes available after the answer review is complete.
      </p>

      {!showFeedback ? (
        <div className="mt-5 space-y-3">
          <div className="h-16 rounded-2xl bg-slate-100" />
          <div className="h-16 rounded-2xl bg-slate-100" />
          <div className="h-16 rounded-2xl bg-slate-100" />
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
              Summary
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">{summary}</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[1.5rem] bg-mist p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
              Strengths
            </p>
            <div className="mt-4 space-y-3">
              {strengths.map((item) => (
                <div
                  key={item}
                  className="list-tile"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-lavender/45 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
              Improve Next
            </p>
            <div className="mt-4 space-y-3">
              {improvements.map((item) => (
                <div
                  key={item}
                  className="list-tile"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          </div>
        </div>
      )}
    </div>
  );
}
