import { Reading } from "@/interfaces/i-readings";
import { ISaveReading } from "@/interfaces/i-save-reading";
import { torso } from "@/services/torso/torso-db";

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
          data.lineId,
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
 * Deletes a reading session
 * @param id - Reading session ID
 * @returns boolean indicating success/failure
 */
export const deleteReading = async (id: number) => {
  try {
    const result = await torso.execute({
      sql: `DELETE FROM question_answer WHERE id = ?`,
      args: [id],
    });

    return result.rowsAffected > 0 ? true : false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * Retrieves reading history for a user
 * @param lineId - Line user ID
 * @returns Array of reading history records
 */
export const getReading = async (lineId: string) => {
  try {
    const result = await torso.execute({
      sql: `SELECT qa.id, qa.question, qa.header, qa.cards, qa.reading, qa.final, qa.suggest, qa.end, qa.notice, qa.created_at,
      rev.accurate_level,
      rev.review_id,
      rev.liked,
      rev.review_period,
      rev.created_at as rev_created_at
      FROM question_answer as qa LEFT JOIN review as rev ON qa.id = rev.question_answer_id WHERE qa.line_id = ? ORDER BY qa.created_at DESC`,
      args: [lineId],
    });

    if (result.rows.length <= 0) {
      return [];
    }

    const readings: Reading[] = result.rows.map((r) => {
      return {
        id: r.id,
        question: r.question,
        header: r.header,
        cards: JSON.parse(r.cards as string),
        reading: r.reading,
        final: JSON.parse(r.final as string),
        suggest: JSON.parse(r.suggest as string),
        end: r.end,
        notice: r.notice,
        review: {
          reviewId: r.review_id,
          reviewPeriod: r.review_period,
          accurateLevel: r.accurate_level,
          questionAnswerId: r.id,
          createdAt: r.rev_created_at,
        },
        createdAt: r.created_at,
      } as Reading;
    });
    return readings;
  } catch (error) {
    console.log(error);
    return [];
  }
};

/**
 * Creates a review for a reading session
 * @param data - Review data containing question_answer_id, line_id, and accurate_level
 * @returns boolean indicating success/failure
 */
export const createReview = async (data: {
  questionAnswerId: number;
  lineId: string;
  accurateLevel: number;
}) => {
  try {
    const result = await torso.execute({
      sql: `INSERT INTO review (question_answer_id, line_id, accurate_level) VALUES(?, ?, ?)`,
      args: [data.questionAnswerId, data.lineId, data.accurateLevel],
    });

    return result.rowsAffected > 0 ? true : false;
  } catch (error) {
    console.log(error);
    return false;
  }
};
