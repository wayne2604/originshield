import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OriginShield — AI Content Detection Platform",
  description:
    "Detect AI-generated text, images, and web content with cutting-edge deep learning models. Protect trust and authenticity at scale.",
  keywords: ["AI detection", "deepfake detection", "content authenticity", "AI-generated text", "image forensics"],
  openGraph: {
    title: "OriginShield — AI Content Detection",
    description: "Verify what's authentically human. Analyze text, images, and links for AI-generated content.",
    type: "website",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#030712] text-slate-200" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
