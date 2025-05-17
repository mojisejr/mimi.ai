"use server";

import { useReferralCode } from "@/services/torso/referral";
import { IReferralResult } from "@/interfaces/i-referral-code-action";

export const useReferralCodeAction = async (
  referrerLineId: string,
  code: string
): Promise<IReferralResult> => {
  try {
    const result = await useReferralCode(referrerLineId, code);
    return {
      success: true,
      data: {
        coins: Number(result.referrer.coins),
        exp: Number(result.referrer.exp),
      },
    };
  } catch (error) {
    console.error("Referral error:", error);

    // จัดการ error ตามประเภท
    if (error instanceof Error) {
      if (error.message === "Invalid referral code") {
        return {
          success: false,
          error: {
            code: "INVALID_CODE",
            message: "รหัสแนะนำไม่ถูกต้อง",
          },
        };
      }

      if (error.message === "Cannot use your own referral code") {
        return {
          success: false,
          error: {
            code: "SELF_REFERRAL",
            message: "ไม่สามารถใช้รหัสแนะนำของตัวเองได้",
          },
        };
      }

      if (error.message === "This referral code has already been used") {
        return {
          success: false,
          error: {
            code: "ALREADY_USED",
            message: "คุณได้ใช้รหัสแนะนำนี้ไปแล้ว",
          },
        };
      }
    }

    // กรณี error อื่นๆ
    return {
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
      },
    };
  }
};
