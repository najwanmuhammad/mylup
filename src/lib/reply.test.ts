import { describe, expect, it } from "vitest";
import { buildWhatsAppUrl } from "./reply";

describe("buildWhatsAppUrl", () => {
  it("encodes a recipient-controlled reply without making a request", () => {
    expect(buildWhatsAppUrl("Aku butuh waktu & ruang.")).toBe(
      "https://wa.me/?text=Aku%20butuh%20waktu%20%26%20ruang.",
    );
  });

  it("sanitizes an optional international phone number", () => {
    expect(buildWhatsAppUrl("Halo 💗", "+62 812-3456-7890")).toBe(
      "https://wa.me/6281234567890?text=Halo%20%F0%9F%92%97",
    );
  });
});
