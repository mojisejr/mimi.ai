"use server";
import { getActivePack } from "@/services/torso/pack";

export const getActivePacks = async () => {
  return await getActivePack();
};
