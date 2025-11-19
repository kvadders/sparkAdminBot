export type User = {
  id: number;
  name: string;
  email: string;
  balance: number;
  balance_referral: number;
  referral_code: string;
  percent: number;
  is_blocked: boolean;
}


export type BaseData = {
  success: number;
  failed: number;
}

export type PaymentStatsResponse = Record<string, number>;


export type WithdrawResponse = {
  createdAt: Date;
  amount: number;
  address: string;
  user: User;
  id: number;
}

export type UserInfoResponse = {
  user: User;
  successGenerations: number;
  failedGenerations: number;
  successfulPayments: number;
}


export type ReferralInfoResponse = {
  referralCount: number;
  totalReferralPayments: number;
}