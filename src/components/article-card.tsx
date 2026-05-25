import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ArticleSummary } from "@/lib/articles";
import { BucketBadge } from "./bucket-badge";

export function ArticleCard({ article }: { article: ArticleSummary }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group grid min-h-[360px] grid-rows-[150px_1fr] overflow-hidden border hairline bg-[var(--paper)] transition hover:-translate-y-1 hover:bg-white"
    >
      <div
        className="bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(17,22,23,0.08), rgba(17,22,23,0.38)), url('${article.heroImagePath ?? "/generated/bucket-perspective.png"}')`
        }}
      />
      <div className="flex flex-col p-5">
        <BucketBadge bucket={article.bucket} />
        <h3 className="serif mt-5 text-3xl leading-tight">{article.title}</h3>
        {article.dek ? <p className="mt-4 line-clamp-3 leading-7 text-[var(--muted)]">{article.dek}</p> : null}
        <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--rust-dark)]">
          Read <ArrowRight className="transition-transform group-hover:translate-x-1" size={15} />
        </span>
      </div>
    </Link>
  );
}
