type StepCardProps = {
  step: string;
  title: string;
  description: string;
};

export function StepCard({ step, title, description }: StepCardProps) {
  return (
    <article className="surface-panel p-6">
      <span className="inline-flex rounded-full bg-mist px-3 py-1 text-sm font-semibold text-slate-700">
        {step}
      </span>
      <h3 className="mt-5 text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </article>
  );
}
