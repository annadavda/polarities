export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 md:px-10">
      <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--rust)]">About</p>
      <h1 className="serif text-5xl leading-tight md:text-6xl">A practical way to work with both sides.</h1>
      <div className="section-prose mt-8 text-lg leading-8 text-[var(--muted)]">
        <p>
          The polarity project treats many leadership and life dilemmas as tensions to discern rather than problems to solve once and for all.
        </p>
        <p>
          This first website skeleton is intentionally simple: a public essay library, structured article pages, and a local editor so content can keep evolving.
        </p>
      </div>
    </main>
  );
}
