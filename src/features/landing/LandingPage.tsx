"use client";

import { useRouter } from "next/navigation";
import { FIGMA_ASSETS } from "@/lib/figma-assets";
import { log } from "@/lib/log";

/** Figma Envelope/close 41:1749 */
function EnvelopeClose() {
  return (
    <div className="ps-figma-envelope" data-name="Envelope/close">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="ps-figma-envelope__img"
        src={FIGMA_ASSETS.envelopeClose}
        alt=""
      />
    </div>
  );
}

/** Figma Text/Title 43:1760 */
function TextTitle() {
  return (
    <div className="ps-figma-title" data-name="Text/Title">
      <p className="ps-figma-title__send" data-node-id="16:61">
        Send An
        <br aria-hidden />
        {" "}
      </p>
      <p className="ps-figma-title__apology" data-node-id="16:62">
        Apology
      </p>
    </div>
  );
}

/** Figma Button/Create 41:1750 */
function ButtonCreate() {
  return (
    <div className="ps-figma-create" data-name="Button/Create">
      <div className="ps-figma-create__halo" aria-hidden />
      <div className="ps-figma-create__wax-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="ps-figma-create__wax"
          src={FIGMA_ASSETS.buttonCreateSource}
          alt=""
        />
      </div>
      <div className="ps-figma-create__mouth" data-node-id="16:65">
        <div className="ps-figma-create__mouth-inset">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FIGMA_ASSETS.waxFaceMouth} alt="" />
        </div>
      </div>
      <div className="ps-figma-create__eye-left" data-node-id="16:66">
        <div className="ps-figma-create__eye-left-inset">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FIGMA_ASSETS.waxFaceEyeLeft} alt="" />
        </div>
      </div>
      <div className="ps-figma-create__eye-right" data-node-id="16:67">
        <div className="ps-figma-create__eye-right-inset">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FIGMA_ASSETS.waxFaceEyeRight} alt="" />
        </div>
      </div>
    </div>
  );
}

/** Figma Screen/Landing-Closed 16:58 */
export function LandingPage() {
  const router = useRouter();

  return (
    <main className="ps-shell ps-landing">
      <div className="ps-landing-scale">
        <div
          className="ps-landing-frame"
          data-name="Screen/Landing-Closed"
          data-node-id="16:58"
        >
          <EnvelopeClose />
          <button
            type="button"
            className="ps-landing-create-hit"
            aria-label="Create your apology letter"
            onClick={() => {
              log("info", {
                category: "landing",
                action: "letter_opened",
                outcome: "ok",
              });
              router.push("/create");
            }}
          >
            <ButtonCreate />
          </button>
          <TextTitle />
        </div>
      </div>
    </main>
  );
}
