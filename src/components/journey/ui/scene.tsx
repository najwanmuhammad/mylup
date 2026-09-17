"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/components/journey/gsap";

type SceneProps = {
  title: string;
  children: ReactNode;
  tone?: "light" | "night" | "quiet" | "pink";
  className?: string;
  reducedMotion: boolean;
};

export function Scene({
  title,
  children,
  tone = "light",
  className = "",
  reducedMotion,
}: SceneProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion) return;
      gsap.from(".scene__copy, .scene__body", {
        autoAlpha: 0,
        y: 24,
        duration: 0.72,
        stagger: 0.08,
        ease: "power3.out",
      });
    },
    { scope: root, dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <section ref={root} className={`scene scene--${tone} ${className}`}>
      <header className="scene__copy">
        <h1>{title}</h1>
      </header>
      <div className="scene__body">{children}</div>
    </section>
  );
}
