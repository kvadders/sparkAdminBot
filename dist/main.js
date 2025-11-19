"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const node_process_1 = __importDefault(require("node:process"));
const bot_1 = require("./bot");
const app = (0, express_1.default)();
const PORT = node_process_1.default.env.PORT || 3000;
app.use(express_1.default.json());
app.listen(PORT, async () => {
    console.log(`🌐 Express сервер запущен на http://localhost:${PORT}`);
    console.log(`📂 Статика: ${path_1.default.join(__dirname, '../assets')}`);
    try {
        //await bot.telegram.setWebhook(`https://bot.art-neurona.com/lwemfkrewmfgkwem34234353wfrwerfvwerfwedsf`);
        //console.log('✅ Webhook установлен');
        await bot_1.bot.launch();
    }
    catch (err) {
        console.error('❌ Ошибка установки вебхука', err);
    }
});
node_process_1.default.once('SIGINT', () => bot_1.bot.stop('SIGINT'));
node_process_1.default.once('SIGTERM', () => bot_1.bot.stop('SIGTERM'));
