import memory1 from "../../public/images/memory-1.jpg";
import memory2 from "../../public/images/memory-2.jpg";
import memory3 from "../../public/images/memory-3.jpg";
import memory4 from "../../public/images/memory-4.jpg";
import memory5 from "../../public/images/memory-5.jpg";
import memory6 from "../../public/images/memory-6.jpg";
import { StaticImageData } from "next/image";

export type StoryItem = { id: string; title?: string; body?: string };
export type GalleryItem = StoryItem & {
  src: string | StaticImageData;
  alt: string;
};
export type ReplyOption = StoryItem & { message: string };

export type GiftContent = {
  recipientName: string;
  senderName: string;
  intro: { eyebrow?: string; title: string; body: string };
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
  musicSrc: string;
  whatsappNumber: string;
  whatsappMessage: string;
};

export const giftContent: GiftContent = {
  recipientName: "Firna",
  senderName: "Najwan",
  intro: {
    title: "Selamat ulang tahun, Firna✨",
    body: "Aku udah bikin perjalanan kecil tentangmu yang ingin aku ingat terus",
  },
  garden: [
    // {
    //   id: "garden-1",
    //   title: "Caramu tertawa",
    //   body: "Tawa yang bisa membuat suasana paling berat terasa sedikit lebih ringan.",
    // },
    {
      id: "garden-2",
      title: "Your smile is my favorite view in the world ",
    },
    {
      id: "garden-3",
      title: "You inspire me to be better every single day",
    },
    {
      id: "garden-4",
      title: "You turn ordinary moments into adventures",
    },
    {
      id: "garden-5",
      title: "You make me laugh even on the hardest days",
    },
    {
      id: "garden-6",
      title: "Being with you feels like coming home",
    },
  ],
  constellation: [
    {
      id: "star-1",
      title: "Pertemuan",
      body: "Satu titik kecil yang kemudian mengubah banyak hal dalam hidupku.",
    },
    {
      id: "star-2",
      title: "Obrolan panjang",
      body: "Waktu terasa berjalan lebih cepat ketika aku mendengarkan ceritamu.",
    },
    {
      id: "star-3",
      title: "Hari sederhana",
      body: "Momen biasa bersamamu sering menjadi bagian yang paling ingin kuulang.",
    },
    {
      id: "star-4",
      title: "Tawa kita",
      body: "Lelucon yang mungkin tidak dipahami orang lain, tetapi selalu terasa seperti rumah.",
    },
    {
      id: "star-5",
      title: "Saat sulit",
      body: "Aku belajar bahwa menyayangi juga berarti hadir, mendengar, dan bertanggung jawab.",
    },
    {
      id: "star-6",
      title: "Harapan baik",
      body: "Apa pun arah hidupmu, aku berharap langitmu selalu memiliki banyak cahaya.",
    },
  ],
  appreciation: [
    {
      id: "card-1",
      title: "🌸",
      body: "Aku suka caramu antusias ketika membahas sesuatu yang benar-benar kamu sukai.",
    },
    {
      id: "card-2",
      title: "🎀",
      body: "Aku suka ekspresi wajahmu ketika mencoba menahan tawa.",
    },
    {
      id: "card-3",
      title: "💕",
      body: "Aku mengagumi caramu bertahan dan terus belajar dari hari-hari yang berat.",
    },
    {
      id: "card-4",
      title: "🌷",
      body: "Aku suka bagaimana kehadiranmu bisa membuat tempat sederhana terasa istimewa.",
    },
    {
      id: "card-5",
      title: "⋆. 𐙚˚࿔ sayang 𝜗𝜚˚⋆",
      body: "Aku menghargai kejujuranmu, termasuk ketika kebenaran itu sulit kudengar.",
    },
    {
      id: "card-6",
      title: "🥰",
      body: "Aku bersyukur pernah mengenal dunia dari sudut pandangmu.",
    },
  ],
  gallery: [
    {
      id: "memory-1",
      // title: "Ruang kenangan 1",
      // body: "Tempat untuk foto dan cerita yang hanya kalian berdua pahami.",
      src: memory1,
      alt: "Tempat foto kenangan pribadi nomor 1",
    },
    {
      id: "memory-2",
      // title: "Ruang kenangan 2",
      // body: "Tempat untuk foto dan cerita yang hanya kalian berdua pahami.",
      src: memory2,
      alt: "Tempat foto kenangan pribadi nomor 2",
    },
    {
      id: "memory-3",
      // title: "Ruang kenangan 3",
      // body: "Tempat untuk foto dan cerita yang hanya kalian berdua pahami.",
      src: memory3,
      alt: "Tempat foto kenangan pribadi nomor 3",
    },
    {
      id: "memory-4",
      // title: "Ruang kenangan 4",
      // body: "Tempat untuk foto dan cerita yang hanya kalian berdua pahami.",
      src: memory4,
      alt: "Tempat foto kenangan pribadi nomor 4",
    },
    {
      id: "memory-5",
      // title: "Ruang kenangan 5",
      // body: "Tempat untuk foto dan cerita yang hanya kalian berdua pahami.",
      src: memory5,
      alt: "Tempat foto kenangan pribadi nomor 5",
    },
    {
      id: "memory-6",
      // title: "Ruang kenangan 6",
      // body: "Tempat untuk foto dan cerita yang hanya kalian berdua pahami.",
      src: memory6,
      alt: "Tempat foto kenangan pribadi nomor 6",
    },
  ],
  wishes: [
    {
      id: "wish-1",
      title: "Untuk harimu",
      body: "Semoga kamu merasa dirayakan, didengar, dan disayangi tanpa syarat.",
    },
    {
      id: "wish-2",
      title: "Untuk langkahmu",
      body: "Semoga tahun ini membawamu lebih dekat pada hidup yang benar-benar kamu inginkan.",
    },
    {
      id: "wish-3",
      title: "Untuk hatimu",
      body: "Semoga ada lebih banyak tenang, tawa, dan orang-orang yang memperlakukanmu dengan baik.",
    },
    {
      id: "wish-4",
      title: "Untuk mimpimu",
      body: "Semoga keberanianmu selalu lebih besar daripada rasa takutmu untuk mencoba.",
    },
  ],
  birthdayLetter: [
    "Happy birthday to my favorite person. 🤍",
    "Another year of you, and somehow I’m still very, very lucky to be the one who gets to love you this closely.",
    "Aku suka banget waktu yang kita habisin bareng. Bahkan sometimes kita nggak ngapa-ngapain yang special, cuma ngobrol, deep talk sampai lupa waktu, cerita hal random, atau sekadar spending time together. Somehow, being with you always feels like home. And honestly, I don’t think I’ll ever get tired of that.",

    "Aku sayang banget sama kamu. Sometimes aku nggak selalu bisa nunjukinnya dengan cara yang paling obvious, tapi you really mean that much to me. Kamu udah jadi bagian yang penting banget dari hidup aku. Sampai di titik di mana aku genuinely nggak kebayang hidup aku tanpa kamu di dalamnya.",
    "And I hope you know how proud I am of you.",

    "Aku bangga banget bisa bilang kalau pacarku adalah seorang mahasiswa film yang literally belajar buat bikin cerita dan role-nya sebagai sutradara. Seeing you doing what you love, figuring things out, creating something from your own ideas... it’s honestly attractive as fuck. And yes, I’m allowed to flex a little because my girlfriend is a director. :p",

    "Aku tahu jadi kamu nggak selalu gampang. Ada deadline, tugas, pressure, overthinking, dan mungkin banyak hal yang nggak selalu kamu ceritain. Tapi whatever happens, I hope you know that you don’t have to figure everything out alone. I’m here. Mau deep talk sampai pagi, mau cerita hal random, mau diem bareng, atau cuma butuh someone to stay—I'll be here.",

    "Di umur kamu yang baru ini, Aku pengen kamu punya lebih banyak alasan buat senyum, lebih banyak moments yang bikin kamu excited, dan lebih banyak kesempatan buat jadi versi diri kamu yang kamu banggakan.",

    "And selfishly, I hope I get to be there for a lot of it.",

    "I wanna see more of your films, more of your dreams, more of your random thoughts, more of your smiles, and obviously... more of you.",

    "Thank you for being my person, my favorite human to talk to, my partner in all these little moments, and the girl who somehow managed to make me fall this hard.",

    "Happy birthday, sayang.",

    "I love you. More than I probably know how to put into words.",

    "I miss you. ❤️",
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
    "I didn't mean to hurt you...You mean so much to me🥺💗Will you forgive me? 🥺",
  musicSrc: "/assets/RomanticPiano_UNTIL WE MEET AGAIN_Arthur Vyncke.mp3",
  // Isi dengan nomor internasional tanpa tanda +, misalnya 6281234567890.
  whatsappNumber: "6287882375795",
  whatsappMessage:
    "Aku udah melihat hadiah ulang tahunnya sampai akhir. Terima kasih sudah membuatnya untukku 💗 Aku sayang banget sama kamu Najwan, ayuk kita balikan lagi ya",
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
      message:
        "Aku sudah membaca semuanya. Untuk sekarang, aku belum ingin kembali.",
    },
  ],
};
