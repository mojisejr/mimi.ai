"use client";
import { motion } from "framer-motion";

const variants = {
  blinking: {
    opacity: [0, 0, 1, 1],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatDelay: 0,
      ease: "linear",
      times: [0, 0.5, 0.5, 1],
    },
  },
};

export default function Cursor() {
  return (
    <motion.div
      variants={variants}
      animate="blinking"
      className="inline-block h-[50px] w-[3px] translate-y-1 bg-primary"
    ></motion.div>
  );
}
