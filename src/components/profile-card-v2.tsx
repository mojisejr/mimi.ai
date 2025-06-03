"use client";

import { motion } from "framer-motion";
import { FaCoins } from "react-icons/fa";
import { IoMdStar } from "react-icons/io";
import Image from "next/image";
import { useUser } from "@/contexts/user-context";
import { useEffect, useState } from "react";

type Props = {
  image: string;
};

const calculateProgress = (
  exp: number,
  nextExpRequired: number,
  nextExpTotal: number
): number => {
  // คำนวณ exp ที่เหลือต้องใช้เพื่อไปถึงเลเวลถัดไป
  const remainingExp = nextExpTotal - exp;

  // คำนวณ exp ทั้งหมดที่ต้องใช้ในเลเวลนี้
  const totalExpForLevel = nextExpTotal - (nextExpTotal - nextExpRequired);

  // คำนวณ progress
  const progress = ((totalExpForLevel - remainingExp) / totalExpForLevel) * 100;

  // ตรวจสอบค่า progress ต้องอยู่ระหว่าง 0-100
  return Math.min(Math.max(progress, 0), 100);
};

export default function ProfileCardV2({ image }: Props) {
  const { user } = useUser();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const newProgress = calculateProgress(
      user.exp,
      user.nextExpRequired,
      user.nextExpTotal
    );
    setProgress(newProgress);
  }, [user.exp, user.nextExpRequired, user.nextExpTotal]);

  const currentExp = user.exp;
  const maxExp = user.nextExpTotal;

  return (
    <motion.div
      className="card w-full max-w-[350px] bg-gradient-to-br from-primary/90 to-secondary/90 shadow-xl backdrop-blur-sm overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      {/* Mystical background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-primary/20 blur-3xl"></div>
        <div className="absolute top-40 -right-20 w-60 h-60 rounded-full bg-secondary/20 blur-3xl"></div>
        <div className="absolute -bottom-20 left-20 w-40 h-40 rounded-full bg-accent/20 blur-3xl"></div>

        {/* Stars */}
        <div className="stars absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
      </div>

      <div className="card-body relative z-10">
        {/* Avatar with glow effect */}
        <motion.div
          className="flex justify-center -mt-6 mb-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary blur-md opacity-70 scale-110"></div>
            <div className="relative rounded-full border-2 border-primary-content/50 overflow-hidden w-24 h-24">
              <Image
                src={image || "/placeholder.svg"}
                alt={user.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </motion.div>

        {/* User name */}
        <motion.h2
          className="text-center text-2xl font-bold text-white mb-1"
          whileHover={{ scale: 1.03 }}
        >
          {user.name}
        </motion.h2>

        {/* Level badge */}
        <div className="flex justify-center mb-4">
          <motion.div
            className="badge badge-lg bg-gradient-to-r from-secondary to-primary border-none text-primary-content px-4 py-3"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Level {user.level}
          </motion.div>
        </div>

        {/* EXP progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-primary-content mb-1">
            <span>EXP</span>
            <span>
              {currentExp} / {maxExp}
            </span>
          </div>
          <div className="w-full h-3 bg-base-300/50 rounded-full overflow-hidden">
            <motion.div
              key={`${currentExp}-${maxExp}`}
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full relative"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
            </motion.div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          <motion.div
            className="bg-secondary/30 rounded-xl p-3 flex items-center justify-between"
            whileHover={{ scale: 1.03 }}
          >
            <div className="flex flex-col items-center justify-center">
              <FaCoins className="text-yellow-300  text-xl" />
              <span className="text-primary-content text-xs">Coins</span>
            </div>
            <span className="text-primary-content font-bold">{user.coins}</span>
          </motion.div>

          <motion.div
            className="bg-secondary/30 rounded-xl p-3 flex items-center justify-between"
            whileHover={{ scale: 1.03 }}
          >
            <div className="flex-col items-center justify-center flex">
              <IoMdStar className="text-green-400 text-xl" />
              <span className="text-primary-content text-xs">Stars</span>
            </div>
            <span className="text-primary-content font-bold text-sm">
              {user.point}
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
