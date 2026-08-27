import Link from "next/link";
import { ReceivePageClient } from "@/features/receive/ReceivePageClient";
import { getPosterById } from "@/lib/db/posters";
import { log } from "@/lib/log";

export default async function PosterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getPosterById(id);

  if (!result.ok) {
    log("warn", {
      category: "receive",
      action: "poster_page_load",
      outcome: "fail",
      reason: result.code,
      meta: { id },
    });

    return (
      <main className="ps-error-page">
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
          {result.code === "not_found"
            ? "Poster not found"
            : result.code === "config"
              ? "Database not ready"
              : "Could not open poster"}
        </h1>
        <p style={{ color: "var(--ink-soft)", maxWidth: "20rem" }}>
          {result.error}
        </p>
        <Link href="/" className="ps-wax-btn ps-wax-btn--purple">
          Back home
        </Link>
      </main>
    );
  }

  return <ReceivePageClient poster={result.data} />;
}
