"use client";

import { useState } from "react";
import { giftContent } from "@/content/gift-content";

export function FlipCardsSection() {
  const [flipped, setFlipped] = useState<string[]>([]);

  function toggle(id: string) {
    setFlipped((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <section
      className="memory-section memory-section--cards"
      id="appreciation-cards"
    >
      <header className="memory-section__heading scroll-reveal">
        <h2>Hal-hal kecil yang kusukai</h2>
      </header>
      <div className="flip-grid scroll-reveal">
        {giftContent.appreciation.map((item, index) => {
          const isOpen = flipped.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              className={`flashcard ${isOpen ? "is-flipped" : ""}`}
              aria-pressed={isOpen}
              aria-label={`${isOpen ? "Tutup" : "Balik"} kartu ${item.title}`}
              onClick={() => toggle(item.id)}
            >
              <span className="flashcard__inner">
                <span
                  className="flashcard__face flashcard__front"
                  aria-hidden={isOpen}
                >
                  <span className="flashcard__number">{index + 1}</span>
                  <strong>{item.title}</strong>
                  <small>tap to flip</small>
                </span>
                <span
                  className="flashcard__face flashcard__back"
                  aria-hidden={!isOpen}
                >
                  <span aria-hidden="true">💗</span>
                  <strong>{item.body}</strong>
                  <small>tap to return</small>
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <a className="scroll-cue" href="#memory-gallery">
        Scroll untuk melihat kenangan <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}
