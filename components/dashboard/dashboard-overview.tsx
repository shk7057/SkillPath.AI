"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CAREER_STATE_EVENT,
  getCareerStateSnapshot,
  type CareerStateSnapshot
} from "@/lib/client/career-state";
import { getSelectedRoleFromStorage } from "@/lib/client/selected-role";
import {
  generateCareerRoadmap,
  getRoadmapProgress
} from "@/lib/skillpath/roadmap";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { ProgressRing } from "@/components/dashboard/progress-ring";

export function DashboardOverview() {
  const [careerState, setCareerState] = useState<CareerStateSnapshot>({
    skillMatch: null,
    ats: null,
    interview: null,
    completedWeekIds: []
  });
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    const sync = () => {
      setCareerState(getCareerStateSnapshot());
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

  const roadmap = useMemo(
    () =>
      selectedRole
        ? generateCareerRoadmap({
            selectedRole,
            skillMatch: careerState.skillMatch,
            ats: careerState.ats,
            interview: careerState.interview
          })
        : null,
    [selectedRole, careerState]
  );

  const roadmapProgress = useMemo(
    () =>
      roadmap
        ? getRoadmapProgress(roadmap, careerState.completedWeekIds)
        : null,
    [roadmap, careerState.completedWeekIds]
  );

  const strongestArea = careerState.ats
    ? Object.entries(careerState.ats.breakdown).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Skill match"
    : "Skill match";
  const interviewAverage = careerState.interview
    ? (
        (careerState.interview.scores.relevance +
          careerState.interview.scores.confidence +
          careerState.interview.scores.clarity +
          careerState.interview.scores.communication) /
        4
      ).toFixed(1)
    : null;
  const roadmapPreview =
    roadmap?.phases
      .flatMap((phase) => phase.weeks)
      .filter((week) => !careerState.completedWeekIds.includes(week.id))
      .slice(0, 3) ?? [];

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <DashboardCard className="overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(233,226,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(220,235,255,0.18),transparent_40%)]" />
          <div className="relative">
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/65">
              Welcome back
            </span>
            <h2 className="mt-5 max-w-xl font-display text-3xl text-white sm:text-4xl">
              {selectedRole
                ? `You are building steady momentum toward ${selectedRole.toLowerCase()} roles.`
                : "Start with Skill Match to unlock a personalized career roadmap."}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
              {roadmap
                ? roadmap.overview
                : "Analyze your skills, run the ATS checker, and complete one mock interview to turn the dashboard into a role-specific action plan."}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-white/55">
                  Target role
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {selectedRole || "Choose in Skill Match"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-white/55">
                  Weekly focus
                </p>
                <p className="mt-2 text-base font-semibold">
                  {roadmapProgress?.nextRecommendedTask ?? "Skill analysis first"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-white/55">
                  Interview stage
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {careerState.interview
                    ? `Mock round ${careerState.interview.questionIndex + 1}`
                    : "Not started"}
                </p>
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Job Readiness"
          description="An at-a-glance score based on your saved role match, ATS, interview, and roadmap progress."
        >
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
            <ProgressRing
              value={roadmap?.estimatedJobReadinessScore ?? 42}
              label={`${roadmap?.estimatedJobReadinessScore ?? 42}%`}
            />
            <div className="space-y-3">
              <div className="rounded-2xl bg-mist p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Strongest area
                </p>
                <p className="mt-1 text-sm text-slate-500 capitalize">
                  {strongestArea.replace(/([A-Z])/g, " $1").trim()}
                </p>
              </div>
              <div className="rounded-2xl bg-lavender/45 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Best next step
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {roadmapProgress?.nextRecommendedTask ??
                    "Open Skill Match to generate a role-specific roadmap."}
                </p>
              </div>
            </div>
          </div>
        </DashboardCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <DashboardCard
          title="Resume Score"
          description="Latest ATS-aligned evaluation from your saved resume analysis."
        >
          <div className="rounded-3xl bg-gradient-to-br from-sky/60 to-lavender/55 p-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-600">Current score</p>
                <p className="mt-2 text-5xl font-semibold text-slate-900">
                  {careerState.ats?.score ?? "--"}
                </p>
              </div>
              <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-slate-700 shadow-sm">
                {careerState.ats?.targetRole ??
                  careerState.ats?.suggestedRole ??
                  "No mode yet"}
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {careerState.ats
                ? careerState.ats.improvementSuggestions[0] ??
                  "Keep tightening keyword alignment and quantified impact."
                : "Run Resume Checker to score your resume and capture ATS weaknesses for the roadmap."}
            </p>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Recent Interview"
          description="Last mock interview session summary."
        >
          <div className="space-y-4">
            <div className="rounded-2xl border border-line bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">
                  {careerState.interview?.role ?? "No interview saved yet"}
                </p>
                <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-slate-700">
                  {interviewAverage ? `${interviewAverage} / 10` : "Waiting"}
                </span>
              </div>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                {careerState.interview?.summary ??
                  "Practice one role-specific answer in Interview AI to bring interview signals into your roadmap."}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-mist p-4">
                <p className="text-sm font-semibold text-slate-900">Clarity</p>
                <p className="mt-1 text-sm text-slate-500">
                  {careerState.interview?.scores.clarity ?? "--"} / 10
                </p>
              </div>
              <div className="rounded-2xl bg-lavender/40 p-4">
                <p className="text-sm font-semibold text-slate-900">Confidence</p>
                <p className="mt-1 text-sm text-slate-500">
                  {careerState.interview?.scores.confidence ?? "--"} / 10
                </p>
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Career Roadmap Preview"
          description="Your next three milestones from the personalized roadmap."
        >
          <div className="space-y-3">
            {roadmapPreview.length > 0 ? (
              roadmapPreview.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4"
                >
                  <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-7 text-slate-600">{item.title}</p>
                </div>
              ))
            ) : (
              <div className="rounded-[1.5rem] bg-mist p-4 text-sm leading-7 text-slate-500">
                Personalized roadmap milestones will appear after you select a role in Skill Match.
              </div>
            )}
          </div>
          <Link href="/dashboard/roadmap" className="btn-secondary mt-5 w-full">
            Open Roadmap
          </Link>
        </DashboardCard>
      </section>
    </div>
  );
}
