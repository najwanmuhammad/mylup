# mylup

Website ulang tahun interaktif berbasis Next.js App Router. Pengalaman terdiri dari perjalanan kenangan, mini-game tanpa kondisi kalah, galeri, surat ulang tahun, permintaan maaf, dan ajakan berbicara kembali yang menghormati pilihan penerima.

## Menjalankan proyek

```bash
bun install
bun run dev
```

Buka `http://localhost:3000`.

## Personalisasi

Semua teks utama berada di `src/content/gift-content.ts`. Ganti nama, pesan taman, kenangan, caption, surat ulang tahun, permintaan maaf, perubahan konkret, dan draf respons di satu file tersebut.

Maskot orisinal berada di `public/assets/lumi-mascot.png`. Tambahkan foto pribadi yang sudah dihapus metadata lokasinya ke `public/assets/memories/`, lalu hubungkan di bagian `gallery`.

Baca `CONTENT_CHECKLIST.md` sebelum membagikan link.

## Pemeriksaan

```bash
bun run lint
bun run typecheck
bun run test --run
bun run build
```

Website tidak menyimpan jawaban penerima di server. Tombol WhatsApp hanya menyiapkan teks; penerima tetap menentukan apakah pesan akan dikirim.
