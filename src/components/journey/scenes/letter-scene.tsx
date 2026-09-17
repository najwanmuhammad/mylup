"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/components/journey/gsap";
import { PrimaryButton } from "@/components/journey/ui/primary-button";
import { Scene } from "@/components/journey/ui/scene";
import { giftContent } from "@/content/gift-content";

function useTypedLetter(open: boolean, reducedMotion: boolean) {
  const fullText = giftContent.birthdayLetter.join("\n\n");
  const [length, setLength] = useState(0);

  useEffect(() => {
    if (!open || reducedMotion) return;

    const timer = window.setInterval(() => {
      setLength((current) => {
        const next = Math.min(fullText.length, current + 5);
        if (next >= fullText.length) window.clearInterval(timer);
        return next;
      });
    }, 24);

    return () => window.clearInterval(timer);
  }, [fullText, open, reducedMotion]);

  return {
    text: fullText.slice(0, length),
    finished: length >= fullText.length,
    start: () => setLength(reducedMotion ? fullText.length : 0),
    showAll: () => setLength(fullText.length),
  };
}

export function LetterScene({
  onNext,
  reducedMotion,
}: {
  onNext: () => void;
  reducedMotion: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const typed = useTypedLetter(showLetter, reducedMotion);

  useGSAP(
    (_context, contextSafe) => {
      if (!open || reducedMotion || showLetter) return;
      const revealLetter = contextSafe
        ? contextSafe(() => setShowLetter(true))
        : () => setShowLetter(true);
      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          onComplete: revealLetter,
        })
        .to(".envelope__flap", {
          rotationX: -180,
          transformOrigin: "center top",
          duration: 0.65,
        })
        .to(".envelope-letter", { y: -82, duration: 0.72 }, "-=0.28")
        .to(".envelope-wrap", { autoAlpha: 0, scale: 0.9, duration: 0.38 });
    },
    {
      scope: root,
      dependencies: [open, reducedMotion, showLetter],
      revertOnUpdate: true,
    },
  );

  useGSAP(
    () => {
      if (!showLetter || reducedMotion) return;
      gsap.fromTo(
        ".letter-paper",
        { autoAlpha: 0, y: 44, rotation: -1.2 },
        { autoAlpha: 1, y: 0, rotation: 0, duration: 0.72, ease: "power3.out" },
      );
    },
    {
      scope: root,
      dependencies: [showLetter, reducedMotion],
      revertOnUpdate: true,
    },
  );

  return (
    <Scene
      title="Untuk Kesayanganku, di hari spesialnya"
      tone="quiet"
      reducedMotion={reducedMotion}
    >
      <div ref={root} className="letter-stage">
        {!showLetter && (
          <button
            type="button"
            className="envelope-wrap"
            onClick={() => {
              typed.start();
              setOpen(true);
              if (reducedMotion) setShowLetter(true);
            }}
            aria-label="Buka surat ulang tahun"
            aria-hidden={open}
            disabled={open}
            tabIndex={open ? -1 : 0}
          >
            <span className="envelope-letter" aria-hidden="true">
              Dear you ♡
            </span>
            <span className="envelope__flap" aria-hidden="true" />
            <span className="envelope__front" aria-hidden="true" />
            <span className="envelope__seal" aria-hidden="true">
              ♡
            </span>
            <strong>Buka perlahan</strong>
          </button>
        )}
        {showLetter && (
          <article className="letter-paper">
            <p className="letter-salutation">
              Dear {giftContent.recipientName},
            </p>
            <div className="typed-letter" aria-live="polite">
              {typed.text.split("\n\n").map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 12)}`}>{paragraph}</p>
              ))}
              {!typed.finished && (
                <span className="typing-caret" aria-hidden="true" />
              )}
            </div>
            {typed.finished && (
              <p className="letter-signature">— {giftContent.senderName}</p>
            )}
          </article>
        )}
      </div>
      {showLetter && !typed.finished && (
        <button type="button" className="text-button" onClick={typed.showAll}>
          Tampilkan seluruh surat
        </button>
      )}
      {showLetter && typed.finished && (
        <PrimaryButton className="continue-button" onClick={onNext}>
          Continue
        </PrimaryButton>
      )}
    </Scene>
  );
}
