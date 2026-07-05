import { describe, expect, it } from "vitest";
import { parseGoogleDocDrafts } from "./google-doc-parser";

const draftText = `
Speaking Up vs Staying Quiet
Speaking Up vs Staying Quiet

Opening image

A microphone rings before the song begins.

The polarity in real life

A leader tells the team too much context and notices their steadiness drop.

Speaking up, wisely used

Speaking up protects truth.

Speaking up, overused

Speaking can become discharge.

Staying quiet, wisely used

Quiet can be containment.

Staying quiet, overused

Quiet can become avoidance.

Signals and questions to consider

- What truth is useful here?
- What needs containment?

Related polarities

- Strength vs Vulnerability
- Compassion vs Accountability
`;

describe("parseGoogleDocDrafts", () => {
  it("extracts article metadata and structured sections", () => {
    const [article] = parseGoogleDocDrafts(draftText, { sourceRevision: "test" });

    expect(article.title).toBe("Speaking Up vs Staying Quiet");
    expect(article.slug).toBe("speaking-up-vs-staying-quiet");
    expect(article.bucket).toBe("Relationships");
    expect(article.sourceRevision).toBe("test");
    expect(article.sections.map((section) => section.type)).toEqual([
      "opening_image",
      "vignette",
      "wise_use",
      "overuse",
      "wise_use",
      "overuse",
      "questions"
    ]);
    expect(article.related).toHaveLength(2);
    expect(article.related[0].targetSlug).toBe("strength-vs-vulnerability");
  });
});
