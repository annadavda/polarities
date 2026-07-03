import { InlineRichText, RichText } from "@/lib/rich-text";
import { getSiteContent, SITE_CONTENT_KEYS } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const about = await getSiteContent(SITE_CONTENT_KEYS.about);

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 md:px-10">
      <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--rust)]">About</p>
      <h1 className="serif text-5xl leading-tight md:text-6xl">
        <InlineRichText text={about.title} />
      </h1>
      <div className="section-prose mt-8 text-lg leading-8 text-[var(--muted)]">
        <RichText text={about.body} />
      </div>
    </main>
  );
}
