"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  giftContent,
  type ReplyOption,
  type StoryItem,
} from "@/content/gift-content";
import {
  JOURNEY_VERSION,
  LAST_CHAPTER,
  journeyReducer,
  restoreJourneyState,
} from "@/lib/journey";
import { buildWhatsAppUrl } from "@/lib/reply";

const STORAGE_KEY = "mylup-journey";
const PREFERENCE_KEY = "mylup-preferences";

type Preferences = { muted: boolean; reducedMotion: boolean };
const DEFAULT_PREFERENCES: Preferences = { muted: false, reducedMotion: false };
const DEFAULT_PREFERENCES_SNAPSHOT = JSON.stringify(DEFAULT_PREFERENCES);

function readPreferencesSnapshot() {
  const saved = window.localStorage.getItem(PREFERENCE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as Partial<Preferences>;
      return JSON.stringify({
        muted: parsed.muted === true,
        reducedMotion: parsed.reducedMotion === true,
      });
    } catch {
      window.localStorage.removeItem(PREFERENCE_KEY);
    }
  }

  return JSON.stringify({
    muted: false,
    reducedMotion:
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
  });
}

function subscribePreferences(onChange: () => void) {
  const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  window.addEventListener("storage", onChange);
  window.addEventListener("mylup-preferences-change", onChange);
  media?.addEventListener("change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("mylup-preferences-change", onChange);
    media?.removeEventListener("change", onChange);
  };
}

const chapterNames = [
  "Pembuka",
  "Taman",
  "Langit",
  "Permainan",
  "Pintu kecil",
  "Kartu",
  "Kenangan",
  "Harapan",
  "Surat",
  "Maaf",
  "Percakapan",
  "Penutup",
] as const;

function useAmbientSound(muted: boolean) {
  const contextRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const start = useCallback(() => {
    if (typeof window === "undefined" || !("AudioContext" in window)) return;
    if (contextRef.current) {
      void contextRef.current.resume();
      return;
    }

    const context = new AudioContext();
    const master = context.createGain();
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 520;
    master.gain.value = muted ? 0 : 0.025;
    master.connect(filter);
    filter.connect(context.destination);

    [196, 293.66, 392].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const noteGain = context.createGain();
      oscillator.type = index === 0 ? "sine" : "triangle";
      oscillator.frequency.value = frequency;
      noteGain.gain.value = index === 0 ? 0.5 : 0.18;
      oscillator.connect(noteGain);
      noteGain.connect(master);
      oscillator.start();
    });

    contextRef.current = context;
    gainRef.current = master;
  }, [muted]);

  const chime = useCallback(() => {
    const context = contextRef.current;
    if (!context || muted) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(659.25, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      987.77,
      context.currentTime + 0.25,
    );
    gain.gain.setValueAtTime(0.06, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.45);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.46);
  }, [muted]);

  useEffect(() => {
    const gain = gainRef.current;
    const context = contextRef.current;
    if (!gain || !context) return;
    gain.gain.setTargetAtTime(muted ? 0 : 0.025, context.currentTime, 0.08);
  }, [muted]);

  useEffect(
    () => () => {
      if (contextRef.current) void contextRef.current.close();
    },
    [],
  );

  return { start, chime };
}

function Scene({
  eyebrow,
  title,
  children,
  tone = "light",
  reducedMotion,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  tone?: "light" | "night" | "quiet";
  reducedMotion: boolean;
}) {
  return (
    <motion.section
      className={`scene scene--${tone}`}
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -18 }}
      transition={{ duration: reducedMotion ? 0.12 : 0.48, ease: "easeOut" }}
    >
      <div className="scene__copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      {children}
    </motion.section>
  );
}

function PrimaryButton({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button className={`button button--primary ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}

function StoryModal({
  item,
  onClose,
}: {
  item: StoryItem;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => closeRef.current?.focus(), []);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="story-modal-title"
        className="story-modal"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <span aria-hidden="true" className="story-modal__sparkle">
          ✦
        </span>
        <h2 id="story-modal-title">{item.title}</h2>
        <p>{item.body}</p>
        <button
          ref={closeRef}
          className="button button--soft"
          onClick={onClose}
        >
          Simpan di hati
        </button>
      </motion.div>
    </div>
  );
}

function OpeningScene({
  onStart,
  reducedMotion,
}: {
  onStart: () => void;
  reducedMotion: boolean;
}) {
  return (
    <Scene
      eyebrow={giftContent.intro.eyebrow}
      title={giftContent.intro.title}
      reducedMotion={reducedMotion}
    >
      <div className="opening-grid">
        <motion.div
          className="mascot-halo"
          animate={
            reducedMotion ? undefined : { y: [0, -10, 0], rotate: [-1, 1, -1] }
          }
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/assets/lumi-mascot.png"
            alt="Lumi, teman kecil pembawa hadiah ulang tahun"
            width={440}
            height={440}
            priority
          />
        </motion.div>
        <div className="opening-note">
          <p>{giftContent.intro.body}</p>
          <p className="small-note">
            Siapkan waktu sekitar 5 menit. Tidak ada jawaban yang harus kamu
            berikan.
          </p>
          <PrimaryButton onClick={onStart}>
            Mulai perjalanan kecil ini <span aria-hidden="true">✦</span>
          </PrimaryButton>
        </div>
      </div>
    </Scene>
  );
}

function GardenScene({
  opened,
  onOpen,
  onNext,
  reducedMotion,
}: {
  opened: string[];
  onOpen: (item: StoryItem) => void;
  onNext: () => void;
  reducedMotion: boolean;
}) {
  const count = giftContent.garden.filter((item) =>
    opened.includes(item.id),
  ).length;
  return (
    <Scene
      eyebrow="Bab 1 · Memory garden"
      title="Taman kecil tentangmu"
      reducedMotion={reducedMotion}
    >
      <p className="lede">
        Sentuh setiap bunga. Di baliknya ada satu hal yang layak dirayakan.
      </p>
      <div className="garden" aria-label="Enam bunga berisi pesan">
        {giftContent.garden.map((item, index) => (
          <motion.button
            key={item.id}
            className={`flower ${opened.includes(item.id) ? "flower--opened" : ""}`}
            aria-label={item.title}
            onClick={() => onOpen(item)}
            whileHover={
              reducedMotion ? undefined : { y: -6, rotate: index % 2 ? 2 : -2 }
            }
            whileTap={{ scale: 0.96 }}
          >
            <span className="flower__bloom" aria-hidden="true">
              ✿
            </span>
            <span>{item.title}</span>
          </motion.button>
        ))}
      </div>
      <p className="progress-copy" aria-live="polite">
        {count} dari 6 bunga terbuka
      </p>
      <PrimaryButton onClick={onNext}>
        {count === 6 ? "Bawa semuanya ke langit" : "Lanjut kapan pun kamu siap"}
      </PrimaryButton>
    </Scene>
  );
}

function ConstellationScene({
  opened,
  onOpen,
  onNext,
  reducedMotion,
}: {
  opened: string[];
  onOpen: (item: StoryItem) => void;
  onNext: () => void;
  reducedMotion: boolean;
}) {
  return (
    <Scene
      eyebrow="Bab 2 · Langit kenangan"
      title="Ada cerita di setiap bintang"
      tone="night"
      reducedMotion={reducedMotion}
    >
      <p className="lede lede--night">
        Tidak semua momen besar. Beberapa hanya tinggal karena rasanya hangat.
      </p>
      <div className="constellation" aria-label="Konstelasi enam kenangan">
        <svg
          className="constellation__lines"
          viewBox="0 0 100 62"
          aria-hidden="true"
        >
          <motion.path
            d="M12 40 L28 18 L46 35 L61 13 L76 31 L90 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.7"
            initial={reducedMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: opened.length / 6 }}
            transition={{ duration: 0.8 }}
          />
        </svg>
        {giftContent.constellation.map((item, index) => (
          <button
            key={item.id}
            className={`star star--${index + 1} ${opened.includes(item.id) ? "star--lit" : ""}`}
            aria-label={`Buka bintang: ${item.title}`}
            onClick={() => onOpen(item)}
          >
            <span aria-hidden="true">✦</span>
            <span className="sr-only">{item.title}</span>
          </button>
        ))}
      </div>
      <PrimaryButton onClick={onNext}>
        Tangkap sedikit kebahagiaan
      </PrimaryButton>
    </Scene>
  );
}

function CollectScene({
  onNext,
  reducedMotion,
}: {
  onNext: () => void;
  reducedMotion: boolean;
}) {
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(15);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || seconds <= 0) return;
    const timer = window.setInterval(
      () => setSeconds((value) => value - 1),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [running, seconds]);

  const finished = seconds <= 0;
  return (
    <Scene
      eyebrow="Bab 3 · Mini game"
      title="Tangkap bahagianya"
      reducedMotion={reducedMotion}
    >
      <p className="lede">
        Ini permainan tanpa kalah. Kumpulkan sebanyak yang kamu mau—atau lewati.
      </p>
      <div className="game-card">
        <div className="game-stats" aria-live="polite">
          <span>
            Waktu <strong>{seconds}s</strong>
          </span>
          <span>
            Terkumpul <strong>{score}</strong>
          </span>
        </div>
        {!running ? (
          <PrimaryButton onClick={() => setRunning(true)}>
            Mulai 15 detik
          </PrimaryButton>
        ) : finished ? (
          <div className="game-finish">
            <span aria-hidden="true">🎁</span>
            <p>
              {score > 8
                ? "Banyak sekali cahaya yang kamu tangkap."
                : "Sedikit atau banyak, semuanya tetap berarti."}
            </p>
          </div>
        ) : (
          <div
            className="collect-grid"
            aria-label="Benda-benda ulang tahun untuk dikumpulkan"
          >
            {["💫", "🎀", "💛", "🧁", "✨", "🌟", "🎈", "💗", "🎁"].map(
              (symbol, index) => (
                <motion.button
                  key={`${symbol}-${index}`}
                  aria-label={`Kumpulkan ${symbol}`}
                  onClick={() => setScore((value) => value + 1)}
                  animate={reducedMotion ? undefined : { y: [0, -6, 0] }}
                  transition={{
                    delay: index * 0.08,
                    duration: 1.2,
                    repeat: Infinity,
                  }}
                >
                  {symbol}
                </motion.button>
              ),
            )}
          </div>
        )}
      </div>
      <div className="button-row">
        <button className="button button--ghost" onClick={onNext}>
          Lewati permainan
        </button>
        {(finished || score > 0) && (
          <PrimaryButton onClick={onNext}>Buka hadiah berikutnya</PrimaryButton>
        )}
      </div>
    </Scene>
  );
}

function TransitionScene({
  onNext,
  reducedMotion,
}: {
  onNext: () => void;
  reducedMotion: boolean;
}) {
  return (
    <Scene
      eyebrow="Sebuah pintu kecil"
      title="Dari perjalanan, menuju ruang kenangan"
      reducedMotion={reducedMotion}
    >
      <div className="gift-transition">
        <motion.div
          className="gift-box"
          animate={
            reducedMotion
              ? undefined
              : { rotate: [-2, 2, -2], scale: [1, 1.04, 1] }
          }
          transition={{ duration: 1.8, repeat: Infinity }}
          aria-hidden="true"
        >
          🎁
        </motion.div>
        <p>Semua cahaya tadi menemukan tempatnya di sini.</p>
      </div>
      <PrimaryButton onClick={onNext}>Masuk ke ruang kenangan</PrimaryButton>
    </Scene>
  );
}

function AppreciationScene({
  onNext,
  reducedMotion,
}: {
  onNext: () => void;
  reducedMotion: boolean;
}) {
  const [flipped, setFlipped] = useState<string[]>([]);
  const toggle = (id: string) =>
    setFlipped((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
    );
  return (
    <Scene
      eyebrow="Bab 5 · Kartu apresiasi"
      title="Hal-hal kecil yang kusukai"
      reducedMotion={reducedMotion}
    >
      <p className="lede">
        Buka dalam urutan apa pun. Tidak ada jawaban yang tersembunyi di
        baliknya—hanya rasa terima kasih.
      </p>
      <div className="flip-grid">
        {giftContent.appreciation.map((item) => {
          const isOpen = flipped.includes(item.id);
          return (
            <button
              key={item.id}
              className={`flip-card ${isOpen ? "flip-card--open" : ""}`}
              aria-expanded={isOpen}
              onClick={() => toggle(item.id)}
            >
              <span className="flip-card__number" aria-hidden="true">
                {item.id.slice(-1)}
              </span>
              <strong>{isOpen ? item.body : item.title}</strong>
              <small>
                {isOpen ? "Sentuh untuk menutup" : "Sentuh untuk membuka"}
              </small>
            </button>
          );
        })}
      </div>
      <PrimaryButton onClick={onNext}>Lihat ruang kenangan</PrimaryButton>
    </Scene>
  );
}

function GalleryScene({
  onNext,
  reducedMotion,
}: {
  onNext: () => void;
  reducedMotion: boolean;
}) {
  const [index, setIndex] = useState(0);
  const memory = giftContent.gallery[index];
  return (
    <Scene
      eyebrow="Bab 6 · Polaroid memories"
      title="Tempat untuk cerita kalian"
      reducedMotion={reducedMotion}
    >
      <p className="lede">
        Enam bingkai ini siap diganti dengan foto dan caption pribadi sebelum
        link dikirim.
      </p>
      <div className="polaroid-stage">
        <motion.article
          key={memory.id}
          className="polaroid"
          initial={reducedMotion ? false : { opacity: 0, rotate: -3, x: 18 }}
          animate={{ opacity: 1, rotate: index % 2 ? 2 : -2, x: 0 }}
        >
          <div
            className={`memory-placeholder memory-placeholder--${index + 1}`}
            role="img"
            aria-label={memory.alt}
          >
            <span aria-hidden="true">
              {["☁", "✿", "☕", "♫", "☾", "♡"][index]}
            </span>
            <small>Tambahkan foto pribadi</small>
          </div>
          <h2>{memory.title}</h2>
          <p>{memory.body}</p>
        </motion.article>
      </div>
      <div className="gallery-controls" aria-label="Navigasi galeri">
        <button
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
      <PrimaryButton onClick={onNext}>Baca harapan untukmu</PrimaryButton>
    </Scene>
  );
}

function WishesScene({
  onNext,
  reducedMotion,
}: {
  onNext: () => void;
  reducedMotion: boolean;
}) {
  const [secret, setSecret] = useState(false);
  return (
    <Scene
      eyebrow="Bab 7 · Hope wall"
      title="Harapan untuk tahun barumu"
      reducedMotion={reducedMotion}
    >
      <div className="wish-wall">
        {giftContent.wishes.map((wish, index) => (
          <article
            key={wish.id}
            className={`wish-note wish-note--${index + 1}`}
          >
            <span aria-hidden="true">{["✦", "☀", "♡", "☾"][index]}</span>
            <h2>{wish.title}</h2>
            <p>{wish.body}</p>
          </article>
        ))}
      </div>
      <button
        className="secret-note"
        aria-expanded={secret}
        onClick={() => setSecret((value) => !value)}
      >
        {secret
          ? "Dan satu lagi: semoga kamu selalu merasa cukup, bahkan pada hari saat kamu tidak produktif."
          : "Buka satu catatan rahasia"}
      </button>
      <PrimaryButton onClick={onNext}>Ada sebuah surat untukmu</PrimaryButton>
    </Scene>
  );
}

function LetterScene({
  onNext,
  reducedMotion,
}: {
  onNext: () => void;
  reducedMotion: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Scene
      eyebrow="Bab 8 · Surat ulang tahun"
      title="Untuk kamu, di hari ini"
      tone="quiet"
      reducedMotion={reducedMotion}
    >
      {!open ? (
        <button
          className="envelope"
          onClick={() => setOpen(true)}
          aria-label="Buka surat ulang tahun"
        >
          <span className="envelope__seal" aria-hidden="true">
            ♡
          </span>
          <strong>Buka perlahan</strong>
        </button>
      ) : (
        <motion.article
          className="letter-paper"
          initial={reducedMotion ? false : { opacity: 0, y: 40, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
        >
          <p className="letter-salutation">
            Untuk {giftContent.recipientName},
          </p>
          {giftContent.birthdayLetter.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="letter-signature">— {giftContent.senderName}</p>
        </motion.article>
      )}
      {open && (
        <PrimaryButton onClick={onNext}>
          Lanjut ke satu hal yang perlu kusampaikan
        </PrimaryButton>
      )}
    </Scene>
  );
}

function ApologyScene({
  onNext,
  reducedMotion,
}: {
  onNext: () => void;
  reducedMotion: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Scene
      eyebrow="Bab 9 · Dengan jujur"
      title="Aku ingin meminta maaf"
      tone="quiet"
      reducedMotion={reducedMotion}
    >
      <div className="apology-layout">
        <div className="apology-mascot" aria-hidden="true">
          <Image
            src="/assets/lumi-mascot.png"
            alt=""
            width={220}
            height={220}
          />
        </div>
        <div className="apology-card">
          {(expanded
            ? giftContent.apology
            : giftContent.apology.slice(0, 2)
          ).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {!expanded && (
            <button className="text-button" onClick={() => setExpanded(true)}>
              Baca surat maaf lengkap
            </button>
          )}
          {expanded && (
            <div className="change-list">
              <h2>Yang sedang kuubah dalam tindakan</h2>
              <ul>
                {giftContent.changes.map((change) => (
                  <li key={change}>{change}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {expanded && (
        <PrimaryButton onClick={onNext}>
          Lanjut tanpa kewajiban menjawab
        </PrimaryButton>
      )}
    </Scene>
  );
}

function ReplyComposer({
  option,
  onDone,
}: {
  option: ReplyOption;
  onDone: () => void;
}) {
  const [message, setMessage] = useState(option.message);
  const [copied, setCopied] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => headingRef.current?.focus(), [option.id]);

  async function copyReply() {
    if (navigator.clipboard) await navigator.clipboard.writeText(message);
    setCopied(true);
  }

  return (
    <motion.div
      className="reply-composer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 ref={headingRef} tabIndex={-1}>
        Pilihanmu akan dihormati
      </h2>
      <p>
        Kamu boleh mengubah pesan ini, mengirimnya nanti, atau tidak mengirim
        apa pun.
      </p>
      <label htmlFor="reply-message">Pesan balasan</label>
      <textarea
        id="reply-message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        rows={4}
      />
      <div className="button-row">
        <button className="button button--soft" onClick={copyReply}>
          {copied ? "Tersalin" : "Salin pesan"}
        </button>
        <a
          className="button button--primary"
          href={buildWhatsAppUrl(message)}
          target="_blank"
          rel="noreferrer"
        >
          Buka WhatsApp
        </a>
      </div>
      <button className="text-button" onClick={onDone}>
        Lihat penutup tanpa mengirim pesan
      </button>
    </motion.div>
  );
}

function ReconnectScene({
  selected,
  onSelect,
  onNext,
  reducedMotion,
}: {
  selected: ReplyOption | null;
  onSelect: (option: ReplyOption) => void;
  onNext: () => void;
  reducedMotion: boolean;
}) {
  return (
    <Scene
      eyebrow="Bab 10 · Ruang untuk memilih"
      title="Bolehkah kita ngobrol lagi?"
      tone="quiet"
      reducedMotion={reducedMotion}
    >
      <p className="reconnect-question">{giftContent.reconnectQuestion}</p>
      <p className="small-note">
        Tidak ada pilihan yang salah. Ketiganya ditampilkan dengan bobot yang
        sama.
      </p>
      <div className="choice-grid">
        {giftContent.replyOptions.map((option) => (
          <button
            key={option.id}
            className={`choice-card ${selected?.id === option.id ? "choice-card--selected" : ""}`}
            aria-label={`Pilih: ${option.title}`}
            onClick={() => onSelect(option)}
          >
            <strong>{option.title}</strong>
            <span>{option.body}</span>
          </button>
        ))}
      </div>
      {selected && (
        <ReplyComposer key={selected.id} option={selected} onDone={onNext} />
      )}
    </Scene>
  );
}

function ClosingScene({
  selected,
  onRestart,
  reducedMotion,
}: {
  selected: ReplyOption | null;
  onRestart: () => void;
  reducedMotion: boolean;
}) {
  const positive = selected?.id === "talk";
  return (
    <Scene
      eyebrow="Penutup"
      title="Terima kasih sudah sampai di sini"
      tone="night"
      reducedMotion={reducedMotion}
    >
      <div className="closing-card">
        <span className="closing-card__symbol" aria-hidden="true">
          {positive ? "✨" : "🌙"}
        </span>
        <p>
          {positive
            ? "Aku akan menjaga percakapan itu tetap pelan, jujur, dan tanpa memaksa hasil apa pun."
            : "Pilihan dan waktumu tetap penting. Tidak ada jawaban yang akan mengurangi semua hal baik yang pantas kamu terima hari ini."}
        </p>
        <p className="closing-wish">
          Selamat ulang tahun. Semoga tahun ini lembut kepadamu.
        </p>
      </div>
      <button className="button button--soft" onClick={onRestart}>
        Putar perjalanan dari awal
      </button>
    </Scene>
  );
}

function PersistentControls({
  chapter,
  muted,
  reducedMotion,
  onBack,
  onToggleMute,
  onToggleMotion,
}: {
  chapter: number;
  muted: boolean;
  reducedMotion: boolean;
  onBack: () => void;
  onToggleMute: () => void;
  onToggleMotion: () => void;
}) {
  if (chapter === 0) return null;
  return (
    <nav className="journey-controls" aria-label="Kontrol perjalanan">
      <button
        onClick={onBack}
        disabled={chapter === 0}
        aria-label="Kembali ke bab sebelumnya"
      >
        ←
      </button>
      <div
        className="journey-progress"
        aria-label={`Bab ${chapter} dari ${LAST_CHAPTER}`}
      >
        <span style={{ width: `${(chapter / LAST_CHAPTER) * 100}%` }} />
      </div>
      <span className="chapter-label">{chapterNames[chapter]}</span>
      <button
        onClick={onToggleMute}
        aria-label={muted ? "Nyalakan musik" : "Matikan musik"}
      >
        {muted ? "♪̸" : "♫"}
      </button>
      <button
        onClick={onToggleMotion}
        aria-label={reducedMotion ? "Nyalakan animasi" : "Kurangi animasi"}
      >
        {reducedMotion ? "◌" : "✦"}
      </button>
    </nav>
  );
}

export function BirthdayJourney() {
  const [state, dispatch] = useReducer(journeyReducer, undefined, () => ({
    version: JOURNEY_VERSION,
    chapter: 0,
    completed: [],
  }));
  const skipInitialPersist = useRef(true);
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);
  const [selectedReply, setSelectedReply] = useState<ReplyOption | null>(null);
  const preferenceSnapshot = useSyncExternalStore(
    subscribePreferences,
    readPreferencesSnapshot,
    () => DEFAULT_PREFERENCES_SNAPSHOT,
  );
  const preferences = JSON.parse(preferenceSnapshot) as Preferences;
  const { start: startSound, chime } = useAmbientSound(preferences.muted);

  useEffect(() => {
    const restored = restoreJourneyState(
      window.localStorage.getItem(STORAGE_KEY),
    );
    dispatch({ type: "GO_TO", chapter: restored.chapter });
    restored.completed.forEach((id) => dispatch({ type: "COMPLETE", id }));
  }, []);

  useEffect(() => {
    if (skipInitialPersist.current) {
      skipInitialPersist.current = false;
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const openStory = (item: StoryItem) => {
    dispatch({ type: "COMPLETE", id: item.id });
    setActiveStory(item);
    chime();
  };
  const next = () => dispatch({ type: "NEXT" });
  const back = () => dispatch({ type: "BACK" });
  const restart = () => {
    setSelectedReply(null);
    dispatch({ type: "RESTART" });
  };
  const togglePreference = (key: keyof Preferences) => {
    window.localStorage.setItem(
      PREFERENCE_KEY,
      JSON.stringify({ ...preferences, [key]: !preferences[key] }),
    );
    window.dispatchEvent(new Event("mylup-preferences-change"));
  };

  const scene = (() => {
    const shared = { reducedMotion: preferences.reducedMotion };
    switch (state.chapter) {
      case 0:
        return (
          <OpeningScene
            {...shared}
            onStart={() => {
              startSound();
              next();
            }}
          />
        );
      case 1:
        return (
          <GardenScene
            {...shared}
            opened={state.completed}
            onOpen={openStory}
            onNext={next}
          />
        );
      case 2:
        return (
          <ConstellationScene
            {...shared}
            opened={state.completed}
            onOpen={openStory}
            onNext={next}
          />
        );
      case 3:
        return <CollectScene {...shared} onNext={next} />;
      case 4:
        return <TransitionScene {...shared} onNext={next} />;
      case 5:
        return <AppreciationScene {...shared} onNext={next} />;
      case 6:
        return <GalleryScene {...shared} onNext={next} />;
      case 7:
        return <WishesScene {...shared} onNext={next} />;
      case 8:
        return <LetterScene {...shared} onNext={next} />;
      case 9:
        return <ApologyScene {...shared} onNext={next} />;
      case 10:
        return (
          <ReconnectScene
            {...shared}
            selected={selectedReply}
            onSelect={setSelectedReply}
            onNext={next}
          />
        );
      default:
        return (
          <ClosingScene
            {...shared}
            selected={selectedReply}
            onRestart={restart}
          />
        );
    }
  })();

  return (
    <main
      className={`journey-shell chapter-${state.chapter}`}
      aria-label="Perjalanan ulang tahun"
    >
      <div className="ambient ambient--one" aria-hidden="true" />
      <div className="ambient ambient--two" aria-hidden="true" />
      <PersistentControls
        chapter={state.chapter}
        muted={preferences.muted}
        reducedMotion={preferences.reducedMotion}
        onBack={back}
        onToggleMute={() => togglePreference("muted")}
        onToggleMotion={() => togglePreference("reducedMotion")}
      />
      <AnimatePresence mode="wait">{scene}</AnimatePresence>
      <AnimatePresence>
        {activeStory && (
          <StoryModal item={activeStory} onClose={() => setActiveStory(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}
