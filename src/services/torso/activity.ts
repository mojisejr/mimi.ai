import { torso } from "./torso-db";

export const updateActivityBonus = async (lineId: string, code: string) => {
  /**
   * 1. find user
   * 2. check if user found?
   * 3. get their current level
   * 4. get activity by type
   * 5. check activity bonus for the user current level
   * 6. update user bonus to the point transaction
   * 7. update user bonus (eg. coins, exp)
   * @notice make up transaction make sure if one of them error will reject all database operation and throw error
   */

  try {
    //1. find user
    const userQuery = await torso.execute({
      sql: `SELECT * FROM user_point WHERE line_id = ?`,
      args: [lineId],
    });

    if (userQuery.rows.length <= 0) {
      throw Error("User Not Found!");
    }

    const userData = userQuery.rows[0];
    const userCurrentLevel = userData.level;

    console.log("found user: ", userCurrentLevel);

    //2.get activity type จะดึงข้อมูล activiy ขึ้นมาตาม level โดยเเอา level ต่ำกว่าหรือเท่ากัน ออกมา เช่นถ้า level 2 แล้วเจอ code มีทั้ง 1 3 5 เราจะดึง record ที่ น้อยกว่ามา 1 ระดับ
    const activityQuery = await torso.execute({
      sql: `SELECT * FROM activity_bonus 
            WHERE activity_code = ? 
            AND level <= ? 
            ORDER BY level DESC 
            LIMIT 1`,
      args: [code, userCurrentLevel],
    });

    if (activityQuery.rows.length <= 0) {
      throw new Error("Activity Not Found!");
    }

    const activity = activityQuery.rows[0];
    const activityCode = activity.activity_code as string;
    const bonusCoin = activity.bonus_coins as number;
    const bonusExp = activity.bonus_exp as number;

    console.log("found activity: ", activity);

    //3. update bonus to point_tranasction

    const transaction = await torso.transaction("write");

    try {
      await transaction.execute({
        sql: `INSERT INTO point_transactions (event_type, delta_coins, delta_exp, line_id) VALUES(?, ?, ?, ?)`,
        args: [activityCode, bonusCoin, bonusExp, lineId],
      });

      await transaction.execute({
        sql: `UPDATE user_point SET coins = coins + ?, exp = exp + ? WHERE line_id = ?`,
        args: [bonusCoin, bonusExp, lineId],
      });

      await transaction.commit();
    } finally {
      transaction.close();
    }

    return {
      success: true,
      bonus: {
        coins: bonusCoin,
        exp: bonusExp,
      },
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
