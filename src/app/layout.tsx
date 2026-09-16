import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sebuah Hadiah Kecil Untukmu",
  description: "Perjalanan ulang tahun pribadi, dibuat dengan tulus.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
