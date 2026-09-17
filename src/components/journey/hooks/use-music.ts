"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

const MUTE_KEY = "mylup-muted";
const MUTE_EVENT = "mylup-muted-change";

function getMutedSnapshot() {
  return window.localStorage.getItem(MUTE_KEY) === "true";
}

function subscribeMuted(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(MUTE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(MUTE_EVENT, onChange);
  };
}

export function useMusic(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const muted = useSyncExternalStore(subscribeMuted, getMutedSnapshot, () => false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = "metadata";
    audio.volume = 0.26;
    audio.muted = getMutedSnapshot();
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
  }, [src]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  const start = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      await audio.play();
      setStarted(true);
    } catch {
      setStarted(false);
    }
  }, []);

  const toggleMuted = useCallback(() => {
    window.localStorage.setItem(MUTE_KEY, String(!getMutedSnapshot()));
    window.dispatchEvent(new Event(MUTE_EVENT));
  }, []);

  return { muted, started, start, toggleMuted };
}
