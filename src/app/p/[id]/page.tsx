import Link from "next/link";

/** Public poster page - wired in Phase 6. */
export default async function PosterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="desk-bg flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-2xl text-[var(--ink)]">Poster coming soon</h1>
      <p className="mt-2 max-w-sm text-sm text-[var(--ink-muted)]">
        This route will load poster <code className="text-[var(--accent)]">{id}</code>{" "}
        after Phase 6.
      </p>
      <Link href="/" className="btn-primary mt-6 inline-flex">
        Back to letter
      </Link>
    </main>
  );
}
