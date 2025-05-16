"use server";
import { getReading } from "@/services/torso";

export const getReadingsByUserId = async (userId: string) => {
  return await getReading(userId);
};
