export type PosterVibe = "funny" | "sweet" | "chaotic";

export type CanvasTextRole = "greeting" | "headline" | "body";

export type CanvasTextBlock = {
  id: string;
  role: CanvasTextRole;
  content: string;
  x: number;
  y: number;
  rotation: number;
  scale?: number;
};

export type CanvasAssetPlacement = {
  id: string;
  assetId: string;
  kind: "sticker" | "meme";
  x: number;
  y: number;
  rotation: number;
  scale?: number;
};

export type CanvasLayout = {
  textBlocks: CanvasTextBlock[];
  assets: CanvasAssetPlacement[];
  borderId: string | null;
  borderScale?: number;
};

/** @deprecated use canvasLayout.assets */
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
  canvasLayout: CanvasLayout;
  stickerPlacements: StickerPlacement[];
  paperTheme: string;
  createdAt: string;
  deleteToken?: string;
};

export const EMPTY_CANVAS: CanvasLayout = {
  textBlocks: [],
  assets: [],
  borderId: null,
};

export const DESIGN_DIALS = {
  VARIANCE: 9,
  MOTION: 7,
  DENSITY: 3,
} as const;
