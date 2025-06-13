import {
  IDailyLoggin,
  IDailyLogginCampaign,
} from "@/interfaces/i-daily-loggin";
import { torso } from "./torso-db";
import { v4 as uuidv4 } from "uuid";

/**
 * ตรวจสอบว่าผู้ใช้สามารถ claim daily login reward ได้หรือไม่
 * @param lineId - Line user ID
 * @returns Object ประกอบด้วย canClaim และข้อมูล daily login
 */
export const checkDailyLoginStatus = async (lineId: string) => {
  // let campaignId = "dlg-1";
  try {
    // 1. ดึงข้อมูล campaign ที่ active อยู่
    const activeCampaign = await torso.execute({
      sql: `SELECT * FROM daily_login_campaigns 
            WHERE is_active = true
            AND start_date <= unixepoch() 
            AND end_date >= unixepoch()
            LIMIT 1`,
    });

    if (activeCampaign.rows.length === 0) {
      return {
        canClaim: false,
        message: "No active campaign",
        campaign: null,
        userProgress: null,
      };
    }

    const campaign = {
      id: activeCampaign.rows[0].id,
      campaignCode: activeCampaign.rows[0].campaign_code,
      title: activeCampaign.rows[0].title,
      startDate: new Date(activeCampaign.rows[0].start_date as string),
      endDate: new Date(activeCampaign.rows[0].end_date as string),
      isActive: activeCampaign.rows[0].is_active === 1,
      createdAt: new Date(activeCampaign.rows[0].created_at as string),
      updatedAt: new Date(activeCampaign.rows[0].updated_at as string),
    } as IDailyLogginCampaign;

    // 2. ดึงข้อมูล daily login ทั้งหมดของ campaign นี้
    const dailyLogins = await torso.execute({
      sql: `SELECT * FROM daily_login_rewards 
            WHERE campaign_id = ? 
            ORDER BY day_number ASC`,
      args: [campaign.id],
    });

    // 3. ดึงข้อมูลการ claim ของ user ใน campaign นี้
    const userClaims = await torso.execute({
      sql: `SELECT * FROM user_daily_logins
            WHERE line_id = ? 
            AND campaign_id = ? 
            ORDER BY day_number ASC`,
      args: [lineId, campaign.id],
    });

    // 4. หาวันที่ควร claim ถัดไป
    const claimedDays = userClaims.rows.map(
      (claim) => claim.day_number as number
    );
    const nextDayToClaim = dailyLogins.rows.find(
      (login) => !claimedDays.includes(login.day_number as number)
    );

    return {
      canClaim: !!nextDayToClaim,
      message: nextDayToClaim ? "Can claim reward" : "All rewards claimed",
      campaign: {
        id: campaign.id,
        campaignCode: campaign.campaignCode,
        title: campaign.title,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
      },
      userProgress: {
        totalDays: dailyLogins.rows.length,
        claimedDays: claimedDays.length,
        nextDay: nextDayToClaim ? nextDayToClaim.day_number : null,
      },
    };
  } catch (error) {
    console.error("Error checking daily login status:", error);
    throw error;
  }
};

/**
 * Claim daily login reward สำหรับผู้ใช้
 * @param lineId - Line user ID
 * @returns Object ประกอบด้วย success และข้อมูล reward ที่ได้รับ
 */
export const claimDailyLoginReward = async (lineId: string) => {
  try {
    // 1. ตรวจสอบสถานะ daily login
    const status = await checkDailyLoginStatus(lineId);
    if (!status.canClaim || !status.campaign) {
      throw new Error("Cannot claim reward");
    }

    // 2. ดึงข้อมูล daily login สำหรับวันที่จะ claim
    const dailyLogin = await torso.execute({
      sql: `SELECT * FROM daily_login_rewards as dlw 
      JOIN activity_bonus as ab 
      ON dlw.activity_code = ab.activity_code 
      AND dlw.level = ab.level
      WHERE campaign_id = ?
      AND day_number = ?
      AND dlw.level = 1
    `,
      args: [status.campaign.id, status.userProgress?.nextDay],
    });

    console.log("daily_login: ", dailyLogin);

    if (dailyLogin.rows.length === 0) {
      throw new Error("Daily login reward not found");
    }

    const reward = {
      id: dailyLogin.rows[0].id,
      campaignId: dailyLogin.rows[0].campaign_id,
      dayNumber: dailyLogin.rows[0].day_number,
      activityCode: dailyLogin.rows[0].activity_code,
      level: dailyLogin.rows[0].level,
      createdAt: new Date(dailyLogin.rows[0].created_at as string),
      bonusCoin: dailyLogin.rows[0].bonus_coins,
      bonusExp: dailyLogin.rows[0].bonus_exp,
    } as IDailyLoggin;

    // 3. เริ่ม transaction เพื่อบันทึกการ claim และเพิ่ม reward
    const transaction = await torso.transaction("write");
    try {
      // สร้าง UUID สำหรับ id
      const claimId = uuidv4();

      // บันทึกการ claim
      await transaction.execute({
        sql: `INSERT INTO user_daily_logins (id, line_id, campaign_id, day_number, received_at) 
              VALUES (?, ?, ?, ?, unixepoch())`,
        args: [claimId, lineId, status.campaign.id, reward.dayNumber],
      });

      // เพิ่ม reward ให้ user
      await transaction.execute({
        sql: `UPDATE user_point 
              SET coins = coins + ?, 
                  exp = exp + ? 
              WHERE line_id = ?`,
        args: [reward.bonusCoin, reward.bonusExp, lineId],
      });

      // บันทึก transaction
      await transaction.execute({
        sql: `INSERT INTO point_transactions 
              (line_id, event_type, delta_coins, delta_exp) 
              VALUES (?, ?, ?, ?)`,
        args: [lineId, reward.activityCode, reward.bonusCoin, reward.bonusExp],
      });

      await transaction.commit();

      return {
        success: true,
        reward: {
          dayNumber: reward.dayNumber,
          coins: reward.bonusCoin,
          exp: reward.bonusExp,
        },
      };
    } finally {
      transaction.close();
    }
  } catch (error) {
    console.error("Error claiming daily login reward:", error);
    throw error;
  }
};

/**
 * ดึงข้อมูล daily reward campaign ทั้งหมด
 * @returns Array ของ daily reward campaigns
 */
export const getDailyRewardCampaigns = async () => {
  try {
    const campaigns = await torso.execute({
      sql: `SELECT * FROM daily_login_campaigns
            AND is_active = true
            ORDER BY created_at DESC`,
    });

    if (campaigns.rows.length === 0) {
      return [];
    }

    return campaigns.rows.map((campaign) => ({
      id: campaign.id,
      campaignCode: campaign.campaign_code,
      title: campaign.title,
      startDate: new Date(campaign.start_date as string),
      endDate: new Date(campaign.end_date as string),
      isActive: campaign.is_active === 1,
      createdAt: new Date(campaign.created_at as string),
      updatedAt: new Date(campaign.updated_at as string),
    })) as IDailyLogginCampaign[];
  } catch (error) {
    console.error("Error getting daily reward campaigns:", error);
    throw error;
  }
};

/**
 * ดึงข้อมูล daily reward campaign ตาม ID
 * @param campaignId - ID ของ campaign ที่ต้องการ
 * @returns ข้อมูล campaign และ rewards ทั้งหมด
 */
export const getDailyRewardCampaignById = async (campaignId: string) => {
  try {
    // 1. ดึงข้อมูล campaign
    const campaignResult = await torso.execute({
      sql: `SELECT * FROM daily_loggin_campaign 
            WHERE id = ?`,
      args: [campaignId],
    });

    if (campaignResult.rows.length === 0) {
      throw new Error("Campaign not found");
    }

    const campaign = {
      id: campaignResult.rows[0].id,
      campaignCode: campaignResult.rows[0].campaign_code,
      title: campaignResult.rows[0].title,
      startDate: new Date(campaignResult.rows[0].start_date as string),
      endDate: new Date(campaignResult.rows[0].end_date as string),
      isActive: campaignResult.rows[0].is_active === 1,
      createdAt: new Date(campaignResult.rows[0].created_at as string),
      updatedAt: new Date(campaignResult.rows[0].updated_at as string),
    } as IDailyLogginCampaign;

    // 2. ดึงข้อมูล rewards ทั้งหมดของ campaign
    const rewardsResult = await torso.execute({
      sql: `SELECT * FROM daily_loggin 
            WHERE campaign_id = ? 
            ORDER BY day_number ASC`,
      args: [campaignId],
    });

    const rewards = rewardsResult.rows.map((reward) => ({
      id: reward.id,
      campaignId: reward.campaign_id,
      dayNumber: reward.day_number,
      activityCode: reward.activity_code,
      level: reward.level,
      createdAt: new Date(reward.created_at as string),
      bonusCoin: reward.bonus_coin,
      bonusExp: reward.bonus_exp,
    })) as IDailyLoggin[];

    return {
      campaign,
      rewards,
    };
  } catch (error) {
    console.error("Error getting daily reward campaign by ID:", error);
    throw error;
  }
};

/**
 * ตรวจสอบว่าผู้ใช้ได้ claim reward วันนี้แล้วหรือไม่
 * @param lineId - Line user ID
 * @returns Object ประกอบด้วย hasClaimedToday และ message
 */
export const checkDailyClaimStatus = async (lineId: string) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 1. ตรวจสอบว่ามี campaign ที่ active อยู่หรือไม่
    const activeCampaign = await torso.execute({
      sql: `SELECT * FROM daily_login_campaigns 
            WHERE is_active = true
            AND start_date <= unixepoch() 
            AND end_date >= unixepoch()
            LIMIT 1`,
    });

    if (activeCampaign.rows.length === 0) {
      return {
        hasClaimedToday: false,
        message: "ไม่มีแคมเปญที่กำลังดำเนินการอยู่",
      };
    }

    const campaignId = activeCampaign.rows[0].id;

    // 2. ตรวจสอบจำนวนวันที่ต้องทำทั้งหมด
    const totalDays = await torso.execute({
      sql: `SELECT COUNT(*) as count 
            FROM daily_login_rewards 
            WHERE campaign_id = ?`,
      args: [campaignId],
    });

    // 3. ตรวจสอบจำนวนวันที่ผู้ใช้ได้ claim แล้ว
    const claimedDays = await torso.execute({
      sql: `SELECT COUNT(*) as count 
            FROM user_daily_logins 
            WHERE line_id = ? 
            AND campaign_id = ?`,
      args: [lineId, campaignId],
    });

    const totalDaysCount = Number(totalDays.rows[0]?.count || 0);
    const claimedDaysCount = Number(claimedDays.rows[0]?.count || 0);

    // 4. ตรวจสอบว่าผู้ใช้ได้ claim วันนี้แล้วหรือไม่
    const checkClaimedToday = await torso.execute({
      sql: `SELECT COUNT(*) as count 
            FROM user_daily_logins 
            WHERE line_id = ? 
            AND campaign_id = ?
            AND received_at >= ? 
            AND received_at < ?`,
      args: [
        lineId,
        campaignId,
        today.getTime() / 1000,
        tomorrow.getTime() / 1000,
      ],
    });

    const claimedTodayCount = Number(checkClaimedToday.rows[0]?.count || 0);

    // 5. สร้างข้อความตามสถานะ
    let message = "";
    if (claimedTodayCount > 0 && claimedDaysCount < totalDaysCount) {
      message = "คุณได้ claim reward วันนี้แล้ว กรุณามาใหม่พรุ่งนี้";
    } else if (claimedDaysCount >= totalDaysCount) {
      message =
        "ขอบคุณที่ร่วมกิจกรรมกับเรา คุณได้ทำครบทุกวันแล้ว รอติดตามแคมเปญหน้านะคะ";
    } else {
      message = "คุณสามารถ claim reward ได้";
    }

    return {
      hasClaimedToday: claimedTodayCount > 0,
      message,
      progress: {
        totalDays: totalDaysCount,
        claimedDays: claimedDaysCount,
        isCompleted: claimedDaysCount >= totalDaysCount,
      },
    };
  } catch (error) {
    console.error("Error checking daily claim status:", error);
    throw error;
  }
};
