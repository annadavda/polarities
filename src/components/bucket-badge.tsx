export function BucketBadge({ bucket }: { bucket: string }) {
  return (
    <span className="inline-flex w-fit border border-[rgba(164,71,51,0.42)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--rust-dark)]">
      {bucket}
    </span>
  );
}
