"use server";

import { UserCreateDTO } from "@/interfaces/i-user-create";
import { addUserInfomation } from "@/services/torso";

export const addNewUserIfNotExist = async (userData: UserCreateDTO) => {
  await addUserInfomation(userData);
};
