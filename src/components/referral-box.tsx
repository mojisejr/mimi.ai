"use client";

import { motion } from "framer-motion";
import { FaCopy, FaUserPlus } from "react-icons/fa";
import { useState, useEffect } from "react";
import { IReferralCode } from "@/interfaces/i-referral";
import { getReferralCodeAction } from "@/actions/get-referral-code";
import { createReferralCodeAction } from "@/actions/create-referral-code";
import { useReferralCodeAction } from "@/actions/use-referral-code";
import { useUser } from "@/contexts/user-context";
import { toast } from "react-toastify";
import { useLanguage } from "@/providers/language";

type Props = {
  image: string;
};

export default function ReferralBox() {
  const { user, updateUserStats } = useUser();
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState<IReferralCode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [friendCode, setFriendCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchReferralCode = async () => {
      try {
        const code = await getReferralCodeAction(user.lineId);
        setReferralCode(code);
      } catch (error) {
        console.error("Error fetching referral code:", error);
      }
    };

    fetchReferralCode();
  }, [user.lineId]);

  const handleGenerateCode = async () => {
    setIsLoading(true);
    try {
      await createReferralCodeAction(user.lineId);
      const code = await getReferralCodeAction(user.lineId);
      setReferralCode(code);
    } catch (error) {
      console.error("Error generating referral code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUseReferralCode = async () => {
    if (!friendCode.trim()) {
      toast.error("กรุณากรอกรหัสแนะนำ", { autoClose: 3000 });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await useReferralCodeAction(user.lineId, friendCode);

      if (result.success && result.data) {
        // อัพเดท user stats ใน context
        updateUserStats(result.data.coins, result.data.exp);
        toast.success(
          `ยินดีด้วย! คุณได้รับ ${result.data.coins} coins และ ${result.data.exp} exp`,
          { autoClose: 3000 }
        );
        setFriendCode(""); // เคลียร์ input หลังจากใช้รหัสสำเร็จ
      } else {
        toast.error(
          result.error?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
          { autoClose: 3000 }
        );
      }
    } catch (error) {
      console.error("Error using referral code:", error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", { autoClose: 3000 });
    } finally {
      setIsSubmitting(false);
    }
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
          <h2 className="text-xl font-bold text-primary-content">
            {t("referralBox.title")}
          </h2>
        </motion.div>

        {/* Referral Code Section */}
        {referralCode ? (
          <motion.div
            className="bg-secondary/30 rounded-xl p-4 flex flex-col items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-sm text-primary-content/80">
              {t("referralBox.yourCode")}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary-content tracking-wider">
                {referralCode.code}
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
                {t("referralBox.copied")}
              </motion.span>
            )}
          </motion.div>
        ) : (
          <motion.div
            className="bg-secondary/30 rounded-xl p-4 flex flex-col items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-sm text-primary-content/80 mb-2">
              {t("referralBox.noCode")}
            </span>
            <motion.button
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerateCode}
              disabled={isLoading}
            >
              {isLoading
                ? t("referralBox.createLoading")
                : t("referralBox.createBtn")}
            </motion.button>
          </motion.div>
        )}

        {/* Enter Friend's Referral Code */}
        <motion.div
          className="bg-secondary/30 rounded-xl p-4 flex flex-col items-center gap-2 mt-4"
          whileHover={{ scale: 1.02 }}
        >
          <span className="text-sm text-primary-content/80">
            {t("referralBox.insertYourFriendCode")}
          </span>
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              placeholder="referral code"
              className="input input-bordered w-full max-w-xs bg-primary/20 text-primary-content placeholder:text-primary-content/50"
              maxLength={8}
              value={friendCode}
              onChange={(e) => setFriendCode(e.target.value)}
              disabled={isSubmitting}
            />
            <motion.button
              className="btn btn-primary btn-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUseReferralCode}
              disabled={isSubmitting}
            >
              {isSubmitting ? t("referralBox.loading") : t("referralBox.btn")}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
