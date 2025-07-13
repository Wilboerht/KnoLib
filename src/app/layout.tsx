import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { MainLayout } from "@/components/layout/main-layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

// DingTalk 进步体字体
const dingTalkJinbu = localFont({
  src: "../../public/fonts/DingTalk Jinbu/DingTalk JinBuTi.ttf",
  variable: "--font-dingtalk-jinbu",
  display: "swap",
});

// DingTalk Sans字体
const dingTalkSans = localFont({
  src: "../../public/fonts/DingTalk Jinbu/DingTalk Sans.ttf",
  variable: "--font-dingtalk-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KnoLib - Personal Knowledge Sharing Platform",
  description: "Your comprehensive knowledge library for continuous learning and professional growth. Discover, learn, and excel with KnoLib.",
  keywords: ["knowledge sharing", "personal platform", "learning", "documentation", "collaboration"],
  authors: [{ name: "Wilboerht" }],
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/knolib-icon-32.svg",
        sizes: "32x32",
        type: "image/svg+xml",
      },
      {
        url: "/knolib-icon-48.svg",
        sizes: "48x48",
        type: "image/svg+xml",
      },
      {
        url: "/knolib-icon-16.svg",
        sizes: "16x16",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/favicon.svg",
    apple: "/knolib-icon-48.svg",
  },
  openGraph: {
    title: "KnoLib - Personal Knowledge Sharing Platform",
    description: "Your comprehensive knowledge library for continuous learning and professional growth.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "KnoLib - Personal Knowledge Sharing Platform",
    description: "Your comprehensive knowledge library for continuous learning and professional growth.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${dingTalkJinbu.variable} ${dingTalkSans.variable}`}>
      <body className="font-sans antialiased">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
