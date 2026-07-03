import { existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ASSET_RECORDS } from "../src/lib/content/buckets";
import { parseGoogleDocDrafts } from "../src/lib/content/google-doc-parser";
import { parseMarkdownArticle } from "../src/lib/content/markdown-fallback";
import { normalizeForSeed } from "../src/lib/content/seed-transform";
import type { ParsedArticle } from "../src/lib/content/types";
import { prisma } from "../src/lib/prisma";
import { DEFAULT_SITE_CONTENT } from "../src/lib/site-content";

async function main() {
  for (const [key, content] of Object.entries(DEFAULT_SITE_CONTENT)) {
    await prisma.siteContent.upsert({
      where: { key },
      create: {
        key,
        title: content.title,
        body: content.body
      },
      update: {}
    });
  }

  for (const asset of ASSET_RECORDS) {
    await prisma.asset.upsert({
      where: { key: asset.key },
      create: {
        key: asset.key,
        bucket: asset.bucket,
        prompt: asset.prompt,
        filePath: asset.filePath,
        altText: asset.altText,
        generationStatus: "generated"
      },
      update: {
        bucket: asset.bucket,
        prompt: asset.prompt,
        filePath: asset.filePath,
        altText: asset.altText,
        generationStatus: "generated"
      }
    });
  }

  if (process.env.SKIP_SEED_IF_ARTICLES_EXIST === "true") {
    const existingArticleCount = await prisma.article.count();
    if (existingArticleCount > 0) {
      console.log(`Skipping article seed because ${existingArticleCount} articles already exist.`);
      return;
    }
  }

  const articles = normalizeForSeed(await loadArticles());

  for (const article of articles) {
    const saved = await prisma.article.upsert({
      where: { slug: article.slug },
      create: {
        title: article.title,
        slug: article.slug,
        dek: article.dek,
        bucket: article.bucket,
        status: article.status,
        sourceDocId: article.sourceDocId,
        sourceTabId: article.sourceTabId,
        sourceRevision: article.sourceRevision,
        heroImagePath: article.heroImagePath,
        published: article.published,
        featured: article.featured
      },
      update: {
        title: article.title,
        dek: article.dek,
        bucket: article.bucket,
        status: article.status,
        sourceDocId: article.sourceDocId,
        sourceTabId: article.sourceTabId,
        sourceRevision: article.sourceRevision,
        heroImagePath: article.heroImagePath,
        published: article.published,
        featured: article.featured
      }
    });

    await prisma.articleSection.deleteMany({ where: { articleId: saved.id } });
    await prisma.relatedArticle.deleteMany({ where: { articleId: saved.id } });

    await prisma.articleSection.createMany({
      data: article.sections.map((section) => ({
        articleId: saved.id,
        type: section.type,
        heading: section.heading,
        body: section.body,
        sortOrder: section.sortOrder
      }))
    });

    if (article.related.length > 0) {
      await prisma.relatedArticle.createMany({
        data: article.related.map((related) => ({
          articleId: saved.id,
          targetTitle: related.targetTitle,
          targetSlug: related.targetSlug,
          sortOrder: related.sortOrder
        }))
      });
    }
  }

  console.log(`Seeded ${articles.length} polarity articles and ${ASSET_RECORDS.length} asset records.`);
}

async function loadArticles(): Promise<ParsedArticle[]> {
  const sourcePath = path.resolve(process.env.GOOGLE_DOC_DRAFTS_PATH ?? "content/source/polarity-articles-drafts.txt");

  if (existsSync(sourcePath)) {
    const raw = await readFile(sourcePath, "utf8");
    const sourceRevision = statSync(sourcePath).mtime.toISOString();
    const parsed = parseGoogleDocDrafts(raw, { sourceRevision });
    if (parsed.length > 0) {
      return parsed;
    }
  }

  const fallbackPaths = ["outputs/articles/making_it_happen.md", "outputs/articles/staying_safe.md"].map((item) =>
    path.resolve(item)
  );

  return fallbackPaths.filter(existsSync).map((file, index) => parseMarkdownArticle(file, index));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
