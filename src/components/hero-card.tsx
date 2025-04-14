"use client";
import { motion } from "framer-motion";

export default function HeroCard() {
  return (
    <motion.div
      initial={{
        y: 0,
        x: 0,
        rotate: 0,
        scale: 1,
        boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
      }}
      animate={{
        x: [0, -5, 5, -3, 3, 0],
        y: [0, -10, -5, 5 - 3, 0],
        rotate: [0, 1, -1, 2, -2, 0],
        rotateY: [0, 10, -10, 5, -5, 0],
        scaleX: [1, 0.98, 1],
        boxShadow: [
          "0px 10px 20px rgba(0, 0, 0, 0.2)",
          "0px 20px 30px rgba(0, 0, 0, 0.3)",
          "0px 15px 25px rgba(0, 0, 0, 0.25)",
          "0px 10px 20px rgba(0, 0, 0, 0.2)",
        ],
      }}
      transition={{
        duration: 6 + Math.random() * 2,
        ease: "easeInOut",
        repeat: Infinity,
      }}
      className="flex justify-center items-center max-w-[250px] max-h-[370px] h-full w-full  rounded-md shadow-2xl overflow-hidden border-[1px] border-opacity-30 border-amber-300  rotate-3"
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
      <div className="relative h-[200px] w-[200px]">
        <div className="absolute top-0 left-0 loading loading-ring bg-gradient-to-br from-primary to-accent w-[200px]"></div>
        <div className="absolute top-[25%] left-[25%] loading loading-infinity bg-gradient-to-br from-accent to-primary w-[100px]"></div>
      </div>
      <div className="absolute bottom-2">mimi.ai</div>
    </motion.div>
  );
}
