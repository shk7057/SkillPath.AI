import Link from "next/link";

export function FooterCta() {
  return (
    <section id="login" className="page-wrap py-16">
      <div className="page-max panel-dark rounded-[2.5rem] border border-slate-200 px-8 py-12 sm:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/60">
              Start Here
            </p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl">
              Start building a smarter path to your first job
            </h2>
            <p className="mt-4 text-base leading-8 text-white/75">
              Explore the product, try the demo flow, or head toward login when
              you are ready to continue your progress.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="btn-secondary rounded-full border-white/10 px-6 py-3 text-slate-900"
            >
              Start Free
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15 focus-visible:outline-white"
            >
              Try Demo
            </Link>
          </div>
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/70">
          Already have an account? Use the Login link in the navigation to continue to your workspace.
        </div>
      </div>
    </section>
  );
}
