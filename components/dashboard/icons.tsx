type IconProps = {
  className?: string;
};

const baseClassName = "h-5 w-5";

export function MenuIcon({ className = baseClassName }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ className = baseClassName }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

export function DashboardIcon({ className = baseClassName }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SkillMatchIcon({ className = baseClassName }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M4 16.5 9 11l4 4 7-8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 7h2v2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ResumeIcon({ className = baseClassName }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M8 4h6l4 4v10.5A1.5 1.5 0 0 1 16.5 20h-9A1.5 1.5 0 0 1 6 18.5v-13A1.5 1.5 0 0 1 7.5 4H8Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 10h4M10 14h4M9.5 18l1.5 1.5L15 16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function InterviewIcon({ className = baseClassName }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M8.5 9.5A3.5 3.5 0 1 0 8.5 2.5a3.5 3.5 0 0 0 0 7Zm7 3A3.5 3.5 0 1 0 15.5 5.5a3.5 3.5 0 0 0 0 7Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 20.5c.8-3.3 3-5 5.5-5s4.7 1.7 5.5 5M10 20.5c.7-2.4 2.4-3.5 4.5-3.5 2.2 0 3.9 1.1 4.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function RoadmapIcon({ className = baseClassName }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M6 18V8.5a1.5 1.5 0 0 1 1.5-1.5H10l2-2h4.5A1.5 1.5 0 0 1 18 6.5V18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 18h12M9 10h6M9 14h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SettingsIcon({ className = baseClassName }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="m14.5 4 .7 1.7a1 1 0 0 0 .6.6l1.7.7-1.7.7a1 1 0 0 0-.6.6l-.7 1.7-.7-1.7a1 1 0 0 0-.6-.6l-1.7-.7 1.7-.7a1 1 0 0 0 .6-.6L14.5 4Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 13 7.7 16a1 1 0 0 0 .6.6l3 1.2-3 1.2a1 1 0 0 0-.6.6L6.5 23l-1.2-3a1 1 0 0 0-.6-.6l-3-1.2 3-1.2a1 1 0 0 0 .6-.6L6.5 13Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 14h4M19 12v4M4 5h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function UploadIcon({ className = baseClassName }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M12 16V6M8.5 9.5 12 6l3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 18.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
