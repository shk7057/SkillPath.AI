export function Footer() {
  return (
    <footer className="page-wrap pb-10 pt-2">
      <div className="page-max surface-section flex flex-col gap-4 px-6 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-xl text-slate-900">SkillPath.AI</p>
          <p className="mt-1">
            Helping students and freshers move from learning to getting hired.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <a href="#features" className="transition hover:text-slate-900">
            Features
          </a>
          <a href="#about" className="transition hover:text-slate-900">
            About
          </a>
          <a href="#login" className="transition hover:text-slate-900">
            Login
          </a>
        </div>
      </div>
    </footer>
  );
}
