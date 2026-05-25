import type { ParsedArticle } from "./types";

export function normalizeForSeed(articles: ParsedArticle[]) {
  return articles.map((article, index) => ({
    ...article,
    featured: index === 0 || article.featured,
    sections: article.sections.map((section, sortOrder) => ({
      ...section,
      sortOrder
    })),
    related: article.related.map((related, sortOrder) => ({
      ...related,
      sortOrder
    }))
  }));
}
