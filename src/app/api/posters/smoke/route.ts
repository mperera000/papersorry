import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/server";

/** Dev helper: check env without writing a poster. */
export async function GET() {
  const configured = isSupabaseConfigured();
  return NextResponse.json({
    configured,
    hint: configured
      ? "Supabase env looks set. Create a poster via POST /api/posters."
      : "Add keys to .env.local. See docs/SUPABASE-SETUP.md.",
  });
}
