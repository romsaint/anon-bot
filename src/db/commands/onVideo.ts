import TelegramBot from 'node-telegram-bot-api';
import { bot, redis } from '../..';


export async function onVideo(msg: TelegramBot.Message) {
    try {
        const userId = msg.from?.id;
        if (userId) {
            const chatSessions1 = await redis.get(userId.toString())
            const chatSessions2 = await redis.get(chatSessions1 || '-1')

            if (chatSessions1 && userId.toString() == chatSessions2 && msg.video) {
                await bot.sendChatAction(chatSessions1, 'upload_video')
                await bot.sendVideo(chatSessions1, msg.video.file_id, {
                    has_spoiler: true
                })
                return
            }
            if (chatSessions1 && userId.toString() == chatSessions2 && msg.video_note) {
                await bot.sendChatAction(chatSessions1, 'upload_video_note')
                await bot.sendVideoNote(chatSessions1, msg.video_note.file_id)
                return
            }
        }
    } catch (e) {
        if (e instanceof Error) console.log('e.message')
        await bot.sendMessage(msg.chat.id, 'Error');
    }
}