import express from 'express';
import path from "path";
import process from "node:process";
import {bot} from "./bot";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


app.listen(PORT, async () => {
  console.log(`🌐 Express сервер запущен на http://localhost:${PORT}`);
  console.log(`📂 Статика: ${path.join(__dirname, '../assets')}`);
  try {
    //await bot.telegram.setWebhook(`https://bot.art-neurona.com/lwemfkrewmfgkwem34234353wfrwerfvwerfwedsf`);
    //console.log('✅ Webhook установлен');
    await bot.launch()
  } catch (err) {
    console.error('❌ Ошибка установки вебхука', err);
  }
});


process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
