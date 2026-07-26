import type { ReactNode } from "react";

type PaperSurfaceProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "section";
};

/** Textured paper sheet used by letter + poster. Keep fiber grain + soft shadow. */
export function PaperSurface({
  children,
  className = "",
  as: Tag = "div",
}: PaperSurfaceProps) {
  return (
    <Tag className={`paper-surface relative overflow-hidden ${className}`}>
      <span className="paper-grain pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative z-[1]">{children}</div>
    </Tag>
  );
}
