"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaExchangeAlt, FaCoins, FaStar } from "react-icons/fa";
import { IoMdSwap } from "react-icons/io";

// Mock data
const MOCK_RATE = 10; // 10 coins = 1 point
const MOCK_USER_COINS = 1000;

export default function PointSwapPage() {
  const [coins, setCoins] = useState<string>("");
  const [points, setPoints] = useState<string>("");

  const handleCoinsChange = (value: string) => {
    setCoins(value);
    const calculatedPoints = value
      ? (Number(value) / MOCK_RATE).toString()
      : "";
    setPoints(calculatedPoints);
  };

  const handlePointsChange = (value: string) => {
    setPoints(value);
    const calculatedCoins = value ? (Number(value) * MOCK_RATE).toString() : "";
    setCoins(calculatedCoins);
  };

  const handleSwap = () => {
    // Mock swap function
    console.log("แลก", coins, "เหรียญเป็น", points, "คะแนน");
  };

  return (
    <div className="h-5/6 bg-base-200 p-4 overflow-y-scroll">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-base-100 shadow-xl"
        >
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold mb-4">
              แลกเหรียญเป็นคะแนน
            </h2>

            {/* Available Balance */}
            <div className="bg-base-200 rounded-lg p-4 mb-4">
              <p className="text-sm opacity-70">ยอดเหรียญที่มี</p>
              <div className="flex items-center gap-2">
                <FaCoins className="text-yellow-500" />
                <span className="font-bold">{MOCK_USER_COINS} เหรียญ</span>
              </div>
            </div>

            {/* Swap Interface */}
            <div className="space-y-4">
              {/* From */}
              <div className="bg-base-200 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm opacity-70">จาก</span>
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() =>
                      handleCoinsChange(MOCK_USER_COINS.toString())
                    }
                  >
                    จำนวนสูงสุด
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={coins}
                    onChange={(e) => handleCoinsChange(e.target.value)}
                    placeholder="0.0"
                    className="input input-ghost w-full text-2xl"
                  />
                  <div className="flex items-center gap-2 bg-base-300 px-3 py-2 rounded-lg">
                    <FaCoins className="text-yellow-500" />
                    <span>เหรียญ</span>
                  </div>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="btn btn-circle btn-ghost"
                >
                  <IoMdSwap className="text-2xl" />
                </motion.button>
              </div>

              {/* To */}
              <div className="bg-base-200 rounded-lg p-4">
                <span className="text-sm opacity-70">เป็น</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={points}
                    onChange={(e) => handlePointsChange(e.target.value)}
                    placeholder="0.0"
                    className="input input-ghost w-full text-2xl"
                  />
                  <div className="flex items-center gap-2 bg-base-300 px-3 py-2 rounded-lg">
                    <FaStar className="text-blue-500" />
                    <span>คะแนน</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary w-full mt-6"
              onClick={handleSwap}
              disabled={
                !coins || Number(coins) <= 0 || Number(coins) > MOCK_USER_COINS
              }
            >
              แลก
            </motion.button>

            {/* Rate Info */}
            <div className="text-center mt-4 text-sm opacity-70">
              <p>อัตราแลกเปลี่ยน: 1 คะแนน = {MOCK_RATE} เหรียญ</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
