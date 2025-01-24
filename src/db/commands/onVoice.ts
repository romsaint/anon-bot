import TelegramBot from 'node-telegram-bot-api';
import { bot, chatSessions } from '../..';


export async function onVoice(msg: TelegramBot.Message) {
    try {
        const userId = msg.from?.id;
        if (userId) {
            if (chatSessions[userId] && userId == chatSessions[chatSessions[userId]] && msg.voice) {
                await bot.sendVoice(chatSessions[userId], msg.voice.file_id)
                return
            }
        }
    } catch (e) {
        if (e instanceof Error) console.log('e.message')
        await bot.sendMessage(msg.chat.id, 'Error');
    }
}