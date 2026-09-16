import { expect, test } from "@playwright/test";

test("completes the birthday journey and preserves an honest response", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /selamat ulang tahun/i })).toBeVisible();

  await page.getByRole("button", { name: /mulai perjalanan kecil ini/i }).click();
  await page.getByRole("button", { name: /lanjut kapan pun/i }).click();
  await page.getByRole("button", { name: /tangkap sedikit kebahagiaan/i }).click();
  await page.getByRole("button", { name: /lewati permainan/i }).click();
  await page.getByRole("button", { name: /masuk ke ruang kenangan/i }).click();
  await page.getByRole("button", { name: /lihat ruang kenangan/i }).click();
  await page.getByRole("button", { name: /baca harapan untukmu/i }).click();
  await page.getByRole("button", { name: /ada sebuah surat untukmu/i }).click();
  await page.getByRole("button", { name: /buka surat ulang tahun/i }).click();
  await page.getByRole("button", { name: /lanjut ke satu hal/i }).click();
  await page.getByRole("button", { name: /baca surat maaf lengkap/i }).click();
  await page.getByRole("button", { name: /lanjut tanpa kewajiban/i }).click();

  await expect(page.getByRole("heading", { name: /bolehkah kita ngobrol lagi/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /pilih:/i })).toHaveCount(3);
  await page.getByRole("button", { name: /pilih: aku butuh waktu/i }).click();
  await page.getByLabel(/pesan balasan/i).fill("Aku akan menjawab setelah siap.");
  await expect(page.getByRole("link", { name: /buka whatsapp/i })).toHaveAttribute(
    "href",
    "https://wa.me/?text=Aku%20akan%20menjawab%20setelah%20siap.",
  );

  await page.getByRole("button", { name: /lihat penutup tanpa mengirim/i }).click();
  await expect(page.getByRole("heading", { name: /terima kasih sudah sampai/i })).toBeVisible();
});

test("restores the most recently visited chapter", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "mylup-journey",
      JSON.stringify({ version: 1, chapter: 7, completed: [] }),
    );
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /harapan untuk tahun barumu/i })).toBeVisible();
});
