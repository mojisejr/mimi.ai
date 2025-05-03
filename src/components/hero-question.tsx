"use client";

import TypingText from "./typing-text/text";

export default function HeroQuestion() {
  return (
    <div className="flex flex-col justify-start w-full p-6">
      <h1 className="text-[40px] font-bold bg-gradient-to-tr from-accent to-amber-300 bg-clip-text text-transparent">
        {/* ไพ่พร้อมแล้วค่ะ ✨ */}
        <TypingText texts={["ไพ่พร้อมแล้วค่ะ"]} />
      </h1>
      <div className="text-[26px] leading-tight">
        <h3>บอกฉันสิ</h3>
        <h3>คุณอยากรู้อะไร ?</h3>
      </div>
    </div>
  );
}
