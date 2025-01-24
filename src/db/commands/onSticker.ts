import TelegramBot from 'node-telegram-bot-api';
import { bot, redis } from '../..';


export async function onSticker(msg: TelegramBot.Message) {
    try {
        const userId = msg.from?.id;
        if (userId) {
            const chatSessions1 = await redis.get(userId.toString())
            const chatSessions2 = await redis.get(chatSessions1 || '-1')

            if (msg.sticker && chatSessions1 && userId.toString() == chatSessions2) {
                await bot.sendSticker(chatSessions1, msg.sticker.file_id)
                return
            }
        }
    } catch (e) {
        if (e instanceof Error) console.log('e.message')
        await bot.sendMessage(msg.chat.id, 'Error');
    }
}