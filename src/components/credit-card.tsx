"use client";
import { usePromptPay } from "@/hooks/promptpay";
import { PackageInfo } from "@/interfaces/i-package";
import { Profile } from "@/providers/line";
import { loadScript } from "@/utils/script-loader";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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
      className="relative w-full max-w-[280px] mx-auto"
      style={{ aspectRatio: "2/3" }}
      animate={{
        y: [0, -5, 0],
        rotate: [0, 0.5, 0, -0.5, 0],
      }}
      transition={{
        duration: 4,
        ease: "easeInOut",
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
    >
      <div
        className="absolute inset-0 rounded-md blur-md opacity-30 animate-pulse"
        style={{
          background: `
            radial-gradient(circle at top left, rgba(255, 255, 255, 0.4) 10%, transparent 50%),
            linear-gradient(to bottom right, rgba(255, 200, 100, 0.9), rgba(255, 150, 50, 0.8)),
            radial-gradient(circle at center, rgba(255, 255, 255, 0.2), transparent 50%)
          `,
        }}
      />
      <div className="relative w-full h-full rounded-md overflow-hidden shadow-xl">
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            animationDuration: "3s",
            background: `
              radial-gradient(circle at top left, rgba(255, 255, 255, 0.4) 10%, transparent 50%),
              linear-gradient(to bottom right, rgba(255, 200, 100, 0.9), rgba(255, 150, 50, 0.8)),
              radial-gradient(circle at center, rgba(255, 255, 255, 0.2), transparent 50%)
            `,
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-between p-6 text-amber-900">
          {/* Header */}
          <div className="text-center w-full">
            <h3 className="text-xl font-bold mb-1">{packageTitle}</h3>
            <div className="w-full h-px bg-amber-600/30 mb-2" />
          </div>

          {/* Credit Amount */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <FaStar className="h-4 w-4" />
              <span className="font-semibold">แพ็ค</span>
              <FaStar className="h-4 w-4" />
            </div>
            <div className="text-3xl font-bold mb-2">{creditAmount} คำถาม</div>
            <p className="text-xs opacity-80 italic mb-4">"{subtitle}"</p>
          </div>

          {/* Price */}
          <div className="text-center w-full">
            <div className="w-full h-px bg-amber-600/30 mb-2" />
            <div className="text-lg font-semibold mb-1">ราคา</div>
            <div className="text-2xl font-bold mb-4">
              {currency}
              {price}
            </div>

            {/* CTA Button */}
            <button
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
              className="w-full py-2 bg-amber-900 text-amber-100 rounded-md hover:bg-amber-800 transition-colors font-medium swap-off"
            >
              {ctaText}
            </button>
            {/* <div className="w-full swap-on flex flex-col gap-2">
                <button className="btn btn-sm text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800">
                  Promptpay
                </button>
                <button className="btn btn-sm text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800">
                  True Money QR
                </button>
                <button className="btn btn-sm text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800">
                  Mobile Banking
                </button>
              </div> */}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
