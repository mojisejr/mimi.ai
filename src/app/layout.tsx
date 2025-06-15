import type { Metadata, Viewport } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import { LineProvider } from "../providers/line";
import ToastProvider from "@/components/ui/toast-container";
import { LanguageProvider } from "@/providers/language";

const prompt = Prompt({ subsets: ["thai"], weight: ["300", "400", "600"] });

export const metadata: Metadata = {
  title: "MiMiVibe.ai",
  description:
    "ไพ่พร้อมแล้ว... แล้วคุณล่ะ อยากรู้เรื่องอะไร? MiMiVibe.ai คือผู้ช่วยดูดวงอัจฉริยะ ที่จะเผยคำทำนายจาก AI แม่นยำ รู้ใจ พร้อมตอบทุกความสงสัยในชีวิต",
};

export const viewport: Viewport = {
  width: "device-width",
  height: "device-height",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <LineProvider>
        <LanguageProvider>
          <body
            className={`${prompt.className} antialiased bg-gradient-to-br from-base-300 via-base-100 to-base-300`}
          >
            <ToastProvider />
            {children}
          </body>
        </LanguageProvider>
      </LineProvider>
    </html>
  );
}
