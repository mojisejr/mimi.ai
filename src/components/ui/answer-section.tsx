"use client";
import { motion } from "framer-motion";
import { IAnswer } from "@/interfaces/i-answer";
import { useState, useRef, useEffect } from "react";
import AnswerCard from "../answer-card";
import { useLanguage } from "@/providers/language";
import { useRouter } from "next/navigation";
import LoadingScreen from "./loading-screen";

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeInOut" },
  },
};

export default function AnswerSection() {
  const [parsedAnswer, setParsedAnswer] = useState<IAnswer | null>(null);
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    const answerData = localStorage.getItem("answerData");
    if (answerData) {
      const parsedAnswer = JSON.parse(answerData);
      setFlipped(Array(parsedAnswer.cards.length).fill(false));
      setParsedAnswer(parsedAnswer);
    }
  }, []);

  useEffect(() => {
    if (parsedAnswer != null) {
      autoRevealTimeout.current = setTimeout(() => {
        handleAutoReveal();
      }, 3000);
    }

    return () => {
      if (autoRevealTimeout.current) {
        clearTimeout(autoRevealTimeout.current);
      }
    };
  }, [parsedAnswer]);

  const [flipped, setFlipped] = useState(
    Array(parsedAnswer?.cards.length).fill(false)
  );

  const [reveal, setReveal] = useState<boolean>(false);
  const autoRevealTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (flipped.every((value) => value === true)) {
      setReveal(true);
      if (autoRevealTimeout.current) {
        clearTimeout(autoRevealTimeout.current);
      }
    }
    console.log(flipped);
  }, [flipped]);

  const handleFlip = (index: number) => {
    setFlipped((prev) => prev.map((f, i) => (i === index ? !f : f)));
  };

  const handleAutoReveal = async () => {
    setFlipped((prev) => prev.map(() => true));
    setReveal(true);
  };

  return (
    <section className="h-4/6 pt-[h-1/6] p-4 overflow-y-auto">
      {parsedAnswer == null ? (
        <LoadingScreen />
      ) : (
        // <div>Loading ... </div>
        <div className="grid grid-cols-1 gap-4 max-w-2xl">
          <h1 className="border-l-2 border-accent p-2">
            {parsedAnswer.header}
          </h1>
          <div className="w-full">
            <div className="text-xl font-bold">{t("answer.cards")}</div>
            <div className="my-4">
              {parsedAnswer.cards.length <= 3 ? (
                <div className="grid grid-cols-3 gap-2 max-w-md">
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
                {t("answer.prediction")}
              </motion.h1>
              <motion.p variants={textVariants}>
                {parsedAnswer?.reading}
              </motion.p>
              <motion.h1 className="text-xl font-bold" variants={textVariants}>
                {t("answer.final")}
              </motion.h1>
              <motion.ul variants={textVariants}>
                {parsedAnswer?.final.map((f, index) => (
                  <li key={index}>
                    {index + 1}. {f}
                  </li>
                ))}
              </motion.ul>

              <motion.h1 className="text-xl font-bold" variants={textVariants}>
                {t("answer.suggest")}
              </motion.h1>
              <motion.p
                className="text-sm text-gray-500 mb-2"
                variants={textVariants}
              >
                {t("answer.suggest_note") ||
                  "คลิกที่คำถามเพื่อดูคำทำนายเพิ่มเติม"}
              </motion.p>
              <motion.ul variants={textVariants}>
                {parsedAnswer?.suggest.map((s, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      localStorage.setItem("selectedQuestion", s);
                      router.push("/questions");
                    }}
                    className="cursor-pointer hover:text-accent transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="text-accent group-hover:scale-110 transition-transform">
                      →
                    </span>
                    <span className="group-hover:underline">
                      {index + 1}. {s}
                    </span>
                  </li>
                ))}
              </motion.ul>

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
