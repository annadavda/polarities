export type ParsedSection = {
  type: string;
  heading: string | null;
  body: string;
  sortOrder: number;
};

export type ParsedRelated = {
  targetTitle: string;
  targetSlug: string | null;
  sortOrder: number;
};

export type ParsedArticle = {
  title: string;
  slug: string;
  dek: string;
  bucket: string;
  status: "draft" | "published";
  sourceDocId: string;
  sourceTabId: string;
  sourceRevision: string;
  heroImagePath: string;
  published: boolean;
  featured: boolean;
  sections: ParsedSection[];
  related: ParsedRelated[];
};
