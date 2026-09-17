"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/components/journey/gsap";
import { FlipCardsSection } from "@/components/journey/sections/flip-cards-section";
import { GallerySection } from "@/components/journey/sections/gallery-section";
import { StickyNotesSection } from "@/components/journey/sections/sticky-notes-section";

export function MemoriesScrollScene({
  onNext,
  reducedMotion,
}: {
  onNext: () => void;
  reducedMotion: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reducedMotion) return;

      gsap.from(".memory-section:first-child .scroll-reveal", {
        opacity: 0,
        y: 38,
        duration: 0.78,
        stagger: 0.1,
        ease: "power3.out",
      });

      gsap
        .utils.toArray<HTMLElement>(
          ".memory-section:not(:first-child) .scroll-reveal",
        )
        .forEach((item) => {
        gsap.from(item, {
          opacity: 0,
          y: 38,
          duration: 0.78,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "clamp(top 84%)",
            once: true,
          },
        });
      });
      ScrollTrigger.refresh();
    },
    { scope: root, dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <div ref={root} className="memories-scroll-page">
      <FlipCardsSection />
      <GallerySection />
      <StickyNotesSection onNext={onNext} />
    </div>
  );
}
