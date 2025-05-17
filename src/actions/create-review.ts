"use server";

import { createReview, updateActivityBonus } from "@/services/torso";
import { levelUp } from "@/services/torso/level";

export async function createReviewAction(data: {
  questionAnswerId: number;
  lineId: string;
  accurateLevel: number;
}) {
  try {
    const activityCode = "reading_review";
    const result = await createReview(data);

    if (result) {
      const bonusUpdateResult = await updateActivityBonus(
        data.lineId,
        activityCode
      );

      if (!bonusUpdateResult.success) {
        return {
          success: false,
          message: "Bonus Update Failed",
        };
      }
    }

    await levelUp(data.lineId);

    return {
      success: result,
      message: result
        ? "Review created successfully"
        : "Failed to create review",
    };
  } catch (error) {
    console.error("Error creating review:", error);
    return {
      success: false,
      message: "An error occurred while creating review",
    };
  }
}
