type TestimonialCardProps = {
  quote: string;
  name: string;
  role: string;
};

export function TestimonialCard({
  quote,
  name,
  role
}: TestimonialCardProps) {
  return (
    <article className="surface-panel bg-gradient-to-b from-white/95 to-mist p-6">
      <p className="text-base leading-8 text-slate-700">&ldquo;{quote}&rdquo;</p>
      <div className="mt-6">
        <p className="text-sm font-semibold text-slate-900">{name}</p>
        <p className="mt-1 text-sm text-slate-500">{role}</p>
      </div>
    </article>
  );
}
