import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ArticleBody } from "@/components/article-body";

describe("ArticleBody", () => {
  it("renders prose sections and list questions", () => {
    render(
      <ArticleBody
        sections={[
          { id: "1", articleId: "a1", type: "wise_use", heading: "Making it happen, wisely used", body: "A paragraph.", sortOrder: 0 },
          { id: "2", articleId: "a1", type: "questions", heading: "Questions", body: "- What is yours to move?\n- What needs time?", sortOrder: 1 }
        ]}
      />
    );

    expect(screen.getByRole("heading", { name: "Making it happen, wisely used" })).toBeInTheDocument();
    expect(screen.getByText("What is yours to move?")).toBeInTheDocument();
  });
});
