"use client";

type CanvasDeleteButtonProps = {
  label: string;
  scaleLabel: string;
  canShrink: boolean;
  canGrow: boolean;
  onShrink: () => void;
  onGrow: () => void;
  onDelete?: () => void;
  onCancel: () => void;
};

/** Actions for the currently selected canvas element */
export function CanvasDeleteButton({
  label,
  scaleLabel,
  canShrink,
  canGrow,
  onShrink,
  onGrow,
  onDelete,
  onCancel,
}: CanvasDeleteButtonProps) {
  return (
    <div className="ps-canvas-delete-bar" role="toolbar" aria-label="Selection actions">
      <span className="ps-canvas-delete-bar__label">{label}</span>
      <div className="ps-canvas-delete-bar__resize" aria-label="Resize">
        <button
          type="button"
          className="ps-canvas-delete-bar__resize-btn"
          aria-label="Make smaller"
          disabled={!canShrink}
          onClick={onShrink}
        >
          −
        </button>
        <span className="ps-canvas-delete-bar__scale" aria-live="polite">
          {scaleLabel}
        </span>
        <button
          type="button"
          className="ps-canvas-delete-bar__resize-btn"
          aria-label="Make larger"
          disabled={!canGrow}
          onClick={onGrow}
        >
          +
        </button>
      </div>
      {onDelete ? (
        <button
          type="button"
          className="ps-canvas-delete-bar__btn"
          onClick={onDelete}
        >
          Delete
        </button>
      ) : null}
      <button
        type="button"
        className="ps-canvas-delete-bar__cancel"
        onClick={onCancel}
      >
        Done
      </button>
    </div>
  );
}
