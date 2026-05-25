import { notFound } from "next/navigation";
import { canUseAdmin } from "@/lib/admin/access";
import { getAdminArticleById } from "@/lib/articles";
import { saveArticleAction } from "./actions";
import { AdminArticleEditor } from "./editor";

export const dynamic = "force-dynamic";

export default async function AdminArticlePage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ saved?: string }>;
}) {
  if (!canUseAdmin()) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20 md:px-10">
        <h1 className="serif text-5xl">Admin locked</h1>
      </main>
    );
  }

  const { id } = await params;
  const article = await getAdminArticleById(id);
  const query = (await searchParams) ?? {};

  if (!article) {
    notFound();
  }

  const action = saveArticleAction.bind(null, article.id);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 md:px-10">
      <AdminArticleEditor article={article} saved={query.saved === "1"} action={action} />
    </main>
  );
}
