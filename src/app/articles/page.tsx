import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { BucketFilter } from "@/components/bucket-filter";
import { getArticleIndex } from "@/lib/articles";
import { BUCKETS } from "@/lib/content/buckets";

export const dynamic = "force-dynamic";

export default async function ArticlesPage({
  searchParams
}: {
  searchParams?: Promise<{ bucket?: string; status?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const articles = await getArticleIndex({
    bucket: params.bucket,
    status: params.status
  });

  return (
    <main className="mx-auto max-w-7xl px-6 py-16 md:px-10">
      <header className="mb-12 grid gap-8 border-b hairline pb-10 md:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--rust)]">Essays</p>
          <h1 className="serif text-5xl leading-tight md:text-6xl">A working library of polarities</h1>
        </div>
        <p className="max-w-2xl self-end text-lg leading-8 text-[var(--muted)]">
          Each essay treats both sides as necessary. The work is not to pick the better pole, but to notice what wise use and overuse look like in real rooms, relationships, and decisions.
        </p>
      </header>

      <div className="mb-10 flex flex-wrap items-center gap-3">
        <BucketFilter activeBucket={params.bucket} buckets={BUCKETS} />
        {params.bucket ? (
          <Link href="/articles" className="ml-auto text-sm font-semibold uppercase tracking-[0.2em] text-[var(--rust-dark)]">
            Clear
          </Link>
        ) : null}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </main>
  );
}
