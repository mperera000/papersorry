type RequestHost = {
  host: string;
  proto: string;
};

/** Public URL for `/p/[id]` — prefers NEXT_PUBLIC_APP_URL when set. */
export function getShareUrl(posterId: string, request?: RequestHost): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (configured) {
    return `${configured}/p/${posterId}`;
  }

  const host = request?.host ?? "localhost:3000";
  const proto = request?.proto ?? "http";
  return `${proto}://${host}/p/${posterId}`;
}
