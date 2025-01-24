import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { onStart } from './db/commands/onStart';
import { onText } from './db/commands/ontext';
import { onSticker } from './db/commands/onSticker';
import { onPhoto } from './db/commands/onPhoto';
import { onVideo } from './db/commands/onVideo';
import { onAudio } from './db/commands/onAudio';
import { onVoice } from './db/commands/onVoice';


dotenv.config();

const token = process.env.API_KEY_BOT;
if (!token) {
    throw new Error('TOKEN is not defined!');
}

export const bot = new TelegramBot(token, { polling: true });

const commands = [
    { command: 'start', description: 'Start anonymous chat' }
]
import { Redis } from "ioredis";

export const redis = new Redis({
    host: "localhost",
    port: 6379
});

bot.setMyCommands(commands);

// Обработчики

bot.onText(/\/start/, onStart);
bot.on('text', onText);
bot.on('sticker', onSticker);
bot.on('photo', onPhoto);
bot.on('video', onVideo);
bot.on('video_note', onVideo);
bot.on('audio', onAudio);
bot.on('voice', onVoice);