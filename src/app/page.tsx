import { ArrowRight, Circle } from "lucide-react";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { getHomeArticles } from "@/lib/articles";
import { InlineRichText, RichText } from "@/lib/rich-text";
import { getSiteContent, SITE_CONTENT_KEYS } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ featured, articles }, homeIntro] = await Promise.all([
    getHomeArticles(),
    getSiteContent(SITE_CONTENT_KEYS.homeIntro)
  ]);
  const hero = featured ?? articles[0];

  return (
    <main>
      <section className="relative min-h-[700px] overflow-hidden border-b hairline bg-[var(--ink)] text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(250,247,241,0.97) 0%, rgba(250,247,241,0.78) 31%, rgba(17,22,23,0.44) 56%, rgba(17,22,23,0.92) 100%), url('/generated/home-hero.png')"
          }}
        />
        <div className="relative mx-auto flex min-h-[700px] max-w-7xl flex-col justify-center px-6 py-24 md:px-10">
          <div className="max-w-2xl text-[var(--foreground)]">
            <div className="mb-10 h-px w-10 bg-[var(--rust)]" />
            <h1 className="serif text-6xl leading-none md:text-7xl lg:text-8xl">
              <InlineRichText text={homeIntro.title} />
            </h1>
            <div className="section-prose mt-8 max-w-xl text-lg leading-8 text-[var(--muted)]">
              <RichText text={homeIntro.body} />
            </div>
            <Link
              href="/articles"
              className="mt-10 inline-flex items-center gap-3 border-b border-[var(--rust)] pb-2 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--foreground)]"
            >
              Explore essays <ArrowRight size={16} />
            </Link>
          </div>
          <div className="absolute bottom-20 right-8 hidden max-w-sm text-white md:block lg:right-20">
            <Circle className="mb-8 text-[var(--rust)]" size={18} />
            <p className="serif text-2xl italic leading-9">
              We do not need to choose sides. We need to learn what each side is for.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b hairline bg-[var(--paper)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[0.95fr_1.25fr] md:px-10">
          <div>
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--rust)]">Featured</p>
            <h2 className="serif text-4xl leading-tight md:text-5xl">
              {hero?.title ?? "Polarity articles are ready for seed content"}
            </h2>
          </div>
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <p className="max-w-xl text-lg leading-8 text-[var(--muted)]">
              {hero?.dek ? (
                <InlineRichText text={hero.dek} />
              ) : (
                "Run the database migration and seed to load the draft article set from the Google Docs export."
              )}
            </p>
            {hero ? (
              <Link
                href={`/articles/${hero.slug}`}
                className="inline-flex items-center gap-3 border-l hairline px-10 py-6 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--foreground)]"
              >
                Read more <ArrowRight size={16} />
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="editorial-grid">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--rust)]">Draft library</p>
              <h2 className="serif text-4xl">Current essays</h2>
            </div>
            <Link href="/articles" className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--rust-dark)]">
              View all
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {articles.slice(0, 6).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
