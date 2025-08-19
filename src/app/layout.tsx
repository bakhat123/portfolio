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

export const metadata: Metadata = {
  title: "Bakhat • AI Portfolio",
  description: "Chat with Li Wang Zhang Liu Yang Zhao Huang Wu to explore skills, projects, goals, and contact info.",
  metadataBase: new URL("https://localhost"),
  openGraph: {
    title: "Bakhat • AI Portfolio",
    description: "Chat with Li Wang Zhang Liu Yang Zhao Huang Wu to explore skills, projects, goals, and contact info.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bakhat • AI Portfolio",
    description: "Chat with Li Wang Zhang Liu Yang Zhao Huang Wu to explore skills, projects, goals, and contact info.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased` }>
        {children}
      </body>
    </html>
  );
}
