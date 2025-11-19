import {t} from "../../locales/useLocale";
import {User, UserInfoResponse} from "../../@types/nsfw.dto";
import {Project} from "../../@types/context";

export const userBlock = (data: UserInfoResponse, project: Project) => {
  const user = data.user;
  const text = t("nsfw_user_info", {
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
        [{text: "Статистика", callback_data: "referralInfo"}],
        [
          {text: "Изменить баланс", callback_data: "updateBalance"},
          {text: "Забл./Разбл.", callback_data: "toggleBlock"}
        ],
        [{text: "Оформить вывод", callback_data: "createWithdrawInfo"}],
        [{text: "К проекту", callback_data: project === Project.DeepNude ? "selectDN" : "selectAIDN"}],
      ],
    },
  };

  return {text, keyboard};
};

