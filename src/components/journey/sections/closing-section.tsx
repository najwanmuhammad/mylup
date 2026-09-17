export function ClosingSection({ onRestart }: { onRestart: () => void }) {
  return (
    <section className="after-section closing-section" id="closing">
      <header>
        <h2>Terima kasih sudah sampai di sini</h2>
      </header>
      <div className="closing-card">
        <span className="closing-card__symbol" aria-hidden="true">
          ✨
        </span>
        <p className="closing-wish">
          Selamat ulang tahun. Semoga tahun ini kamu sukses.
        </p>
      </div>
      <button type="button" className="button button--soft" onClick={onRestart}>
        Putar perjalanan dari awal
      </button>
    </section>
  );
}
