import { useId } from "react";

type ProgressRingProps = {
  value: number;
  label: string;
};

export function ProgressRing({ value, label }: ProgressRingProps) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const gradientId = useId();

  return (
    <div className="relative flex h-36 w-36 items-center justify-center">
      <svg className="h-36 w-36 -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="rgba(217, 227, 243, 0.8)"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeLinecap="round"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        <defs>
          <linearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#BFD9FF" />
            <stop offset="100%" stopColor="#D8CBFF" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex h-24 w-24 items-center justify-center rounded-full bg-white text-xl font-semibold text-slate-900 shadow-sm">
        {label}
      </div>
    </div>
  );
}
