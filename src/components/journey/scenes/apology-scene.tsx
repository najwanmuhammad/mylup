"use client";

import Image from "next/image";
import { useState } from "react";
import { PrimaryButton } from "@/components/journey/ui/primary-button";
import { Scene } from "@/components/journey/ui/scene";
import { giftContent } from "@/content/gift-content";

export function ApologyScene({
  onNext,
  reducedMotion,
}: {
  onNext: () => void;
  reducedMotion: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Scene
      title="Aku ingin meminta maaf"
      tone="quiet"
      reducedMotion={reducedMotion}
    >
      <div className="apology-layout">
        <div className="apology-mascot" aria-hidden="true">
          <Image src="/assets/lumi-mascot.png" alt="" width={220} height={220} />
        </div>
        <div className="apology-card">
          {(expanded ? giftContent.apology : giftContent.apology.slice(0, 2)).map(
            (paragraph) => <p key={paragraph}>{paragraph}</p>,
          )}
          {!expanded && (
            <button type="button" className="text-button" onClick={() => setExpanded(true)}>
              Baca surat maaf lengkap
            </button>
          )}
          {expanded && (
            <div className="change-list">
              <h2>Yang sedang kuubah dalam tindakan</h2>
              <ul>
                {giftContent.changes.map((change) => <li key={change}>{change}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
      {expanded && (
        <PrimaryButton className="continue-button" onClick={onNext}>
          Lanjut
        </PrimaryButton>
      )}
    </Scene>
  );
}
