import {MyContext} from "../../@types/context";
import {t} from "../../locales/useLocale";
import {getImage} from "../../helpers/getImage";
import {getNsfwApi} from "../../api/nsfwApi";
import dayjs from "dayjs";
import {userBlock} from "./answer";

export const mainNsfwCommand = async (ctx: MyContext) => {
  await ctx.deleteMessage();
  const projectName = ctx.session.project;
  if (!projectName) return
  await ctx.replyWithPhoto(getImage(projectName),
    {
      reply_markup: {
        inline_keyboard: [
          [{text: "Данные о проекте", callback_data: 'stat'}],
          [{text: "Поиск пользователя", callback_data: 'find_user'}],
          [{text: "Заявки на вывод", callback_data: 'find_withdraw'}],
          [{text: "В главное меню", callback_data: 'start'}],
        ]
      },
    });
};

export const getStats = async (ctx: MyContext) => {
  await ctx.answerCbQuery()

  const loadingMsg = await ctx.reply("Загружаем данные...");
  const api = getNsfwApi(ctx.session.project!);
  const baseData = await api.fetchBaseData();
  const paymentData = await api.fetchPaymentData();
  const success = baseData.success;
  const failed = baseData.failed;
  await ctx.deleteMessage(loadingMsg.message_id);
  const paymentText = Object.entries(paymentData)
    .map(([method, amount]) => `${method}: ${amount.toFixed(2)}$`)
    .join("\n");

  await ctx.reply(t("nsfw_stat", {
    total_generation: success,
    total_error: failed,
    payments: paymentText,
  }))
}

export const searchUser = async (ctx: MyContext, email: string) => {
  const loadingMsg = await ctx.reply("Занимаемся поиском, пару секунд и все будет готово…");
  const api = getNsfwApi(ctx.session.project!);
  const data = await api.fetchUser(email);
  ctx.session.currentUser = data;
  await ctx.deleteMessage(loadingMsg.message_id);
  const {text, keyboard} = userBlock(data, ctx.session.project!)
  await ctx.reply(text, keyboard);
};

export const getWithdrawal = async (ctx: MyContext) => {
  await ctx.answerCbQuery()

  const loadingMsg = await ctx.reply("Загружаем данные...");
  const api = getNsfwApi(ctx.session.project!);
  const withdraws = await api.fetchWithdrawal();
  await ctx.deleteMessage(loadingMsg.message_id);
  for (const w of withdraws) {
    const text = [
      `👤 Email: *${w.user.email}*`,
      `💰 Сумма: *${w.amount}$*`,
      `🏦 Адрес: \`${w.address}\``,
      `📅 Дата: ${dayjs(w.createdAt).format("DD.MM.YYYY HH:mm")}`,
    ].join("\n");

    await ctx.reply(text, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {text: "✔ Подтвердить", callback_data: `withdraw_ok_${w.id}`},
            {text: "❌ Отклонить", callback_data: `withdraw_cancel_${w.id}`},
          ],
        ],
      },
    });
  }
}


export const updateWithdrawal = async (ctx: MyContext, id: number, isCanceled: boolean) => {
  const loadingMsg = await ctx.reply("Обновляем данные...");
  const mode = isCanceled ? "CANCELED" : "SUCCESS";
  const msg = isCanceled ? "Выплата успешно отменена" : "Выплата успешно выполнена";

  const api = getNsfwApi(ctx.session.project!);
  await api.updateWithdrawal(id, mode);
  await ctx.deleteMessage(loadingMsg.message_id);
  await ctx.reply(msg);
}

export const updateBalance = async (ctx: MyContext, balance: string) => {
  const loadingMsg = await ctx.reply("Обновляем данные...");
  if (!ctx.session.currentUser) return;
  ctx.session.mode = "SEARCH_USER";
  const user = ctx.session.currentUser.user;
  if (!user) {
    await ctx.reply("пользователь не выбран!")
    return;
  }
  const api = getNsfwApi(ctx.session.project!);
  ctx.session.currentUser.user = await api.updateUser(user.id, Number(balance), user.is_blocked);
  await ctx.deleteMessage(loadingMsg.message_id);
  const {text, keyboard} = userBlock(ctx.session.currentUser, ctx.session.project!)
  await ctx.reply(text, keyboard);
}


export const toggleBlock = async (ctx: MyContext) => {
  const loadingMsg = await ctx.reply("Обновляем данные...");
  if (!ctx.session.currentUser) return;
  const user = ctx.session.currentUser?.user;
  if (!user) {
    await ctx.reply("пользователь не выбран!")
    return;
  }
  const api = getNsfwApi(ctx.session.project!);
  ctx.session.currentUser.user = await api.updateUser(user.id, user.balance, !user.is_blocked);
  await ctx.deleteMessage(loadingMsg.message_id);
  await ctx.deleteMessage();
  const {text, keyboard} = userBlock(ctx.session.currentUser, ctx.session.project!)
  await ctx.reply(text, keyboard);
}


export const referralInfo = async (ctx: MyContext) => {
  await ctx.answerCbQuery();
  const loadingMsg = await ctx.reply("Загружаем данные...");
  if (!ctx.session.currentUser) return;
  const user = ctx.session.currentUser?.user;
  if (!user) {
    await ctx.reply("пользователь не выбран!")
    return;
  }
  const api = getNsfwApi(ctx.session.project!);
  const {referralCount, totalReferralPayments} = await api.fetchReferralInfo(user.id);
  await ctx.deleteMessage(loadingMsg.message_id);
  await ctx.reply(t("nsfw_referral_info", {count: referralCount, sum: totalReferralPayments.toFixed(2)}));
}

export const createWithdraw = async (ctx: MyContext, balance: string) => {
  if (!ctx.session.currentUser || ctx.session.currentUser.user.balance_referral < Number(balance)) {
    await ctx.reply("Проверьте сумму выплаты!");
    return;
  }
  const loadingMsg = await ctx.reply("Загружаем данные...");
  if (!ctx.session.currentUser) return;
  const user = ctx.session.currentUser?.user;
  if (!user) {
    await ctx.reply("пользователь не выбран!")
    return;
  }
  const api = getNsfwApi(ctx.session.project!);
  ctx.session.currentUser.user = await api.createWithdrawal(user.id, Number(balance));
  await ctx.deleteMessage(loadingMsg.message_id);
  await ctx.reply("Выплата произведена!");
  await ctx.deleteMessage();
  const {text, keyboard} = userBlock(ctx.session.currentUser, ctx.session.project!)
  await ctx.reply(text, keyboard);
}