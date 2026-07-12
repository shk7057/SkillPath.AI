import { MenuIcon } from "@/components/dashboard/icons";
import { LogoutButton } from "@/components/dashboard/logout-button";

type HeaderProps = {
  title: string;
  subtitle: string;
  onMenuClick: () => void;
  userEmail: string;
  userName: string;
};

export function Header({
  title,
  subtitle,
  onMenuClick,
  userEmail,
  userName
}: HeaderProps) {
  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-white/72 px-4 py-3.5 backdrop-blur sm:px-6 sm:py-4 xl:mt-4 xl:rounded-[1.5rem] xl:border xl:bg-white/74">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="btn-secondary h-11 w-11 px-0 py-0 lg:hidden"
            aria-label="Open sidebar"
          >
            <MenuIcon />
          </button>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              SkillPath.AI
            </p>
            <h1 className="truncate text-2xl font-semibold text-slate-900 sm:text-3xl">
              {title}
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="hidden shrink-0 flex-wrap items-center justify-end gap-3 self-start sm:flex lg:self-center">
          <div className="rounded-full border border-line bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">
            Premium Plan
          </div>
          <LogoutButton
            className="btn-secondary rounded-full px-4 py-2"
          />
          <div className="flex items-center gap-3 rounded-full border border-white/80 bg-white px-2 py-2 pr-4 shadow-sm">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky to-lavender text-sm font-semibold text-slate-800">
              {initials || "SP"}
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">{userName}</p>
              <p className="text-xs text-slate-500">{userEmail}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
