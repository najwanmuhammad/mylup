import { describe, expect, it } from "vitest";
import { buildWhatsAppUrl } from "./reply";

describe("buildWhatsAppUrl", () => {
  it("encodes a recipient-controlled reply without making a request", () => {
    expect(buildWhatsAppUrl("Aku butuh waktu & ruang.")).toBe(
      "https://wa.me/?text=Aku%20butuh%20waktu%20%26%20ruang.",
    );
  });
});
