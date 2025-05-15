import { UserCreateDTO } from "@/interfaces/i-user-create";
import { IUser } from "@/interfaces/i-user-info";
import { torso } from "@/services/torso/torso-db";

/**
 * Adds new user information to the database
 * Creates user record and initializes user points if user doesn't exist
 * @param userData - User creation data containing lineId and name
 * @returns boolean indicating success/failure
 */
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

/**
 * Retrieves user information including points
 * @param userId - Line user ID
 * @returns User info object or null if not found
 */
export const getUserInfo = async (userId: string) => {
  try {
    const result = await torso.execute({
      sql: `SELECT 
        u.line_id, 
        u.name, 
        p.point, 
        p.coins, 
        p.exp, 
        p.level,
        lc.exp_required as current_exp_required,
        lc.exp_total as current_exp_total,
        next_lc.exp_required as next_exp_required,
        next_lc.exp_total as next_exp_total
      FROM user AS u 
      LEFT JOIN user_point AS p ON u.line_id = p.line_id 
      LEFT JOIN level_config AS lc ON p.level = lc.level
      LEFT JOIN level_config AS next_lc ON p.level + 1 = next_lc.level
      WHERE u.line_id = ?`,
      args: [userId],
    });

    return {
      lineId: result.rows[0].line_id,
      name: result.rows[0].name,
      point: result.rows[0].point,
      coins: result.rows[0].coins,
      exp: result.rows[0].exp,
      level: result.rows[0].level,
      currentExpRequired: result.rows[0].current_exp_required,
      currentExpTotal: result.rows[0].current_exp_total,
      nextExpRequired: result.rows[0].next_exp_required,
      nextExpTotal: result.rows[0].next_exp_total,
    } as IUser;
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * Gets current point balance for a user
 * @param userId - Line user ID
 * @returns number of points or 0 if error
 */
export const getUserPoint = async (userId: string) => {
  try {
    const result = await torso.execute({
      sql: "SELECT point FROM user_point WHERE line_id = ?",
      args: [userId],
    });

    const point = result.rows[0].point as number;

    return point;
  } catch (error) {
    console.log(error);
    return 0;
  }
};

/**
 * Adds points to user's balance and records the transaction
 * @param userId - Line user ID
 * @param pointToAdd - Number of points to add
 * @returns boolean indicating success/failure
 */
export const addPointToUser = async (userId: string, pointToAdd: number) => {
  if (pointToAdd <= 0) return false;
  try {
    const result = await torso.batch([
      {
        sql: `UPDATE user_point SET point = point + ? WHERE line_id = ?`,
        args: [pointToAdd, userId],
      },
      {
        sql: `INSERT INTO user_point_history (line_id, action, amount) VALUES(?, ?, ?)`,
        args: [userId, "refilled", pointToAdd],
      },
    ]);

    console.log("addPointToUser: ", result);

    return result.length > 0 ? true : false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * Deducts points from user's balance
 * @param userId - Line user ID
 * @param currentPoint - Current point balance
 * @param pointToSub - Number of points to subtract
 * @returns boolean indicating success/failure
 */
export const subtractPointToUser = async (
  userId: string,
  currentPoint: number,
  pointToSub: number
) => {
  if (currentPoint <= 0) return false;
  if (pointToSub <= 0) return false;

  try {
    const point = await getUserPoint(userId);
    if (point <= 0) return false;
    await torso.batch([
      {
        sql: `UPDATE user_point SET point = point - ? WHERE line_id = ?`,
        args: [pointToSub, userId],
      },
    ]);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
