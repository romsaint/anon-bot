import TelegramBot from 'node-telegram-bot-api';
import { bot, chatSessions } from '../..';


export async function onAudio(msg: TelegramBot.Message) {
    try {
        const userId = msg.from?.id;
        if (userId) {
            console.log(msg.audio)
            if (chatSessions[userId] && userId == chatSessions[chatSessions[userId]] && msg.audio) {
                await bot.sendAudio(chatSessions[userId], msg.audio.file_id)
                return
            }
        }
    } catch (e) {
        if (e instanceof Error) console.log('e.message')
        await bot.sendMessage(msg.chat.id, 'Error');
    }
}