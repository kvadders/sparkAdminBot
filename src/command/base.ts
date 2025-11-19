import {MyContext} from "../@types/context";
import {t} from "../locales/useLocale";

export const baseCommand = async (ctx: MyContext) => {
  await ctx.reply("Авторизоваться", {
    reply_markup: {
      inline_keyboard: [
        [{text: "Войти", callback_data: 'start'}],
      ]
    },
  });
}

export const startCommand = async (ctx: MyContext) => {
  await ctx.deleteMessage();
  ctx.session.project = null;
  ctx.session.mode = "SEARCH_USER";
  await ctx.replyWithPhoto("https://bot.deep-nudes.com/static/spark.png", {
    caption: t("bot"),
    reply_markup: {
      inline_keyboard: [
        [{text: "Deep nude", callback_data: 'selectDN'}],
        [{text: "AI deep nudes", callback_data: 'selectAIDN'}],
        [{text: "Статус сайтов", callback_data: 'check'}]
      ]
    },
  });
};

export const findUser = async (ctx: MyContext) => {
  await ctx.answerCbQuery();
  ctx.session.mode = "SEARCH_USER";
  await ctx.reply("Ожидаем ввод почты пользователя:")
}

export const updateBalanceInfo = async (ctx: MyContext) => {
  await ctx.answerCbQuery();
  ctx.session.mode = "EDIT_BALANCE";
  await ctx.reply("Введите кол-во монет:")
}

export const createWithdrawInfo = async (ctx: MyContext) => {
  await ctx.answerCbQuery();
  ctx.session.mode = "CREATE_WITHDRAW";
  await ctx.reply("Введите сумму выплаты:")
}
