"use client";

import { useId, useRef, type ChangeEvent } from "react";
import { UploadIcon } from "@/components/dashboard/icons";
import {
  RESUME_FILE_ACCEPT,
  getResumeFileValidationError
} from "@/lib/resume-upload/validation";

type FileUploadProps = {
  fileName: string | null;
  label: string;
  helperText: string;
  onSelect: (file: File) => void;
  onError?: (message: string) => void;
  error?: string;
  statusMessage?: string;
  disabled?: boolean;
};

export function FileUpload({
  fileName,
  label,
  helperText,
  onSelect,
  onError,
  error,
  statusMessage,
  disabled = false
}: FileUploadProps) {
  const generatedId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpenPicker = () => {
    if (!inputRef.current || disabled) {
      return;
    }

    inputRef.current.value = "";
    inputRef.current.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const validationError = getResumeFileValidationError(file);

    if (validationError) {
      onError?.(validationError);
      event.target.value = "";
      return;
    }

    onError?.("");
    onSelect(file);
  };

  return (
    <div>
      <label htmlFor={generatedId} className="field-label">
        {label}
      </label>

      <input
        id={generatedId}
        ref={inputRef}
        type="file"
        accept={RESUME_FILE_ACCEPT}
        className="sr-only"
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={handleOpenPicker}
        disabled={disabled}
        className="surface-panel flex w-full cursor-pointer flex-col items-center rounded-[1.5rem] border-dashed bg-white/92 px-5 py-5 text-center hover:border-slate-300 hover:shadow-card sm:px-6 sm:py-6 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-slate-700 sm:h-14 sm:w-14">
          <UploadIcon className="h-6 w-6" />
        </span>
        <span className="mt-3 text-base font-semibold text-slate-900">
          {fileName ?? "Upload resume"}
        </span>
        <span className="mt-1.5 max-w-sm text-sm leading-6 text-slate-500">
          {fileName
            ? "Resume selected. Replace it anytime before analyzing."
            : helperText}
        </span>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
            {fileName ? "Replace file" : "Choose file"}
          </span>
          <span className="rounded-full bg-mist px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            PDF, DOC, DOCX
          </span>
        </div>
      </button>

      <div className="mt-3 space-y-2">
        <p className="text-sm leading-6 text-slate-500">
          {statusMessage ?? helperText}
        </p>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
          {fileName ? `Selected file: ${fileName}` : "Accepted: PDF, DOC, DOCX"}
        </p>
        {error ? (
          <p role="alert" className="text-sm font-medium text-rose-500">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
