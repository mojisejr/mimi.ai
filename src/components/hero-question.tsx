"use client";

import { useLanguage } from "@/providers/language";
import TypingText from "./typing-text/text";

export default function HeroQuestion() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col justify-start w-full p-6">
      <h1 className="text-[40px] font-bold bg-gradient-to-tr from-accent to-amber-300 bg-clip-text text-transparent">
        {/* ไพ่พร้อมแล้วค่ะ ✨ */}
        <TypingText texts={[t("heroQuestion.typingTextHero")]} />
      </h1>
      <div className="text-[26px] leading-tight">
        <h3>{t("heroQuestion.subtitleLine1")}</h3>
        <h3>{t("heroQuestion.subtitleLine2")}</h3>
      </div>
    </div>
  );
}
