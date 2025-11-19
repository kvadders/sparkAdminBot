"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userBlock = void 0;
const useLocale_1 = require("../../locales/useLocale");
const context_1 = require("../../@types/context");
const userBlock = (data, project) => {
    const user = data.user;
    const text = (0, useLocale_1.t)("nsfw_user_info", {
        email: user.email,
        balance: user.balance,
        is_blocked: user.is_blocked ? "❌" : "✅",
        balance_referral: user.balance_referral.toFixed(0),
        code: user.referral_code,
        percent: user.percent,
        done: data.successGenerations,
        error: data.failedGenerations,
        payments: data.successfulPayments,
    });
    const keyboard = {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Статистика", callback_data: "referralInfo" }],
                [
                    { text: "Изменить баланс", callback_data: "updateBalance" },
                    { text: "Забл./Разбл.", callback_data: "toggleBlock" }
                ],
                [{ text: "Оформить вывод", callback_data: "createWithdrawInfo" }],
                [{ text: "К проекту", callback_data: project === context_1.Project.DeepNude ? "selectDN" : "selectAIDN" }],
            ],
        },
    };
    return { text, keyboard };
};
exports.userBlock = userBlock;
