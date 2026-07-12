type ScoreCardProps = {
  label: string;
  score: number | null;
  accent?: "sky" | "lavender";
};

export function ScoreCard({
  label,
  score,
  accent = "sky"
}: ScoreCardProps) {
  const accentClass =
    accent === "sky"
      ? "from-sky/70 to-white"
      : "from-lavender/75 to-white";

  return (
    <div className="surface-panel rounded-[1.5rem] p-5">
      <div
        className={`inline-flex rounded-2xl bg-gradient-to-br ${accentClass} px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700`}
      >
        {label}
      </div>
      <p className="mt-4 text-4xl font-semibold text-slate-900">
        {score === null ? "--" : score.toFixed(1)}
      </p>
      <p className="mt-2 text-sm leading-7 text-slate-500">
        {score === null ? "available after review" : "out of 10"}
      </p>
    </div>
  );
}
