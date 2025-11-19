"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNsfwApi = void 0;
const dotenv_1 = require("dotenv");
const context_1 = require("../@types/context");
(0, dotenv_1.config)();
const PROJECT_API_CONFIG = {
    [context_1.Project.DeepNude]: {
        API_URL: process.env.DN_API_URL,
        API_KEY: process.env.API_KEY,
    },
    [context_1.Project.AIDeepNudes]: {
        API_URL: process.env.AIDN_API_URL,
        API_KEY: process.env.API_KEY,
    },
    [context_1.Project.SwappyBot]: {
        API_URL: process.env.DN_API_URL,
        API_KEY: process.env.API_KEY,
    },
    [context_1.Project.DeepBot]: {
        API_URL: process.env.AIDN_API_URL,
        API_KEY: process.env.API_KEY,
    },
};
const getNsfwApi = (project) => {
    const config = PROJECT_API_CONFIG[project];
    if (!config)
        throw new Error(`Unknown project: ${project}`);
    const { API_URL, API_KEY } = config;
    return {
        async fetchUser(email) {
            const res = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}`, { headers: { apiKey: API_KEY } });
            if (!res.ok)
                throw new Error(`API error ${res.status}`);
            return await res.json();
        },
        async fetchBaseData() {
            const res = await fetch(API_URL, { headers: { apiKey: API_KEY } });
            if (!res.ok)
                throw new Error(`API error ${res.status}`);
            return await res.json();
        },
        async fetchPaymentData() {
            const res = await fetch(`${API_URL}/payments`, { headers: { apiKey: API_KEY } });
            if (!res.ok)
                throw new Error(`API error ${res.status}`);
            return await res.json();
        },
        async fetchReferralInfo(userId) {
            const res = await fetch(`${API_URL}/referralInfo?email=${encodeURIComponent(userId)}`, { headers: { apiKey: API_KEY } });
            if (!res.ok)
                throw new Error(`API error ${res.status}`);
            return await res.json();
        },
        async fetchWithdrawal() {
            const res = await fetch(`${API_URL}/withdraws`, { headers: { apiKey: API_KEY } });
            if (!res.ok)
                throw new Error(`API error ${res.status}`);
            return await res.json();
        },
        async updateUser(userId, balance, isBlocked) {
            const res = await fetch(`${API_URL}/user`, {
                headers: { apiKey: API_KEY, "Content-Type": "application/json" },
                method: 'PATCH',
                body: JSON.stringify({ id: userId, balance: balance, is_blocked: isBlocked }),
            });
            if (!res.ok)
                throw new Error(`API error ${res.status}`);
            return await res.json();
        },
        async createWithdrawal(userId, balance) {
            const res = await fetch(`${API_URL}/withdraw`, {
                headers: { apiKey: API_KEY, "Content-Type": "application/json" },
                method: 'POST',
                body: JSON.stringify({ user_id: userId, amount: balance, network: "TRC20", address: "FROM TG" }),
            });
            if (!res.ok)
                throw new Error(`API error ${res.status}`);
            return await res.json();
        },
        async updateWithdrawal(withdrawId, status) {
            const res = await fetch(`${API_URL}/withdraw`, {
                headers: { apiKey: API_KEY, "Content-Type": "application/json" },
                method: 'PATCH',
                body: JSON.stringify({ id: withdrawId, status: status }),
            });
            if (!res.ok)
                throw new Error(`API error ${res.status}`);
            return await res.json();
        }
    };
};
exports.getNsfwApi = getNsfwApi;
