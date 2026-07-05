import type { PublicArticleSection } from "@/lib/articles";
import { RichText } from "@/lib/rich-text";

const openingImagesBySlug: Record<string, string> = {
  "compassion-vs-accountability": "/generated/compassion-vs-accountability-opening.png",
  "doing-vs-being": "/generated/doing-vs-being-opening.png",
  "enoughness-vs-improvement": "/generated/enoughness-vs-improvement-opening.png",
  "expertise-vs-beginners-mind": "/generated/expertise-vs-beginners-mind-opening.png",
  "individual-needs-vs-collective-needs": "/generated/individual-needs-vs-collective-needs-opening.png",
  "making-it-happen-vs-letting-it-unfold": "/generated/making-it-happen-vs-letting-it-unfold-opening.png",
  "persistence-vs-release": "/generated/persistence-vs-release-opening.png",
  "present-moment-vs-future-direction": "/generated/present-moment-vs-future-direction-opening.png",
  "prioritizing-vs-staying-open": "/generated/prioritizing-vs-staying-open-opening.png",
  "seeing-what-is-vs-seeing-what-could-be": "/generated/seeing-what-is-vs-seeing-what-could-be-opening.png",
  "speaking-up-vs-staying-quiet": "/generated/speaking-up-vs-staying-quiet-opening.png",
  "strength-vs-vulnerability": "/generated/strength-vs-vulnerability-opening.png"
};

export function ArticleBody({ slug, sections }: { slug: string; sections: PublicArticleSection[] }) {
  return (
    <article className="mx-auto max-w-4xl px-6 py-16 md:px-10">
      {sections.map((section) => {
        const imagePath = section.type === "opening_image" ? openingImagesBySlug[slug] : null;
        const headingText = section.heading && section.heading.toLowerCase() !== "opening image" ? section.heading : null;

        return (
          <section key={section.id} className="border-b hairline py-10 first:pt-0 last:border-b-0">
            {headingText && !imagePath ? (
              <h2 className="serif mb-6 text-3xl leading-tight text-[var(--foreground)]">{section.heading}</h2>
            ) : null}
            {imagePath ? (
              <>
                <figure className="mb-8">
                  <img
                    src={imagePath}
                    alt={headingText || "Essay opening image"}
                    className="aspect-[16/9] w-full object-cover"
                  />
                  {headingText ? (
                    <figcaption className="mt-3 text-sm leading-6 text-[var(--muted)]">{section.heading}</figcaption>
                  ) : null}
                </figure>
                <div className="section-prose text-lg leading-8 text-[var(--foreground)]">
                  <RichText text={section.body} />
                </div>
              </>
            ) : (
              <div className="section-prose text-lg leading-8 text-[var(--foreground)]">
                <RichText text={section.body} />
              </div>
            )}
          </section>
        );
      })}
    </article>
  );
}
