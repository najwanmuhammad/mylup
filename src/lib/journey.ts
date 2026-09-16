export const JOURNEY_VERSION = 1;
export const LAST_CHAPTER = 11;

export type JourneyState = {
  version: number;
  chapter: number;
  completed: string[];
};

export type JourneyAction =
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "COMPLETE"; id: string }
  | { type: "GO_TO"; chapter: number }
  | { type: "RESTART" };

export const createInitialJourneyState = (): JourneyState => ({
  version: JOURNEY_VERSION,
  chapter: 0,
  completed: [],
});

export function journeyReducer(
  state: JourneyState,
  action: JourneyAction,
): JourneyState {
  switch (action.type) {
    case "NEXT":
      return { ...state, chapter: Math.min(LAST_CHAPTER, state.chapter + 1) };
    case "BACK":
      return { ...state, chapter: Math.max(0, state.chapter - 1) };
    case "GO_TO":
      return {
        ...state,
        chapter: Math.max(0, Math.min(LAST_CHAPTER, action.chapter)),
      };
    case "COMPLETE":
      return state.completed.includes(action.id)
        ? state
        : { ...state, completed: [...state.completed, action.id] };
    case "RESTART":
      return createInitialJourneyState();
  }
}

export function restoreJourneyState(value: string | null): JourneyState {
  if (!value) return createInitialJourneyState();

  try {
    const parsed: unknown = JSON.parse(value);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("version" in parsed) ||
      parsed.version !== JOURNEY_VERSION ||
      !("chapter" in parsed) ||
      typeof parsed.chapter !== "number" ||
      !("completed" in parsed) ||
      !Array.isArray(parsed.completed)
    ) {
      return createInitialJourneyState();
    }

    return {
      version: JOURNEY_VERSION,
      chapter: Math.max(0, Math.min(LAST_CHAPTER, parsed.chapter)),
      completed: parsed.completed.filter(
        (entry): entry is string => typeof entry === "string",
      ),
    };
  } catch {
    return createInitialJourneyState();
  }
}
