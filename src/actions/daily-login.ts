"use server";

import {
  checkDailyLoginStatus,
  claimDailyLoginReward,
  checkDailyClaimStatus,
} from "@/services/torso/daily-login";
import { torso } from "@/services/torso";

/**
 * Server action สำหรับตรวจสอบสถานะ daily login
 * @param lineId - Line user ID
 * @returns ข้อมูลสถานะ daily login
 */
export async function getDailyLoginStatus(lineId: string) {
  try {
    const [status, claimStatus] = await Promise.all([
      checkDailyLoginStatus(lineId),
      checkDailyClaimStatus(lineId),
    ]);

    return {
      success: true,
      data: {
        ...status,
        hasClaimedToday: claimStatus.hasClaimedToday,
        message: claimStatus.message,
      },
    };
  } catch (error) {
    console.error("Error in getDailyLoginStatus:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Server action สำหรับ claim daily login reward
 * @param lineId - Line user ID
 * @returns ผลลัพธ์การ claim reward
 */
export async function claimDailyLogin(lineId: string) {
  try {
    const claimStatus = await checkDailyClaimStatus(lineId);
    if (claimStatus.hasClaimedToday) {
      return {
        success: false,
        error: claimStatus.message,
      };
    }

    const result = await claimDailyLoginReward(lineId);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error in claimDailyLogin:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
