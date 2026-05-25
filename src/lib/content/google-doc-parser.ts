import { inferBucket, heroForBucket } from "./buckets";
import { slugify } from "./slug";
import type { ParsedArticle, ParsedRelated, ParsedSection } from "./types";

const SOURCE_DOC_ID = "1bUwgAeTR_pKjwPKgJyEEf2dym50IOtlN_J4t_04Dmuw";

const headingMap: Array<{ type: string; test: (line: string) => boolean }> = [
  { type: "opening_image", test: (line) => /^opening image$/i.test(line) },
  { type: "vignette", test: (line) => /^the polarity in real life$/i.test(line) },
  { type: "questions", test: (line) => /^(signals and questions to consider|questions to consider)$/i.test(line) }
];

export function parseGoogleDocDrafts(
  rawText: string,
  options: { sourceRevision?: string; sourceDocId?: string } = {}
): ParsedArticle[] {
  const lines = rawText
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd());

  const starts = findArticleStarts(lines);

  return starts.map((start, index) => {
    const nextStart = starts[index + 1]?.lineIndex ?? lines.length;
    const content = lines.slice(start.bodyStart, nextStart);
    return parseArticleBlock(start.title, content, index, {
      sourceDocId: options.sourceDocId ?? SOURCE_DOC_ID,
      sourceRevision: options.sourceRevision ?? "google-doc-export"
    });
  });
}

function findArticleStarts(lines: string[]) {
  const starts: Array<{ title: string; lineIndex: number; bodyStart: number }> = [];

  for (let i = 0; i < lines.length; i += 1) {
    const title = lines[i].trim();
    if (!isArticleTitle(title)) {
      continue;
    }

    const next = nextNonEmpty(lines, i + 1);
    if (next && next.line.trim() === title) {
      starts.push({ title, lineIndex: i, bodyStart: next.index + 1 });
      i = next.index;
    }
  }

  return starts;
}

function nextNonEmpty(lines: string[], start: number) {
  for (let i = start; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (line) {
      return { line, index: i };
    }
  }
  return null;
}

function isArticleTitle(line: string) {
  return /^[A-Z0-9][A-Za-z0-9 ,'"’/&-]{2,90} vs [A-Z0-9][A-Za-z0-9 ,'"’/&-]{2,90}$/.test(line);
}

function parseArticleBlock(
  title: string,
  rawLines: string[],
  articleIndex: number,
  source: { sourceDocId: string; sourceRevision: string }
): ParsedArticle {
  const sections: ParsedSection[] = [];
  let current: { type: string; heading: string | null; lines: string[] } | null = null;
  let relatedLines: string[] = [];
  let collectingRelated = false;

  const flush = () => {
    if (!current) {
      return;
    }

    const body = normalizeBody(current.lines);
    if (body) {
      sections.push({
        type: current.type,
        heading: current.heading,
        body,
        sortOrder: sections.length
      });
    }
    current = null;
  };

  for (const rawLine of rawLines) {
    const line = rawLine.trim();

    if (/^related polarities$/i.test(line)) {
      flush();
      collectingRelated = true;
      relatedLines = [];
      continue;
    }

    if (collectingRelated) {
      relatedLines.push(rawLine);
      continue;
    }

    const heading = classifyHeading(line);
    if (heading) {
      flush();
      current = { type: heading.type, heading: heading.label, lines: [] };
      continue;
    }

    if (!current) {
      if (!line) {
        continue;
      }
      current = { type: "body", heading: null, lines: [] };
    }

    current.lines.push(rawLine);
  }

  flush();

  const bucket = inferBucket(title);
  const slug = slugify(title);
  const related = parseRelated(relatedLines);
  const dek = deriveDek(sections);

  return {
    title,
    slug,
    dek,
    bucket,
    status: "draft",
    sourceDocId: source.sourceDocId,
    sourceTabId: title,
    sourceRevision: source.sourceRevision,
    heroImagePath: heroForBucket(bucket),
    published: true,
    featured: articleIndex === 0,
    sections,
    related
  };
}

function classifyHeading(line: string) {
  for (const candidate of headingMap) {
    if (candidate.test(line)) {
      return { type: candidate.type, label: canonicalHeading(candidate.type, line) };
    }
  }

  if (/,\s*wisely used$/i.test(line)) {
    return { type: "wise_use", label: line };
  }

  if (/,\s*overused$/i.test(line)) {
    return { type: "overuse", label: line };
  }

  return null;
}

function canonicalHeading(type: string, line: string) {
  if (type === "opening_image") return "Opening image";
  if (type === "vignette") return "The polarity in real life";
  if (type === "questions") return line;
  return line;
}

function normalizeBody(lines: string[]) {
  return lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parseRelated(lines: string[]): ParsedRelated[] {
  return lines
    .map((line) => line.trim().replace(/^[-*]\s+/, ""))
    .filter(Boolean)
    .map((targetTitle, index) => ({
      targetTitle,
      targetSlug: slugify(targetTitle),
      sortOrder: index
    }));
}

function deriveDek(sections: ParsedSection[]) {
  const firstBody = sections
    .map((section) => section.body)
    .find((body) => body && !body.startsWith("-"));
  const firstParagraph = firstBody?.split(/\n{2,}/)[0].replace(/^[-*]\s+/, "").trim() ?? "";

  if (firstParagraph.length <= 210) {
    return firstParagraph;
  }

  return `${firstParagraph.slice(0, 207).replace(/\s+\S*$/, "")}...`;
}
