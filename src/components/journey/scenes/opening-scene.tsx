"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/components/journey/gsap";
import { PrimaryButton } from "@/components/journey/ui/primary-button";
import { Scene } from "@/components/journey/ui/scene";
import { giftContent } from "@/content/gift-content";

export function OpeningScene({
  onStart,
  reducedMotion,
}: {
  onStart: () => void;
  reducedMotion: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reducedMotion) return;
      gsap.to(".mascot-halo", {
        y: -12,
        rotation: 1.5,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: root, dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <Scene title={giftContent.intro.title} reducedMotion={reducedMotion}>
      <div ref={root} className="opening-grid">
        <div className="mascot-halo">
          <Image
            src="/assets/lumi-mascot.png"
            alt="Lumi, teman kecil pembawa hadiah ulang tahun"
            width={440}
            height={440}
            priority
          />
        </div>
        <div className="opening-note">
          <p>{giftContent.intro.body}</p>
          <PrimaryButton onClick={onStart}>Klik ini, Sayang</PrimaryButton>
        </div>
      </div>
    </Scene>
  );
}
