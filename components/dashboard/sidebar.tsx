import Link from "next/link";
import {
  CloseIcon,
  DashboardIcon,
  InterviewIcon,
  ResumeIcon,
  RoadmapIcon,
  SettingsIcon,
  SkillMatchIcon
} from "@/components/dashboard/icons";
import { dashboardNavItems } from "@/components/dashboard/navigation";
import { LogoutButton } from "@/components/dashboard/logout-button";

type SidebarProps = {
  pathname: string;
  open: boolean;
  onClose: () => void;
  userEmail: string;
  userName: string;
};

function iconForKey(key: string) {
  switch (key) {
    case "dashboard":
      return <DashboardIcon />;
    case "skill-match":
      return <SkillMatchIcon />;
    case "resume-checker":
      return <ResumeIcon />;
    case "interview-ai":
      return <InterviewIcon />;
    case "roadmap":
      return <RoadmapIcon />;
    case "settings":
      return <SettingsIcon />;
    default:
      return <DashboardIcon />;
  }
}

export function Sidebar({
  pathname,
  open,
  onClose,
  userEmail,
  userName
}: SidebarProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-sm transition lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-80 max-w-[88vw] flex-col border-r border-white/70 bg-white/88 p-4 shadow-soft backdrop-blur transition-transform duration-200 ease-out sm:p-5 lg:sticky lg:top-4 lg:z-10 lg:h-[calc(100vh-2rem)] lg:w-72 lg:translate-x-0 lg:rounded-[1.75rem] lg:border lg:shadow-card ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="font-display text-[1.8rem] leading-none text-slate-900">
            SkillPath.AI
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary h-10 w-10 px-0 py-0 lg:hidden"
            aria-label="Close sidebar"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="panel-dark mt-6 flex min-h-[9.75rem] flex-col justify-between p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-white/55">
            Current focus
          </p>
          <p className="mt-3 break-words text-lg font-semibold leading-snug sm:text-xl">
            Resume optimization sprint
          </p>
          <p className="mt-2 pr-2 text-sm leading-6 text-white/75">
            Two high-impact tasks left before your next application round.
          </p>
        </div>

        <nav className="mt-6 space-y-1.5">
          {dashboardNavItems.map((item) => {
            const active = item.href ? pathname === item.href : false;
            const content = (
              <>
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${
                    active
                      ? "bg-white text-slate-900 shadow-sm"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {iconForKey(item.key)}
                </span>
                <span className="flex-1">{item.label}</span>
                {!item.href && (
                  <span className="rounded-full bg-white/80 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Soon
                  </span>
                )}
              </>
            );

            const className = `flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition duration-200 ease-out ${
              active
                ? "bg-gradient-to-r from-sky/70 to-lavender/65 text-slate-900 shadow-sm"
                : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm"
            }`;

            if (item.href) {
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={className}
                  aria-current={active ? "page" : undefined}
                  onClick={onClose}
                >
                  {content}
                </Link>
              );
            }

            return (
              <button key={item.key} type="button" className={`${className} cursor-default`} disabled>
                {content}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3 pt-4">
          <div className="rounded-[1.5rem] border border-white/80 bg-white/85 p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">{userName}</p>
            <p className="mt-1 text-sm text-slate-500">{userEmail}</p>
            <LogoutButton
              className="btn-secondary mt-4 w-full"
            />
          </div>

          <div className="rounded-[1.5rem] border border-line bg-mist p-4">
            <p className="text-sm font-semibold text-slate-900">Today&apos;s progress</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">3 / 5</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Complete the resume keyword pass and one mock interview reflection.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
