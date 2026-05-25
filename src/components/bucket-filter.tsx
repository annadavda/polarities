import Link from "next/link";
import { cn } from "@/lib/utils";

export function BucketFilter({
  buckets,
  activeBucket
}: {
  buckets: readonly string[];
  activeBucket?: string;
}) {
  return (
    <>
      {buckets.map((bucket) => (
        <Link
          key={bucket}
          href={`/articles?bucket=${encodeURIComponent(bucket)}`}
          className={cn(
            "border hairline px-4 py-2 text-sm transition",
            activeBucket === bucket
              ? "bg-[var(--foreground)] text-white"
              : "bg-[var(--paper)] text-[var(--foreground)] hover:bg-white"
          )}
        >
          {bucket}
        </Link>
      ))}
    </>
  );
}
