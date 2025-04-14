"use client";
import { IAnswer } from "@/interfaces/i-answer";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { animate, motion } from "framer-motion";
import Logo from "@/components/logo";
import AnswerCard from "@/components/answer-card";
import Link from "next/link";

const mocked = {
  header:
    "สวัสดีค่ะ ดวงวันนี้เป็นอย่างไรบ้างนะ? ตั้งจิตอธิษฐานให้แน่วแน่ แล้วมาเปิดไพ่ 3 ใบกันค่ะ",
  cards: [
    {
      name: "The Hermit",
      imageUrl: "the_hermit.png",
    },
    {
      name: "Eight Of Cups",
      imageUrl: "eight_of_cups.png",
    },
    {
      name: "Four of Cups",
      imageUrl: "four_of_cups.png",
    },
    {
      name: "Four of Cups",
      imageUrl: "four_of_cups.png",
    },
    {
      name: "Four of Cups",
      imageUrl: "four_of_cups.png",
    },
  ],
  reading:
    "จากหน้าไพ่ที่เปิดมานี้ บ่งบอกว่ามีโอกาสที่จะได้พบเจอกันในวันนี้สูงมากค่ะ มีความเป็นไปได้ว่าคุณและเขาจะได้ใช้เวลาร่วมกันอย่างมีความสุข อาจจะเป็นการทานอาหารค่ำด้วยกัน หรือการไปเที่ยวในสถานที่พิเศษ การพบเจอกันครั้งนี้จะนำมาซึ่งความสุขสมหวัง และความรู้สึกเติมเต็มในความสัมพันธ์ของคุณทั้งสองคนนะคะ",
  suggest:
    "ลองเปิดใจและปล่อยวางความกังวลในอดีต แล้วให้โอกาสเขาได้เข้ามาในชีวิตของคุณอีกครั้งนะคะ",
  final:
    "วันนี้เป็นวันที่ดีที่จะได้เริ่มต้นใหม่ หรือสานสัมพันธ์ให้แน่นแฟ้นยิ่งขึ้นค่ะ",
  end: "ขอบคุณที่ให้แม่หมอมีมี่ได้ทำนายดวงให้นะคะ",
  notice: "คำทำนายนี้เป็นเพียงแนวทาง โปรดใช้วิจารณญาณในการตัดสินใจนะคะ",
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeInOut" },
  },
};

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
  // const parsedAnswer: IAnswer | null = mocked ? mocked : null;
  const [flipped, setFlipped] = useState(
    Array(parsedAnswer?.cards.length).fill(false)
  );

  console.log(flipped);
  const [reveal, setReveal] = useState<boolean>(false);

  useEffect(() => {
    if (flipped.every((value) => value === true)) {
      setReveal(true);
    }
  }, [flipped]);

  const handleFlip = (index: number) => {
    setFlipped((prev) => prev.map((f, i) => (i === index ? !f : f)));
  };

  return (
    <section className="h-4/6 pt-[h-1/6]flex items-center p-4 overflow-y-auto">
      {parsedAnswer == null ? (
        <div>Loading ... </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <h1 className="border-l-2 border-accent p-2">
            {parsedAnswer.header}
          </h1>
          <div className="w-full">
            <div className="text-xl font-bold">🎴 ไพ่ที่หยิบได้</div>
            <div className="my-4">
              {parsedAnswer.cards.length <= 3 ? (
                <div className="grid grid-cols-3 gap-2">
                  {parsedAnswer.cards.map((card, index) => (
                    <AnswerCard
                      key={index + 1}
                      name={card.name}
                      image={card.imageUrl}
                      flipped={flipped[index]}
                      onClick={() => handleFlip(index)}
                    />
                  ))}
                </div>
              ) : (
                <div className="my-4">
                  <div className="grid grid-cols-3 gap-2">
                    {parsedAnswer.cards.slice(0, 3).map((card, index) => (
                      <AnswerCard
                        key={index + 1}
                        name={card.name}
                        image={card.imageUrl}
                        flipped={flipped[index]}
                        onClick={() => handleFlip(index)}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {parsedAnswer.cards.slice(3, 5).map((card, index) => (
                      <AnswerCard
                        key={index + 1}
                        name={card.name}
                        image={card.imageUrl}
                        flipped={flipped[index + 3]}
                        onClick={() => handleFlip(index + 3)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {reveal ? (
            <motion.div
              className="grid grid-cols-1 gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { staggerChildren: 0.2 },
                },
              }}
            >
              <motion.h1 className="text-xl font-bold" variants={textVariants}>
                🪄 คำทำนาย
              </motion.h1>
              <motion.p variants={textVariants}>
                {parsedAnswer?.reading}
              </motion.p>
              <motion.h1 className="text-xl font-bold" variants={textVariants}>
                🤟 แนะนำ
              </motion.h1>
              <motion.p variants={textVariants}>
                {parsedAnswer?.suggest}
              </motion.p>
              <motion.h1 className="text-xl font-bold" variants={textVariants}>
                💚 สรุป
              </motion.h1>
              <motion.p variants={textVariants}>{parsedAnswer?.final}</motion.p>

              <motion.div variants={textVariants}>
                {parsedAnswer.end} 🙏🙏
              </motion.div>
              <motion.div
                className="font-semibold text-accent"
                variants={textVariants}
              >
                {parsedAnswer.notice}
              </motion.div>
            </motion.div>
          ) : null}
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
          👈 กลับไปถามต่อ
        </button>
      </section>
    </>
  );
}
