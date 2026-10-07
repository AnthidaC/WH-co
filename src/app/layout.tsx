import type { Metadata } from "next";
import { Prompt, Inter } from "next/font/google";
import "./globals.css";

const promptFont = Prompt({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-prompt",
  display: "swap",
});

const interFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KAZETIX | ระบบกดบัตรคอนเสิร์ตความเร็วสูง (Couchbase Rush Engine)",
  description:
    "ระบบจำลองการกดบัตรคอนเสิร์ตความเร็วสูง รองรับ Concurrency และ CAS Atomic Protection บน Couchbase In-Memory Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${promptFont.variable} ${interFont.variable}`} suppressHydrationWarning>
      <body
        className="min-h-screen bg-canvas text-ink antialiased leading-relaxed font-sans selection:bg-primary-subtle selection:text-primary"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
