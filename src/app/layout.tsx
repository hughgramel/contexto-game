import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Contexto",
  description: "Minimal local-first Contexto scaffold",
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
