"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/components/journey/gsap";
import { PrimaryButton } from "@/components/journey/ui/primary-button";
import { Scene } from "@/components/journey/ui/scene";

const HEART_POSITIONS = [
  { left: 8, top: 62 },
  { left: 22, top: 18 },
  { left: 37, top: 70 },
  { left: 54, top: 32 },
  { left: 68, top: 74 },
  { left: 82, top: 20 },
  { left: 91, top: 57 },
] as const;

export function CatchLoveScene({
  onNext,
  reducedMotion,
}: {
  onNext: () => void;
  reducedMotion: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [caught, setCaught] = useState<number[]>([]);

  useGSAP(
    () => {
      if (reducedMotion) return;
      gsap.to(".catch-heart:not(.is-caught)", {
        y: -28,
        rotation: (index) => (index % 2 ? 10 : -10),
        duration: (index) => 1.6 + (index % 3) * 0.35,
        stagger: 0.08,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    {
      scope: root,
      dependencies: [reducedMotion, caught.length],
      revertOnUpdate: true,
    },
  );

  function catchHeart(index: number) {
    setCaught((current) =>
      current.includes(index) ? current : [...current, index],
    );
  }

  return (
    <Scene title="Catch All My Love" reducedMotion={reducedMotion}>
      <p className="lede">Click the floating hearts! ❤️</p>
      <p className="catch-score" aria-live="polite">
        Hearts Collected: <strong>{caught.length}</strong>
      </p>
      <div ref={root} className="catch-field" aria-label="Tangkap hati yang melayang">
        {HEART_POSITIONS.map((position, index) => {
          const isCaught = caught.includes(index);
          return (
            <button
              key={`${position.left}-${position.top}`}
              type="button"
              className={`catch-heart ${isCaught ? "is-caught" : ""}`}
              style={{ left: `${position.left}%`, top: `${position.top}%` }}
              aria-label={`Tangkap hati ${index + 1}`}
              disabled={isCaught}
              onClick={() => catchHeart(index)}
            >
              ♥
            </button>
          );
        })}
      </div>
      {caught.length >= 3 ? (
        <PrimaryButton className="continue-button" onClick={onNext}>
          Continue
        </PrimaryButton>
      ) : (
        <p className="small-note">Tangkap minimal 3 hati untuk melanjutkan.</p>
      )}
    </Scene>
  );
}
