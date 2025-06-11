"use client";
import { PackageInfo } from "@/interfaces/i-package";
import { useLanguage } from "@/providers/language";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

interface RefillCardProps {
  id: number;
  packageTitle?: string;
  creditAmount?: string | number;
  creditAmountNumber: number;
  priceNumber: number;
  price?: string | number;
  currency?: string;
  subtitle?: string;
  ctaText?: string;
  setSelectedPack: (pack: PackageInfo) => void;
}

export default function CreditCard({
  id,
  packageTitle,
  creditAmount,
  creditAmountNumber,
  priceNumber,
  price,
  currency,
  subtitle,
  ctaText,
  setSelectedPack,
}: RefillCardProps) {
  return (
    <motion.div
      className="card w-full max-w-[280px] bg-gradient-to-br from-primary/90 to-secondary/90 shadow-xl backdrop-blur-sm overflow-hidden"
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
        {/* Package Title */}
        <motion.h2
          className="text-center text-2xl font-bold text-primary-content mb-4"
          whileHover={{ scale: 1.03 }}
        >
          {packageTitle}
        </motion.h2>

        {/* Credit Amount */}
        <motion.div className="text-center mb-6" whileHover={{ scale: 1.05 }}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <FaStar className="text-warning text-xl" />
            <span className="font-semibold text-primary-content">แพ็ค</span>
            <FaStar className="text-warning text-xl" />
          </div>
          <div className="text-3xl font-bold text-primary-content mb-2">
            {creditAmount} คำถาม
          </div>
          <p className="text-sm text-primary-content/80 italic">"{subtitle}"</p>
        </motion.div>

        {/* Price */}
        <motion.div className="text-center mb-6" whileHover={{ scale: 1.03 }}>
          <div className="text-lg font-semibold text-primary-content mb-2">
            ราคา
          </div>
          <div className="text-2xl font-bold text-primary-content">
            {currency}
            {price}
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          onClick={() =>
            setSelectedPack({
              id,
              packageTitle,
              creditAmount,
              creditAmountNumber,
              priceNumber,
              price,
              currency,
              subtitle,
              ctaText,
            })
          }
          className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-primary-content rounded-xl font-medium hover:opacity-90 transition-opacity"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {ctaText}
        </motion.button>
      </div>
    </motion.div>
  );
}
