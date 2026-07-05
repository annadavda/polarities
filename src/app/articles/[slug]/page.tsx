import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/article-body";
import { BucketBadge } from "@/components/bucket-badge";
import { getArticleBySlug } from "@/lib/articles";
import { InlineRichText } from "@/lib/rich-text";

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <main>
      <section className="relative overflow-hidden border-b hairline bg-[var(--ink)] text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(17,22,23,0.9), rgba(17,22,23,0.58) 54%, rgba(250,247,241,0.2)), url('${article.heroImagePath ?? "/generated/bucket-perspective.png"}')`
          }}
        />
        <div className="relative mx-auto max-w-5xl px-6 py-20 md:px-10 md:py-28">
          <Link href="/articles" className="mb-12 inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-white/78">
            <ArrowLeft size={15} /> Articles
          </Link>
          <BucketBadge bucket={article.bucket} />
          <h1 className="serif mt-8 max-w-4xl text-5xl leading-tight md:text-7xl">{article.title}</h1>
          {article.dek ? (
            <p className="mt-8 max-w-2xl text-xl leading-8 text-white/78">
              <InlineRichText text={article.dek} />
            </p>
          ) : null}
        </div>
      </section>

      <ArticleBody slug={article.slug} sections={article.sections} />

      {article.related.length > 0 ? (
        <section className="border-t hairline bg-[var(--paper)]">
          <div className="mx-auto max-w-4xl px-6 py-14 md:px-10">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--rust)]">Related polarities</p>
            <div className="grid gap-3">
              {article.related.map((related) => (
                <Link
                  key={related.id}
                  href={related.targetSlug ? `/articles/${related.targetSlug}` : "/articles"}
                  className="group flex items-center justify-between border-t hairline py-4 text-lg"
                >
                  <span>{related.targetTitle}</span>
                  <ArrowRight className="text-[var(--rust)] transition-transform group-hover:translate-x-1" size={18} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
