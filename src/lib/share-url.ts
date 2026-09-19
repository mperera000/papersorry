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

  // The host the visitor is actually on: production alias, custom domain, or
  // preview URL. Must win over VERCEL_URL, which is always the per-deployment
  // hostname (papersorry-jd6p64jlb-…) and changes with every deploy.
  const host = request?.host?.trim();
  if (host && !isLocalHost(host)) {
    const proto = request?.proto ?? "https";
    return `${proto}://${host}`;
  }

  // Vercel sets both automatically — the project's stable production domain
  // first, the deployment-specific host only as a last resort
  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim().replace(/\/$/, "");
  if (productionHost && !isLocalHost(productionHost)) {
    return `https://${productionHost}`;
  }

  const vercelHost = process.env.VERCEL_URL?.trim().replace(/\/$/, "");
  if (vercelHost && !isLocalHost(vercelHost)) {
    return `https://${vercelHost}`;
  }

  if (configured) {
    return configured;
  }

  return `${request?.proto ?? "http"}://${request?.host ?? "localhost:3000"}`;
}

/** Public URL for `/p/[id]` — uses NEXT_PUBLIC_APP_URL, the request host, then Vercel's domains. */
export function getShareUrl(posterId: string, request?: RequestHost): string {
  return `${resolveAppBase(request)}/p/${posterId}`;
}
