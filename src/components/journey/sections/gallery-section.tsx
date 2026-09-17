"use client";

import Image from "next/image";
import { useState } from "react";
import { giftContent } from "@/content/gift-content";

export function GallerySection() {
  const [index, setIndex] = useState(0);
  const memory = giftContent.gallery[index];
  const hasPhoto =
    typeof memory.src === "string"
      ? memory.src.trim().length > 0
      : Boolean(memory.src);

  return (
    <section
      className="memory-section memory-section--gallery"
      id="memory-gallery"
    >
      <header className="memory-section__heading scroll-reveal">
        <h2>Tempat untuk cerita kita</h2>
      </header>

      <div className="polaroid-stage scroll-reveal" aria-live="polite">
        <article className={`polaroid polaroid--${(index % 3) + 1}`}>
          <div className="polaroid__photo">
            {hasPhoto ? (
              <Image
                key={memory.id}
                src={memory.src}
                alt={memory.alt}
                fill
                sizes="(max-width: 720px) 86vw, 480px"
                className="polaroid__image"
                priority={index === 0}
              />
            ) : (
              <div
                className={`memory-placeholder memory-placeholder--${index + 1}`}
              >
                <span aria-hidden="true">
                  {["☁", "✿", "☕", "♫", "☾", "♡"][index]}
                </span>
                <small>Tambahkan foto pribadi</small>
              </div>
            )}
          </div>
          <h3>{memory.title}</h3>
          <p>{memory.body}</p>
        </article>
      </div>
      <div
        className="gallery-controls scroll-reveal"
        aria-label="Navigasi galeri"
      >
        <button
          type="button"
          className="button button--soft"
          disabled={index === 0}
          onClick={() => setIndex((value) => Math.max(0, value - 1))}
        >
          ← Sebelumnya
        </button>
        <span>
          {index + 1} / {giftContent.gallery.length}
        </span>
        <button
          type="button"
          className="button button--soft"
          disabled={index === giftContent.gallery.length - 1}
          onClick={() =>
            setIndex((value) =>
              Math.min(giftContent.gallery.length - 1, value + 1),
            )
          }
        >
          Berikutnya →
        </button>
      </div>
      <a className="scroll-cue" href="#hope-wall">
        Scroll ke harapan untukmu <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}
