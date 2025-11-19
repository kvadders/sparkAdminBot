"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
const dotenv_1 = require("dotenv");
const telegraf_1 = require("telegraf");
const context_1 = require("./@types/context");
const base_1 = require("./command/base");
const main_1 = require("./command/nsfw/main");
const filters_1 = require("telegraf/filters");
const checkSite_1 = require("./helpers/checkSite");
(0, dotenv_1.config)();
const bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN);
exports.bot = bot;
bot.catch(async (err, ctx) => {
    try {
        await ctx.reply("Сорри, какая-та хрень 🥲 Мы уже занимаемся этим! (Нет)");
    }
    catch (e) {
        console.error("❗ Failed to send error message:", e);
    }
});
bot.use((0, telegraf_1.session)());
bot.use((ctx, next) => {
    if (!ctx.session)
        ctx.session = { project: null, mode: "SEARCH_USER" };
    return next();
});
bot.start(base_1.baseCommand);
bot.action("start", base_1.startCommand);
bot.action("check", checkSite_1.checkAllSitesCommand);
//NSFW
bot.action("find_withdraw", main_1.getWithdrawal);
bot.action("find_user", base_1.findUser);
bot.action("updateBalance", base_1.updateBalanceInfo);
bot.action("stat", main_1.getStats);
bot.action("toggleBlock", main_1.toggleBlock);
bot.action("referralInfo", main_1.referralInfo);
bot.action("createWithdrawInfo", base_1.createWithdrawInfo);
bot.action(/withdraw_ok_(\d+)/, async (ctx) => {
    await ctx.deleteMessage();
    const withdrawId = Number(ctx.match[1]);
    await (0, main_1.updateWithdrawal)(ctx, withdrawId, false);
});
bot.action(/withdraw_cancel_(\d+)/, async (ctx) => {
    await ctx.deleteMessage();
    const withdrawId = Number(ctx.match[1]);
    await (0, main_1.updateWithdrawal)(ctx, withdrawId, true);
});
bot.action("selectDN", async (ctx) => {
    ctx.session.project = context_1.Project.DeepNude;
    await (0, main_1.mainNsfwCommand)(ctx);
});
bot.action("selectAIDN", async (ctx) => {
    ctx.session.project = context_1.Project.AIDeepNudes;
    await (0, main_1.mainNsfwCommand)(ctx);
});
bot.on((0, filters_1.message)('text'), async (ctx) => {
    const projectName = ctx.session.project;
    const mode = ctx.session.mode;
    if (!projectName) {
        ctx.reply("Выберите проект!");
        return;
    }
    if (mode === "SEARCH_USER") {
        const text = ctx.message.text;
        await (0, main_1.searchUser)(ctx, text);
    }
    if (mode === "EDIT_BALANCE") {
        const text = ctx.message.text;
        await (0, main_1.updateBalance)(ctx, text);
    }
    if (mode === "CREATE_WITHDRAW") {
        const text = ctx.message.text;
        await (0, main_1.createWithdraw)(ctx, text);
    }
});
