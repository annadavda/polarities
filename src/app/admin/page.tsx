import { Search } from "lucide-react";
import Link from "next/link";
import { canUseAdmin } from "@/lib/admin/access";
import { getAdminArticles } from "@/lib/articles";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  if (!canUseAdmin()) {
    return <AdminLocked />;
  }

  const params = (await searchParams) ?? {};
  const articles = await getAdminArticles(params.q);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 md:px-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--rust)]">Admin</p>
          <h1 className="serif text-5xl">Article editor</h1>
        </div>
        <form className="flex min-w-[280px] items-center gap-2 border-b hairline pb-2">
          <Search size={18} className="text-[var(--muted)]" />
          <input
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Search articles"
            className="w-full bg-transparent outline-none placeholder:text-[var(--muted)]"
          />
        </form>
      </header>

      <div className="overflow-hidden border hairline bg-[var(--paper)]">
        <div className="grid grid-cols-[1.2fr_0.75fr_0.6fr_0.6fr] gap-4 border-b hairline px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          <span>Title</span>
          <span>Bucket</span>
          <span>Status</span>
          <span>Source</span>
        </div>
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/admin/articles/${article.id}`}
            className="grid grid-cols-[1.2fr_0.75fr_0.6fr_0.6fr] gap-4 border-b hairline px-5 py-4 transition hover:bg-white/60"
          >
            <span>
              <span className="block font-semibold">{article.title}</span>
              <span className="mt-1 block text-sm text-[var(--muted)]">/{article.slug}</span>
            </span>
            <span>{article.bucket}</span>
            <span>{article.published ? "Published" : article.status}</span>
            <span className="text-sm text-[var(--muted)]">{article.sourceTabId ?? "manual"}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}

function AdminLocked() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 md:px-10">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--rust)]">Admin locked</p>
      <h1 className="serif text-5xl">Local admin editing is disabled.</h1>
      <p className="mt-6 text-lg leading-8 text-[var(--muted)]">
        Set <code>ALLOW_UNAUTHENTICATED_ADMIN=true</code> for local development, or add Google auth in the next pass.
      </p>
    </main>
  );
}
