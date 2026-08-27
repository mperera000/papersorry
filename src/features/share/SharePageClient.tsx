"use client";

import Link from "next/link";
import { useState } from "react";
import { FIGMA_ASSETS } from "@/lib/figma-assets";
import { log } from "@/lib/log";

type SharePageClientProps = {
  posterId: string;
  sharePath: string;
};

async function writeToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* fall through */
    }
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "0";
    textarea.style.top = "0";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

/** Figma Screen/Share-Link-Ready 54:2169 */
export function SharePageClient({ posterId, sharePath }: SharePageClientProps) {
  const [copied, setCopied] = useState(false);

  const displayPath = sharePath.replace(/^https?:\/\//, "");

  async function copyLink() {
    const ok = await writeToClipboard(sharePath);

    if (ok) {
      setCopied(true);
      log("info", {
        category: "share",
        action: "link_copied",
        outcome: "ok",
        meta: { id: posterId },
      });
      setTimeout(() => setCopied(false), 2500);
      return;
    }

    log("warn", {
      category: "share",
      action: "link_copied",
      outcome: "fail",
      reason: "clipboard",
      meta: { id: posterId },
    });
  }

  return (
    <main className="ps-shell ps-share">
      <div
        className="ps-share-frame"
        data-name="Screen/Share-Link-Ready"
        data-node-id="54:2169"
      >
        <h1 className="ps-share__title">Send Your Apology</h1>

        <div className="ps-figma-mailbox" data-name="Mailbox/54:2564">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="ps-figma-mailbox__img"
            src={FIGMA_ASSETS.mailbox}
            alt=""
          />

          <div className="ps-figma-mailbox__slot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="ps-figma-mailbox__slot-icon"
              src={FIGMA_ASSETS.linkIcon}
              alt=""
            />
            <button
              type="button"
              className="ps-figma-mailbox__url-btn"
              onClick={copyLink}
            >
              {displayPath}
            </button>
            <button
              type="button"
              className="ps-figma-mailbox__copy"
              aria-label="Copy share link"
              onClick={copyLink}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={FIGMA_ASSETS.copyIcon} alt="" />
            </button>
          </div>

          {copied ? (
            <span
              className="ps-figma-mailbox__copied"
              role="status"
              aria-live="polite"
            >
              Link Copied
            </span>
          ) : null}
        </div>

        <p className="ps-share__footer">
          <Link href="/">Make another</Link>
        </p>
      </div>
    </main>
  );
}
