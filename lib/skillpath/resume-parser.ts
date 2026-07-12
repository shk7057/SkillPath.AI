import "server-only";

import { createRequire } from "module";
import { detectResumeSections, extractSkillsFromText } from "@/lib/skillpath/engine";
import type { ResumeParseResult } from "@/lib/skillpath/types";

const require = createRequire(import.meta.url);

type PdfParseModule = (data: Buffer) => Promise<{ text: string }>;

type MammothModule = {
  extractRawText: (input: { buffer: Buffer }) => Promise<{ value: string }>;
};

type WordExtractorDocument = {
  getBody(): string;
};

type WordExtractorClass = new () => {
  extract(source: Buffer): Promise<WordExtractorDocument>;
};

function ensureDomMatrixShim() {
  if (typeof globalThis.DOMMatrix !== "undefined") {
    return;
  }

  class DOMMatrix {
    a = 1;
    b = 0;
    c = 0;
    d = 1;
    e = 0;
    f = 0;

    multiply() {
      return this;
    }

    translate() {
      return this;
    }

    scale() {
      return this;
    }

    inverse() {
      return this;
    }

    toString() {
      return "matrix(1, 0, 0, 1, 0, 0)";
    }
  }

  Object.defineProperty(globalThis, "DOMMatrix", {
    value: DOMMatrix,
    configurable: true,
    writable: true
  });
}

async function parsePdf(buffer: Buffer) {
  ensureDomMatrixShim();

  const pdfParse = require("pdf-parse") as PdfParseModule;
  const result = await pdfParse(buffer);
  return result.text;
}

async function parseDocx(buffer: Buffer) {
  const { extractRawText } = require("mammoth") as MammothModule;
  const result = await extractRawText({ buffer });
  return result.value;
}

async function parseDoc(buffer: Buffer) {
  const WordExtractor = require("word-extractor") as WordExtractorClass;
  const extractor = new WordExtractor();
  const document = await extractor.extract(buffer);
  return document.getBody();
}

function cleanText(text: string) {
  return text.replace(/\u0000/g, " ").replace(/\s+/g, " ").trim();
}

export async function parseResumeFile(file: File) {
  const extension = file.name.toLowerCase().split(".").pop();
  const buffer = Buffer.from(await file.arrayBuffer());

  let resumeText = "";

  if (extension === "pdf") {
    resumeText = await parsePdf(buffer);
  } else if (extension === "docx") {
    resumeText = await parseDocx(buffer);
  } else if (extension === "doc") {
    resumeText = await parseDoc(buffer);
  } else {
    throw new Error("Unsupported resume format. Please upload PDF, DOC, or DOCX.");
  }

  const cleanedText = cleanText(resumeText);

  if (!cleanedText) {
    throw new Error(
      "We could not extract readable text from this resume. Try another PDF, DOC, or DOCX file."
    );
  }

  const extractedSkills = extractSkillsFromText(cleanedText);
  const detectedSections = detectResumeSections(cleanedText);
  const wordCount = cleanedText.split(/\s+/).filter(Boolean).length;

  return {
    fileName: file.name,
    resumeText: cleanedText,
    extractedSkills,
    detectedSections,
    wordCount
  } satisfies ResumeParseResult;
}
