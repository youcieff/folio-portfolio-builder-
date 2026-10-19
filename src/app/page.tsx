import type { Metadata } from "next";
import { HomePage } from "./HomePage";

export const metadata: Metadata = {
  title: "Folio — Your work, beautifully yours",
  description: "Build a distinctive portfolio in minutes. Choose a design, add your work, and export a responsive website you own.",
};

export default function Home() { return <HomePage />; }
