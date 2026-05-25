import { describe, expect, it } from "vitest";
import { normalizeForSeed } from "./seed-transform";
import type { ParsedArticle } from "./types";

describe("normalizeForSeed", () => {
  it("normalizes featured flags and section ordering", () => {
    const article: ParsedArticle = {
      title: "Doing vs Being",
      slug: "doing-vs-being",
      dek: "A summary",
      bucket: "Action",
      status: "draft",
      sourceDocId: "doc",
      sourceTabId: "tab",
      sourceRevision: "rev",
      heroImagePath: "/generated/bucket-action.png",
      published: true,
      featured: false,
      sections: [
        { type: "body", heading: null, body: "Second", sortOrder: 9 },
        { type: "questions", heading: "Questions", body: "- One", sortOrder: 99 }
      ],
      related: [{ targetTitle: "Enoughness vs Improvement", targetSlug: "enoughness-vs-improvement", sortOrder: 8 }]
    };

    const [normalized] = normalizeForSeed([article]);

    expect(normalized.featured).toBe(true);
    expect(normalized.sections.map((section) => section.sortOrder)).toEqual([0, 1]);
    expect(normalized.related[0].sortOrder).toBe(0);
  });
});
