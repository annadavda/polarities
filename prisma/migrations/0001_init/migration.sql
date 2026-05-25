CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "dek" TEXT,
    "bucket" TEXT NOT NULL DEFAULT 'Perspective',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "sourceDocId" TEXT,
    "sourceTabId" TEXT,
    "sourceRevision" TEXT,
    "heroImagePath" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ArticleSection" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "heading" TEXT,
    "body" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    CONSTRAINT "ArticleSection_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RelatedArticle" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "targetSlug" TEXT,
    "targetTitle" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    CONSTRAINT "RelatedArticle_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "articleId" TEXT,
    "bucket" TEXT,
    "prompt" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "generationStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");
CREATE INDEX "Article_published_bucket_idx" ON "Article"("published", "bucket");
CREATE INDEX "Article_status_idx" ON "Article"("status");
CREATE INDEX "ArticleSection_articleId_sortOrder_idx" ON "ArticleSection"("articleId", "sortOrder");
CREATE INDEX "RelatedArticle_articleId_sortOrder_idx" ON "RelatedArticle"("articleId", "sortOrder");
CREATE UNIQUE INDEX "Asset_key_key" ON "Asset"("key");

ALTER TABLE "ArticleSection" ADD CONSTRAINT "ArticleSection_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RelatedArticle" ADD CONSTRAINT "RelatedArticle_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;
