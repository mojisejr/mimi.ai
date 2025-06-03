import { torso } from "./torso-db";
import { IExchangeSetting } from "../../interfaces/i-exchage";

export async function getExchangeSettingById(
  id: number
): Promise<IExchangeSetting | null> {
  try {
    const result = await torso.execute({
      sql: "SELECT * FROM exchange_settings WHERE id = ? AND is_active = true",
      args: [id],
    });

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    return {
      id: Number(row.id),
      exchangeType: String(row.exchange_type),
      receivedItem: String(row.received_item),
      coinPerUnit: Number(row.coin_per_unit),
      isActive: Boolean(row.is_active),
      metadata: String(row.metadata),
      createdAt: new Date((row.created_at as number) * 1000),
      updatedAt: new Date((row.updated_at as number) * 1000),
    };
  } catch (error) {
    console.error("Error fetching exchange setting:", error);
    throw error;
  }
}

export const swapCoins = async (
  lineId: string,
  exchangeSetting: IExchangeSetting,
  inputCoins: number,
  outputPoint: number
) => {
  try {
    // 1. ตรวจสอบว่า user มี coins พอหรือไม่
    const userQuery = await torso.execute({
      sql: `SELECT * FROM user_point WHERE line_id = ?`,
      args: [lineId],
    });

    if (userQuery.rows.length === 0) {
      throw new Error("User not found");
    }

    const userCoins = userQuery.rows[0].coins as number;
    if (userCoins < inputCoins) {
      throw new Error("Insufficient coins");
    }

    // 2. เริ่ม transaction
    const transaction = await torso.transaction("write");
    try {
      // 2.2 update user point table
      await transaction.execute({
        sql: `UPDATE user_point 
              SET coins = coins - ?, 
                  point = point + ? 
              WHERE line_id = ?`,
        args: [inputCoins, outputPoint, lineId],
      });

      // 2.3 update point transactions
      await transaction.execute({
        sql: `INSERT INTO point_transactions 
              (line_id, event_type, delta_coins, delta_point) 
              VALUES (?, ?, ?, ?)`,
        args: [lineId, exchangeSetting.exchangeType, -inputCoins, outputPoint],
      });

      // 2.4 update coin exchange history
      await transaction.execute({
        sql: `INSERT INTO coin_exchanges 
              (line_id, exchange_type, coin_amount, received_item, received_amount) 
              VALUES (?, ?, ?, ?, ?)`,
        args: [
          lineId,
          exchangeSetting.exchangeType,
          inputCoins,
          "point",
          outputPoint,
        ],
      });

      await transaction.commit();

      return {
        success: true,
        exchange: {
          inputCoins,
          outputPoint,
          exchangeType: exchangeSetting.exchangeType,
        },
      };
    } finally {
      transaction.close();
    }
  } catch (error) {
    console.error("Error in swapCoins:", error);
    throw error;
  }
};
