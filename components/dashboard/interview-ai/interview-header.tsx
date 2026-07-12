type InterviewHeaderProps = {
  role: string;
  language: string;
  difficulty: string;
  roles: string[];
  languages: string[];
  difficulties: string[];
  sessionState: "idle" | "active" | "feedback";
  onRoleChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onStart: () => void;
  startDisabled: boolean;
  hint: string;
};

export function InterviewHeader({
  role,
  language,
  difficulty,
  roles,
  languages,
  difficulties,
  sessionState,
  onRoleChange,
  onLanguageChange,
  onDifficultyChange,
  onStart,
  startDisabled,
  hint
}: InterviewHeaderProps) {
  const buttonLabel =
    sessionState === "idle"
      ? "Start Interview"
      : sessionState === "active"
        ? "Restart Session"
        : "Start New Round";

  return (
    <div className="surface-panel p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Interview Setup
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
            Practice a guided oral mock interview
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            Tune the role, language, and difficulty, then step into a realistic AI-led interview flow.
          </p>
        </div>

        <button
          type="button"
          onClick={onStart}
          disabled={startDisabled}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-70"
        >
          {buttonLabel}
        </button>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-500">{hint}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div>
          <label className="field-label">
            Role
          </label>
          <select
            value={role}
            onChange={(event) => onRoleChange(event.target.value)}
            className="field-select"
          >
            <option value="">Choose a role</option>
            {roles.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label">
            Language
          </label>
          <select
            value={language}
            onChange={(event) => onLanguageChange(event.target.value)}
            className="field-select"
          >
            {languages.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(event) => onDifficultyChange(event.target.value)}
            className="field-select"
          >
            {difficulties.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
