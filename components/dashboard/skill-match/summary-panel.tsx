type SummaryPanelProps = {
  summary: string;
  title?: string;
};

export function SummaryPanel({
  summary,
  title = "Role Guidance"
}: SummaryPanelProps) {
  return (
    <div className="panel-dark p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/55">
        {title}
      </p>
      <p className="mt-4 text-base leading-8 text-white/80">{summary}</p>
    </div>
  );
}
