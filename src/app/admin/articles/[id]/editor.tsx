"use client";

import { ArrowLeft, Eye, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BucketBadge } from "@/components/bucket-badge";
import { Button } from "@/components/ui/button";
import { BUCKETS, heroForBucket } from "@/lib/content/buckets";
import type { AdminArticle } from "@/lib/articles";

type EditorSection = {
  type: string;
  heading: string;
  body: string;
};

type EditorRelated = {
  targetTitle: string;
  targetSlug: string;
};

export function AdminArticleEditor({
  article,
  saved,
  action
}: {
  article: AdminArticle;
  saved: boolean;
  action: (formData: FormData) => void | Promise<void>;
}) {
  const [sections, setSections] = useState<EditorSection[]>(
    article.sections.map((section) => ({
      type: section.type,
      heading: section.heading ?? "",
      body: section.body
    }))
  );
  const [relatedText, setRelatedText] = useState(
    article.related.map((related) => related.targetTitle).join("\n")
  );
  const [bucket, setBucket] = useState(article.bucket);
  const [heroImagePath, setHeroImagePath] = useState(article.heroImagePath ?? heroForBucket(article.bucket));

  const relatedJson = useMemo<EditorRelated[]>(() => {
    return relatedText
      .split("\n")
      .map((line) => line.replace(/^[-*]\s*/, "").trim())
      .filter(Boolean)
      .map((title) => ({ targetTitle: title, targetSlug: "" }));
  }, [relatedText]);

  const setSection = (index: number, patch: Partial<EditorSection>) => {
    setSections((current) => current.map((section, i) => (i === index ? { ...section, ...patch } : section)));
  };

  const removeSection = (index: number) => {
    setSections((current) => current.filter((_, i) => i !== index));
  };

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[0.86fr_1.45fr]">
      <input type="hidden" name="sectionsJson" value={JSON.stringify(sections)} />
      <input type="hidden" name="relatedJson" value={JSON.stringify(relatedJson)} />

      <aside className="self-start border hairline bg-[var(--paper)] p-5">
        <Link href="/admin" className="mb-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-[var(--muted)]">
          <ArrowLeft size={15} /> Admin
        </Link>
        {saved ? (
          <div className="mb-5 border border-[rgba(111,125,114,0.35)] bg-white/60 px-4 py-3 text-sm text-[var(--muted-strong)]">
            Saved.
          </div>
        ) : null}
        <div className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Title</span>
            <input name="title" defaultValue={article.title} required className="w-full border hairline bg-white px-3 py-2 outline-none" />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Slug</span>
            <input name="slug" defaultValue={article.slug} required className="w-full border hairline bg-white px-3 py-2 outline-none" />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Summary</span>
            <textarea name="dek" defaultValue={article.dek ?? ""} rows={5} className="w-full border hairline bg-white px-3 py-2 outline-none" />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Bucket</span>
            <select
              name="bucket"
              value={bucket}
              onChange={(event) => {
                setBucket(event.target.value);
                setHeroImagePath(heroForBucket(event.target.value));
              }}
              className="w-full border hairline bg-white px-3 py-2 outline-none"
            >
              {BUCKETS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Hero image path</span>
            <input
              name="heroImagePath"
              value={heroImagePath}
              onChange={(event) => setHeroImagePath(event.target.value)}
              className="w-full border hairline bg-white px-3 py-2 outline-none"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" defaultChecked={article.published} />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="featured" defaultChecked={article.featured} />
              Featured
            </label>
          </div>
          <input type="hidden" name="status" value={article.status} />
          <div className="flex flex-wrap gap-3">
            <Button type="submit">
              <Save size={16} /> Save
            </Button>
            <Button asChild variant="secondary">
              <Link href={`/articles/${article.slug}`}>
                <Eye size={16} /> View
              </Link>
            </Button>
          </div>
        </div>
        <div className="mt-8 border-t hairline pt-5 text-sm leading-6 text-[var(--muted)]">
          <BucketBadge bucket={bucket} />
          <p className="mt-4">Source tab: {article.sourceTabId ?? "manual"}</p>
          <p>Revision: {article.sourceRevision ?? "unknown"}</p>
        </div>
      </aside>

      <section className="space-y-6">
        {sections.map((section, index) => (
          <div key={`${section.type}-${index}`} className="border hairline bg-[var(--paper)] p-5">
            <div className="mb-4 grid gap-3 md:grid-cols-[0.35fr_1fr_auto]">
              <select
                value={section.type}
                onChange={(event) => setSection(index, { type: event.target.value })}
                className="border hairline bg-white px-3 py-2 outline-none"
              >
                <option value="opening_image">Opening image</option>
                <option value="vignette">Vignette</option>
                <option value="wise_use">Wise use</option>
                <option value="overuse">Overuse</option>
                <option value="questions">Questions</option>
                <option value="body">Body</option>
              </select>
              <input
                value={section.heading}
                onChange={(event) => setSection(index, { heading: event.target.value })}
                placeholder="Heading"
                className="border hairline bg-white px-3 py-2 outline-none placeholder:text-[var(--muted)]"
              />
              <Button type="button" variant="ghost" onClick={() => removeSection(index)} aria-label="Remove section">
                <Trash2 size={16} />
              </Button>
            </div>
            <textarea
              value={section.body}
              onChange={(event) => setSection(index, { body: event.target.value })}
              rows={section.type === "questions" ? 8 : 14}
              className="min-h-44 w-full border hairline bg-white px-3 py-3 leading-7 outline-none"
            />
          </div>
        ))}

        <Button
          type="button"
          variant="secondary"
          onClick={() => setSections((current) => [...current, { type: "body", heading: "New section", body: "" }])}
        >
          <Plus size={16} /> Add section
        </Button>

        <div className="border hairline bg-[var(--paper)] p-5">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Related polarities</span>
            <textarea
              value={relatedText}
              onChange={(event) => setRelatedText(event.target.value)}
              rows={7}
              className="w-full border hairline bg-white px-3 py-3 leading-7 outline-none"
            />
          </label>
        </div>
      </section>
    </form>
  );
}
