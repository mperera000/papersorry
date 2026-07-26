type LogLevel = "info" | "warn" | "error";
type LogCategory =
  | "landing"
  | "compose"
  | "canvas"
  | "share"
  | "receive"
  | "db";

type LogPayload = {
  category: LogCategory;
  action: string;
  outcome?: "ok" | "fail";
  reason?: string;
  meta?: Record<string, string | number | boolean | undefined>;
};

export function log(level: LogLevel, payload: LogPayload) {
  const line = {
    ts: new Date().toISOString(),
    level,
    ...payload,
  };

  if (level === "error") {
    console.error("[papersorry]", line);
    return;
  }
  if (level === "warn") {
    console.warn("[papersorry]", line);
    return;
  }
  console.info("[papersorry]", line);
}
