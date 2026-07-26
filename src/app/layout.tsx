import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Human Capital Platform — Measure. Improve. Grow.",
  description:
    "The Bloomberg Terminal for Human Capital. Measure your overall Human Capital score (0–100) across career, financial health, skills, lifestyle, and psychometric assessments.",
  keywords: [
    "Human Capital",
    "Human Capital Score",
    "Career Trajectory",
    "Financial Health",
    "Psychometrics",
    "Personal Analytics",
    "Bloomberg Terminal for Humans",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#060911] text-slate-100 antialiased selection:bg-sky-500 selection:text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
