"use client";
import Link from "next/link";
import { IAnswer } from "@/interfaces/i-answer";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import Logo from "@/components/logo";

function AnswerSection() {
  const params = useSearchParams();

  const answer = params.get("ans");

  if (!answer) {
    return (
      <div className="relative h-screen w-full max-w-xl overflow-hidden">
        <section className="h-6/6 overflow-scroll flex items-center">
          <Link href="/questions" className="btn">
            ไม่พบคำตอบ
          </Link>
        </section>
      </div>
    );
  }

  const parsedAnswer: IAnswer | null = answer ? JSON.parse(answer) : null;

  return (
    <section className="h-4/6 pt-[h-1/6]flex items-center p-4 overflow-y-auto">
      {parsedAnswer == null ? (
        <div>Loading ... </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          <h1 className="border-l-2 border-accent p-2">
            {parsedAnswer.header}
          </h1>
          <div>
            <div className="text-xl font-bold">🎴 ไพ่ที่หยิบได้</div>
            {parsedAnswer.cards.map((card, index) => (
              <div key={index}>
                {index + 1}. {card}
              </div>
            ))}
          </div>

          <h1 className="text-xl font-bold">🪄 คำทำนาย</h1>
          <p>{parsedAnswer?.reading}</p>
          <h1 className="text-xl font-bold">🤟 แนะนำ</h1>
          <p>{parsedAnswer?.suggest}</p>
          <h1 className="text-xl font-bold">💚 สรุป</h1>
          <p>{parsedAnswer?.final}</p>

          <div>{parsedAnswer.end} 🙏🙏</div>
          <div className="font-semibold text-accent">{parsedAnswer.notice}</div>
        </div>
      )}
    </section>
  );
}

export default function AnswerPage() {
  const { back } = useRouter();

  return (
    <>
      <Suspense
        fallback={
          <div className="mt-10 flex flex-col items-center gap-2 flex-1">
            <Logo />
            <div>รอสักครู่ 😊</div>
          </div>
        }
      >
        <AnswerSection />
      </Suspense>
      <section className="h-1/6 flex w-full justify-center items-center">
        <button onClick={back} className="btn">
          กลับหน้าคำถาม
        </button>
      </section>
    </>
  );
}
