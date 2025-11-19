import {config} from "dotenv";
import {
  BaseData,
  PaymentStatsResponse,
  ReferralInfoResponse,
  User,
  UserInfoResponse,
  WithdrawResponse
} from "../@types/nsfw.dto";
import {Project} from "../@types/context";

config();

const PROJECT_API_CONFIG: Record<Project, { API_URL: string; API_KEY: string }> = {
  [Project.DeepNude]: {
    API_URL: process.env.DN_API_URL!,
    API_KEY: process.env.API_KEY!,
  },
  [Project.AIDeepNudes]: {
    API_URL: process.env.AIDN_API_URL!,
    API_KEY: process.env.API_KEY!,
  },
  [Project.SwappyBot]: {
    API_URL: process.env.DN_API_URL!,
    API_KEY: process.env.API_KEY!,
  },
  [Project.DeepBot]: {
    API_URL: process.env.AIDN_API_URL!,
    API_KEY: process.env.API_KEY!,
  },
};

export const getNsfwApi = (project: Project) => {
  const config = PROJECT_API_CONFIG[project];
  if (!config) throw new Error(`Unknown project: ${project}`);

  const {API_URL, API_KEY} = config;

  return {
    async fetchUser(email: string) {
      const res = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}`, {headers: {apiKey: API_KEY}});
      if (!res.ok) throw new Error(`API error ${res.status}`);
      return await res.json() as UserInfoResponse;
    },

    async fetchBaseData() {
      const res = await fetch(API_URL, {headers: {apiKey: API_KEY}});
      if (!res.ok) throw new Error(`API error ${res.status}`);
      return await res.json() as BaseData;
    },

    async fetchPaymentData() {
      const res = await fetch(`${API_URL}/payments`, {headers: {apiKey: API_KEY}});
      if (!res.ok) throw new Error(`API error ${res.status}`);
      return await res.json() as PaymentStatsResponse;
    },

    async fetchReferralInfo(userId: number) {
      const res = await fetch(`${API_URL}/referralInfo?email=${encodeURIComponent(userId)}`, {headers: {apiKey: API_KEY}});
      if (!res.ok) throw new Error(`API error ${res.status}`);
      return await res.json() as ReferralInfoResponse;
    },

    async fetchWithdrawal() {
      const res = await fetch(`${API_URL}/withdraws`, {headers: {apiKey: API_KEY}});
      if (!res.ok) throw new Error(`API error ${res.status}`);
      return await res.json() as WithdrawResponse[];
    },

    async updateUser(userId: number, balance: number, isBlocked: boolean) {
      const res = await fetch(`${API_URL}/user`, {
        headers: {apiKey: API_KEY, "Content-Type": "application/json"},
        method: 'PATCH',
        body: JSON.stringify({ id: userId, balance: balance, is_blocked: isBlocked }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      return await res.json() as User;
    },

    async createWithdrawal(userId: number, balance: number) {
      const res = await fetch(`${API_URL}/withdraw`, {
        headers: {apiKey: API_KEY, "Content-Type": "application/json"},
        method: 'POST',
        body: JSON.stringify({ user_id: userId, amount: balance, network: "TRC20", address: "FROM TG" }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      return await res.json() as User;
    },

    async updateWithdrawal(withdrawId: number, status: string) {
      const res = await fetch(`${API_URL}/withdraw`, {
        headers: {apiKey: API_KEY, "Content-Type": "application/json"},
        method: 'PATCH',
        body: JSON.stringify({ id: withdrawId, status: status }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      return await res.json() as User;
    }
  }
}
