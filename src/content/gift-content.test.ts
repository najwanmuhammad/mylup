import { describe, expect, it } from "vitest";
import { giftContent } from "./gift-content";

describe("giftContent", () => {
  it("contains a complete interactive journey", () => {
    expect(giftContent.garden).toHaveLength(6);
    expect(giftContent.constellation).toHaveLength(6);
    expect(giftContent.appreciation).toHaveLength(6);
    expect(giftContent.gallery.length).toBeGreaterThanOrEqual(6);
    expect(giftContent.gallery.length).toBeLessThanOrEqual(12);
  });

  it("provides meaningful labels and unique ids", () => {
    const items = [
      ...giftContent.garden,
      ...giftContent.constellation,
      ...giftContent.gallery,
    ];
    expect(new Set(items.map((item) => item.id)).size).toBe(items.length);
    expect(giftContent.gallery.every((item) => item.alt.trim().length > 8)).toBe(
      true,
    );
  });

  it("offers three non-coercive response choices", () => {
    expect(giftContent.replyOptions.map((option) => option.id)).toEqual([
      "talk",
      "time",
      "no",
    ]);
  });
});
