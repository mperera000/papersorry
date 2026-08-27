import type {
  CanvasAssetPlacement,
  CanvasLayout,
  CanvasTextBlock,
  CanvasTextRole,
  StickerPlacement,
} from "@/lib/types";

export type TextPromptInput = {
  recipientName: string;
  whatHappened: string;
  messageText: string;
};

export const ELEMENT_SCALE_MIN = 0.5;
export const ELEMENT_SCALE_MAX = 2.5;
export const BORDER_SCALE_MIN = 0.85;
export const BORDER_SCALE_MAX = 1.15;
export const SCALE_STEP = 0.1;

function newBlockId(): string {
  return crypto.randomUUID();
}

export function resolveScale(scale?: number): number {
  return typeof scale === "number" && Number.isFinite(scale) ? scale : 1;
}

export function clampElementScale(scale: number): number {
  return Math.min(
    ELEMENT_SCALE_MAX,
    Math.max(ELEMENT_SCALE_MIN, Math.round(scale * 10) / 10),
  );
}

export function clampBorderScale(scale: number): number {
  return Math.min(
    BORDER_SCALE_MAX,
    Math.max(BORDER_SCALE_MIN, Math.round(scale * 100) / 100),
  );
}

export function textBlocksFromPrompt(input: TextPromptInput): CanvasTextBlock[] {
  const blocks: CanvasTextBlock[] = [];
  const name = input.recipientName.trim();
  const what = input.whatHappened.trim();
  const message = input.messageText.trim();

  if (name) {
    blocks.push({
      id: newBlockId(),
      role: "greeting",
      content: `Dear ${name},`,
      x: 8,
      y: 6,
      rotation: -1,
      scale: 1,
    });
  }
  if (what) {
    blocks.push({
      id: newBlockId(),
      role: "headline",
      content: what,
      x: 8,
      y: 18,
      rotation: 0,
      scale: 1,
    });
  }
  if (message) {
    blocks.push({
      id: newBlockId(),
      role: "body",
      content: message,
      x: 8,
      y: 32,
      rotation: 0.5,
      scale: 1,
    });
  }
  return blocks;
}

export function promptFromTextBlocks(blocks: CanvasTextBlock[]): TextPromptInput {
  const greeting = blocks.find((b) => b.role === "greeting");
  const headline = blocks.find((b) => b.role === "headline");
  const body = blocks.find((b) => b.role === "body");

  const recipientName =
    greeting?.content.replace(/^Dear\s/i, "").replace(/,\s*$/, "").trim() ?? "";
  return {
    recipientName,
    whatHappened: headline?.content ?? "",
    messageText: body?.content ?? "",
  };
}

export function canvasHasContent(layout: CanvasLayout): boolean {
  return layout.textBlocks.length > 0 || layout.assets.length > 0;
}

export function stickerPlacementsFromCanvas(
  layout: CanvasLayout,
): StickerPlacement[] {
  return layout.assets
    .filter((a) => a.kind === "sticker")
    .map((a) => ({
      stickerId: a.assetId,
      x: a.x,
      y: a.y,
      rotation: a.rotation,
    }));
}

export function layoutFromLegacy(
  recipientName: string,
  whatHappened: string,
  messageText: string,
  stickerPlacements: StickerPlacement[],
): CanvasLayout {
  const textBlocks = textBlocksFromPrompt({
    recipientName,
    whatHappened,
    messageText,
  });
  const assets: CanvasAssetPlacement[] = stickerPlacements.map((s) => ({
    id: newBlockId(),
    assetId: s.stickerId,
    kind: "sticker" as const,
    x: s.x,
    y: s.y,
    rotation: s.rotation,
    scale: 1,
  }));
  return { textBlocks, assets, borderId: null };
}

export function roleClass(role: CanvasTextRole): string {
  switch (role) {
    case "greeting":
      return "canvas-text canvas-text--greeting";
    case "headline":
      return "canvas-text canvas-text--headline";
    case "body":
      return "canvas-text canvas-text--body";
  }
}
