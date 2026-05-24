import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CINEVERSE - Watch Movies Online",

  description:
    "Watch Bollywood, South Indian, Web Series and Anime online in HD.",

  keywords:
    "movies, bollywood, south movies, anime, web series, watch online",

  openGraph: {
    title: "CINEVERSE",
    description:
      "Watch latest movies online",
    images: [
      "https://upload.wikimedia.org/wikipedia/en/0/0e/Pushpa_2.jpg",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
