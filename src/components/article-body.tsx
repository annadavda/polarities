import type { PublicArticleSection } from "@/lib/articles";
import { RichText } from "@/lib/rich-text";

export function ArticleBody({ sections }: { sections: PublicArticleSection[] }) {
  return (
    <article className="mx-auto max-w-4xl px-6 py-16 md:px-10">
      {sections.map((section) => (
        <section key={section.id} className="border-b hairline py-10 first:pt-0 last:border-b-0">
          {section.heading ? (
            <h2 className="serif mb-6 text-3xl leading-tight text-[var(--foreground)]">{section.heading}</h2>
          ) : null}
          <div className="section-prose text-lg leading-8 text-[var(--foreground)]">
            <RichText text={section.body} />
          </div>
        </section>
      ))}
    </article>
  );
}
