"use client";

import { useState } from "react";
import { giftContent } from "@/content/gift-content";
import { buildWhatsAppUrl } from "@/lib/reply";

export function WhatsAppSection() {
  const [message, setMessage] = useState(giftContent.whatsappMessage);

  return (
    <section className="after-section whatsapp-section" id="send-message">
      <div className="message-card">
        <span className="message-card__icon" aria-hidden="true">
          💌
        </span>
        <h2>Kirim pesan kalau kamu mau</h2>
        <p>Kamu bebas mengubah isi pesan ini sebelum membuka WhatsApp.</p>
        <label htmlFor="reply-message">
          Pesan untuk {giftContent.senderName}
        </label>
        <textarea
          id="reply-message"
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <a
          className="button button--primary"
          href={buildWhatsAppUrl(message, giftContent.whatsappNumber)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Kirim Ke Najwan Sayang
        </a>
        {!giftContent.whatsappNumber && (
          <small>
            Nomor tujuan belum diisi, jadi WhatsApp akan meminta kamu memilih
            penerima.
          </small>
        )}
      </div>
      <a className="scroll-cue" href="#closing">
        Lihat penutup ↓
      </a>
    </section>
  );
}
