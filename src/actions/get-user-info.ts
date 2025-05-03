"use server";

import { getUserInfo } from "@/services/torso-db";

export const getUser = async (userId: string) => {
  try {
    const user = await getUserInfo(userId);

    return user;
  } catch (error) {
    return null;
  }
};
