import { ILevelConfig } from "@/interfaces/i-level";
import { torso } from "./torso-db";

//get current level config
export const getCurrentLevelConfig = async (level: number) => {
  try {
    const results = await torso.execute({
      sql: `SELECT * FROM level_config WHERE level = ? LIMIT = 1`,
      args: [level],
    });

    if (results.rows.length <= 0) {
      return null;
    }

    const data = results.rows[0] ? results.rows[0] : null;

    if (data) {
      return {
        level: data.level,
        expRequired: data.exp_required,
        expTotal: data.exp_total,
      } as ILevelConfig;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
