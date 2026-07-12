type MatchCardProps = {
  role: string;
  percentage: number;
  description: string;
  missingSkillsCount: number;
  isSelected: boolean;
  onSelect: () => void;
};

export function MatchCard({
  role,
  percentage,
  description,
  missingSkillsCount,
  isSelected,
  onSelect
}: MatchCardProps) {
  return (
    <div
      className={`surface-panel rounded-[1.5rem] p-5 transition ${
        isSelected ? "ring-2 ring-slate-900/10" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-slate-900">{role}</p>
          <p className="mt-2 text-sm leading-7 text-slate-500">{description}</p>
          <p className="mt-3 text-sm font-medium text-slate-600">
            {missingSkillsCount} missing skill
            {missingSkillsCount === 1 ? "" : "s"} to close.
          </p>
        </div>
        <span className="rounded-full bg-gradient-to-r from-sky/70 to-lavender/70 px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm">
          {percentage}%
        </span>
      </div>

      <div className="mt-5 h-2 rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-sky to-lilac"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <button
        type="button"
        onClick={onSelect}
        className={`mt-5 inline-flex rounded-full px-4 py-2 text-sm font-semibold transition ${
          isSelected
            ? "bg-slate-900 text-white"
            : "bg-mist text-slate-700 hover:bg-lavender/50"
        }`}
      >
        {isSelected ? "Selected Role" : "Use This Role"}
      </button>
    </div>
  );
}
