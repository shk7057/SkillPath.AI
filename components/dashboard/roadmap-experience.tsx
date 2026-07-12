"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CAREER_STATE_EVENT,
  getCareerStateSnapshot,
  toggleCompletedRoadmapWeek,
  type CareerStateSnapshot
} from "@/lib/client/career-state";
import { getSelectedRoleFromStorage } from "@/lib/client/selected-role";
import {
  generateCareerRoadmap,
  getRoadmapProgress
} from "@/lib/skillpath/roadmap";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { ProgressRing } from "@/components/dashboard/progress-ring";
import { RoadmapWeekCard } from "@/components/dashboard/roadmap/roadmap-week-card";

function useCareerState() {
  const [state, setState] = useState<CareerStateSnapshot>({
    skillMatch: null,
    ats: null,
    interview: null,
    completedWeekIds: []
  });
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    const sync = () => {
      setState(getCareerStateSnapshot());
      setSelectedRole(getSelectedRoleFromStorage());
    };

    sync();
    window.addEventListener(CAREER_STATE_EVENT, sync);
    window.addEventListener("storage", sync);
    window.addEventListener("skillpath:selected-role-change", sync);

    return () => {
      window.removeEventListener(CAREER_STATE_EVENT, sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("skillpath:selected-role-change", sync);
    };
  }, []);

  return {
    ...state,
    selectedRole
  };
}

export function RoadmapExperience() {
  const { skillMatch, ats, interview, completedWeekIds, selectedRole } =
    useCareerState();

  const roadmap = useMemo(
    () =>
      selectedRole
        ? generateCareerRoadmap({
            selectedRole,
            skillMatch,
            ats,
            interview
          })
        : null,
    [selectedRole, skillMatch, ats, interview]
  );

  const progress = useMemo(
    () =>
      roadmap
        ? getRoadmapProgress(roadmap, completedWeekIds)
        : null,
    [roadmap, completedWeekIds]
  );

  if (!selectedRole || !roadmap || !progress) {
    return (
      <div className="space-y-6">
        <DashboardCard
          title="Career Roadmap"
          description="Your roadmap appears once Skill Match has identified and selected a target role."
        >
          <div className="rounded-[1.75rem] bg-mist p-6">
            <p className="text-lg font-semibold text-slate-900">
              No personalized roadmap yet
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Start with Skill Match so we can understand your selected role, current skills, and missing skills. Resume Checker and Interview AI will then sharpen the roadmap further with ATS and interview signals.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/dashboard/skill-match" className="btn-primary">
                Open Skill Match
              </Link>
              <Link href="/dashboard/resume-checker" className="btn-secondary">
                Improve ATS profile
              </Link>
              <Link href="/dashboard/interview-ai" className="btn-secondary">
                Practice interview
              </Link>
            </div>
          </div>
        </DashboardCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <DashboardCard className="overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(233,226,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(220,235,255,0.18),transparent_40%)]" />
          <div className="relative">
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/65">
              Personalized roadmap
            </span>
            <h2 className="mt-5 max-w-3xl font-display text-3xl text-white sm:text-4xl">
              {roadmap.role} roadmap tuned to your skills, ATS profile, and interview progress.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              {roadmap.overview}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-white/55">
                  Next task
                </p>
                <p className="mt-2 text-base font-semibold text-white">
                  {progress.nextRecommendedTask}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-white/55">
                  Completed
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {progress.completedCount} / {progress.totalWeeks} weeks
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-white/55">
                  Category
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {roadmap.category}
                </p>
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Readiness Snapshot"
          description="A blended score from role match, ATS progress, interview performance, and roadmap completion."
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <ProgressRing
              value={roadmap.estimatedJobReadinessScore}
              label={`${roadmap.estimatedJobReadinessScore}%`}
            />
            <div className="flex-1 space-y-3">
              <div className="rounded-2xl bg-mist p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Roadmap progress
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {progress.progressPercentage}% complete
                </p>
              </div>
              <div className="rounded-2xl bg-lavender/40 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  ATS score
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {ats?.score ?? "Not analyzed yet"} / 100
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">
                  Interview momentum
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {interview
                    ? `${Math.round(
                        ((interview.scores.relevance +
                          interview.scores.confidence +
                          interview.scores.clarity +
                          interview.scores.communication) /
                          4) *
                          10
                      )}% mock readiness`
                    : "No interview feedback saved yet"}
                </p>
              </div>
            </div>
          </div>
        </DashboardCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
        <DashboardCard
          title="Current Signals"
          description="The roadmap updates from real state captured across Skill Match, Resume Checker, and Interview AI."
        >
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-slate-900">Top priorities</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {roadmap.topPriorities.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-line bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Current skills</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(skillMatch?.combinedSkills ?? []).slice(0, 12).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-mist px-3 py-1.5 text-sm font-semibold text-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-line bg-mist/60 p-4">
              <p className="text-sm font-semibold text-slate-900">Role gaps</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(skillMatch?.matchedRoles.find((item) => item.role === selectedRole)
                  ?.missingSkills ?? []
                ).slice(0, 10).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Weekly Timeline"
          description="Mark weeks complete as you move through the roadmap. Your progress and next step update automatically."
        >
          <div className="space-y-6">
            {roadmap.phases.map((phase) => (
              <div key={phase.label} className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {phase.label}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {phase.summary}
                    </p>
                  </div>
                  <span className="state-chip bg-mist text-slate-700">
                    {phase.weeks.length} weekly milestones
                  </span>
                </div>

                <div className="space-y-4">
                  {phase.weeks.map((week) => (
                    <RoadmapWeekCard
                      key={week.id}
                      week={week}
                      completed={completedWeekIds.includes(week.id)}
                      onToggle={toggleCompletedRoadmapWeek}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </section>
    </div>
  );
}
