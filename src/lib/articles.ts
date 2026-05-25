import { prisma } from "./prisma";

export type ArticleSummary = Awaited<ReturnType<typeof getArticleIndex>>[number];
export type PublicArticle = NonNullable<Awaited<ReturnType<typeof getArticleBySlug>>>;
export type PublicArticleSection = PublicArticle["sections"][number];
export type AdminArticle = NonNullable<Awaited<ReturnType<typeof getAdminArticleById>>>;

const publicInclude = {
  sections: {
    orderBy: { sortOrder: "asc" as const }
  },
  related: {
    orderBy: { sortOrder: "asc" as const }
  }
};

export async function getHomeArticles() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { title: "asc" }],
    take: 12
  });

  return {
    featured: articles.find((article) => article.featured) ?? articles[0] ?? null,
    articles
  };
}

export async function getArticleIndex(filters: { bucket?: string; status?: string } = {}) {
  return prisma.article.findMany({
    where: {
      published: filters.status === "draft" ? undefined : true,
      bucket: filters.bucket || undefined,
      status: filters.status || undefined
    },
    orderBy: [{ bucket: "asc" }, { title: "asc" }]
  });
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findFirst({
    where: { slug, published: true },
    include: publicInclude
  });
}

export async function getAdminArticles(query?: string) {
  return prisma.article.findMany({
    where: query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
            { bucket: { contains: query, mode: "insensitive" } }
          ]
        }
      : undefined,
    orderBy: [{ updatedAt: "desc" }, { title: "asc" }]
  });
}

export async function getAdminArticleById(id: string) {
  return prisma.article.findUnique({
    where: { id },
    include: publicInclude
  });
}
