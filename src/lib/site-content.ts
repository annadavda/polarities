import { prisma } from "./prisma";

export const SITE_CONTENT_KEYS = {
  homeIntro: "home_intro",
  about: "about"
} as const;

export const DEFAULT_SITE_CONTENT = {
  [SITE_CONTENT_KEYS.homeIntro]: {
    title: "The tension holds the truth.",
    body: "Essays for working with the useful tension between opposites, where discernment becomes more practical than choosing sides."
  },
  [SITE_CONTENT_KEYS.about]: {
    title: "A practical way to work with both sides.",
    body: [
      "The polarity project treats many leadership and life dilemmas as tensions to discern rather than problems to solve once and for all.",
      "This first website skeleton is intentionally simple: a public essay library, structured article pages, and a local editor so content can keep evolving."
    ].join("\n\n")
  }
} as const;

export type SiteContentKey = keyof typeof DEFAULT_SITE_CONTENT;

export async function getSiteContent(key: SiteContentKey) {
  const saved = await prisma.siteContent.findUnique({
    where: { key }
  });

  return saved ?? { key, ...DEFAULT_SITE_CONTENT[key] };
}

export async function getEditableSiteContent() {
  const [homeIntro, about] = await Promise.all([
    getSiteContent(SITE_CONTENT_KEYS.homeIntro),
    getSiteContent(SITE_CONTENT_KEYS.about)
  ]);

  return { homeIntro, about };
}

export function splitParagraphs(body: string) {
  return body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
