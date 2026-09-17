"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/components/journey/gsap";
import { PrimaryButton } from "@/components/journey/ui/primary-button";
import { Scene } from "@/components/journey/ui/scene";
import { giftContent } from "@/content/gift-content";

const HEART_POINTS = [
  { x: 50, y: 82 },
  { x: 30, y: 62 },
  { x: 20, y: 39 },
  { x: 27, y: 22 },
  { x: 42, y: 25 },
  { x: 50, y: 38 },
  { x: 58, y: 25 },
  { x: 73, y: 22 },
  { x: 80, y: 39 },
  { x: 70, y: 62 },
] as const;

export function ConstellationScene({
  onNext,
  onInteraction,
  reducedMotion,
}: {
  onNext: () => void;
  onInteraction: (id: string) => void;
  reducedMotion: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [connected, setConnected] = useState<number[]>([]);
  const complete = connected.length === HEART_POINTS.length;

  useGSAP(
    () => {
      if (reducedMotion) return;
      const availableStars = gsap.utils.toArray<HTMLElement>(
        ".constellation-star:not(.is-connected)",
      );
      if (availableStars.length === 0) return;
      gsap.to(availableStars, {
        scale: 1.22,
        autoAlpha: 0.68,
        duration: 1.25,
        stagger: { each: 0.12, from: "random" },
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    {
      scope: root,
      dependencies: [reducedMotion, connected.length],
      revertOnUpdate: true,
    },
  );

  function connect(index: number) {
    setConnected((current) =>
      current.includes(index) ? current : [...current, index],
    );
    onInteraction(`constellation-${index}`);
  }

  return (
    <Scene
      title="Written in the Stars"
      tone="night"
      reducedMotion={reducedMotion}
    >
      <p className="lede lede--night">
        Click one star, then another, to connect them into a heart.
      </p>
      <div ref={root} className="heart-constellation">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          {HEART_POINTS.map((from, index) => {
            const nextIndex = (index + 1) % HEART_POINTS.length;
            if (!connected.includes(index) || !connected.includes(nextIndex)) {
              return null;
            }
            const to = HEART_POINTS[nextIndex];
            return (
              <line
                key={`${index}-${nextIndex}`}
                className="constellation-line"
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
              />
            );
          })}
        </svg>
        {HEART_POINTS.map((point, index) => {
          const lit = connected.includes(index);
          const memory = giftContent.constellation[index % giftContent.constellation.length];
          return (
            <button
              key={`${point.x}-${point.y}`}
              type="button"
              className={`constellation-star ${lit ? "is-connected" : ""}`}
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              aria-label={`Hubungkan bintang ${index + 1}: ${memory.title}`}
              aria-pressed={lit}
              onClick={() => connect(index)}
            >
              <span aria-hidden="true">✦</span>
            </button>
          );
        })}
      </div>
      <p className="constellation-status" aria-live="polite">
        {complete
          ? "Every little moment with you found its place in my heart."
          : `${connected.length} dari ${HEART_POINTS.length} bintang terhubung`}
      </p>
      {complete && (
        <PrimaryButton className="continue-button" onClick={onNext}>
          Continue
        </PrimaryButton>
      )}
    </Scene>
  );
}
