import { PaymentHistory } from "@/interfaces/i-payment-history";
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

export const getUserInfo = async (userId: string) => {
  try {
    const result = await torso.execute({
      sql: `SELECT u.line_id, u.name, p.point FROM user AS u LEFT JOIN user_point AS p ON u.line_id = p.line_id WHERE u.line_id = ?`,
      args: [userId],
    });

    return {
      userId: result.rows[0].userId,
      point: result.rows[0].point,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

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

export const addPaymentHistory = async (payment: PaymentHistory) => {
  try {
    const result = await torso.execute({
      sql: `INSERT INTO payment_history (line_id, pack_id, status, charge_id) VALUES(?, ?, ?, ?)`,
      args: [payment.lineId, payment.packId, payment.status, payment.chargeId],
    });

    console.log("addPaymentHistory: ", result);

    return result.rows.length > 0 ? true : false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

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
      {
        sql: `INSERT INTO user_point_history (line_id, action, amount) VALUES(?, ?, ?)`,
        args: [userId, "used", pointToSub],
      },
    ]);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getPaymentHistory = async (userId: string) => {
  try {
    const result = await torso.execute({
      sql: "SELECT ph.line_id, ph.status, ph.created_at, ph.charge_id, p.title, p.credit_amount FROM payment_history AS ph LEFT JOIN pack AS p ON ph.pack_id == p.id WHERE line_id = ?",
      args: [userId],
    });

    if (result.rows.length <= 0) {
      return [];
    }

    return result.rows;
  } catch (error) {
    console.log(error);
    return [];
  }
};
