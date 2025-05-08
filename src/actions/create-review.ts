"use server";

import { createReview } from "@/services/torso-db";

export async function createReviewAction(data: {
  question_answer_id: number;
  line_id: string;
  accurate_level: number;
}) {
  try {
    const result = await createReview(data);
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
