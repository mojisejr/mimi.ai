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

export const swapCoins = async () => {
  /**
   *
   */
};
