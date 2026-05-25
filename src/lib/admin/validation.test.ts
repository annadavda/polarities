import { describe, expect, it } from "vitest";
import { parseArticleUpdateForm } from "./validation";

describe("parseArticleUpdateForm", () => {
  it("validates article fields, booleans, sections, and related records", () => {
    const form = new FormData();
    form.set("title", "Making It Happen vs Letting It Unfold");
    form.set("slug", "making-it-happen-vs-letting-it-unfold");
    form.set("dek", "A useful summary");
    form.set("bucket", "Action");
    form.set("status", "draft");
    form.set("heroImagePath", "/generated/bucket-action.png");
    form.set("published", "on");
    form.set("sectionsJson", JSON.stringify([{ type: "wise_use", heading: "Wise use", body: "Agency in motion." }]));
    form.set("relatedJson", JSON.stringify([{ targetTitle: "Doing vs Being", targetSlug: "doing-vs-being" }]));

    const parsed = parseArticleUpdateForm(form);

    expect(parsed.published).toBe(true);
    expect(parsed.featured).toBe(false);
    expect(parsed.sections[0].body).toBe("Agency in motion.");
    expect(parsed.related[0].targetTitle).toBe("Doing vs Being");
  });

  it("rejects unsafe slugs", () => {
    const form = new FormData();
    form.set("title", "Bad Slug");
    form.set("slug", "Bad Slug!");
    form.set("bucket", "Action");
    form.set("sectionsJson", JSON.stringify([{ type: "body", body: "Body" }]));

    expect(() => parseArticleUpdateForm(form)).toThrow();
  });
});
