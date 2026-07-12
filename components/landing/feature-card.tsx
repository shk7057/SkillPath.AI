import Link from "next/link";
import type { ReactNode } from "react";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  accent: string;
  href: string;
};

export function FeatureCard({
  title,
  description,
  icon,
  accent,
  href
}: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="surface-panel group block cursor-pointer p-6 transition hover:-translate-y-0.5 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15"
    >
      <article>
        <div
          className={`inline-flex rounded-2xl bg-gradient-to-br ${accent} p-3 text-slate-800 shadow-sm transition group-hover:scale-[1.02]`}
        >
          {icon}
        </div>
        <h3 className="mt-5 text-xl font-semibold text-slate-900">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
      </article>
    </Link>
  );
}
