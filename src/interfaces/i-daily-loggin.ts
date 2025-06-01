export interface IDailyLogginCampaign {
  id: string;
  campaignCode: string;
  title: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDailyLoggin {
  id: string;
  campaignId: string;
  dayNumber: number;
  activityCode: string;
  level: number;
  createdAt: Date;
  bonusCoin: number;
  bonusExp: number;
}

export interface IUserDailyLoggin {
  id: string;
  lineId: string;
  campaignId: string;
  dayNumber: number;
  receivedAt: Date;
}
