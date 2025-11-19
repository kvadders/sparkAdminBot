"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAllSitesCommand = checkAllSitesCommand;
const SITES_TO_CHECK = [
    'https://deep-nudes.com',
    'https://ai-deep-nude.com',
    'https://undressapp.pl/',
    'https://ai-neurona.com/',
    'https://art-neurona.com/',
];
// -------------------- UTILS --------------------
const STATUS_MAP = [
    { check: (s) => s >= 200 && s < 300, emoji: '✅', text: 'Available' },
    { check: (s) => s >= 300 && s < 400, emoji: '🔄', text: 'Redirect' },
    { check: (s) => s >= 400 && s < 500, emoji: '⚠️', text: 'Client Error' },
    { check: (s) => s >= 500, emoji: '🚨', text: 'Server Error' },
];
async function checkSite(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
        const response = await fetch(url, {
            method: 'HEAD',
            redirect: 'follow',
            signal: controller.signal,
        });
        clearTimeout(timeout);
        const match = STATUS_MAP.find((x) => x.check(response.status));
        return {
            url,
            status: response.status,
            emoji: match?.emoji ?? '❓',
            description: match?.text ?? 'Unknown',
            success: response.ok,
        };
    }
    catch (e) {
        clearTimeout(timeout);
        return {
            url,
            status: 0,
            emoji: '🔌',
            description: e.name === 'AbortError' ? 'Timeout' : 'Network Error',
            success: false,
        };
    }
}
// -------------------- COMMAND --------------------
async function checkAllSitesCommand(ctx) {
    await ctx.answerCbQuery();
    const loading = await ctx.reply('🔍 Checking websites...');
    try {
        // параллельные запросы
        const results = await Promise.all(SITES_TO_CHECK.map(checkSite));
        const available = results.filter((r) => r.success).length;
        const pct = ((available / results.length) * 100).toFixed(1);
        let text = `📊 Аналитика сайтов`;
        text += results
            .map((r) => {
            const domain = r.url.replace(/^https?:\/\//, '');
            return `${r.emoji} ${domain}\nStatus: ${r.status} — ${r.description}\n`;
        })
            .join('\n');
        text += `\n📈 Summary: ${available}/${results.length} available (${pct}%)\n`;
        await ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, undefined, text);
    }
    catch (err) {
        console.error(err);
        await ctx.reply('❌ Error while checking websites.');
    }
}
