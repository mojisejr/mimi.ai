import { torso } from "./torso-db";

export const levelUp = async (lineId: string) => {
  /**
   * 1. get current level of user id
   * 2. get current exp and current level from user_point
   * 3. get level config ดึงเอา exp-total ของ level +1  ขุึนมา
   * 4. ถ้า current exp >= exp-total ให้ up level + 1
   */

  try {
    //1. ดึงข้อมูล exp ปัจจุบันของ user
    const userQuery = await torso.execute({
      sql: `SELECT * FROM user_point WHERE line_id = ?`,
      args: [lineId],
    });

    if (userQuery.rows.length <= 0) {
      throw new Error("User Not Found!");
    }

    const userLevel = userQuery.rows[0].level as number;
    const userCurrentExp = userQuery.rows[0].exp as number;

    //2. ดึงข้อมูล exp ของ level ถัดไป
    const levelConfigQuery = await torso.execute({
      sql: `SELECT * FROM level_config WHERE level = ?`,
      args: [userLevel + 1],
    });

    if (levelConfigQuery.rows.length <= 0) {
      throw new Error("Level Config Not Found");
    }

    const nextLevel = levelConfigQuery.rows[0].level as number;
    const expForThisLevel = levelConfigQuery.rows[0].exp_total as number;

    console.log("current exp: ", userCurrentExp);
    console.log("next level exp: ", expForThisLevel);
    console.log("level up ?: ", userCurrentExp >= expForThisLevel);

    //3. check ว่า current exp มากกว่า หรือ เท่ากับ exp total
    if (userCurrentExp >= expForThisLevel) {
      //update level
      const updateLevelResult = await torso.execute({
        sql: `UPDATE user_point SET level = ? WHERE line_id = ?`,
        args: [nextLevel, lineId],
      });

      if (updateLevelResult.rowsAffected === 0) {
        throw new Error("Level Update Failed!");
      }
    }

    return {
      success: true,
      level: {
        prev: userLevel,
        current: nextLevel,
      },
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
