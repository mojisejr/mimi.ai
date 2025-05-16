import { generateTransactionId } from "@/utils/generate-transaction-id";
import { torso } from "./torso-db";
import { IReferralCode } from "@/interfaces/i-referral";

export const createReferralCode = async (lineId: string) => {
  try {
    // ตรวจสอบว่ามี referral code อยู่แล้วหรือไม่
    const existingCode = await torso.execute({
      sql: `SELECT * FROM referral_code WHERE user_id = ?`,
      args: [lineId],
    });

    // ถ้ายังไม่มี code ให้สร้างใหม่
    if (existingCode.rows.length === 0) {
      const code = lineId.substring(0, 8); // เอา 8 ตัวแรกของ line_id
      await torso.execute({
        sql: `INSERT INTO referral_code (user_id, code) VALUES (?, ?)`,
        args: [lineId, code],
      });
    }
  } catch (error) {
    console.error("Error creating referral code:", error);
    throw error;
  }
};

export const getReferralCode = async (
  lineId: string
): Promise<IReferralCode> => {
  try {
    // ตรวจสอบว่ามี referral code อยู่แล้วหรือไม่
    const existingCode = await torso.execute({
      sql: `SELECT * FROM referral_code WHERE user_id = ?`,
      args: [lineId],
    });

    // ถ้ามี code อยู่แล้ว ให้ return กลับไป
    if (existingCode.rows.length > 0) {
      return {
        lineId: existingCode.rows[0].user_id as string,
        code: existingCode.rows[0].code as string,
      };
    }

    // ถ้ายังไม่มี code ให้สร้างใหม่
    const code = lineId.substring(0, 8);
    const result = await torso.execute({
      sql: `INSERT INTO referral_code (user_id, code) VALUES (?, ?)`,
      args: [lineId, code],
    });

    if (result.rowsAffected === 0) {
      throw new Error("Failed to create referral code");
    }

    return {
      lineId,
      code,
    };
  } catch (error) {
    console.error("Error getting referral code:", error);
    throw error;
  }
};

export const useReferralCode = async (referrerLineId: string, code: string) => {
  const referralReceiverCode = "referral_receiver"; // activity bonus ref ของ เจ้าของ code
  const referralSenderCode = "referral_sender"; // activity bonus ref ของ คนใช้ code

  try {
    // 1. ตรวจสอบความถูกต้องของ input
    if (!referrerLineId || !code) {
      throw new Error("Missing required parameters");
    }

    // 2. ตรวจสอบว่า code มีอยู่จริงและไม่ใช่ code ของตัวเอง
    const codeOwner = await torso.execute({
      sql: `SELECT user_id FROM referral_code WHERE code = ?`,
      args: [code],
    });

    if (codeOwner.rows.length === 0) {
      throw new Error("Invalid referral code");
    }

    const ownerLineId = codeOwner.rows[0].user_id;
    if (ownerLineId === referrerLineId) {
      throw new Error("Cannot use your own referral code");
    }

    // 3. ตรวจสอบว่าเคยใช้ code นี้แล้วหรือไม่
    const existingTransaction = await torso.execute({
      sql: `SELECT * FROM referral_transaction WHERE referrer_id = ? AND code = ?`,
      args: [referrerLineId, code],
    });

    if (existingTransaction.rows.length > 0) {
      throw new Error("This referral code has already been used");
    }

    // 4. ดึงข้อมูล level ของทั้งสองฝ่าย
    const [referrerLevel, ownerLevel] = await Promise.all([
      torso.execute({
        sql: `SELECT level FROM user_point WHERE line_id = ?`,
        args: [referrerLineId],
      }),
      torso.execute({
        sql: `SELECT level FROM user_point WHERE line_id = ?`,
        args: [ownerLineId],
      }),
    ]);

    const referrerUserLevel = referrerLevel.rows[0]?.level || 1;
    const ownerUserLevel = ownerLevel.rows[0]?.level || 1;

    // 5. ดึงข้อมูล bonus จาก activity_bonus
    const [referrerBonus, ownerBonus] = await Promise.all([
      torso.execute({
        sql: `SELECT * FROM activity_bonus WHERE activity_code = ? AND level = ?`,
        args: [referralSenderCode, referrerUserLevel],
      }),
      torso.execute({
        sql: `SELECT * FROM activity_bonus WHERE activity_code = ? AND level = ?`,
        args: [referralReceiverCode, ownerUserLevel],
      }),
    ]);

    // 6. ดึงข้อมูล point ของทั้งสองฝ่าย
    const referrerCoins = referrerBonus.rows[0]?.bonus_coins || 0;
    const referrerExp = referrerBonus.rows[0]?.bonus_exp || 0;
    const ownerCoins = ownerBonus.rows[0]?.bonus_coins || 0;
    const ownerExp = ownerBonus.rows[0]?.bonus_exp || 0;

    // เริ่ม transaction เพื่อให้แน่ใจว่าทุกอย่างสำเร็จพร้อมกัน
    const transaction = await torso.transaction("write");
    try {
      // อัพเดท point transactions
      await transaction.execute({
        sql: `INSERT INTO point_transactions (line_id, event_type, delta_point, delta_coins, delta_exp) VALUES (?, ?, ?, ?, ?)`,
        args: [
          referrerLineId,
          referralSenderCode,
          0,
          referrerCoins,
          referrerExp,
        ],
      });

      await transaction.execute({
        sql: `INSERT INTO point_transactions (line_id, event_type, delta_point, delta_coins, delta_exp) VALUES (?, ?, ?, ?, ?)`,
        args: [ownerLineId, referralReceiverCode, 0, ownerCoins, ownerExp],
      });

      const txId = generateTransactionId(ownerLineId as string, referrerLineId);
      //update referral-transaction
      await transaction.execute({
        sql: `INSERT INTO referral_transaction (id, referrer_id, referred_id, code, rewarded) VALUES(?, ?, ?, ?, ?)`,
        args: [txId, referrerLineId, ownerLineId, code, true],
      });

      // อัพเดท user_point
      await transaction.execute({
        sql: `UPDATE user_point SET coins = coins + ?, exp = exp + ? WHERE line_id = ?`,
        args: [referrerCoins, referrerExp, referrerLineId],
      });

      await transaction.execute({
        sql: `UPDATE user_point SET coins = coins + ?, exp = exp + ?  WHERE line_id = ?`,
        args: [ownerCoins, ownerExp, ownerLineId],
      });

      // ถ้าทุกอย่างสำเร็จ ให้ commit transaction
      await transaction.commit();
    } finally {
      // ต้องปิด transaction เสมอ แม้ว่าจะเกิด error
      transaction.close();
    }

    return {
      success: true,
      referrer: {
        coins: referrerCoins,
        exp: referrerExp,
      },
    };
  } catch (error) {
    console.error("Error in useReferralCode:", error);
    throw error;
  }
};
