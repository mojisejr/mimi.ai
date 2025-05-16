"use server";

import { getUserInfo } from "@/services/torso";

export const getUser = async (userId: string) => {
  try {
    const user = await getUserInfo(userId);

    return user;
  } catch (error) {
    return null;
  }
};
