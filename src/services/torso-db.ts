import { UserCreateDTO } from "@/interfaces/i-user-create";
import { createClient } from "@libsql/client";

export const torso = createClient({
  url: process.env.TORSO_DATABASE_URL!,
  authToken: process.env.TORSO_AUTH_TOKEN!,
});

export const addUserInfomation = async (userData: UserCreateDTO) => {
  try {
    const found = await torso.execute({
      sql: `SELECT * FROM user where line_id = ?`,
      args: [userData.lineId],
    });

    if (found.rows.length <= 0) {
      await torso.batch([
        {
          sql: `INSERT INTO user (line_id, name) VALUES (?, ?)`,
          args: [userData.lineId, userData.name],
        },
        {
          sql: `INSERT INTO user_point (line_id, last_update) VALUES (?, unixepoch())`,
          args: [userData.lineId],
        },
      ]);
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
