"use server";

import { getExchangeSettingById } from "@/services/torso/exchange";

export const getExchangeSetting = async () => {
  let id = 1;

  try {
    const result = await getExchangeSettingById(id);

    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};
