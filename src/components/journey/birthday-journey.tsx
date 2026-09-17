"use client";

import { useEffect, useReducer, useRef } from "react";
import { FloatingHearts } from "@/components/journey/effects/floating-hearts";
import { HeartCursor } from "@/components/journey/effects/heart-cursor";
import { useMusic } from "@/components/journey/hooks/use-music";
import { useReducedMotion } from "@/components/journey/hooks/use-reduced-motion";
import { ApologyScene } from "@/components/journey/scenes/apology-scene";
import { CatchLoveScene } from "@/components/journey/scenes/catch-love-scene";
import { ConstellationScene } from "@/components/journey/scenes/constellation-scene";
import { ForgivenessScene } from "@/components/journey/scenes/forgiveness-scene";
import { GardenScene } from "@/components/journey/scenes/garden-scene";
import { LetterScene } from "@/components/journey/scenes/letter-scene";
import { MemoriesScrollScene } from "@/components/journey/scenes/memories-scroll-scene";
import { OpeningScene } from "@/components/journey/scenes/opening-scene";
import { PersistentControls } from "@/components/journey/ui/persistent-controls";
import { giftContent } from "@/content/gift-content";
import {
  JOURNEY_VERSION,
  journeyReducer,
  restoreJourneyState,
} from "@/lib/journey";

const STORAGE_KEY = "mylup-journey";

export function BirthdayJourney() {
  const [state, dispatch] = useReducer(journeyReducer, undefined, () => ({
    version: JOURNEY_VERSION,
    chapter: 0,
    completed: [],
  }));
  const skipInitialPersist = useRef(true);
  const reducedMotion = useReducedMotion();
  const music = useMusic(giftContent.musicSrc);

  useEffect(() => {
    const restored = restoreJourneyState(window.localStorage.getItem(STORAGE_KEY));
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

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [state.chapter]);

  function go(type: "NEXT" | "BACK" | "RESTART") {
    dispatch({ type });
  }

  function complete(id: string) {
    dispatch({ type: "COMPLETE", id });
  }

  const shared = { reducedMotion };
  const scene = (() => {
    switch (state.chapter) {
      case 0:
        return (
          <OpeningScene
            {...shared}
            onStart={() => {
              void music.start();
              go("NEXT");
            }}
          />
        );
      case 1:
        return (
          <GardenScene
            {...shared}
            onInteraction={complete}
            onNext={() => go("NEXT")}
          />
        );
      case 2:
        return (
          <ConstellationScene
            {...shared}
            onInteraction={complete}
            onNext={() => go("NEXT")}
          />
        );
      case 3:
        return <CatchLoveScene {...shared} onNext={() => go("NEXT")} />;
      case 4:
        return <LetterScene {...shared} onNext={() => go("NEXT")} />;
      case 5:
        return <MemoriesScrollScene {...shared} onNext={() => go("NEXT")} />;
      case 6:
        return <ApologyScene {...shared} onNext={() => go("NEXT")} />;
      default:
        return <ForgivenessScene {...shared} onRestart={() => go("RESTART")} />;
    }
  })();

  return (
    <main
      className={`journey-shell journey-step-${state.chapter}`}
      aria-label="Perjalanan ulang tahun"
    >
      <FloatingHearts reducedMotion={reducedMotion} />
      <HeartCursor enabled={state.chapter === 3 || state.chapter === 7} />
      <PersistentControls
        step={state.chapter}
        muted={music.muted}
        musicStarted={music.started}
        onBack={() => go("BACK")}
        onToggleMute={music.toggleMuted}
      />
      {scene}
    </main>
  );
}
