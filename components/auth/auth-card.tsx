import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="surface-panel-strong p-6 sm:p-8">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
          {title}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
          {description}
        </p>
      </div>
      <div className="mt-8 space-y-1">{children}</div>
    </div>
  );
}
