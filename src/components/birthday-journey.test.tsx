import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { BirthdayJourney } from "./birthday-journey";

describe("BirthdayJourney", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("starts the journey and toggles a flower message", async () => {
    const user = userEvent.setup();
    render(<BirthdayJourney />);

    expect(
      screen.getByRole("heading", { name: /selamat ulang tahun/i }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /klik ini, sayang/i }),
    );

    expect(
      screen.getByRole("heading", { name: /our memory garden/i }),
    ).toBeInTheDocument();

    const flower = screen.getByRole("button", {
      name: /buka bunga: caramu tertawa/i,
    });
    await user.click(flower);
    expect(screen.getByText(/tawa yang bisa membuat/i)).toBeInTheDocument();

    await user.click(flower);
    expect(screen.queryByText(/tawa yang bisa membuat/i)).not.toBeInTheDocument();
  });

  it("has no automated accessibility violations on the opening scene", async () => {
    const { container } = render(<BirthdayJourney />);
    expect((await axe(container)).violations).toEqual([]);
  });

  it("restores the forgiveness scene with a disabled no choice", async () => {
    window.localStorage.setItem(
      "mylup-journey",
      JSON.stringify({ version: 2, chapter: 7, completed: [] }),
    );

    render(<BirthdayJourney />);

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /i’m really sorry/i }),
      ).toBeInTheDocument(),
    );

    expect(screen.getByRole("button", { name: /yes/i })).toBeEnabled();
    expect(screen.getByRole("button", { name: /no/i })).toBeDisabled();
  });

  it("reveals the hug and editable WhatsApp message after yes", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      "mylup-journey",
      JSON.stringify({ version: 2, chapter: 7, completed: [] }),
    );

    render(<BirthdayJourney />);
    await user.click(await screen.findByRole("button", { name: /yes/i }));

    expect(await screen.findByText(/no matter what/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /send a hug/i }));
    expect(screen.getByText(/hugs sent: 1/i)).toBeInTheDocument();

    const reply = screen.getByLabelText(/pesan untuk/i);
    await user.clear(reply);
    await user.type(reply, "Aku akan menjawab setelah siap.");

    expect(screen.getByRole("link", { name: /buka whatsapp/i })).toHaveAttribute(
      "href",
      "https://wa.me/?text=Aku%20akan%20menjawab%20setelah%20siap.",
    );
  });
});
