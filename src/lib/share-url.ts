type RequestHost = {
  host: string;
  proto: string;
};

function isLocalHost(value: string): boolean {
  return /localhost|127\.0\.0\.1|\[::1\]/i.test(value);
}

function resolveAppBase(request?: RequestHost): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  if (configured && !isLocalHost(configured)) {
    return configured;
  }

  // Vercel sets this automatically — no manual env var needed
  const vercelHost = process.env.VERCEL_URL?.trim().replace(/\/$/, "");
  if (vercelHost && !isLocalHost(vercelHost)) {
    return `https://${vercelHost}`;
  }

  const host = request?.host?.trim();
  if (host && !isLocalHost(host)) {
    const proto = request?.proto ?? "https";
    return `${proto}://${host}`;
  }

  if (configured) {
    return configured;
  }

  return `${request?.proto ?? "http"}://${request?.host ?? "localhost:3000"}`;
}

/** Public URL for `/p/[id]` — uses Vercel host, request headers, or NEXT_PUBLIC_APP_URL. */
export function getShareUrl(posterId: string, request?: RequestHost): string {
  return `${resolveAppBase(request)}/p/${posterId}`;
}
