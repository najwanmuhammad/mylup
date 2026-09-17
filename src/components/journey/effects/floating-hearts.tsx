"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/components/journey/gsap";

const HEARTS = [
  { left: 5, size: 16, delay: 0 },
  { left: 13, size: 24, delay: 2.3 },
  { left: 22, size: 14, delay: 5.1 },
  { left: 31, size: 20, delay: 1.2 },
  { left: 40, size: 13, delay: 6.4 },
  { left: 49, size: 26, delay: 3.8 },
  { left: 58, size: 18, delay: 7.2 },
  { left: 66, size: 14, delay: 0.8 },
  { left: 74, size: 23, delay: 4.5 },
  { left: 82, size: 16, delay: 6 },
  { left: 90, size: 21, delay: 1.9 },
  { left: 96, size: 13, delay: 5.7 },
] as const;

export function FloatingHearts({ reducedMotion }: { reducedMotion: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reducedMotion) return;
      const hearts = gsap.utils.toArray<HTMLElement>(".ambient-heart");
      hearts.forEach((heart, index) => {
        gsap.fromTo(
          heart,
          { y: "110vh", x: 0, rotation: -12, autoAlpha: 0 },
          {
            y: "-18vh",
            x: index % 2 ? 24 : -24,
            rotation: index % 2 ? 18 : -18,
            autoAlpha: 0.34,
            duration: 12 + (index % 4) * 2,
            delay: HEARTS[index].delay,
            repeat: -1,
            ease: "none",
          },
        );
      });
    },
    { scope: root, dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <div ref={root} className="floating-hearts" aria-hidden="true">
      {HEARTS.map((heart, index) => (
        <span
          key={`${heart.left}-${index}`}
          className="ambient-heart"
          style={{ left: `${heart.left}%`, fontSize: heart.size }}
        >
          ♥
        </span>
      ))}
    </div>
  );
}
