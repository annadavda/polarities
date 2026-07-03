"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { canUseAdmin } from "@/lib/admin/access";
import { parseSiteContentUpdateForm } from "@/lib/admin/validation";
import { prisma } from "@/lib/prisma";
import { SITE_CONTENT_KEYS } from "@/lib/site-content";

export async function saveSiteContentAction(formData: FormData) {
  if (!canUseAdmin()) {
    throw new Error("Admin access is disabled.");
  }

  const input = parseSiteContentUpdateForm(formData);

  await prisma.$transaction([
    prisma.siteContent.upsert({
      where: { key: SITE_CONTENT_KEYS.homeIntro },
      create: {
        key: SITE_CONTENT_KEYS.homeIntro,
        title: input.homeTitle,
        body: input.homeBody
      },
      update: {
        title: input.homeTitle,
        body: input.homeBody
      }
    }),
    prisma.siteContent.upsert({
      where: { key: SITE_CONTENT_KEYS.about },
      create: {
        key: SITE_CONTENT_KEYS.about,
        title: input.aboutTitle,
        body: input.aboutBody
      },
      update: {
        title: input.aboutTitle,
        body: input.aboutBody
      }
    })
  ]);

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/pages");
  redirect("/admin/pages?saved=1");
}
