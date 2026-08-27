/** Paper border overlays — export from Figma `Borders` frame into public/figma/borders/ */
export type BorderOption = {
  id: string | null;
  label: string;
  src: string | null;
  figmaNode?: string;
};

export const BORDER_OPTIONS: BorderOption[] = [
  { id: null, label: "None", src: null },
  {
    id: "border-1",
    label: "Classic",
    src: "/figma/borders/border-1.svg",
    figmaNode: "TBD — Borders frame",
  },
  {
    id: "border-2",
    label: "Dashed",
    src: "/figma/borders/border-2.svg",
    figmaNode: "TBD — Borders frame",
  },
  {
    id: "border-3",
    label: "Double",
    src: "/figma/borders/border-3.svg",
    figmaNode: "TBD — Borders frame",
  },
  {
    id: "border-4",
    label: "Frame",
    src: "/figma/borders/border-4.svg",
    figmaNode: "TBD — Borders frame",
  },
];

export function getBorderSrc(borderId: string | null): string | null {
  if (!borderId) return null;
  return BORDER_OPTIONS.find((b) => b.id === borderId)?.src ?? null;
}
