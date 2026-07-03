import type { MetadataRoute } from "next";
import { getArticleIndex } from "@/lib/articles";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:3000";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let articles: Awaited<ReturnType<typeof getArticleIndex>> = [];

  try {
    articles = await getArticleIndex();
  } catch {
    articles = [];
  }

  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${siteUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${siteUrl}/articles`,
      changeFrequency: "weekly",
      priority: 0.9
    },
    ...articles.map((article) => ({
      url: `${siteUrl}/articles/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7
    }))
  ];
}
