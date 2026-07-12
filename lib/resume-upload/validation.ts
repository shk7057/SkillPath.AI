export const RESUME_FILE_ACCEPT = ".pdf,.doc,.docx";

const ACCEPTED_RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"] as const;

export function getResumeFileValidationError(file: {
  name: string;
  type?: string;
}) {
  const normalizedName = file.name.trim().toLowerCase();
  const hasAcceptedExtension = ACCEPTED_RESUME_EXTENSIONS.some((extension) =>
    normalizedName.endsWith(extension)
  );

  if (!hasAcceptedExtension) {
    return "Please select a PDF, DOC, or DOCX resume file.";
  }

  return "";
}
