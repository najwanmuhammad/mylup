import { expect, test } from "@playwright/test";

test("completes the redesigned birthday journey", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /selamat ulang tahun/i }),
  ).toBeVisible();
  await expect(page.getByText(/bab\s+\d/i)).toHaveCount(0);

  await page.getByRole("button", { name: /klik ini, sayang/i }).click();
  const firstFlower = page.getByRole("button", {
    name: /buka bunga: caramu tertawa/i,
  });
  await firstFlower.click();
  await expect(page.getByText(/tawa yang bisa membuat/i)).toBeVisible();
  await firstFlower.click();
  await expect(page.getByText(/tawa yang bisa membuat/i)).toHaveCount(0);
  await page.getByRole("button", { name: /^continue$/i }).click();

  const stars = page.getByRole("button", { name: /hubungkan bintang/i });
  await expect(stars).toHaveCount(10);
  for (let index = 0; index < 10; index += 1) {
    await stars.nth(index).click();
  }
  await expect(page.getByText(/found its place in my heart/i)).toBeVisible();
  await page.getByRole("button", { name: /^continue$/i }).click();

  const hearts = page.getByRole("button", { name: /tangkap hati/i });
  for (let index = 0; index < 3; index += 1) {
    await hearts.nth(index).click();
  }
  await expect(page.getByText(/hearts collected:/i)).toContainText("3");
  await page.getByRole("button", { name: /^continue$/i }).click();

  await page.getByRole("button", { name: /buka surat ulang tahun/i }).click();
  await expect(page.getByText(/dear firna/i)).toBeVisible();
  await page.getByRole("button", { name: /^continue$/i }).click();

  const flashcard = page.locator(".flashcard").first();
  await flashcard.click();
  await expect(flashcard).toHaveAttribute("aria-pressed", "true");

  const nextPhoto = page.getByRole("button", { name: /berikutnya/i });
  await nextPhoto.scrollIntoViewIfNeeded();
  await nextPhoto.click();
  await expect(page.getByText("2 / 6")).toBeVisible();

  const wish = page.getByRole("button", { name: /untuk harimu/i });
  await wish.scrollIntoViewIfNeeded();
  await wish.click();
  await expect(wish).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: /^continue$/i }).click();

  await expect(
    page.getByRole("heading", { name: /aku ingin meminta maaf/i }),
  ).toBeVisible();
  await page.getByRole("button", { name: /baca surat maaf lengkap/i }).click();
  await page.getByRole("button", { name: /^lanjut$/i }).click();

  await expect(page.getByRole("button", { name: /^no/i })).toBeDisabled();
  await page.getByRole("button", { name: /^yes/i }).click();
  await expect(page.getByText(/no matter what/i)).toBeVisible();

  await page.getByRole("button", { name: /send a hug/i }).click();
  await expect(page.getByText(/hugs sent: 1/i)).toBeVisible();

  const reply = page.getByLabel(/pesan untuk/i);
  await reply.scrollIntoViewIfNeeded();
  await reply.fill("Aku akan menjawab setelah siap.");
  await expect(page.getByRole("link", { name: /buka whatsapp/i })).toHaveAttribute(
    "href",
    "https://wa.me/?text=Aku%20akan%20menjawab%20setelah%20siap.",
  );

  const closing = page.getByRole("heading", {
    name: /terima kasih sudah sampai di sini/i,
  });
  await closing.scrollIntoViewIfNeeded();
  await expect(closing).toBeVisible();
});

test("restores the combined smooth-scroll memory page", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "mylup-journey",
      JSON.stringify({ version: 2, chapter: 5, completed: [] }),
    );
  });
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /hal-hal kecil yang kusukai/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /tempat untuk cerita kita/i }),
  ).toBeAttached();
  await expect(
    page.getByRole("heading", { name: /harapan untuk tahun barumu/i }),
  ).toBeAttached();
});
