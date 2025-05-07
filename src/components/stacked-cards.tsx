"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const mockedImage = [
  "/images/cards/ace_of_cups.png",
  "/images/cards/ace_of_pentacles.png",
  "/images/cards/ace_of_wands.png",
];

type Props = {
  cards: { name: string; imageUrl: string }[];
};

export default function StackedCards({ cards }: Props) {
  console.log(cards);
  if (cards.length <= 0) {
    return <div className="text-sm">ไม่พบรูปภาพ</div>;
  }
  return (
    <div className="relative w-[60px] h-[90px]">
      {cards.map((c, index) => (
        <motion.div
          key={index}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            width: "55px",
            aspectRatio: "2/3",
            top: `${index * 4}px`,
            left: `${index * 10}px`,
          }}
        >
          <Image
            src={`/images/cards/${c.imageUrl}`}
            alt="card"
            fill
            className="object-contain"
          />
        </motion.div>
      ))}
    </div>
  );
}
