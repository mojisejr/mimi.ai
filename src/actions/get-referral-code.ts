"use server";

import { getReferralCode } from "@/services/torso/referral";
import { IReferralCode } from "@/interfaces/i-referral";

export const getReferralCodeAction = async (
  lineId: string
): Promise<IReferralCode> => {
  try {
    return await getReferralCode(lineId);
  } catch (error) {
    console.error("Error in getReferralCodeAction:", error);
    throw error;
  }
};
