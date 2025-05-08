/**
 * Database service for Torso database operations
 * This file contains all database-related functions for user management, points, payments, and readings
 */

import { PaymentHistory } from "@/interfaces/i-payment-history";
import { ISaveReading } from "@/interfaces/i-save-reading";
import { UserCreateDTO } from "@/interfaces/i-user-create";
import { createClient } from "@libsql/client";

// Initialize Torso database client
export const torso = createClient({
  url: process.env.TORSO_DATABASE_URL!,
  authToken: process.env.TORSO_AUTH_TOKEN!,
});

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
      // {
      //   sql: `INSERT INTO user_point_history (line_id, action, amount) VALUES(?, ?, ?)`,
      //   args: [userId, "used", pointToSub],
      // },
    ]);

    return true;
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

/**
 * Saves a reading session including question and answer details
 * @param data - Reading session data
 * @returns Object containing success status and answer ID
 */
export const saveReading = async (data: ISaveReading) => {
  try {
    const results = await torso.batch([
      {
        sql: `INSERT INTO question_answer (line_id, question, header, cards, reading, suggest, final, end, notice) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          data.line_id,
          data.question,
          data.answer.header,
          JSON.stringify(data.answer.cards),
          data.answer.reading,
          JSON.stringify(data.answer.suggest),
          JSON.stringify(data.answer.final),
          data.answer.end,
          data.answer.notice,
        ],
      },
      {
        sql: `SELECT last_insert_rowid();`,
        args: [],
      },
    ]);

    console.log(results[1].rows[0]);

    if (results[1] && results[1].rows.length > 0) {
      const answerId =
        (results[1].rows[0]["last_insert_rowid()"] as number) ?? -1;
      return {
        success: true,
        answerId,
      };
    } else {
      return {
        success: false,
        answerId: -1,
      };
    }
  } catch (error) {
    console.log(error);
    return { success: false, answerId: -1 };
  }
};

/**
 * Soft deletes a reading record by marking it as deleted
 * @param id - Reading record ID
 * @returns boolean indicating success/failure
 */
export const deleteReading = async (id: number) => {
  try {
    const result = await torso.execute({
      sql: `UPDATE question_answer SET is_deleted = 1 WHERE id = ?`,
      args: [id],
    });

    return result.rowsAffected > 0 ? true : false;
  } catch (error) {}
};

/**
 * Retrieves reading records for a specific user
 * @param lineId - Line user ID
 * @returns Array of reading records or empty array if none found
 */
export const getReading = async (lineId: string) => {
  try {
    const result = await torso.execute({
      sql: `
        SELECT 
          qa.id,
          qa.question,
          qa.header,
          qa.cards,
          qa.reading,
          qa.suggest,
          qa.final,
          qa.end,
          qa.notice,
          qa.is_reviewed,
          qa.created_at,
          r.review_id as review_id,
          r.accurate_level,
          r.created_at as review_created_at,
          r.review_period
        FROM question_answer qa
        LEFT JOIN review r ON qa.id = r.question_answer_id
        WHERE qa.line_id = ? 
        AND qa.is_deleted = 0
        ORDER BY qa.created_at DESC
      `,
      args: [lineId],
    });

    if (result.rows.length <= 0) {
      return [];
    }

    return result.rows.map((row) => ({
      id: row.id as number,
      question: row.question as string,
      header: row.header as string,
      cards: JSON.parse(row.cards as string),
      reading: row.reading as string,
      suggest: JSON.parse(row.suggest as string),
      final: JSON.parse(row.final as string),
      end: row.end as string,
      notice: row.notice as string,
      is_reviewed: row.is_reviewed as number,
      created_at: row.created_at as string,
      review: row.review_id
        ? {
            review_id: row.review_id as number,
            question_answer_id: row.id as number,
            line_id: lineId,
            accurate_level: row.accurate_level as number,
            created_at: row.review_created_at as number,
            review_period: row.review_period as number,
          }
        : undefined,
    }));
  } catch (error) {
    console.log("Error in getReading:", error);
    return [];
  }
};

/**
 * Creates a new review for a question answer
 * @param data - Review data containing question_answer_id, line_id, accurate_level
 * @returns boolean indicating success/failure
 */
export const createReview = async (data: {
  question_answer_id: number;
  line_id: string;
  accurate_level: number;
}) => {
  try {
    // Check if review already exists
    console.log("start saving review !");
    const existingReview = await torso.execute({
      sql: `SELECT * FROM review WHERE question_answer_id = ?`,
      args: [data.question_answer_id],
    });

    if (existingReview.rows.length > 0) {
      return false;
    }

    // Get question creation time
    const questionData = await torso.execute({
      sql: `SELECT created_at FROM question_answer WHERE id = ?`,
      args: [data.question_answer_id],
    });

    if (questionData.rows.length === 0) {
      return false;
    }

    const questionCreatedAt = questionData.rows[0].created_at as number;
    const currentTime = Math.floor(Date.now() / 1000);
    const reviewPeriod = currentTime - questionCreatedAt;

    // Create review and update is_reviewed in question_answer table
    const result = await torso.batch([
      {
        sql: `INSERT INTO review (
          question_answer_id,
          line_id,
          accurate_level,
          created_at,
          review_period
        ) VALUES (?, ?, ?, ?, ?)`,
        args: [
          data.question_answer_id,
          data.line_id,
          data.accurate_level,
          currentTime,
          reviewPeriod,
        ],
      },
      {
        sql: `UPDATE question_answer SET is_reviewed = 1 WHERE id = ?`,
        args: [data.question_answer_id],
      },
    ]);

    return result.length > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
};
