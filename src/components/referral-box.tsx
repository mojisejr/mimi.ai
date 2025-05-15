"use client";

import { IUser } from "@/interfaces/i-user-info";
import { motion } from "framer-motion";
import { FaCopy, FaUserPlus } from "react-icons/fa";
import { useState } from "react";

type Props = {
  user: IUser;
};

export default function ReferralBox({ user }: Props) {
  const [copied, setCopied] = useState(false);
  const referralCode = user.lineId.slice(10, 18).toUpperCase();

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="card w-full max-w-[350px] bg-gradient-to-br from-primary/90 to-secondary/90 shadow-xl backdrop-blur-sm overflow-hidden mt-4"
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
          {[...Array(10)].map((_, i) => (
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
        {/* Title */}
        <motion.div
          className="flex items-center justify-center gap-2 mb-4"
          whileHover={{ scale: 1.03 }}
        >
          <FaUserPlus className="text-2xl text-primary-content" />
          <h2 className="text-xl font-bold text-primary-content">เชิญเพื่อน</h2>
        </motion.div>

        {/* Referral Code */}
        <motion.div
          className="bg-secondary/30 rounded-xl p-4 flex flex-col items-center gap-2"
          whileHover={{ scale: 1.02 }}
        >
          <span className="text-sm text-primary-content/80">
            รหัสแนะนำของคุณ
          </span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-content tracking-wider">
              {referralCode}
            </span>
            <motion.button
              className="btn btn-circle btn-sm bg-accent/50 hover:bg-accent/70 border-none"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
            >
              <FaCopy className="text-primary-content" />
            </motion.button>
          </div>
          {copied && (
            <motion.span
              className="text-xs text-white"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              คัดลอกแล้ว!
            </motion.span>
          )}
        </motion.div>

        {/* Enter Friend's Referral Code */}
        <motion.div
          className="bg-secondary/30 rounded-xl p-4 flex flex-col items-center gap-2 mt-4"
          whileHover={{ scale: 1.02 }}
        >
          <span className="text-sm text-primary-content/80">
            ใส่รหัสแนะนำของเพื่อน
          </span>
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              placeholder="ใส่รหัสแนะนำ"
              className="input input-bordered w-full max-w-xs bg-primary/20 text-primary-content placeholder:text-primary-content/50"
              maxLength={8}
            />
            <motion.button
              className="btn btn-primary btn-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ใช้รหัส
            </motion.button>
          </div>
        </motion.div>

        {/* Benefits */}
        {/* <div className="mt-4">
          <h3 className="text-sm font-medium text-primary-content mb-2">
            สิทธิประโยชน์
          </h3>
          <ul className="text-xs text-primary-content/80 space-y-1">
            <li>• รับ 100 coins เมื่อเพื่อนใช้รหัสของคุณ</li>
            <li>• รับ 50 points เมื่อเพื่อนใช้รหัสของคุณ</li>
            <li>• เพื่อนที่ใช้รหัสจะได้รับ 50 coins</li>
          </ul>
        </div> */}
      </div>
    </motion.div>
  );
}
