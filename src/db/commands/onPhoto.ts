import TelegramBot from 'node-telegram-bot-api';
import { bot, chatSessions } from '../..';
import { onStart } from './onStart';


export async function onPhoto(msg: TelegramBot.Message) {
    try {
        const userId = msg.from?.id;
        if (userId) {
            if (chatSessions[userId] && userId == chatSessions[chatSessions[userId]] && msg.photo) {
                await bot.sendPhoto(chatSessions[userId], msg.photo[msg.photo.length - 1].file_id)
                return
            }
        }
    } catch (e) {
        if (e instanceof Error) console.log('e.message')
        await bot.sendMessage(msg.chat.id, 'Error');
    }
}