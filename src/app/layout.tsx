import type { Metadata } from "next";
import { Inter_Tight, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { UiLanguageProvider } from "@/i18n/UiLanguageProvider";

// Editor UI font — crisp, slightly condensed
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--editor-font-ui",
  display: "swap",
});

// Editor heading font — warm, expressive
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--editor-font-head",
  display: "swap",
  axes: ["SOFT", "WONK"],
});

// Numbers, labels, code snippets in the editor
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--editor-font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Folio — Build your portfolio, own your file",
  description:
    "Drag-and-drop portfolio builder. No account. No subscription. Exports to one self-contained HTML file you own forever.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
    >
      <body><UiLanguageProvider>{children}</UiLanguageProvider></body>
    </html>
  );
}
