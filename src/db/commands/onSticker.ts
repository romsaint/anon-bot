import TelegramBot from 'node-telegram-bot-api';
import { bot, chatSessions } from '../..';


export async function onSticker(msg: TelegramBot.Message) {
    try {
        const userId = msg.from?.id;
        if (userId) {
            if (chatSessions[userId] && userId == chatSessions[chatSessions[userId]] && msg.sticker) {
                await bot.sendSticker(chatSessions[userId], msg.sticker.file_id)
                return
            }
        }
    } catch (e) {
        if (e instanceof Error) console.log('e.message')
        await bot.sendMessage(msg.chat.id, 'Error');
    }
}