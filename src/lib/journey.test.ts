import { describe, expect, it } from "vitest";
import {
  JOURNEY_VERSION,
  LAST_CHAPTER,
  createInitialJourneyState,
  journeyReducer,
  restoreJourneyState,
} from "./journey";

describe("journeyReducer", () => {
  it("advances and returns without leaving the chapter bounds", () => {
    let state = createInitialJourneyState();
    state = journeyReducer(state, { type: "NEXT" });
    expect(state.chapter).toBe(1);

    state = journeyReducer(state, { type: "BACK" });
    state = journeyReducer(state, { type: "BACK" });
    expect(state.chapter).toBe(0);
  });

  it("records interactions once", () => {
    let state = createInitialJourneyState();
    state = journeyReducer(state, { type: "COMPLETE", id: "flower-1" });
    state = journeyReducer(state, { type: "COMPLETE", id: "flower-1" });
    expect(state.completed).toEqual(["flower-1"]);
  });

  it("rejects persisted data from another schema version", () => {
    expect(
      restoreJourneyState(
        JSON.stringify({ version: JOURNEY_VERSION - 1, chapter: 8 }),
      ),
    ).toEqual(createInitialJourneyState());
  });

  it("clamps restored chapters to the seven-scene journey", () => {
    expect(
      restoreJourneyState(
        JSON.stringify({
          version: JOURNEY_VERSION,
          chapter: 99,
          completed: [],
        }),
      ).chapter,
    ).toBe(LAST_CHAPTER);
  });
});
