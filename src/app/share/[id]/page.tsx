import { headers } from "next/headers";
import { SharePageClient } from "@/features/share/SharePageClient";
import { getShareUrl } from "@/lib/share-url";

export default async function SharePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const sharePath = getShareUrl(id, { host, proto });

  return <SharePageClient posterId={id} sharePath={sharePath} />;
}
