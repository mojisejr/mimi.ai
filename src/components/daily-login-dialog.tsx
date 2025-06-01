"use client";

import { getDailyLoginStatus, claimDailyLogin } from "@/actions/daily-login";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaCoins } from "react-icons/fa";
import { IoMdStar } from "react-icons/io";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  lineId: string;
};

export default function DailyLoginDialog({ isOpen, onClose, lineId }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      checkStatus();
    }
  }, [isOpen]);

  const checkStatus = async () => {
    try {
      setIsLoading(true);
      const result = await getDailyLoginStatus(lineId);
      if (result.success) {
        setStatus(result.data);
      } else {
        console.error("Error checking daily login status:", result.error);
      }
    } catch (error) {
      console.error("Error checking daily login status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaim = async () => {
    try {
      setIsClaiming(true);
      const result = await claimDailyLogin(lineId);
      if (result.success) {
        await checkStatus(); // Refresh status after claiming
      } else {
        console.error("Error claiming reward:", result.error);
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
    } finally {
      setIsClaiming(false);
    }
  };

  const canClaim = status?.canClaim && !status?.hasClaimedToday;

  return (
    <>
      {isOpen && (
        <dialog id="daily_login_dialog" className="modal modal-open">
          <div className="modal-box bg-gradient-to-br from-primary/90 to-secondary/90 shadow-xl backdrop-blur-sm overflow-hidden">
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

            {/* Content */}
            <div className="relative">
              {/* <h2 className="text-2xl font-bold text-white mb-4">
                Daily Login Reward
              </h2> */}

              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="loading loading-infinity loading-lg bg-gradient-to-br from-accent to-primary"></div>
                </div>
              ) : status ? (
                <div className="space-y-4">
                  {/* Campaign Info */}
                  <div className="bg-secondary/30 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {status.campaign?.title || "No Active Campaign"}
                    </h3>
                    {status.campaign && (
                      <div className="text-sm text-white/80">
                        <p>
                          Start:{" "}
                          {new Date(
                            status.campaign.startDate * 1000
                          ).toLocaleDateString()}
                        </p>
                        <p>
                          End:{" "}
                          {new Date(
                            status.campaign.endDate * 1000
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Progress */}
                  {status.userProgress && (
                    <div className="bg-secondary/30 rounded-xl p-4">
                      <div className="flex justify-between text-sm text-white mb-2">
                        <span>Progress</span>
                        <span>
                          {status.userProgress.claimedDays} /{" "}
                          {status.userProgress.totalDays} days
                        </span>
                      </div>
                      <div className="w-full h-3 bg-base-300/50 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full relative"
                          style={{
                            width: `${
                              (status.userProgress.claimedDays /
                                status.userProgress.totalDays) *
                              100
                            }%`,
                          }}
                          initial={{ width: 0 }}
                          animate={{
                            width: `${
                              (status.userProgress.claimedDays /
                                status.userProgress.totalDays) *
                              100
                            }%`,
                          }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        >
                          <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                        </motion.div>
                      </div>
                    </div>
                  )}

                  {/* Status Message */}
                  {status.message && (
                    <div className="text-center text-white/80 text-sm">
                      {status.message}
                    </div>
                  )}

                  {/* Claim Button */}
                  <motion.button
                    className={`btn w-full ${
                      canClaim
                        ? "bg-gradient-to-r from-primary to-accent text-white"
                        : "btn-disabled"
                    }`}
                    onClick={handleClaim}
                    disabled={!canClaim || isClaiming}
                    whileHover={canClaim ? { scale: 1.02 } : {}}
                    whileTap={canClaim ? { scale: 0.98 } : {}}
                  >
                    {isClaiming ? (
                      <div className="flex gap-2 justify-center">
                        <div className="loading loading-infinity loading-sm loading-primary"></div>
                        <span>Claiming...</span>
                      </div>
                    ) : status.hasClaimedToday ? (
                      "คุณได้ claim วันนี้แล้ว"
                    ) : status.canClaim ? (
                      "Claim Reward"
                    ) : (
                      "All Rewards Claimed"
                    )}
                  </motion.button>
                </div>
              ) : (
                <div className="text-center text-white">
                  Failed to load status
                </div>
              )}

              {/* Close Button */}
              <div className="modal-action">
                <motion.button
                  className="btn btn-ghost text-white"
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop bg-black/60" onClick={onClose}></div>
        </dialog>
      )}
    </>
  );
}
