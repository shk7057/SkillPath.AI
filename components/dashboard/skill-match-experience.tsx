"use client";

import { useState } from "react";
import { saveSkillMatchSnapshot } from "@/lib/client/career-state";
import { saveSelectedRoleToStorage } from "@/lib/client/selected-role";
import type {
  ResumeParseResult,
  SkillMatchAnalysisResponse
} from "@/lib/skillpath/types";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { FileUpload } from "@/components/dashboard/skill-match/file-upload";
import { MatchCard } from "@/components/dashboard/skill-match/match-card";
import { RoadmapCard } from "@/components/dashboard/skill-match/roadmap-card";
import { SummaryPanel } from "@/components/dashboard/skill-match/summary-panel";
import { TagInput } from "@/components/dashboard/skill-match/tag-input";

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
    const plainText =
      contentType.includes("text/plain") || !contentType
        ? rawText.trim().slice(0, 160)
        : "";

    return {
      data: null as T | null,
      errorMessage: response.ok
        ? "The server returned an unexpected response format."
        : plainText
          ? `${statusPrefix} ${plainText}`
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

export function SkillMatchExperience() {
  const [skills, setSkills] = useState<string[]>([]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedResume, setParsedResume] = useState<ResumeParseResult | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [analysisError, setAnalysisError] = useState("");
  const [analysis, setAnalysis] = useState<SkillMatchAnalysisResponse | null>(null);

  const hasInput = skills.length > 0 || Boolean(parsedResume?.resumeText);
  const activeRole =
    analysis?.matchedRoles.find((role) => role.role === selectedRole) ??
    analysis?.matchedRoles[0];

  const handleParseResume = async (file: File) => {
    setResumeFile(file);
    setFileName(file.name);
    setUploadError("");
    setAnalysisError("");
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
    } catch (error) {
      setParsedResume(null);
      setUploadError(
        error instanceof Error
          ? error.message
          : "Unable to parse the uploaded resume."
      );
    } finally {
      setParsing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!hasInput) {
      setAnalysisError("Add skills manually or upload a resume before analyzing.");
      return;
    }

    setLoading(true);
    setAnalysisError("");

    try {
      const response = await fetch("/api/skill-match/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          manualSkills: skills,
          resumeText: parsedResume?.resumeText ?? ""
        })
      });

      const { data, errorMessage } = await readJsonSafely<
        SkillMatchAnalysisResponse | { error: string }
      >(response);

      if (!response.ok || !data || "error" in data) {
        throw new Error(
          data && "error" in data
            ? data.error
            : errorMessage || "Unable to analyze your skills right now."
        );
      }

      setAnalysis(data);
      const nextRole = data.selectedRole ?? "";
      setSelectedRole(nextRole);
      saveSkillMatchSnapshot({
        combinedSkills: data.combinedSkills,
        extractedSkills: data.extractedSkills,
        matchedRoles: data.matchedRoles,
        selectedRole: nextRole,
        summary: data.summary,
        roadmapExplanation: data.roadmapExplanation
      });

      if (nextRole) {
        saveSelectedRoleToStorage(nextRole);
      }
    } catch (error) {
      setAnalysisError(
        error instanceof Error
          ? error.message
          : "Unable to analyze your skills right now."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-6">
        <DashboardCard
          title="Skill Match Analysis"
          description="Enter skills manually or upload a resume. We will extract known skills from the resume text and rank the closest-fit job roles."
        >
          <div className="space-y-5">
            <TagInput
              label="Skill tags"
              placeholder="Add a skill like Next.js or SQL"
              tags={skills}
              onChange={setSkills}
            />

            <FileUpload
              label="Resume upload"
              helperText="Upload your resume to extract skills from the actual resume text."
              fileName={fileName}
              onSelect={handleParseResume}
              onError={(message) => {
                setResumeFile(null);
                setFileName(null);
                setParsedResume(null);
                setUploadError(message);
              }}
              error={uploadError}
              statusMessage={
                fileName
                  ? parsing
                    ? `Parsing ${fileName} and extracting known skills...`
                    : parsedResume
                      ? `${fileName} parsed successfully. ${parsedResume.extractedSkills.length} known skill signal(s) detected.`
                      : "Resume selected and ready to parse."
                  : "Upload your resume to extract skills from the actual resume text."
              }
              disabled={loading || parsing}
            />

            {analysisError ? (
              <p role="alert" className="text-sm font-medium text-rose-500">
                {analysisError}
              </p>
            ) : null}

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading || parsing || !hasInput}
              className="btn-primary w-full disabled:cursor-wait disabled:opacity-80"
            >
              {loading ? "Analyzing skill match..." : "Analyze"}
            </button>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Input Snapshot"
          description="Manual skills and parsed resume skills are combined before matching. The suggested role can be handed off to Interview AI."
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-mist p-4">
              <p className="text-sm font-semibold text-slate-900">Manual skills</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {skills.length}
              </p>
            </div>

            <div className="rounded-2xl bg-lavender/45 p-4">
              <p className="text-sm font-semibold text-slate-900">Resume status</p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {parsing
                  ? "Parsing resume"
                  : parsedResume
                    ? "Parsed successfully"
                    : resumeFile
                      ? "Ready to parse"
                      : "Optional"}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {fileName ?? "No resume selected yet"}
              </p>
            </div>

            <div className="rounded-2xl bg-mist p-4">
              <p className="text-sm font-semibold text-slate-900">Selected role</p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {selectedRole || "Suggested after analysis"}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-sm font-semibold text-slate-900">Extracted skills</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {(parsedResume?.extractedSkills ?? []).length > 0 ? (
                parsedResume?.extractedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm leading-7 text-slate-500">
                  Upload a resume to see extracted skill signals here.
                </p>
              )}
            </div>
          </div>
        </DashboardCard>
      </div>

      <div className="space-y-6">
        <DashboardCard
          title="Top Matched Roles"
          description="These roles are ranked by deterministic overlap between your current skills and our internal role-to-skill map."
        >
          {loading ? (
            <div className="space-y-4">
              <div className="surface-panel rounded-[1.5rem] bg-mist p-5">
                <div className="h-14 w-14 animate-spin rounded-full border-4 border-lilac border-t-slate-900" />
                <div>
                  <p className="text-lg font-semibold text-slate-900">
                    Matching your skills to relevant roles
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    Combining manual and extracted skills, then ranking the closest-fit job paths.
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-24 rounded-[1.5rem] bg-slate-100/90" />
                <div className="h-24 rounded-[1.5rem] bg-slate-100/90" />
                <div className="h-24 rounded-[1.5rem] bg-slate-100/90" />
              </div>
            </div>
          ) : analysis ? (
            <div className="space-y-4">
              {analysis.matchedRoles.map((match) => (
                <MatchCard
                  key={match.role}
                  role={match.role}
                  percentage={match.percentage}
                  description={match.description}
                  missingSkillsCount={match.missingSkills.length}
                  isSelected={selectedRole === match.role}
                  onSelect={() => {
                    setSelectedRole(match.role);
                    saveSelectedRoleToStorage(match.role);
                    if (analysis) {
                      saveSkillMatchSnapshot({
                        combinedSkills: analysis.combinedSkills,
                        extractedSkills: analysis.extractedSkills,
                        matchedRoles: analysis.matchedRoles,
                        selectedRole: match.role,
                        summary: analysis.summary,
                        roadmapExplanation: analysis.roadmapExplanation
                      });
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.5rem] bg-mist p-5 text-sm leading-7 text-slate-500">
              Add manual skills or upload a resume, then run analysis to see your strongest-fit roles.
            </div>
          )}
        </DashboardCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <DashboardCard
            title="Missing Skills"
            description="These are the gaps for the currently selected suggested role."
          >
            <div className="flex flex-wrap gap-3">
              {activeRole ? (
                activeRole.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-line bg-mist px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm leading-7 text-slate-500">
                  Missing skills will appear here once you analyze your profile.
                </p>
              )}
            </div>
          </DashboardCard>

          <RoadmapCard
            steps={
              activeRole?.roadmap ?? [
                "Analyze your current skills to unlock a role-specific roadmap.",
                "Select the suggested role that feels most aligned with your goals.",
                "Use the roadmap steps to close the highest-impact gaps first."
              ]
            }
          />
        </div>

        <SummaryPanel
          title="Skill Match Guidance"
          summary={
            analysis
              ? `${analysis.summary} ${analysis.roadmapExplanation}`
              : "Your summary and roadmap explanation will update after we analyze your manual skills and parsed resume text."
          }
        />
      </div>
    </div>
  );
}
