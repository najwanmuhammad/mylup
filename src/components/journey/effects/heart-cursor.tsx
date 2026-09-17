"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/components/journey/gsap";

export function HeartCursor({ enabled }: { enabled: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!enabled || !root.current) return;
      const pieces = gsap.utils.toArray<HTMLElement>(".heart-cursor__piece");
      const xSetters = pieces.map((piece, index) =>
        gsap.quickTo(piece, "x", {
          duration: 0.08 + index * 0.055,
          ease: "power3.out",
        }),
      );
      const ySetters = pieces.map((piece, index) =>
        gsap.quickTo(piece, "y", {
          duration: 0.08 + index * 0.055,
          ease: "power3.out",
        }),
      );

      const move = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;
        pieces.forEach((_, index) => {
          xSetters[index](event.clientX);
          ySetters[index](event.clientY);
        });
      };

      window.addEventListener("pointermove", move, { passive: true });
      return () => window.removeEventListener("pointermove", move);
    },
    { scope: root, dependencies: [enabled], revertOnUpdate: true },
  );

  if (!enabled) return null;

  return (
    <div ref={root} className="heart-cursor" aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => (
        <span
          key={index}
          className="heart-cursor__piece"
          style={{ opacity: 1 - index * 0.14 }}
        >
          ♥
        </span>
      ))}
    </div>
  );
}
