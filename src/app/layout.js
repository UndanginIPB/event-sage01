import { Yellowtail, Montserrat } from 'next/font/google'
import './globals.css'

// 1. Konfigurasi Font Yellowtail
const yellowtail = Yellowtail({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-yellowtail', // Nama variabel CSS yang akan kita panggil nanti
  display: 'swap',
})

// 2. Konfigurasi Font Montserrat
const montserrat = Montserrat({
  weight: ['400', '500', '700'], // Pilih ketebalan yang dibutuhkan
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata = {
  title: process.env.NEXT_PUBLIC_TITLE || "Undangin",
  description: "Jangan Lupa Undangin Aja Dulu",
  icons: {
    icon: "/logo-undangin.png",
    // apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${yellowtail.variable} ${montserrat.variable}`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
