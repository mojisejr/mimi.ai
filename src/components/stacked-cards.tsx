"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useImageCache } from "@/hooks/use-image-cache";

type Props = {
  cards: { name: string; imageUrl: string }[];
};

export default function StackedCards({ cards }: Props) {
  if (cards.length <= 0) {
    return <div className="text-sm">ไม่พบรูปภาพ</div>;
  }
  return (
    <div className="relative w-[60px] h-[90px]">
      {cards.map((c, index) => {
        const { imageUrl, isLoading } = useImageCache(c.name, c.imageUrl);
        return (
          <motion.div
            key={index}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
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
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="loading loading-infinity bg-gradient-to-br from-accent to-primary w-[30px]"></div>
              </div>
            ) : (
              <Image
                src={imageUrl}
                alt="card"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
