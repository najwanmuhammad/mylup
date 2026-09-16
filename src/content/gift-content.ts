export type StoryItem = { id: string; title: string; body: string };
export type GalleryItem = StoryItem & { src: string; alt: string };
export type ReplyOption = StoryItem & { message: string };

export type GiftContent = {
  recipientName: string;
  senderName: string;
  intro: { eyebrow: string; title: string; body: string };
  garden: StoryItem[];
  constellation: StoryItem[];
  appreciation: StoryItem[];
  gallery: GalleryItem[];
  wishes: StoryItem[];
  birthdayLetter: string[];
  apology: string[];
  changes: string[];
  reconnectQuestion: string;
  replyOptions: ReplyOption[];
};

export const giftContent: GiftContent = {
  recipientName: "Kamu",
  senderName: "Aku",
  intro: {
    eyebrow: "Sebuah hadiah kecil untuk hari spesialmu",
    title: "Selamat ulang tahun, Kamu ✨",
    body: "Aku menyiapkan perjalanan kecil berisi hal-hal yang selalu ingin aku ingat tentangmu.",
  },
  garden: [
    { id: "garden-1", title: "Caramu tertawa", body: "Tawa yang bisa membuat suasana paling berat terasa sedikit lebih ringan." },
    { id: "garden-2", title: "Ketulusanmu", body: "Kamu selalu berusaha hadir dengan hati yang jujur, bahkan saat itu tidak mudah." },
    { id: "garden-3", title: "Perhatian kecilmu", body: "Hal-hal sederhana yang kamu ingat sering terasa lebih berarti dari hadiah besar." },
    { id: "garden-4", title: "Keberanianmu", body: "Kamu tetap melangkah meski kadang harus membawa banyak hal sendirian." },
    { id: "garden-5", title: "Sisi lembutmu", body: "Ada rasa aman dalam caramu peduli pada orang-orang yang kamu sayangi." },
    { id: "garden-6", title: "Dirimu sendiri", body: "Bukan karena harus menjadi siapa-siapa—kamu berharga hanya dengan menjadi dirimu." },
  ],
  constellation: [
    { id: "star-1", title: "Pertemuan", body: "Satu titik kecil yang kemudian mengubah banyak hal dalam hidupku." },
    { id: "star-2", title: "Obrolan panjang", body: "Waktu terasa berjalan lebih cepat ketika aku mendengarkan ceritamu." },
    { id: "star-3", title: "Hari sederhana", body: "Momen biasa bersamamu sering menjadi bagian yang paling ingin kuulang." },
    { id: "star-4", title: "Tawa kita", body: "Lelucon yang mungkin tidak dipahami orang lain, tetapi selalu terasa seperti rumah." },
    { id: "star-5", title: "Saat sulit", body: "Aku belajar bahwa menyayangi juga berarti hadir, mendengar, dan bertanggung jawab." },
    { id: "star-6", title: "Harapan baik", body: "Apa pun arah hidupmu, aku berharap langitmu selalu memiliki banyak cahaya." },
  ],
  appreciation: [
    { id: "card-1", title: "Hal kecil #1", body: "Aku suka caramu antusias ketika membahas sesuatu yang benar-benar kamu sukai." },
    { id: "card-2", title: "Hal kecil #2", body: "Aku suka ekspresi wajahmu ketika mencoba menahan tawa." },
    { id: "card-3", title: "Hal kecil #3", body: "Aku mengagumi caramu bertahan dan terus belajar dari hari-hari yang berat." },
    { id: "card-4", title: "Hal kecil #4", body: "Aku suka bagaimana kehadiranmu bisa membuat tempat sederhana terasa istimewa." },
    { id: "card-5", title: "Hal kecil #5", body: "Aku menghargai kejujuranmu, termasuk ketika kebenaran itu sulit kudengar." },
    { id: "card-6", title: "Hal kecil #6", body: "Aku bersyukur pernah mengenal dunia dari sudut pandangmu." },
  ],
  gallery: Array.from({ length: 6 }, (_, index) => ({
    id: `memory-${index + 1}`,
    title: `Ruang kenangan ${index + 1}`,
    body: "Tempat untuk foto dan cerita yang hanya kalian berdua pahami.",
    src: "",
    alt: `Tempat foto kenangan pribadi nomor ${index + 1}`,
  })),
  wishes: [
    { id: "wish-1", title: "Untuk harimu", body: "Semoga kamu merasa dirayakan, didengar, dan disayangi tanpa syarat." },
    { id: "wish-2", title: "Untuk langkahmu", body: "Semoga tahun ini membawamu lebih dekat pada hidup yang benar-benar kamu inginkan." },
    { id: "wish-3", title: "Untuk hatimu", body: "Semoga ada lebih banyak tenang, tawa, dan orang-orang yang memperlakukanmu dengan baik." },
    { id: "wish-4", title: "Untuk mimpimu", body: "Semoga keberanianmu selalu lebih besar daripada rasa takutmu untuk mencoba." },
  ],
  birthdayLetter: [
    "Di hari ulang tahunmu, aku ingin berhenti sejenak dan merayakan dirimu—bukan hanya semua yang sudah kamu capai, tetapi juga caramu bertumbuh melalui hari-hari yang tidak mudah.",
    "Terima kasih untuk tawa, cerita, perhatian kecil, dan semua kenangan yang pernah kita bagi. Banyak hal tentangmu yang masih membuatku tersenyum ketika mengingatnya.",
    "Aku berharap tahun barumu dipenuhi orang-orang yang mendengarkanmu dengan sungguh-sungguh, kesempatan yang menghargai kemampuanmu, dan hari-hari tenang ketika kamu bisa merasa cukup.",
    "Selamat ulang tahun. Semoga kamu selalu menemukan alasan baru untuk mencintai hidupmu sendiri.",
  ],
  apology: [
    "Ada sesuatu yang ingin kusampaikan dengan jujur. Aku tahu ada sikap dan keputusanku yang melukaimu.",
    "Aku tidak ingin mengecilkan perasaanmu atau mencari alasan. Dampaknya tetap nyata, dan aku bertanggung jawab atas bagian yang kulakukan.",
    "Aku minta maaf karena tidak selalu hadir, mendengar, dan memperlakukan hubungan kita dengan kedewasaan yang seharusnya.",
    "Aku sedang belajar berkomunikasi tanpa defensif, menghormati batasan, dan membuktikan perubahan melalui tindakan yang konsisten—bukan hanya kata-kata.",
    "Kamu tidak berutang maaf, jawaban, atau kesempatan kedua kepadaku. Aku hanya ingin menyampaikan ini dengan jujur dan menghormati pilihanmu.",
  ],
  changes: [
    "Mendengar sampai selesai sebelum merespons.",
    "Mengomunikasikan masalah dengan jelas, bukan menghilang atau menghindar.",
    "Menghormati batasan dan memberi ruang tanpa menjadikannya hukuman.",
  ],
  reconnectQuestion:
    "Kalau suatu hari kamu merasa siap, bolehkah kita ngobrol lagi dan melihat apakah kita bisa membangun ulang hubungan ini dengan lebih baik?",
  replyOptions: [
    {
      id: "talk",
      title: "Aku bersedia ngobrol",
      body: "Pelan-pelan, tanpa janji yang dipaksakan.",
      message: "Aku sudah membaca semuanya. Aku bersedia ngobrol pelan-pelan.",
    },
    {
      id: "time",
      title: "Aku butuh waktu",
      body: "Jawaban ini sepenuhnya valid.",
      message: "Aku sudah membaca semuanya. Aku masih butuh waktu dan ruang.",
    },
    {
      id: "no",
      title: "Aku belum ingin kembali",
      body: "Pilihan ini juga akan dihormati.",
      message: "Aku sudah membaca semuanya. Untuk sekarang, aku belum ingin kembali.",
    },
  ],
};
