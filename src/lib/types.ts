export type PosterVibe = "funny" | "sweet" | "chaotic";

export type StickerPlacement = {
  stickerId: string;
  x: number;
  y: number;
  rotation: number;
};

export type Poster = {
  id: string;
  recipientName: string;
  whatHappened: string;
  vibe: PosterVibe;
  messageText: string;
  stickerPlacements: StickerPlacement[];
  paperTheme: string;
  createdAt: string;
  deleteToken?: string;
};

export const DESIGN_DIALS = {
  VARIANCE: 9,
  MOTION: 7,
  DENSITY: 3,
} as const;
