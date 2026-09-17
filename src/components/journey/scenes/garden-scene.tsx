"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/components/journey/gsap";
import { PrimaryButton } from "@/components/journey/ui/primary-button";
import { Scene } from "@/components/journey/ui/scene";
import { giftContent } from "@/content/gift-content";

export function GardenScene({
  onNext,
  onInteraction,
  reducedMotion,
}: {
  onNext: () => void;
  onInteraction: (id: string) => void;
  reducedMotion: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeItem = giftContent.garden.find((item) => item.id === activeId);

  useGSAP(
    () => {
      if (reducedMotion) return;
      gsap.from(".garden-flower", {
        y: 38,
        scale: 0.72,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.09,
        ease: "back.out(1.7)",
      });
    },
    { scope: root, dependencies: [reducedMotion], revertOnUpdate: true },
  );

  function toggleFlower(id: string) {
    setActiveId((current) => (current === id ? null : id));
    onInteraction(id);
  }

  return (
    <Scene title="Our Memory Garden" reducedMotion={reducedMotion}>
      <p className="lede">Click each flower to see why you&apos;re amazing.</p>
      <div
        ref={root}
        className="flower-garden"
        aria-label="Enam bunga berisi pesan"
      >
        {giftContent.garden.map((item, index) => {
          const active = activeId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`garden-flower garden-flower--${(index % 3) + 1} ${active ? "is-active" : ""}`}
              aria-pressed={active}
              aria-label={`Buka bunga: ${item.title}`}
              onClick={() => toggleFlower(item.id)}
            >
              <span className="garden-flower__head" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
                <b />
              </span>
              <span className="garden-flower__stem" aria-hidden="true" />
              <span className="garden-flower__leaf" aria-hidden="true" />
              <span className="sr-only">{item.title}</span>
            </button>
          );
        })}
      </div>
      <div className="garden-message" aria-live="polite">
        {activeItem ? (
          <p>
            <strong>{activeItem.title}.</strong> {activeItem.body}
          </p>
        ) : (
          <p className="garden-message__hint">
            Pilih satu bunga untuk membaca pesannya.
          </p>
        )}
      </div>
      <PrimaryButton className="continue-button" onClick={onNext}>
        Continue
      </PrimaryButton>
    </Scene>
  );
}
