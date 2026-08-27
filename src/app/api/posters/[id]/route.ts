import { NextResponse } from "next/server";
import { getPosterById } from "@/lib/db/posters";
import { log } from "@/lib/log";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const result = await getPosterById(id);

  if (!result.ok) {
    const status =
      result.code === "not_found"
        ? 404
        : result.code === "validation"
          ? 400
          : result.code === "config"
            ? 503
            : 500;
    log("warn", {
      category: "receive",
      action: "poster_fetch_api",
      outcome: "fail",
      reason: result.code,
      meta: { id },
    });
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({ poster: result.data });
}
