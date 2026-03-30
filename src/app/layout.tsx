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
      <body className="min-h-screen bg-slate-100 text-slate-950 antialiased">
        {children}
      </body>
    </html>
  );
}
