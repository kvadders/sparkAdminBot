import { Context, MiddlewareFn } from "telegraf";

const ALLOWED_USERS = [
  1951873541,
  1343364574,
];

export const authMiddleware: MiddlewareFn<Context> = async (ctx, next) => {
  const userId = ctx.from?.id;

  if (!userId || !ALLOWED_USERS.includes(userId)) {
    await ctx.reply("❌ Доступ запрещён. Можешь попробовать ещё раз, но от этого ничего не изменится.");
    return;
  }

  return next();
};