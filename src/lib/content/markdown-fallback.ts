import { readFileSync } from "node:fs";
import { inferBucket, heroForBucket } from "./buckets";
import { slugify } from "./slug";
import type { ParsedArticle, ParsedSection } from "./types";

export function parseMarkdownArticle(path: string, index = 0): ParsedArticle {
  const raw = readFileSync(path, "utf8");
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const title = lines.find((line) => line.startsWith("# "))?.replace(/^#\s+/, "").trim() ?? "Untitled";
  const bucket = inferBucket(title);
  const sections: ParsedSection[] = [];
  let current: { heading: string | null; type: string; lines: string[] } = {
    heading: null,
    type: "opening_image",
    lines: []
  };

  const flush = () => {
    const body = current.lines.join("\n").trim();
    if (body) {
      sections.push({
        type: current.type,
        heading: current.heading,
        body,
        sortOrder: sections.length
      });
    }
  };

  for (const line of lines.slice(1)) {
    const heading = line.match(/^##\s+(.+)$/)?.[1];
    if (heading) {
      flush();
      current = {
        heading,
        type: /wisely used/i.test(heading)
          ? "wise_use"
          : /overused/i.test(heading)
            ? "overuse"
            : /questions/i.test(heading)
              ? "questions"
              : /related/i.test(heading)
                ? "related"
                : "body",
        lines: []
      };
      continue;
    }
    current.lines.push(line);
  }
  flush();

  const relatedSection = sections.find((section) => section.type === "related");

  return {
    title,
    slug: slugify(title),
    dek: sections[0]?.body.split(/\n{2,}/)[0].slice(0, 210) ?? "",
    bucket,
    status: "draft",
    sourceDocId: "local-markdown",
    sourceTabId: path,
    sourceRevision: "local",
    heroImagePath: heroForBucket(bucket),
    published: true,
    featured: index === 0,
    sections: sections.filter((section) => section.type !== "related"),
    related:
      relatedSection?.body
        .split("\n")
        .map((line) => line.trim().replace(/^[-*]\s+/, ""))
        .filter(Boolean)
        .map((targetTitle, sortOrder) => ({
          targetTitle,
          targetSlug: slugify(targetTitle),
          sortOrder
        })) ?? []
  };
}
