"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { canUseAdmin } from "@/lib/admin/access";
import { parseArticleUpdateForm } from "@/lib/admin/validation";
import { prisma } from "@/lib/prisma";

export async function saveArticleAction(articleId: string, formData: FormData) {
  if (!canUseAdmin()) {
    throw new Error("Admin access is disabled.");
  }

  const input = parseArticleUpdateForm(formData);

  await prisma.$transaction(async (tx) => {
    await tx.article.update({
      where: { id: articleId },
      data: {
        title: input.title,
        slug: input.slug,
        dek: input.dek || null,
        bucket: input.bucket,
        status: input.status,
        heroImagePath: input.heroImagePath || null,
        published: input.published,
        featured: input.featured
      }
    });

    await tx.relatedArticle.deleteMany({ where: { articleId } });
    await tx.articleSection.deleteMany({ where: { articleId } });

    if (input.sections.length > 0) {
      await tx.articleSection.createMany({
        data: input.sections.map((section, index) => ({
          articleId,
          type: section.type,
          heading: section.heading || null,
          body: section.body,
          sortOrder: index
        }))
      });
    }

    if (input.related.length > 0) {
      await tx.relatedArticle.createMany({
        data: input.related.map((related, index) => ({
          articleId,
          targetTitle: related.targetTitle,
          targetSlug: related.targetSlug || null,
          sortOrder: index
        }))
      });
    }
  });

  revalidatePath("/");
  revalidatePath("/articles");
  revalidatePath(`/articles/${input.slug}`);
  revalidatePath("/admin");
  revalidatePath(`/admin/articles/${articleId}`);
  redirect(`/admin/articles/${articleId}?saved=1`);
}
