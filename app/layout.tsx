import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "SkillPath.AI",
  description:
    "SkillPath.AI helps students and freshers build skills, improve resumes, and practice interviews with confidence."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${manrope.variable} ${fraunces.variable} bg-cloud font-sans text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
