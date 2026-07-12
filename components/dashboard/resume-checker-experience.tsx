"use client";

import { useMemo, useState } from "react";
import { saveAtsSnapshot } from "@/lib/client/career-state";
import { getRoleNames } from "@/lib/skillpath/catalog";
import type { AtsCheckResponse, ResumeParseResult } from "@/lib/skillpath/types";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { ProgressRing } from "@/components/dashboard/progress-ring";
import { FileUpload } from "@/components/dashboard/skill-match/file-upload";

type ViewState = "upload" | "analyzing" | "result";

const roleOptions = getRoleNames();

async function readJsonSafely<T>(response: Response) {
  const rawText = await response.text();
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const statusPrefix = `Request failed with HTTP ${response.status}.`;

  if (!rawText) {
    return {
      data: null as T | null,
      errorMessage: response.ok
        ? "The server returned an empty response."
        : `${statusPrefix} The server returned an empty error response.`
    };
  }

  if (!isJson) {
    return {
      data: null as T | null,
      errorMessage: response.ok
        ? "The server returned an unexpected response format."
        : `${statusPrefix} The server returned HTML or another non-JSON error response.`
    };
  }

  try {
    return {
      data: JSON.parse(rawText) as T,
      errorMessage: ""
    };
  } catch {
    return {
      data: null as T | null,
      errorMessage: "The server returned invalid JSON."
    };
  }
}

function statusTone(status: "Strong" | "Needs Work" | "Missing") {
  if (status === "Strong") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "Needs Work") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-rose-100 text-rose-600";
}

function priorityTone(priority: "High" | "Medium" | "Low") {
  if (priority === "High") {
    return "border-rose-200 bg-rose-50 text-rose-600";
  }

  if (priority === "Medium") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-sky-200 bg-sky/40 text-slate-700";
}

export function ResumeCheckerExperience() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedResume, setParsedResume] = useState<ResumeParseResult | null>(null);
  const [view, setView] = useState<ViewState>("upload");
  const [analysisError, setAnalysisError] = useState("");
  const [parsing, setParsing] = useState(false);
  const [analysis, setAnalysis] = useState<AtsCheckResponse | null>(null);
  const [targetRole, setTargetRole] = useState("");

  const isUpload = view === "upload";
  const isAnalyzing = view === "analyzing";
  const isResult = view === "result";
  const downloadDisabled = !analysis;

  const breakdownItems = useMemo(
    () => [
      {
        label: "Formatting",
        value: analysis?.breakdown.formatting ?? 0
      },
      {
        label: "Keywords",
        value: analysis?.breakdown.keywords ?? 0
      },
      {
        label: "Content",
        value: analysis?.breakdown.content ?? 0
      },
      {
        label: "Readability",
        value: analysis?.breakdown.readability ?? 0
      },
      {
        label: "Role Fit",
        value: analysis?.breakdown.roleFit ?? 0
      }
    ],
    [analysis]
  );

  const handleParseResume = async (file: File) => {
    setFileName(file.name);
    setAnalysisError("");
    setView("upload");
    setParsing(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("/api/resume-upload", {
        method: "POST",
        body: formData
      });

      const { data, errorMessage } = await readJsonSafely<
        ResumeParseResult | { error: string }
      >(response);

      if (!response.ok || !data || "error" in data) {
        throw new Error(
          data && "error" in data
            ? data.error
            : errorMessage || "Unable to parse the uploaded resume."
        );
      }

      setParsedResume(data);
      setAnalysis(null);
    } catch (error) {
      setParsedResume(null);
      setAnalysis(null);
      setAnalysisError(
        error instanceof Error
          ? error.message
          : "Unable to parse the uploaded resume."
      );
    } finally {
      setParsing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!parsedResume?.resumeText) {
      setAnalysisError("Upload and parse a PDF, DOC, or DOCX resume before analyzing.");
      setView("upload");
      return;
    }

    setAnalysisError("");
    setView("analyzing");

    try {
      const response = await fetch("/api/ats/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          resumeText: parsedResume.resumeText,
          targetRole: targetRole || null
        })
      });

      const { data, errorMessage } = await readJsonSafely<
        AtsCheckResponse | { error: string }
      >(response);

      if (!response.ok || !data || "error" in data) {
        throw new Error(
          data && "error" in data
            ? data.error
            : errorMessage || "Unable to analyze your resume right now."
        );
      }

      setAnalysis(data);
      saveAtsSnapshot({
        score: data.score,
        targetRole: data.targetRole,
        suggestedRole: data.suggestedRole,
        missingSections: data.missingSections,
        missingKeywords: data.missingKeywords,
        priorityKeywordGaps: data.priorityKeywordGaps,
        improvementSuggestions: data.improvementSuggestions,
        breakdown: data.breakdown
      });
      setView("result");
    } catch (error) {
      setAnalysisError(
        error instanceof Error
          ? error.message
          : "Unable to analyze your resume right now."
      );
      setView("upload");
    }
  };

  const handleDownloadReport = () => {
    if (!analysis) {
      return;
    }

    const report = [
      "# SkillPath.AI ATS Report",
      "",
      `Resume: ${fileName ?? "Uploaded resume"}`,
      `Target role mode: ${analysis.targetRole ?? "Auto detect"}`,
      `Suggested role: ${analysis.suggestedRole ?? "Not enough signal yet"}`,
      `ATS score: ${analysis.score}/100`,
      "",
      "## Score Breakdown",
      ...breakdownItems.map((item) => `- ${item.label}: ${item.value}/100`),
      "",
      "## Priority Keyword Gaps",
      `- High: ${analysis.priorityKeywordGaps.high.join(", ") || "None"}`,
      `- Medium: ${analysis.priorityKeywordGaps.medium.join(", ") || "None"}`,
      `- Low: ${analysis.priorityKeywordGaps.low.join(", ") || "None"}`,
      "",
      "## Section Heatmap",
      ...analysis.sectionHeatmap.map(
        (item) => `- ${item.section}: ${item.status} - ${item.note}`
      ),
      "",
      "## Suggestions",
      ...analysis.improvementSuggestions.map((item) => `- ${item}`),
      "",
      "## Rewritten Bullets",
      ...analysis.weakBulletRewrites.map(
        (item) => `- Original: ${item.original}\n  Improved: ${item.improved}`
      )
    ].join("\n");

    const blob = new Blob([report], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "skillpath-ats-report.md";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <section className="surface-panel flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Workflow state
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            Upload a resume, parse its text, then run a role-aware ATS check with premium scoring breakdowns and rewrite guidance.
          </p>
        </div>

        <div className="inline-flex rounded-full border border-line bg-white p-1 shadow-sm">
          {(["upload", "analyzing", "result"] as ViewState[]).map((state) => {
            const active = view === state;
            return (
              <span
                key={state}
                className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
                  active ? "bg-slate-900 text-white" : "text-slate-500"
                }`}
              >
                {state}
              </span>
            );
          })}
        </div>
      </section>

      <section className="grid items-start gap-6 xl:grid-cols-[0.94fr_1.06fr]">
        <DashboardCard
          title="Resume Upload"
          description="Upload a resume, parse the text, and score it against ATS fundamentals plus an optional role-specific mode."
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="ats-role-mode" className="field-label">
                Role-specific ATS mode
              </label>
              <select
                id="ats-role-mode"
                value={targetRole}
                onChange={(event) => setTargetRole(event.target.value)}
                className="field-select"
                disabled={isAnalyzing || parsing}
              >
                <option value="">Auto detect best role</option>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                Choose a target role when you want stricter ATS guidance for a specific path.
              </p>
            </div>

            <FileUpload
              label="Resume upload"
              helperText="Click to select a PDF, DOC, or DOCX resume file for ATS analysis."
              fileName={fileName}
              onSelect={handleParseResume}
              onError={(message) => {
                setFileName(null);
                setParsedResume(null);
                setAnalysis(null);
                setAnalysisError(message);
                setView("upload");
              }}
              error={analysisError}
              statusMessage={
                fileName
                  ? isResult
                    ? `${fileName} analyzed successfully. Review the ATS breakdown and suggestions below.`
                    : parsing
                      ? `Parsing ${fileName} for ATS analysis...`
                      : parsedResume
                        ? `${fileName} parsed successfully. ${parsedResume.detectedSections.length} resume section(s) found.`
                        : "Resume selected and ready for ATS analysis."
                  : "Click to select a PDF, DOC, or DOCX resume file for ATS analysis."
              }
              disabled={isAnalyzing || parsing}
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={!parsedResume || isAnalyzing || parsing}
                className="btn-primary px-5 py-3 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isAnalyzing ? "Analyzing resume..." : "Analyze Resume"}
              </button>

              <button
                type="button"
                onClick={handleDownloadReport}
                disabled={downloadDisabled}
                className="btn-secondary px-5 py-3"
              >
                Export ATS Report
              </button>
            </div>

            <div className="metric-tile">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">Upload state</p>
                <span
                  className={`state-chip ${
                    isUpload
                      ? "bg-sky/70 text-slate-800"
                      : isAnalyzing
                        ? "bg-lavender/70 text-slate-800"
                        : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {view}
                </span>
              </div>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                {fileName
                  ? `Selected file: ${fileName}`
                  : "No resume selected yet. Upload a file to begin ATS analysis."}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-mist px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                  {parsedResume ? `${parsedResume.wordCount} words parsed` : "Awaiting parse"}
                </span>
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-sm">
                  {parsedResume
                    ? `${parsedResume.extractedSkills.length} skill signal(s)`
                    : "No extracted skills yet"}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Role mode: {targetRole || "Auto detect best role"}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {parsedResume
                  ? parsedResume.detectedSections.length > 0
                    ? `Detected sections: ${parsedResume.detectedSections.join(", ")}`
                    : "No standard resume sections were detected yet."
                  : "Core sections will be detected after parsing completes."}
              </p>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          className={`overflow-hidden ${
            isResult
              ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white ring-1 ring-white/10"
              : ""
          }`}
          title={isResult ? undefined : "ATS Score"}
          description={
            isResult
              ? undefined
              : "Your ATS result appears here after analysis completes."
          }
        >
          {isAnalyzing ? (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-lilac border-t-slate-900" />
                <div>
                  <p className="text-lg font-semibold text-slate-900">
                    Analyzing your resume
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    Reviewing sections, keyword coverage, content quality, readability, and role fit from the parsed resume text.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="h-4 w-full rounded-full bg-slate-100/90" />
                <div className="h-4 w-5/6 rounded-full bg-slate-100/90" />
                <div className="h-4 w-2/3 rounded-full bg-slate-100/90" />
              </div>
            </div>
          ) : isUpload ? (
            <div className="rounded-[1.75rem] bg-mist p-6">
              <p className="text-lg font-semibold text-slate-900">
                No ATS result yet
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                Upload a resume and run the analysis to generate the ATS score experience.
              </p>
            </div>
          ) : (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(233,226,255,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(220,235,255,0.16),transparent_40%)]" />
              <div className="relative">
                <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
                  <div className="max-w-[34rem]">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">
                      ATS score
                    </p>
                    <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
                      {analysis?.score ?? 0} / 100
                    </h2>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
                      {analysis?.headline}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                        Mode: {analysis?.targetRole ?? "Auto detect"}
                      </span>
                      <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                        Suggested: {analysis?.suggestedRole ?? "No strong fit yet"}
                      </span>
                    </div>
                  </div>
                  <ProgressRing
                    value={analysis?.score ?? 0}
                    label={`${analysis?.score ?? 0}%`}
                  />
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
                  {breakdownItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex min-h-[6.75rem] flex-col justify-between rounded-[1.35rem] border border-white/10 bg-white/10 px-4 py-4 backdrop-blur-sm sm:px-5"
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-white/55">
                        {item.label}
                      </p>
                      <p className="mt-3 text-2xl font-semibold text-white">
                        {item.value}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </DashboardCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardCard
          title="Priority Keyword Gaps"
          description="Missing keywords are grouped by urgency so you can fix the highest-impact gaps first."
          className={isUpload ? "opacity-60" : ""}
        >
          <div className="space-y-5">
            {([
              {
                label: "High" as const,
                items: analysis?.priorityKeywordGaps.high ?? []
              },
              {
                label: "Medium" as const,
                items: analysis?.priorityKeywordGaps.medium ?? []
              },
              {
                label: "Low" as const,
                items: analysis?.priorityKeywordGaps.low ?? []
              }
            ]).map((group) => (
              <div key={group.label}>
                <p className="text-sm font-semibold text-slate-900">
                  {group.label} Priority
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {group.items.length > 0 ? (
                    group.items.map((keyword) => (
                      <span
                        key={`${group.label}-${keyword}`}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold shadow-sm ${priorityTone(
                          group.label
                        )}`}
                      >
                        {keyword}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm leading-7 text-slate-500">
                      No {group.label.toLowerCase()} priority gaps detected.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Resume Summary"
          description="Rule-based findings derived from the parsed text, chosen role mode, and section-level resume quality."
          className={isUpload ? "opacity-60" : ""}
        >
          <div className="space-y-4">
            <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">
                Missing sections
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                {analysis && analysis.missingSections.length > 0
                  ? analysis.missingSections.join(", ")
                  : "No critical sections missing."}
              </p>
            </div>

            {(analysis?.summaryItems ?? []).map((item) => (
              <div key={item} className="list-tile">
                {item}
              </div>
            ))}

            <div className="rounded-[1.5rem] border border-line bg-mist/70 p-4">
              <p className="text-sm font-semibold text-slate-900">
                Resume Section Heatmap
              </p>
              <div className="mt-4 grid gap-3">
                {(analysis?.sectionHeatmap ?? []).map((item) => (
                  <div
                    key={item.section}
                    className="flex flex-col gap-3 rounded-2xl border border-white/70 bg-white/85 p-4 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {item.section}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-slate-500">
                        {item.note}
                      </p>
                    </div>
                    <span
                      className={`state-chip self-start ${statusTone(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DashboardCard>
      </section>

      <section>
        <DashboardCard
          title="Improvement Suggestions"
          description="Suggestions and rewrites update from the actual parsed resume content without changing the page's core experience."
          className={isUpload ? "opacity-60" : ""}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm leading-7 text-slate-500">
              Export a clean ATS report whenever you want to save or share the current recommendations.
            </p>
            <button
              type="button"
              onClick={handleDownloadReport}
              disabled={downloadDisabled}
              className="btn-ghost whitespace-nowrap"
            >
              Download Suggestions
            </button>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-slate-900">
                ATS Improvement Suggestions
              </p>
              {(analysis?.improvementSuggestions ?? []).map((item, index) => (
                <div key={item} className="list-tile flex items-start gap-3">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-7 text-slate-600">{item}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-slate-900">
                Rewrite Weak Bullets
              </p>
              {(analysis?.weakBulletRewrites ?? []).length > 0 ? (
                (analysis?.weakBulletRewrites ?? []).map((item) => (
                  <div
                    key={item.original}
                    className="rounded-[1.5rem] border border-line bg-white p-4 shadow-sm"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Original
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-500">
                      {item.original}
                    </p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Stronger rewrite
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">
                      {item.improved}
                    </p>
                  </div>
                ))
              ) : (
                <div className="state-note">
                  Upload a resume with more project or experience detail to unlock bullet rewrites.
                </div>
              )}
            </div>
          </div>
        </DashboardCard>
      </section>
    </div>
  );
}
