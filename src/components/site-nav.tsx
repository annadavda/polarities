import Link from "next/link";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b hairline bg-[rgba(250,247,241,0.9)] backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-10">
        <Link href="/" className="serif text-3xl">
          Polarity Project
        </Link>
        <div className="hidden items-center gap-10 text-xs font-semibold uppercase tracking-[0.28em] md:flex">
          <Link href="/articles">Essays</Link>
          <Link href="/about">About</Link>
        </div>
      </nav>
    </header>
  );
}
