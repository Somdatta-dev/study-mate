import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Study Mate - AI-Powered Study Document Generator",
  description: "Transform your PDFs into simplified study documents using Google Gemini 2.5 Flash AI. Upload any PDF and get a detailed, easy-to-understand study guide in minutes.",
  keywords: "study, AI, PDF, education, study guide, learning, gemini, document generator",
  authors: [{ name: "Study Mate" }],
  creator: "Study Mate",
  openGraph: {
    title: "Study Mate - AI-Powered Study Document Generator",
    description: "Transform your PDFs into simplified study documents using AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geist.variable} ${geistMono.variable} antialiased bg-gray-900 text-gray-100`}
      >
        {children}
      </body>
    </html>
  );
}
