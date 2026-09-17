"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/components/journey/gsap";
import { ClosingSection } from "@/components/journey/sections/closing-section";
import { HugSection } from "@/components/journey/sections/hug-section";
import { WhatsAppSection } from "@/components/journey/sections/whatsapp-section";
import { Scene } from "@/components/journey/ui/scene";
import { giftContent } from "@/content/gift-content";

type ForgivenessPhase = "ask" | "loading" | "after";

function LoadingThanks({ reducedMotion }: { reducedMotion: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reducedMotion) return;
      gsap.from(".loading-thanks__content > *", {
        autoAlpha: 0,
        y: 20,
        duration: 0.72,
        stagger: 0.18,
        ease: "power3.out",
      });
      gsap.fromTo(
        ".loading-heart",
        { scale: 0.2, x: 0, y: 0, autoAlpha: 0 },
        {
          scale: 1.3,
          x: (index) => (index - 7.5) * 58,
          y: (index) => -120 + (index % 4) * 68,
          autoAlpha: 0.58,
          rotation: (index) => index * 24,
          duration: 1.45,
          stagger: 0.04,
          ease: "power2.out",
        },
      );
    },
    { scope: root, dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <div ref={root} className="loading-thanks" role="status" aria-live="polite">
      <div className="loading-thanks__content">
        <h1>Thank you... 🥺💗</h1>
        <p>I promise to do better</p>
      </div>
      <div className="loading-heart-cloud" aria-hidden="true">
        {Array.from({ length: 16 }, (_, index) => (
          <span key={index} className="loading-heart">♥</span>
        ))}
      </div>
    </div>
  );
}

export function ForgivenessScene({
  onRestart,
  reducedMotion,
}: {
  onRestart: () => void;
  reducedMotion: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<ForgivenessPhase>("ask");
  const [apologyLead, forgivenessQuestion = "Will you forgive me? 🥺"] =
    giftContent.reconnectQuestion.split(/(?=Will you forgive me\?)/);

  useEffect(() => {
    if (phase !== "loading") return;
    const timer = window.setTimeout(() => {
      setPhase("after");
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    }, reducedMotion ? 350 : 2600);
    return () => window.clearTimeout(timer);
  }, [phase, reducedMotion]);

  useGSAP(
    () => {
      if (phase !== "after" || reducedMotion) return;
      gsap.from(".hug-section > *", {
        autoAlpha: 0,
        y: 32,
        duration: 0.72,
        stagger: 0.1,
        ease: "power3.out",
      });
      gsap
        .utils.toArray<HTMLElement>(".after-section:not(.hug-section) > *")
        .forEach((item) => {
          gsap.from(item, {
            autoAlpha: 0,
            y: 32,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "clamp(top 86%)",
              once: true,
            },
          });
        });
      ScrollTrigger.refresh();
    },
    { scope: root, dependencies: [phase, reducedMotion], revertOnUpdate: true },
  );

  if (phase === "loading") return <LoadingThanks reducedMotion={reducedMotion} />;

  if (phase === "after") {
    return (
      <div ref={root} className="after-forgive-page">
        <HugSection reducedMotion={reducedMotion} />
        <WhatsAppSection />
        <ClosingSection onRestart={onRestart} />
      </div>
    );
  }

  return (
    <Scene title="I’m really sorry..." tone="pink" reducedMotion={reducedMotion}>
      <div className="forgive-mascot" aria-hidden="true">
        <Image src="/assets/lumi-mascot.png" alt="" width={190} height={190} />
      </div>
      <div className="forgive-card">
        <p>{apologyLead.replace("...", "...\n")}</p>
        <h2>{forgivenessQuestion}</h2>
        <div className="forgive-actions">
          <button
            type="button"
            className="button button--primary forgive-yes"
            onClick={() => setPhase("loading")}
          >
            Yes 💕
          </button>
          <button
            type="button"
            className="button forgive-no"
            disabled
            aria-disabled="true"
            title="Pilihan ini sengaja tidak aktif"
          >
            No 😤
          </button>
        </div>
      </div>
    </Scene>
  );
}
