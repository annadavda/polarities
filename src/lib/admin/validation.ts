import { z } from "zod";
import { BUCKETS } from "@/lib/content/buckets";
import { slugify } from "@/lib/content/slug";

export const sectionInputSchema = z.object({
  type: z.string().trim().min(1),
  heading: z.string().trim().optional().default(""),
  body: z.string().trim().min(1, "Section body is required")
});

export const relatedInputSchema = z.object({
  targetTitle: z.string().trim().min(1),
  targetSlug: z.string().trim().optional().default("")
});

export const articleUpdateSchema = z
  .object({
    title: z.string().trim().min(3),
    slug: z
      .string()
      .trim()
      .min(3)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a URL-safe slug"),
    dek: z.string().trim().optional().default(""),
    bucket: z.enum(BUCKETS),
    status: z.enum(["draft", "published", "archived"]).default("draft"),
    heroImagePath: z.string().trim().optional().default(""),
    published: z.boolean().default(false),
    featured: z.boolean().default(false),
    sections: z.array(sectionInputSchema).min(1),
    related: z.array(relatedInputSchema).default([])
  })
  .superRefine((value, ctx) => {
    if (slugify(value.title) !== value.slug && value.slug.length < 5) {
      ctx.addIssue({
        code: "custom",
        path: ["slug"],
        message: "Custom slugs should still be descriptive."
      });
    }
  });

export type ArticleUpdateInput = z.infer<typeof articleUpdateSchema>;

export function parseArticleUpdateForm(formData: FormData): ArticleUpdateInput {
  const sections = parseJsonField(formData.get("sectionsJson"), []);
  const related = parseJsonField(formData.get("relatedJson"), []);

  return articleUpdateSchema.parse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    dek: formData.get("dek"),
    bucket: formData.get("bucket"),
    status: formData.get("status") || "draft",
    heroImagePath: formData.get("heroImagePath"),
    published: formData.get("published") === "on" || formData.get("published") === "true",
    featured: formData.get("featured") === "on" || formData.get("featured") === "true",
    sections,
    related
  });
}

function parseJsonField(value: FormDataEntryValue | null, fallback: unknown) {
  if (typeof value !== "string" || !value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}
