"use client";

import type { TextPromptInput } from "@/lib/canvas";

type TextPromptOverlayProps = {
  initial: TextPromptInput;
  onDone: (input: TextPromptInput) => void;
  onCancel: () => void;
};

export function TextPromptOverlay({
  initial,
  onDone,
  onCancel,
}: TextPromptOverlayProps) {
  return (
    <div className="ps-text-prompt" role="dialog" aria-labelledby="text-prompt-title">
      <div className="ps-text-prompt__panel">
        <p id="text-prompt-title" className="sr-only">
          Write your apology
        </p>
        <label htmlFor="prompt-who">Who is this for?</label>
        <input
          id="prompt-who"
          name="who"
          defaultValue={initial.recipientName}
          placeholder="Sam"
          autoComplete="off"
        />
        <label htmlFor="prompt-what">What are you sorry for?</label>
        <input
          id="prompt-what"
          name="what"
          defaultValue={initial.whatHappened}
          placeholder="I ate the last of the chips"
          autoComplete="off"
        />
        <label htmlFor="prompt-message">Message (optional)</label>
        <textarea
          id="prompt-message"
          name="message"
          rows={2}
          defaultValue={initial.messageText}
          placeholder="I owe you a new bag…"
        />
        <div className="ps-text-prompt__actions">
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="primary"
            onClick={() => {
              const panel = document.querySelector(".ps-text-prompt__panel");
              if (!panel) return;
              const who = (
                panel.querySelector("#prompt-who") as HTMLInputElement
              ).value;
              const what = (
                panel.querySelector("#prompt-what") as HTMLInputElement
              ).value;
              const message = (
                panel.querySelector("#prompt-message") as HTMLTextAreaElement
              ).value;
              onDone({
                recipientName: who,
                whatHappened: what,
                messageText: message,
              });
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
