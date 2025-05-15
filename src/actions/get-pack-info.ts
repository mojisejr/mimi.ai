"use server";
import { getActivePack } from "@/services/torso";

export const getActivePacks = async () => {
  return await getActivePack();
};
