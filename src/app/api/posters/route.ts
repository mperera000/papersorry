import { NextResponse } from "next/server";
import {
  createPoster,
  validateCreatePosterInput,
} from "@/lib/db/posters";
import { log } from "@/lib/log";
import { allowPosterCreate } from "@/lib/rate-limit";

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (!allowPosterCreate(ip)) {
    log("warn", {
      category: "share",
      action: "poster_create_rate_limited",
      outcome: "fail",
      reason: "rate_limit",
      meta: { ip },
    });
    return NextResponse.json(
      {
        error:
          "Slow down a bit. You can make more posters after waiting a while.",
      },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Send a poster as JSON." },
      { status: 400 },
    );
  }

  const validated = validateCreatePosterInput(body);
  if (!validated.ok) {
    return NextResponse.json(
      { error: validated.error },
      { status: 400 },
    );
  }

  const result = await createPoster(validated.data);
  if (!result.ok) {
    const status = result.code === "config" ? 503 : 500;
    return NextResponse.json({ error: result.error }, { status });
  }

  log("info", {
    category: "share",
    action: "poster_create_api",
    outcome: "ok",
    meta: { id: result.data.id },
  });

  return NextResponse.json({ poster: result.data }, { status: 201 });
}
