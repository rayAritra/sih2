import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "QShield-QDS | Quantum Cyber Threat Detection for QDS",
  description:
    "Quantum-Inspired Cyber Threat Detection for Teleportation-Based Quantum Digital Signatures (SIH26141)",
  keywords: [
    "Quantum Digital Signatures",
    "QDS",
    "SPRT",
    "QBER",
    "Quantum Cybersecurity",
    "Teleportation",
    "Smart India Hackathon 2026",
    "SIH26141",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <QueryProvider>
          <AppShell>{children}</AppShell>
        </QueryProvider>
      </body>
    </html>
  );
}
