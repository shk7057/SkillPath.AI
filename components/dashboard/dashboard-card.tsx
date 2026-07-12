import type { ReactNode } from "react";

type DashboardCardProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function DashboardCard({
  title,
  description,
  children,
  className = ""
}: DashboardCardProps) {
  return (
    <section
      className={`surface-panel relative p-6 sm:p-7 ${className}`}
    >
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          )}
          {description && (
            <p className="mt-2 text-sm leading-7 text-slate-500">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
