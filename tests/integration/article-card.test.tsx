import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ArticleCard } from "@/components/article-card";

describe("ArticleCard", () => {
  it("links to article detail pages", () => {
    render(
      <ArticleCard
        article={{
          id: "a1",
          title: "Doing vs Being",
          slug: "doing-vs-being",
          dek: "A short summary.",
          bucket: "Action",
          status: "draft",
          sourceDocId: null,
          sourceTabId: null,
          sourceRevision: null,
          heroImagePath: "/generated/bucket-action.png",
          published: true,
          featured: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }}
      />
    );

    expect(screen.getByRole("link", { name: /Doing vs Being/i })).toHaveAttribute("href", "/articles/doing-vs-being");
  });
});
