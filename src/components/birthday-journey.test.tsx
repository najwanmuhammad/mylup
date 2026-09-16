import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { BirthdayJourney } from "./birthday-journey";

describe("BirthdayJourney", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("starts the journey and reveals the interactive garden", async () => {
    const user = userEvent.setup();
    render(<BirthdayJourney />);

    expect(
      screen.getByRole("heading", { name: /selamat ulang tahun/i }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /mulai perjalanan kecil ini/i }),
    );

    expect(
      screen.getByRole("heading", { name: /taman kecil tentangmu/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /caramu tertawa/i }));
    expect(screen.getByText(/1 dari 6 bunga terbuka/i)).toBeInTheDocument();
  });

  it("has no automated accessibility violations on the opening scene", async () => {
    const { container } = render(<BirthdayJourney />);
    expect((await axe(container)).violations).toEqual([]);
  });

  it("restores the reconciliation chapter with three honest choices", async () => {
    window.localStorage.setItem(
      "mylup-journey",
      JSON.stringify({ version: 1, chapter: 10, completed: [] }),
    );

    render(<BirthdayJourney />);

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /bolehkah kita ngobrol lagi/i }),
      ).toBeInTheDocument(),
    );

    expect(screen.getAllByRole("button", { name: /pilih:/i })).toHaveLength(3);
  });

  it("lets the recipient edit a reply before opening WhatsApp", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      "mylup-journey",
      JSON.stringify({ version: 1, chapter: 10, completed: [] }),
    );

    render(<BirthdayJourney />);
    await user.click(
      await screen.findByRole("button", { name: /pilih: aku butuh waktu/i }),
    );

    const reply = screen.getByLabelText(/pesan balasan/i);
    await user.clear(reply);
    await user.type(reply, "Aku akan menjawab setelah siap.");

    expect(screen.getByRole("link", { name: /buka whatsapp/i })).toHaveAttribute(
      "href",
      "https://wa.me/?text=Aku%20akan%20menjawab%20setelah%20siap.",
    );
  });
});
