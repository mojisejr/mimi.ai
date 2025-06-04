"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Props {
  name: string;
  flipped: boolean;
  image: string;
  onClick: () => void;
}

export default function AnswerCard({ name, image, flipped, onClick }: Props) {
  return (
    <motion.div
      initial={{ rotateY: 360 }}
      className="relative max-w-[150px] h-48  cursor-pointer"
      onClick={onClick}
      animate={{ rotateY: flipped ? 360 : 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Front Side */}
      <motion.div
        className={`absolute inset-0 flex items-center justify-center bg-white shadow-xl rounded-xl ${
          flipped ? "opacity-100" : "opacity-0"
        }`}
      >
        <Image
          // src={`/images/cards/${image}`}
          src={image}
          alt={name}
          fill
          // width={512}
          // height={512}
          // className="w-full h-full rounded-xl"
        />
      </motion.div>

      {/* Back Side */}
      <motion.div
        className={`absolute inset-0 flex items-center justify-center shadow-xl rounded-xl 
            ${flipped ? "opacity-0" : "opacity-100"}
            border-[1px] border-opacity-30 border-amber-300`}
        style={{
          perspective: "1000px",
          background: `
                  radial-gradient(circle at top left, rgba(255, 255, 255, 0.4) 10%, transparent 50%),
                  linear-gradient(to bottom right, rgba(255, 200, 100, 0.9), rgba(255, 150, 50, 0.8)),
                  radial-gradient(circle at center, rgba(255, 255, 255, 0.2), transparent 50%)
                `,
          boxShadow:
            "inset 0px 4px 10px rgba(255, 255, 255, 0.3), 0px 10px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="absolute inset-0 bg-white opacity-20 blur-xl rounded-md"></div>
        <div className="relative h-[50px] w-[50px]">
          {/* <div className="absolute top-0 left-0 loading loading-ring bg-gradient-to-br from-primary to-accent w-[50px]"></div> */}
          <div className="absolute loading loading-infinity bg-gradient-to-br from-accent to-primary w-[50px]"></div>
        </div>
        <div className="absolute bottom-2 text-xs">mimi.ai</div>
      </motion.div>
    </motion.div>
  );
}
