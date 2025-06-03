"use client";
import React, { useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { FaCoins, FaStar } from "react-icons/fa";
import { IoMdSwap } from "react-icons/io";
import { getExchangeSetting } from "@/actions/get-exchange-setting";
import { useLine } from "@/providers/line";
import { getUser } from "@/actions/get-user-info";
import { IUser } from "@/interfaces/i-user-info";
import { swapCoinsAction } from "@/actions/swap-coins";
import { toast } from "react-toastify";
import { IExchangeSetting } from "@/interfaces/i-exchage";

export default function PointSwapPage() {
  const { profile } = useLine();
  const [isPending, startTransition] = useTransition();
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const [coins, setCoins] = useState<string>("");
  const [points, setPoints] = useState<string>("");
  const [rate, setRate] = useState<number>(0);
  const [userCoins, setUserCoins] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [exchangeSetting, setExchangeSetting] = useState<IExchangeSetting>();

  useEffect(() => {
    handleGetExchageRate();
    handleGetUserInfo();
  }, []);

  const handleGetExchageRate = () => {
    setLoading(true);
    getExchangeSetting()
      .then((exchange) => {
        setExchangeSetting(exchange!);
        setRate(exchange?.coinPerUnit ?? 0);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  };

  const handleGetUserInfo = () => {
    setLoading(true);
    if (!profile) return;
    getUser(profile.userId)
      .then((profile) => {
        setUserInfo(profile);
        setUserCoins(profile?.coins ?? 0);
        setLoading(false);
      })
      .catch(() => setLoading(false))
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCoinsChange = (value: string) => {
    if (rate <= 0) return;
    const intValue = value ? Math.floor(Number(value)) : "";
    setCoins(intValue.toString());
    const calculatedPoints = intValue
      ? Math.floor(Number(intValue) / rate).toString()
      : "";
    setPoints(calculatedPoints);
  };

  const handlePointsChange = (value: string) => {
    if (rate <= 0) return;
    const intValue = value ? Math.floor(Number(value)) : "";
    setPoints(intValue.toString());
    const calculatedCoins = intValue
      ? (Number(intValue) * rate).toString()
      : "";
    setCoins(calculatedCoins);
  };

  const isValidSwapAmount = (coins: string): boolean => {
    if (!coins || rate <= 0) return false;
    const coinAmount = Number(coins);
    return coinAmount > 0 && coinAmount <= userCoins && coinAmount % rate === 0;
  };

  const handleSwap = async () => {
    if (rate <= 0 || !isValidSwapAmount(coins) || !profile || !exchangeSetting)
      return;

    startTransition(async () => {
      try {
        const result = await swapCoinsAction(
          profile.userId,
          exchangeSetting,
          Number(coins),
          Number(points)
        );

        if (result.success && result.data) {
          toast.success("แลกเหรียญสำเร็จ");
          // รีเซ็ตค่าและโหลดข้อมูลใหม่
          setCoins("");
          setPoints("");
          handleGetUserInfo();
        } else {
          toast.error(result.error?.message || "เกิดข้อผิดพลาด");
        }
      } catch (error) {
        console.error("Swap error:", error);
        toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    });
  };

  return (
    <div className="h-5/6 bg-base-200 p-4 overflow-y-scroll w-full">
      {!loading && rate > 0 && userInfo ? (
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-gradient-to-br from-primary/90 to-secondary/90 shadow-xl backdrop-blur-sm overflow-hidden"
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

            <div className="card-body relative">
              <h2 className="card-title text-2xl font-bold mb-4 text-white">
                แลกเหรียญเป็นคะแนน
              </h2>

              {/* Available Balance */}
              <motion.div
                className="bg-base-200/30 rounded-lg p-4 mb-4 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-sm opacity-70 text-white">ยอดเหรียญที่มี</p>
                <div className="flex items-center gap-2">
                  <FaCoins className="text-yellow-500" />
                  <span className="font-bold text-white">
                    {userCoins} เหรียญ
                  </span>
                </div>
              </motion.div>

              {/* Swap Interface */}
              <div className="space-y-4">
                {/* From */}
                <motion.div
                  className="bg-base-200/30 rounded-lg p-4 backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-sm opacity-70 text-white">จาก</span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn btn-ghost btn-xs text-white"
                      onClick={() => handleCoinsChange(userCoins.toString())}
                      aria-label="ใช้จำนวนเหรียญสูงสุด"
                    >
                      จำนวนสูงสุด
                    </motion.button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={coins}
                      onChange={(e) => handleCoinsChange(e.target.value)}
                      placeholder="0"
                      step="1"
                      min="0"
                      className="input input-ghost w-full text-2xl text-white placeholder:text-white/50"
                      aria-label="จำนวนเหรียญที่ต้องการแลก"
                    />
                    <div className="flex items-center gap-2 bg-base-300/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                      <FaCoins className="text-yellow-500" />
                      <span className="text-white">เหรียญ</span>
                    </div>
                  </div>
                </motion.div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    className="btn btn-circle btn-ghost text-white"
                    aria-label="สลับการแลกเปลี่ยน"
                  >
                    <IoMdSwap className="text-2xl" />
                  </motion.button>
                </div>

                {/* To */}
                <motion.div
                  className="bg-base-200/30 rounded-lg p-4 backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-sm opacity-70 text-white">เป็น</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={points}
                      onChange={(e) => handlePointsChange(e.target.value)}
                      placeholder="0"
                      step="1"
                      min="0"
                      className="input input-ghost w-full text-2xl text-white placeholder:text-white/50"
                      aria-label="จำนวนคะแนนที่จะได้รับ"
                    />
                    <div className="flex items-center gap-2 bg-base-300/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                      <FaStar className="text-blue-500" />
                      <span className="text-white">คะแนน</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Swap Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-primary w-full mt-6 text-white"
                onClick={handleSwap}
                disabled={!isValidSwapAmount(coins) || isPending}
                aria-label="ยืนยันการแลกเปลี่ยน"
              >
                {isPending ? "กำลังแลก..." : "แลก"}
              </motion.button>

              {/* Rate Info */}
              <div className="text-center mt-4 text-sm opacity-70 text-white">
                <p>อัตราแลกเปลี่ยน: 1 คะแนน = {rate} เหรียญ</p>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </div>
  );
}
