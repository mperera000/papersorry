import type { ReactNode } from "react";

export type StickerDef = {
  id: string;
  label: string;
  render: (className?: string) => ReactNode;
};

function Frame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden
      focusable="false"
    >
      <defs>
        <filter id="stickerSoft" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="1.5"
            floodColor="#2a2420"
            floodOpacity="0.22"
          />
        </filter>
      </defs>
      <g filter="url(#stickerSoft)">{children}</g>
    </svg>
  );
}

export const STICKERS: StickerDef[] = [
  {
    id: "cracked-mug",
    label: "Cracked mug",
    render: (className) => (
      <Frame className={className}>
        <path
          d="M18 30c0-6 8-12 30-12s30 6 30 12v28c0 14-12 24-30 24S18 72 18 58V30z"
          fill="#fff8f2"
          stroke="#2a2420"
          strokeWidth="3"
        />
        <path
          d="M78 38c8 2 12 8 12 14s-4 12-12 14"
          fill="none"
          stroke="#2a2420"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M40 34v40M52 38l-8 16 10 10"
          stroke="#c45c4a"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="38" cy="48" r="2.5" fill="#2a2420" />
        <circle cx="58" cy="48" r="2.5" fill="#2a2420" />
        <path
          d="M40 62c4 4 12 4 16 0"
          stroke="#2a2420"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </Frame>
    ),
  },
  {
    id: "guilty-crumbs",
    label: "Guilty crumbs",
    render: (className) => (
      <Frame className={className}>
        <ellipse
          cx="48"
          cy="58"
          rx="34"
          ry="22"
          fill="#fff8f2"
          stroke="#2a2420"
          strokeWidth="3"
        />
        <circle cx="30" cy="54" r="5" fill="#c45c4a" />
        <circle cx="48" cy="48" r="4" fill="#e8a07a" />
        <circle cx="64" cy="56" r="6" fill="#c45c4a" />
        <circle cx="40" cy="66" r="3.5" fill="#e8a07a" />
        <circle cx="58" cy="66" r="3" fill="#2a2420" opacity="0.35" />
        <circle cx="36" cy="36" r="3" fill="#2a2420" />
        <circle cx="56" cy="34" r="3" fill="#2a2420" />
        <path
          d="M38 42c4 5 12 5 16 0"
          stroke="#2a2420"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </Frame>
    ),
  },
  {
    id: "bandaid-heart",
    label: "Bandaid heart",
    render: (className) => (
      <Frame className={className}>
        <path
          d="M48 78c-18-12-28-24-28-38 0-10 8-16 16-16 6 0 10 3 12 6 2-3 6-6 12-6 8 0 16 6 16 16 0 14-10 26-28 38z"
          fill="#fff8f2"
          stroke="#2a2420"
          strokeWidth="3"
        />
        <rect
          x="28"
          y="40"
          width="40"
          height="16"
          rx="4"
          fill="#f2c9b8"
          stroke="#2a2420"
          strokeWidth="2.5"
          transform="rotate(-18 48 48)"
        />
        <circle cx="40" cy="46" r="2" fill="#c45c4a" />
        <circle cx="56" cy="50" r="2" fill="#c45c4a" />
      </Frame>
    ),
  },
  {
    id: "oops-note",
    label: "Oops note",
    render: (className) => (
      <Frame className={className}>
        <path
          d="M22 20h52l4 56H18l4-56z"
          fill="#fff8f2"
          stroke="#2a2420"
          strokeWidth="3"
        />
        <path d="M30 18v10h36V18" fill="#c45c4a" />
        <text
          x="48"
          y="58"
          textAnchor="middle"
          fontSize="16"
          fontFamily="Georgia, serif"
          fontWeight="700"
          fill="#c45c4a"
        >
          OOPS
        </text>
      </Frame>
    ),
  },
  {
    id: "wilted-bloom",
    label: "Wilted bloom",
    render: (className) => (
      <Frame className={className}>
        <path
          d="M48 78c0-18 2-28 2-40"
          stroke="#2a2420"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse
          cx="40"
          cy="34"
          rx="12"
          ry="8"
          fill="#f2c9b8"
          stroke="#2a2420"
          strokeWidth="2.5"
          transform="rotate(-30 40 34)"
        />
        <ellipse
          cx="58"
          cy="36"
          rx="11"
          ry="7"
          fill="#fff8f2"
          stroke="#2a2420"
          strokeWidth="2.5"
          transform="rotate(24 58 36)"
        />
        <circle
          cx="48"
          cy="38"
          r="7"
          fill="#c45c4a"
          stroke="#2a2420"
          strokeWidth="2.5"
        />
        <path
          d="M50 58c8 2 12 8 12 12"
          stroke="#5b7a5a"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </Frame>
    ),
  },
  {
    id: "sorry-toast",
    label: "Sorry toast",
    render: (className) => (
      <Frame className={className}>
        <path
          d="M24 34c0-10 10-16 24-16s24 6 24 16v34c0 6-8 10-24 10S24 74 24 68V34z"
          fill="#f6d7a8"
          stroke="#2a2420"
          strokeWidth="3"
        />
        <circle cx="38" cy="48" r="3" fill="#2a2420" />
        <circle cx="58" cy="48" r="3" fill="#2a2420" />
        <path
          d="M38 62c3-4 17-4 20 0"
          stroke="#2a2420"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M34 40c2 2 4 2 6 0M56 40c2 2 4 2 6 0"
          stroke="#c45c4a"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </Frame>
    ),
  },
];

export function getSticker(id: string): StickerDef | undefined {
  return STICKERS.find((s) => s.id === id);
}
