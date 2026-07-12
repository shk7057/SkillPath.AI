import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

const highlights = [
  "Personalized skill paths for your target role",
  "ATS resume feedback before you apply",
  "Mock interview practice that feels structured and calm"
];

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer
}: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden page-wrap py-6 sm:py-8">
      <div className="absolute left-0 top-0 -z-10 h-64 w-64 rounded-full bg-lavender/70 blur-3xl sm:h-80 sm:w-80" />
      <div className="absolute bottom-0 right-0 -z-10 h-72 w-72 rounded-full bg-sky/80 blur-3xl sm:h-96 sm:w-96" />

      <div className="page-max flex items-center justify-between gap-4 py-2">
        <Link href="/" className="font-display text-2xl text-slate-900">
          SkillPath.AI
        </Link>
        <Link href="/" className="btn-ghost">
          Back to home
        </Link>
      </div>

      <div className="page-max mt-6 grid min-h-[calc(100vh-7rem)] items-center">
        <div className="surface-panel-strong grid overflow-hidden lg:grid-cols-[0.95fr_1.05fr]">
          <section className="panel-dark p-8 sm:p-10 lg:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(233,226,255,0.2),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(220,235,255,0.18),transparent_40%)]" />
            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
                {eyebrow}
              </p>
              <h1 className="mt-5 max-w-md font-display text-4xl leading-tight sm:text-5xl">
                {title}
              </h1>
              <p className="mt-5 max-w-lg text-base leading-8 text-white/75 sm:text-lg">
                {description}
              </p>

              <div className="mt-10 space-y-4">
                {highlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-4 shadow-sm"
                  >
                    <span className="mt-2 inline-flex h-3 w-3 shrink-0 rounded-full bg-white/50" />
                    <p className="text-sm leading-7 text-white/80">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center bg-white/76 p-5 sm:p-8 lg:p-10">
            <div className="w-full max-w-md">{children}</div>
          </section>
        </div>

        <div className="mx-auto mt-4 w-full max-w-md text-center text-sm text-slate-500">
          {footer}
        </div>
      </div>
    </main>
  );
}
