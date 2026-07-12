type RoadmapCardProps = {
  steps: string[];
};

export function RoadmapCard({ steps }: RoadmapCardProps) {
  return (
    <div className="surface-panel rounded-[1.5rem] p-5">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-slate-900">Roadmap Steps</h3>
        <p className="mt-2 text-sm leading-7 text-slate-500">
          Suggested next steps based on your current skill-to-role gap.
        </p>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={step}
            className="list-tile flex items-start gap-3"
          >
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              {index + 1}
            </span>
            <p className="text-sm leading-7 text-slate-600">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
