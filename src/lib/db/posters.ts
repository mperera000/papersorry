import { randomUUID } from "crypto";
import { getSupabaseServer } from "@/lib/supabase/server";
import {
  canvasHasContent,
  layoutFromLegacy,
  promptFromTextBlocks,
  stickerPlacementsFromCanvas,
} from "@/lib/canvas";
import { log } from "@/lib/log";
import type {
  CanvasLayout,
  Poster,
  PosterVibe,
  StickerPlacement,
} from "@/lib/types";
import { EMPTY_CANVAS } from "@/lib/types";

type PosterRow = {
  id: string;
  recipient_name: string;
  what_happened: string;
  vibe: PosterVibe;
  message_text: string;
  sticker_placements: StickerPlacement[];
  canvas_layout?: CanvasLayout | null;
  paper_theme: string;
  created_at: string;
  delete_token: string | null;
};

export type CreatePosterInput = {
  recipientName: string;
  whatHappened: string;
  vibe: PosterVibe;
  messageText: string;
  canvasLayout: CanvasLayout;
  paperTheme?: string;
};

export type DbResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; code: "config" | "validation" | "not_found" | "db" };

const VIBES: PosterVibe[] = ["funny", "sweet", "chaotic"];

function parseCanvasLayout(raw: unknown): CanvasLayout {
  if (!raw || typeof raw !== "object") return EMPTY_CANVAS;
  const o = raw as Record<string, unknown>;
  const textBlocks = Array.isArray(o.textBlocks) ? o.textBlocks : [];
  const assets = Array.isArray(o.assets) ? o.assets : [];
  const borderId =
    typeof o.borderId === "string" ? o.borderId : null;
  const borderScale =
    typeof o.borderScale === "number" && Number.isFinite(o.borderScale)
      ? o.borderScale
      : undefined;
  return {
    textBlocks: textBlocks as CanvasLayout["textBlocks"],
    assets: assets as CanvasLayout["assets"],
    borderId,
    borderScale,
  };
}

function rowToPoster(row: PosterRow, includeDeleteToken: boolean): Poster {
  const stickerPlacements = Array.isArray(row.sticker_placements)
    ? row.sticker_placements
    : [];
  const parsed = parseCanvasLayout(row.canvas_layout);
  const canvasLayout =
    row.canvas_layout &&
    (parsed.textBlocks.length > 0 || parsed.assets.length > 0)
      ? parsed
      : layoutFromLegacy(
          row.recipient_name,
          row.what_happened,
          row.message_text,
          stickerPlacements,
        );

  return {
    id: row.id,
    recipientName: row.recipient_name,
    whatHappened: row.what_happened,
    vibe: row.vibe,
    messageText: row.message_text,
    canvasLayout,
    stickerPlacements: stickerPlacementsFromCanvas(canvasLayout),
    paperTheme: row.paper_theme,
    createdAt: row.created_at,
    ...(includeDeleteToken && row.delete_token
      ? { deleteToken: row.delete_token }
      : {}),
  };
}

function cleanText(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return null;
  return trimmed;
}

function cleanOptionalText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export function validateCreatePosterInput(
  body: unknown,
): DbResult<CreatePosterInput> {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Send a poster as JSON.", code: "validation" };
  }
  const b = body as Record<string, unknown>;

  const canvasLayout = parseCanvasLayout(b.canvasLayout);
  const prompt = promptFromTextBlocks(canvasLayout.textBlocks);

  const recipientName =
    cleanText(b.recipientName, 60) ?? cleanText(prompt.recipientName, 60);
  const whatHappened =
    cleanText(b.whatHappened, 160) ?? cleanText(prompt.whatHappened, 160);
  const messageText =
    cleanOptionalText(b.messageText, 500) ||
    cleanOptionalText(prompt.messageText, 500);
  const vibe = b.vibe;

  if (!recipientName) {
    return {
      ok: false,
      error: "Add who this is for using the Text tool.",
      code: "validation",
    };
  }
  if (!whatHappened) {
    return {
      ok: false,
      error: "Add what you're sorry for using the Text tool.",
      code: "validation",
    };
  }
  if (!canvasHasContent(canvasLayout)) {
    return {
      ok: false,
      error: "Add a line or sticker to your letter before sending.",
      code: "validation",
    };
  }

  const resolvedVibe =
    typeof vibe === "string" && VIBES.includes(vibe as PosterVibe)
      ? (vibe as PosterVibe)
      : "funny";

  if (canvasLayout.assets.length > 24) {
    return {
      ok: false,
      error: "Too many stickers on this poster.",
      code: "validation",
    };
  }

  const paperTheme = cleanText(b.paperTheme, 40) ?? "warm-scrap";

  return {
    ok: true,
    data: {
      recipientName,
      whatHappened,
      vibe: resolvedVibe,
      messageText,
      canvasLayout,
      paperTheme,
    },
  };
}

export async function createPoster(
  input: CreatePosterInput,
): Promise<DbResult<Poster>> {
  try {
    const supabase = getSupabaseServer();
    const deleteToken = randomUUID();
    const stickerPlacements = stickerPlacementsFromCanvas(input.canvasLayout);

    const insertPayload: Record<string, unknown> = {
      recipient_name: input.recipientName,
      what_happened: input.whatHappened,
      vibe: input.vibe,
      message_text: input.messageText || " ",
      sticker_placements: stickerPlacements,
      canvas_layout: input.canvasLayout,
      paper_theme: input.paperTheme ?? "warm-scrap",
      delete_token: deleteToken,
    };

    const { data, error } = await supabase
      .from("posters")
      .insert(insertPayload)
      .select(
        "id, recipient_name, what_happened, vibe, message_text, sticker_placements, canvas_layout, paper_theme, created_at, delete_token",
      )
      .single();

    if (error || !data) {
      const missingColumn = error?.message?.includes("canvas_layout");
      if (missingColumn) {
        const fallback = await supabase
          .from("posters")
          .insert({
            recipient_name: input.recipientName,
            what_happened: input.whatHappened,
            vibe: input.vibe,
            message_text: input.messageText || " ",
            sticker_placements: stickerPlacements,
            paper_theme: input.paperTheme ?? "warm-scrap",
            delete_token: deleteToken,
          })
          .select(
            "id, recipient_name, what_happened, vibe, message_text, sticker_placements, paper_theme, created_at, delete_token",
          )
          .single();
        if (fallback.error || !fallback.data) {
          log("error", {
            category: "db",
            action: "poster_create",
            outcome: "fail",
            reason: fallback.error?.message ?? "no_data",
          });
          return {
            ok: false,
            error: "Could not save the poster. Run supabase/migrations/001_canvas_layout.sql",
            code: "db",
          };
        }
        return {
          ok: true,
          data: rowToPoster(
            { ...fallback.data, canvas_layout: input.canvasLayout } as PosterRow,
            true,
          ),
        };
      }

      log("error", {
        category: "db",
        action: "poster_create",
        outcome: "fail",
        reason: error?.message ?? "no_data",
      });
      return {
        ok: false,
        error: "Could not save the poster. Try again in a moment.",
        code: "db",
      };
    }

    log("info", {
      category: "db",
      action: "poster_create",
      outcome: "ok",
      meta: { id: data.id },
    });

    return { ok: true, data: rowToPoster(data as PosterRow, true) };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    const isConfig = message.includes("not configured");
    log("error", {
      category: "db",
      action: "poster_create",
      outcome: "fail",
      reason: message,
    });
    return {
      ok: false,
      error: isConfig
        ? "Database is not set up yet. See docs/SUPABASE-SETUP.md."
        : "Could not save the poster. Try again in a moment.",
      code: isConfig ? "config" : "db",
    };
  }
}

export async function getPosterById(id: string): Promise<DbResult<Poster>> {
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
    return { ok: false, error: "That poster link looks broken.", code: "validation" };
  }

  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("posters")
      .select(
        "id, recipient_name, what_happened, vibe, message_text, sticker_placements, canvas_layout, paper_theme, created_at",
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      if (error.message.includes("canvas_layout")) {
        const legacy = await supabase
          .from("posters")
          .select(
            "id, recipient_name, what_happened, vibe, message_text, sticker_placements, paper_theme, created_at",
          )
          .eq("id", id)
          .maybeSingle();
        if (legacy.error || !legacy.data) {
          return {
            ok: false,
            error: "Could not load this poster. Try again in a moment.",
            code: "db",
          };
        }
        if (!legacy.data) {
          return {
            ok: false,
            error: "We could not find that poster. The link may be old or mistyped.",
            code: "not_found",
          };
        }
        return {
          ok: true,
          data: rowToPoster(legacy.data as PosterRow, false),
        };
      }

      log("error", {
        category: "db",
        action: "poster_fetch",
        outcome: "fail",
        reason: error.message,
        meta: { id },
      });
      return {
        ok: false,
        error: "Could not load this poster. Try again in a moment.",
        code: "db",
      };
    }

    if (!data) {
      return {
        ok: false,
        error: "We could not find that poster. The link may be old or mistyped.",
        code: "not_found",
      };
    }

    log("info", {
      category: "db",
      action: "poster_fetch",
      outcome: "ok",
      meta: { id },
    });

    return { ok: true, data: rowToPoster(data as PosterRow, false) };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    const isConfig = message.includes("not configured");
    return {
      ok: false,
      error: isConfig
        ? "Database is not set up yet. See docs/SUPABASE-SETUP.md."
        : "Could not load this poster. Try again in a moment.",
      code: isConfig ? "config" : "db",
    };
  }
}
