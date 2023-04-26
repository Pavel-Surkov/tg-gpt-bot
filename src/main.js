import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { code } from 'telegraf/format';
import config from 'config';
import { ogg } from './ogg.js';
import { openai } from './openai.js';

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'));

bot.on(message('voice'), async (ctx) => {
  try {
    await ctx.reply(code('Waiting for server response...'));

    const userId = String(ctx.message.from.id);
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
    const oggPath = await ogg.create(link.href, userId);
    const mp3Path = await ogg.toMp3(oggPath, userId);

    const text = await openai.transcription(mp3Path);
    // const response = await openai.chat(text);

    await ctx.reply(`Your message: ${text}`);

    // await ctx.reply(JSON.stringify(text, null, 2));
  } catch (err) {
    console.log(`Error while voice message`, err);
  }
});

bot.command('start', async (ctx) => {
  await ctx.reply(JSON.stringify(ctx.message, null, 2));
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
