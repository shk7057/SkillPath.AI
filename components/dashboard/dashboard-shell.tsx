"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";

type DashboardShellProps = {
  children: ReactNode;
  userEmail: string;
  userName: string;
};

const headerContent: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "A calm overview of your job readiness, resume progress, and interview prep."
  },
  "/dashboard/skill-match": {
    title: "Skill Match",
    subtitle: "Compare your current skills with likely-fit roles and see the gaps to close next."
  },
  "/dashboard/interview-ai": {
    title: "Interview AI",
    subtitle: "Practice spoken answers with a calm AI interviewer and review instant mock feedback."
  },
  "/dashboard/resume-checker": {
    title: "Resume ATS Checker",
    subtitle: "Upload, review, and improve your resume using a clear ATS-style score preview."
  },
  "/dashboard/roadmap": {
    title: "Career Roadmap",
    subtitle: "Follow a role-specific 30, 60, and 90 day plan shaped by your skills, ATS gaps, and interview progress."
  }
};

export function DashboardShell({
  children,
  userEmail,
  userName
}: DashboardShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const currentHeader = useMemo(
    () =>
      headerContent[pathname] ?? {
        title: "Dashboard",
        subtitle: "SkillPath.AI workspace"
      },
    [pathname]
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(233,226,255,0.55),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(220,235,255,0.7),transparent_30%),linear-gradient(180deg,#fdfefe_0%,#f6f9ff_55%,#eef4ff_100%)]">
      <div className="mx-auto flex min-h-screen max-w-[1600px] xl:px-4">
        <Sidebar
          pathname={pathname}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          userEmail={userEmail}
          userName={userName}
        />

        <div className="min-w-0 flex-1">
          <Header
            title={currentHeader.title}
            subtitle={currentHeader.subtitle}
            onMenuClick={() => setSidebarOpen(true)}
            userEmail={userEmail}
            userName={userName}
          />

          <main className="px-4 py-6 sm:px-6 lg:px-8 xl:py-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
