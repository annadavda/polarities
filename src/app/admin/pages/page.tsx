import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { RichTextArea } from "@/components/admin/rich-text-area";
import { Button } from "@/components/ui/button";
import { canUseAdmin } from "@/lib/admin/access";
import { getEditableSiteContent } from "@/lib/site-content";
import { saveSiteContentAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPagesPage({
  searchParams
}: {
  searchParams?: Promise<{ saved?: string }>;
}) {
  if (!canUseAdmin()) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20 md:px-10">
        <h1 className="serif text-5xl">Admin locked</h1>
      </main>
    );
  }

  const content = await getEditableSiteContent();
  const query = (await searchParams) ?? {};

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 md:px-10">
      <form action={saveSiteContentAction} className="space-y-8">
        <header className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <Link href="/admin" className="mb-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-[var(--muted)]">
              <ArrowLeft size={15} /> Admin
            </Link>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--rust)]">Page text</p>
            <h1 className="serif text-5xl">Homepage and About</h1>
          </div>
          <Button type="submit">
            <Save size={16} /> Save
          </Button>
        </header>

        {query.saved === "1" ? (
          <div className="border border-[rgba(111,125,114,0.35)] bg-white/60 px-4 py-3 text-sm text-[var(--muted-strong)]">
            Saved.
          </div>
        ) : null}

        <section className="border hairline bg-[var(--paper)] p-5">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Homepage intro</p>
          <label className="mb-5 block">
            <span className="mb-2 block text-sm font-semibold">Main heading</span>
            <input
              name="homeTitle"
              defaultValue={content.homeIntro.title}
              required
              className="w-full border hairline bg-white px-3 py-2 outline-none"
            />
          </label>
          <RichTextArea label="Short intro text" name="homeBody" defaultValue={content.homeIntro.body} required rows={5} />
        </section>

        <section className="border hairline bg-[var(--paper)] p-5">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">About page</p>
          <label className="mb-5 block">
            <span className="mb-2 block text-sm font-semibold">Page heading</span>
            <input
              name="aboutTitle"
              defaultValue={content.about.title}
              required
              className="w-full border hairline bg-white px-3 py-2 outline-none"
            />
          </label>
          <RichTextArea label="Essay text" name="aboutBody" defaultValue={content.about.body} required rows={18} />
        </section>
      </form>
    </main>
  );
}
