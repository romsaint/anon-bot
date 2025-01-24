import TelegramBot from 'node-telegram-bot-api';
import { bot, chatSessions } from '../..';


export async function onVideo(msg: TelegramBot.Message) {
    try {
        const userId = msg.from?.id;
        if (userId) {
            if (chatSessions[userId] && userId == chatSessions[chatSessions[userId]] && msg.video) {
                await bot.sendVideo(chatSessions[userId], msg.video.file_id)
                return
            }
            if (chatSessions[userId] && userId == chatSessions[chatSessions[userId]] && msg.video_note) {
                await bot.sendVideoNote(chatSessions[userId], msg.video_note.file_id)
                return
            }
        }
    } catch (e) {
        if (e instanceof Error) console.log('e.message')
        await bot.sendMessage(msg.chat.id, 'Error');
    }
}