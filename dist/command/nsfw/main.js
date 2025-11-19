"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWithdraw = exports.referralInfo = exports.toggleBlock = exports.updateBalance = exports.updateWithdrawal = exports.getWithdrawal = exports.searchUser = exports.getStats = exports.mainNsfwCommand = void 0;
const useLocale_1 = require("../../locales/useLocale");
const getImage_1 = require("../../helpers/getImage");
const nsfwApi_1 = require("../../api/nsfwApi");
const dayjs_1 = __importDefault(require("dayjs"));
const answer_1 = require("./answer");
const mainNsfwCommand = async (ctx) => {
    await ctx.deleteMessage();
    const projectName = ctx.session.project;
    if (!projectName)
        return;
    await ctx.replyWithPhoto((0, getImage_1.getImage)(projectName), {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Данные о проекте", callback_data: 'stat' }],
                [{ text: "Поиск пользователя", callback_data: 'find_user' }],
                [{ text: "Заявки на вывод", callback_data: 'find_withdraw' }],
                [{ text: "В главное меню", callback_data: 'start' }],
            ]
        },
    });
};
exports.mainNsfwCommand = mainNsfwCommand;
const getStats = async (ctx) => {
    await ctx.answerCbQuery();
    const loadingMsg = await ctx.reply("Загружаем данные...");
    const api = (0, nsfwApi_1.getNsfwApi)(ctx.session.project);
    const baseData = await api.fetchBaseData();
    const paymentData = await api.fetchPaymentData();
    const success = baseData.success;
    const failed = baseData.failed;
    await ctx.deleteMessage(loadingMsg.message_id);
    const paymentText = Object.entries(paymentData)
        .map(([method, amount]) => `${method}: ${amount.toFixed(2)}$`)
        .join("\n");
    await ctx.reply((0, useLocale_1.t)("nsfw_stat", {
        total_generation: success,
        total_error: failed,
        payments: paymentText,
    }));
};
exports.getStats = getStats;
const searchUser = async (ctx, email) => {
    const loadingMsg = await ctx.reply("Занимаемся поиском, пару секунд и все будет готово…");
    const api = (0, nsfwApi_1.getNsfwApi)(ctx.session.project);
    const data = await api.fetchUser(email);
    ctx.session.currentUser = data;
    await ctx.deleteMessage(loadingMsg.message_id);
    const { text, keyboard } = (0, answer_1.userBlock)(data, ctx.session.project);
    await ctx.reply(text, keyboard);
};
exports.searchUser = searchUser;
const getWithdrawal = async (ctx) => {
    await ctx.answerCbQuery();
    const loadingMsg = await ctx.reply("Загружаем данные...");
    const api = (0, nsfwApi_1.getNsfwApi)(ctx.session.project);
    const withdraws = await api.fetchWithdrawal();
    await ctx.deleteMessage(loadingMsg.message_id);
    for (const w of withdraws) {
        const text = [
            `👤 Email: *${w.user.email}*`,
            `💰 Сумма: *${w.amount}$*`,
            `🏦 Адрес: \`${w.address}\``,
            `📅 Дата: ${(0, dayjs_1.default)(w.createdAt).format("DD.MM.YYYY HH:mm")}`,
        ].join("\n");
        await ctx.reply(text, {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "✔ Подтвердить", callback_data: `withdraw_ok_${w.id}` },
                        { text: "❌ Отклонить", callback_data: `withdraw_cancel_${w.id}` },
                    ],
                ],
            },
        });
    }
};
exports.getWithdrawal = getWithdrawal;
const updateWithdrawal = async (ctx, id, isCanceled) => {
    const loadingMsg = await ctx.reply("Обновляем данные...");
    const mode = isCanceled ? "CANCELED" : "SUCCESS";
    const msg = isCanceled ? "Выплата успешно отменена" : "Выплата успешно выполнена";
    const api = (0, nsfwApi_1.getNsfwApi)(ctx.session.project);
    await api.updateWithdrawal(id, mode);
    await ctx.deleteMessage(loadingMsg.message_id);
    await ctx.reply(msg);
};
exports.updateWithdrawal = updateWithdrawal;
const updateBalance = async (ctx, balance) => {
    const loadingMsg = await ctx.reply("Обновляем данные...");
    if (!ctx.session.currentUser)
        return;
    ctx.session.mode = "SEARCH_USER";
    const user = ctx.session.currentUser.user;
    if (!user) {
        await ctx.reply("пользователь не выбран!");
        return;
    }
    const api = (0, nsfwApi_1.getNsfwApi)(ctx.session.project);
    ctx.session.currentUser.user = await api.updateUser(user.id, Number(balance), user.is_blocked);
    await ctx.deleteMessage(loadingMsg.message_id);
    const { text, keyboard } = (0, answer_1.userBlock)(ctx.session.currentUser, ctx.session.project);
    await ctx.reply(text, keyboard);
};
exports.updateBalance = updateBalance;
const toggleBlock = async (ctx) => {
    const loadingMsg = await ctx.reply("Обновляем данные...");
    if (!ctx.session.currentUser)
        return;
    const user = ctx.session.currentUser?.user;
    if (!user) {
        await ctx.reply("пользователь не выбран!");
        return;
    }
    const api = (0, nsfwApi_1.getNsfwApi)(ctx.session.project);
    ctx.session.currentUser.user = await api.updateUser(user.id, user.balance, !user.is_blocked);
    await ctx.deleteMessage(loadingMsg.message_id);
    await ctx.deleteMessage();
    const { text, keyboard } = (0, answer_1.userBlock)(ctx.session.currentUser, ctx.session.project);
    await ctx.reply(text, keyboard);
};
exports.toggleBlock = toggleBlock;
const referralInfo = async (ctx) => {
    await ctx.answerCbQuery();
    const loadingMsg = await ctx.reply("Загружаем данные...");
    if (!ctx.session.currentUser)
        return;
    const user = ctx.session.currentUser?.user;
    if (!user) {
        await ctx.reply("пользователь не выбран!");
        return;
    }
    const api = (0, nsfwApi_1.getNsfwApi)(ctx.session.project);
    const { referralCount, totalReferralPayments } = await api.fetchReferralInfo(user.id);
    await ctx.deleteMessage(loadingMsg.message_id);
    await ctx.reply((0, useLocale_1.t)("nsfw_referral_info", { count: referralCount, sum: totalReferralPayments.toFixed(2) }));
};
exports.referralInfo = referralInfo;
const createWithdraw = async (ctx, balance) => {
    if (!ctx.session.currentUser || ctx.session.currentUser.user.balance_referral < Number(balance)) {
        await ctx.reply("Проверьте сумму выплаты!");
        return;
    }
    const loadingMsg = await ctx.reply("Загружаем данные...");
    if (!ctx.session.currentUser)
        return;
    const user = ctx.session.currentUser?.user;
    if (!user) {
        await ctx.reply("пользователь не выбран!");
        return;
    }
    const api = (0, nsfwApi_1.getNsfwApi)(ctx.session.project);
    ctx.session.currentUser.user = await api.createWithdrawal(user.id, Number(balance));
    await ctx.deleteMessage(loadingMsg.message_id);
    await ctx.reply("Выплата произведена!");
    await ctx.deleteMessage();
    const { text, keyboard } = (0, answer_1.userBlock)(ctx.session.currentUser, ctx.session.project);
    await ctx.reply(text, keyboard);
};
exports.createWithdraw = createWithdraw;
