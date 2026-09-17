"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components/journey/ui/primary-button";
import { giftContent } from "@/content/gift-content";

export function StickyNotesSection({ onNext }: { onNext: () => void }) {
  const [darkNotes, setDarkNotes] = useState<string[]>([]);

  function toggle(id: string) {
    setDarkNotes((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <section className="memory-section memory-section--wishes" id="hope-wall">
      <header className="memory-section__heading scroll-reveal">
        <h2>Harapan untuk tahun barumu</h2>
        <p>Tekan sticky note untuk menandai harapan yang ingin kamu simpan.</p>
      </header>
      <div className="wish-wall scroll-reveal">
        {giftContent.wishes.map((wish, index) => {
          const active = darkNotes.includes(wish.id);
          return (
            <button
              key={wish.id}
              type="button"
              className={`wish-note wish-note--${index + 1} ${active ? "is-dark" : ""}`}
              aria-pressed={active}
              onClick={() => toggle(wish.id)}
            >
              <span aria-hidden="true">{["✦", "☀", "♡", "☾"][index]}</span>
              <strong>{wish.title}</strong>
              <small>{wish.body}</small>
            </button>
          );
        })}
      </div>
      <PrimaryButton className="continue-button scroll-reveal" onClick={onNext}>
        Continue
      </PrimaryButton>
    </section>
  );
}
