"use server";
import { getReading } from "@/services/torso-db";

export const getReadingsByUserId = async (userId: string) => {
  return await getReading(userId);
};
