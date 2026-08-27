export type BuiltinAsset = {
  id: string;
  label: string;
  emoji: string;
};

export const BUILTIN_STICKERS: BuiltinAsset[] = [
  { id: "builtin-star", label: "Star", emoji: "⭐" },
  { id: "builtin-heart", label: "Heart", emoji: "💔" },
  { id: "builtin-bear", label: "Bear", emoji: "🐻" },
  { id: "builtin-flower", label: "Flower", emoji: "🌸" },
  { id: "builtin-bandaid", label: "Bandaid", emoji: "🩹" },
];

export const BUILTIN_MEMES: BuiltinAsset[] = [
  { id: "builtin-sorry", label: "Sorry", emoji: "🙏" },
  { id: "builtin-cry", label: "Cry", emoji: "😭" },
  { id: "builtin-oops", label: "Oops", emoji: "😅" },
  { id: "builtin-wilt", label: "Wilt", emoji: "🥀" },
];

export function getBuiltinAsset(id: string): BuiltinAsset | undefined {
  return [...BUILTIN_STICKERS, ...BUILTIN_MEMES].find((a) => a.id === id);
}
