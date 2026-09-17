import { LAST_CHAPTER } from "@/lib/journey";

type PersistentControlsProps = {
  step: number;
  muted: boolean;
  musicStarted: boolean;
  onBack: () => void;
  onToggleMute: () => void;
};

export function PersistentControls({
  step,
  muted,
  musicStarted,
  onBack,
  onToggleMute,
}: PersistentControlsProps) {
  if (step === 0) return null;

  return (
    <nav className="journey-controls" aria-label="Kontrol perjalanan">
      <button onClick={onBack} aria-label="Kembali ke bagian sebelumnya">
        ←
      </button>
      <div
        className="journey-progress"
        aria-label={`Kemajuan ${step} dari ${LAST_CHAPTER}`}
      >
        <span style={{ width: `${(step / LAST_CHAPTER) * 100}%` }} />
      </div>
      <button
        onClick={onToggleMute}
        aria-label={muted ? "Nyalakan musik" : "Matikan musik"}
        title={musicStarted ? undefined : "Musik dimulai setelah tombol pembuka"}
      >
        {muted ? "♪̸" : "♫"}
      </button>
    </nav>
  );
}
