import type { RoadmapWeek } from "@/lib/skillpath/roadmap";

type RoadmapWeekCardProps = {
  week: RoadmapWeek;
  completed: boolean;
  onToggle: (weekId: string) => void;
};

export function RoadmapWeekCard({
  week,
  completed,
  onToggle
}: RoadmapWeekCardProps) {
  return (
    <article
      className={`relative rounded-[1.6rem] border p-5 shadow-sm transition duration-200 ease-out ${
        completed
          ? "border-emerald-200 bg-emerald-50/80"
          : "border-white/80 bg-white/90"
      }`}
    >
      <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-sky/70 via-lavender/70 to-transparent" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="pr-0 sm:pr-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
              {week.week}
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                {week.phase}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">
                {week.title}
              </h3>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">Learning topics</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {week.learningTopics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full bg-mist px-3 py-1.5 text-sm font-semibold text-slate-700"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">Practical tasks</p>
              <div className="mt-3 space-y-2">
                {week.practicalTasks.map((task) => (
                  <div key={task} className="list-tile py-3">
                    {task}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-3">
            <div className="rounded-2xl bg-lavender/35 p-4">
              <p className="text-sm font-semibold text-slate-900">Mini project</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {week.miniProject}
              </p>
            </div>
            <div className="rounded-2xl bg-mist p-4">
              <p className="text-sm font-semibold text-slate-900">
                Mock interview target
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {week.mockInterviewTarget}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">
                Resume improvement
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {week.resumeImprovement}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggle(week.id)}
          aria-pressed={completed}
          className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition duration-200 ease-out ${
            completed
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              : "bg-slate-900 text-white hover:bg-slate-800"
          }`}
        >
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-current text-xs">
            {completed ? "✓" : ""}
          </span>
          {completed ? "Completed" : "Mark complete"}
        </button>
      </div>
    </article>
  );
}
