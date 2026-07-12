export type DashboardNavItem = {
  label: string;
  href?: string;
  key: string;
};

export const dashboardNavItems: DashboardNavItem[] = [
  { key: "dashboard", label: "Dashboard", href: "/dashboard" },
  { key: "skill-match", label: "Skill Match", href: "/dashboard/skill-match" },
  { key: "resume-checker", label: "Resume Checker", href: "/dashboard/resume-checker" },
  { key: "interview-ai", label: "Interview AI", href: "/dashboard/interview-ai" },
  { key: "roadmap", label: "Roadmap", href: "/dashboard/roadmap" },
  { key: "settings", label: "Settings" }
];
