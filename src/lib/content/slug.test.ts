import { describe, expect, it } from "vitest";
import { slugify } from "./slug";

describe("slugify", () => {
  it("creates stable URL-safe slugs", () => {
    expect(slugify("Making It Happen vs Letting It Unfold")).toBe("making-it-happen-vs-letting-it-unfold");
    expect(slugify("Expertise vs Beginner's Mind")).toBe("expertise-vs-beginners-mind");
  });

  it("collapses punctuation and whitespace", () => {
    expect(slugify("  Strength / Vulnerability & Care  ")).toBe("strength-vulnerability-and-care");
  });
});
