import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Book an Interview — Creoate x Marc",
  description:
    "The Breezy link expired, so I built something better. Schedule an interview with me directly.",
  openGraph: {
    title: "Book an Interview — Creoate x Marc",
    description:
      "A playful scheduling tool built by a PM candidate who prefers shipping solutions over sending follow-up emails.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
