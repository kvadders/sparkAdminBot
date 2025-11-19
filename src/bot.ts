import {config} from 'dotenv';
import {session, Telegraf} from "telegraf";
import {MyContext, Project} from "./@types/context";
import {baseCommand, createWithdrawInfo, findUser, startCommand, updateBalanceInfo} from "./command/base";
import {
  getStats,
  getWithdrawal,
  mainNsfwCommand, referralInfo,
  searchUser,
  toggleBlock,
  updateBalance,
  createWithdraw, updateWithdrawal
} from "./command/nsfw/main";
import {message} from "telegraf/filters";
import {checkAllSitesCommand} from "./helpers/checkSite";

config();

const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN!);

bot.catch(async (err, ctx) => {
  try {
    await ctx.reply("Сорри, какая-та хрень 🥲 Мы уже занимаемся этим! (Нет)");
  } catch (e) {
    console.error("❗ Failed to send error message:", e);
  }
});

bot.use(session());
bot.use((ctx, next) => {
  if (!ctx.session) ctx.session = {project: null, mode: "SEARCH_USER"};
  return next();
});

bot.start(baseCommand);

bot.action("start", startCommand);

bot.action("check", checkAllSitesCommand);

//NSFW
bot.action("find_withdraw", getWithdrawal);
bot.action("find_user", findUser);
bot.action("updateBalance", updateBalanceInfo);
bot.action("stat", getStats);
bot.action("toggleBlock", toggleBlock);
bot.action("referralInfo", referralInfo);
bot.action("createWithdrawInfo", createWithdrawInfo);

bot.action(/withdraw_ok_(\d+)/, async (ctx) => {
  await ctx.deleteMessage()
  const withdrawId = Number(ctx.match[1]);
  await updateWithdrawal(ctx, withdrawId, false)
});

bot.action(/withdraw_cancel_(\d+)/, async (ctx) => {
  await ctx.deleteMessage()
  const withdrawId = Number(ctx.match[1]);
  await updateWithdrawal(ctx, withdrawId, true)
});

bot.action("selectDN", async (ctx) => {
  ctx.session.project = Project.DeepNude;
  await mainNsfwCommand(ctx)
})

bot.action("selectAIDN", async (ctx) => {
  ctx.session.project = Project.AIDeepNudes;
  await mainNsfwCommand(ctx)
})

bot.on(message('text'), async ctx => {
  const projectName = ctx.session.project;
  const mode = ctx.session.mode;
  if (!projectName) {
    ctx.reply("Выберите проект!")
    return;
  }

  if (mode === "SEARCH_USER") {
    const text = ctx.message.text;
    await searchUser(ctx, text);
  }

  if (mode === "EDIT_BALANCE") {
    const text = ctx.message.text;
    await updateBalance(ctx, text);
  }

  if (mode === "CREATE_WITHDRAW") {
    const text = ctx.message.text;
    await createWithdraw(ctx, text);
  }

})


export {bot};