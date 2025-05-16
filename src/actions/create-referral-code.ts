"use server";

import { createReferralCode } from "@/services/torso/referral";

export const createReferralCodeAction = async (
  lineId: string
): Promise<void> => {
  try {
    await createReferralCode(lineId);
  } catch (error) {
    console.error("Error in createReferralCodeAction:", error);
    throw error;
  }
};
