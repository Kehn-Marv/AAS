import type { Metadata, Viewport } from "next";
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
  title: {
    default: "AAS — Anatomic Agentic System",
    template: "%s | AAS",
  },
  description: "Explore human organs in interactive 3D with structured learning, auditable sources, and guided lessons.",
  applicationName: "AAS",
  keywords: ["anatomy", "3D", "education", "HuBMAP", "Human Reference Atlas", "agentic", "learning"],
  openGraph: {
    type: "website",
    title: "AAS — Anatomic Agentic System",
    description: "An interactive 3D anatomy learning system with structured lessons and auditable sources.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "AAS — Anatomic Agentic System 3D organ explorer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AAS — Anatomic Agentic System",
    description: "An interactive 3D anatomy learning system with structured lessons and auditable sources.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#071012" },
    { media: "(prefers-color-scheme: light)", color: "#edf2ef" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
