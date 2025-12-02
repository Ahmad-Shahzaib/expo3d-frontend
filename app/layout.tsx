import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VEX Platform - Virtual Exhibition Platform",
  description: "3D Virtual Exhibition Platform with immersive navigation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
