"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/components/journey/gsap";

export function HugSection({ reducedMotion }: { reducedMotion: boolean }) {
  const root = useRef<HTMLElement>(null);
  const [hugs, setHugs] = useState(0);

  useGSAP(
    () => {
      if (hugs === 0 || reducedMotion) return;
      gsap.fromTo(
        ".hug-pop",
        { x: 0, y: 0, scale: 0.4, autoAlpha: 1 },
        {
          x: (index) => (index - 5.5) * 24,
          y: (index) => -74 - (index % 3) * 26,
          scale: 1.2,
          rotation: (index) => (index % 2 ? 18 : -18),
          autoAlpha: 0,
          duration: 1.1,
          stagger: 0.025,
          ease: "power2.out",
        },
      );
      gsap.fromTo(
        ".hug-button",
        { scale: 0.92 },
        { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.45)" },
      );
    },
    { scope: root, dependencies: [hugs, reducedMotion], revertOnUpdate: true },
  );

  return (
    <section ref={root} className="after-section hug-section" id="send-a-hug">
      <div className="kawaii-panel hug-panel">
        <div className="hug-emoji" aria-hidden="true">🥺💗</div>
        <h2>No matter what...</h2>
        <p>You&apos;ll always be my favorite person.</p>
        <div className="hug-action">
          <button
            type="button"
            className="button button--primary hug-button"
            onClick={() => setHugs((count) => count + 1)}
          >
            Send a hug 🤗
          </button>
          {hugs > 0 && Array.from({ length: 12 }, (_, index) => (
            <span key={`${hugs}-${index}`} className="hug-pop" aria-hidden="true">♥</span>
          ))}
        </div>
        <p className="hug-count" aria-live="polite">Hugs sent: {hugs}</p>
      </div>
      <a className="scroll-cue" href="#send-message">Scroll untuk mengirim pesan ↓</a>
    </section>
  );
}
