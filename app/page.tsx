import type { Metadata } from "next";
import { AnatomyStudio } from "./components/AnatomyStudio";

export const metadata: Metadata = {
  title: "AAS — Anatomic Agentic System",
  description: "An interactive 3D anatomy explorer built with open Human Reference Atlas models and structured learning tools.",
  other: {
    "codex-preview": "development",
  },
};

export default function Home() {
  return <AnatomyStudio />;
}
