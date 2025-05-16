export interface ReferralTransaction {
  id: string;
  referrerId: string;
  referredId: string;
  code: string;
  rewarded: boolean;
}
