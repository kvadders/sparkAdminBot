"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWithdrawInfo = exports.updateBalanceInfo = exports.findUser = exports.startCommand = exports.baseCommand = void 0;
const useLocale_1 = require("../locales/useLocale");
const baseCommand = async (ctx) => {
    await ctx.reply("Авторизоваться", {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Войти", callback_data: 'start' }],
            ]
        },
    });
};
exports.baseCommand = baseCommand;
const startCommand = async (ctx) => {
    await ctx.deleteMessage();
    ctx.session.project = null;
    ctx.session.mode = "SEARCH_USER";
    await ctx.replyWithPhoto("https://bot.deep-nudes.com/static/spark.png", {
        caption: (0, useLocale_1.t)("bot"),
        reply_markup: {
            inline_keyboard: [
                [{ text: "Deep nude", callback_data: 'selectDN' }],
                [{ text: "AI deep nudes", callback_data: 'selectAIDN' }],
                [{ text: "Статус сайтов", callback_data: 'check' }]
            ]
        },
    });
};
exports.startCommand = startCommand;
const findUser = async (ctx) => {
    await ctx.answerCbQuery();
    ctx.session.mode = "SEARCH_USER";
    await ctx.reply("Ожидаем ввод почты пользователя:");
};
exports.findUser = findUser;
const updateBalanceInfo = async (ctx) => {
    await ctx.answerCbQuery();
    ctx.session.mode = "EDIT_BALANCE";
    await ctx.reply("Введите кол-во монет:");
};
exports.updateBalanceInfo = updateBalanceInfo;
const createWithdrawInfo = async (ctx) => {
    await ctx.answerCbQuery();
    ctx.session.mode = "CREATE_WITHDRAW";
    await ctx.reply("Введите сумму выплаты:");
};
exports.createWithdrawInfo = createWithdrawInfo;
