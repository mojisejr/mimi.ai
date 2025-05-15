import { PaymentHistory } from "@/interfaces/i-payment-history";
import { torso } from "@/services/torso/torso-db";

/**
 * Records a payment transaction in the database
 * @param payment - Payment history object containing transaction details
 * @returns boolean indicating success/failure
 */
export const addPaymentHistory = async (payment: PaymentHistory) => {
  try {
    const result = await torso.execute({
      sql: `INSERT INTO payment_history (line_id, pack_id, status, charge_id) VALUES(?, ?, ?, ?)`,
      args: [payment.lineId, payment.packId, payment.status, payment.chargeId],
    });

    console.log("addPaymentHistory: ", result);

    return result.rowsAffected > 0 ? true : false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * Retrieves payment history for a user
 * @param userId - Line user ID
 * @returns Array of payment history records
 */
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
