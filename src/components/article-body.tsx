import type { PublicArticleSection } from "@/lib/articles";

export function ArticleBody({ sections }: { sections: PublicArticleSection[] }) {
  return (
    <article className="mx-auto max-w-4xl px-6 py-16 md:px-10">
      {sections.map((section) => (
        <section key={section.id} className="border-b hairline py-10 first:pt-0 last:border-b-0">
          {section.heading ? (
            <h2 className="serif mb-6 text-3xl leading-tight text-[var(--foreground)]">{section.heading}</h2>
          ) : null}
          <div className="section-prose text-lg leading-8 text-[var(--foreground)]">
            {renderBody(section.body)}
          </div>
        </section>
      ))}
    </article>
  );
}

function renderBody(body: string) {
  const blocks = body.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);

  return blocks.map((block, index) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    const isList = lines.every((line) => /^[-*]\s+/.test(line));

    if (isList) {
      return (
        <ul key={index}>
          {lines.map((line) => (
            <li key={line}>{line.replace(/^[-*]\s+/, "")}</li>
          ))}
        </ul>
      );
    }

    return <p key={index}>{block}</p>;
  });
}
