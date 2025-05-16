export interface IReferralError {
  code: "INVALID_CODE" | "SELF_REFERRAL" | "ALREADY_USED" | "SERVER_ERROR";
  message: string;
}

export interface IReferralResult {
  success: boolean;
  error?: IReferralError;
  data?: {
    coins: number;
    exp: number;
  };
}
