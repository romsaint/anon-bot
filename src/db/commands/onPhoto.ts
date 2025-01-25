import TelegramBot from 'node-telegram-bot-api';
import { bot, redis } from '../..';


export async function onPhoto(msg: TelegramBot.Message) {
    try {
        const userId = msg.from?.id
        
        if (userId) {
            const chatSessions1 = await redis.get(userId.toString())
            const chatSessions2 = await redis.get(chatSessions1 || '-1')

            if (msg.photo && chatSessions1 && userId.toString() == chatSessions2) {
                await bot.sendChatAction(chatSessions1, 'upload_photo')
                await bot.sendPhoto(chatSessions1, msg.photo[msg.photo.length - 1].file_id, {
                    has_spoiler: true
                })
                return
            }
        }
    } catch (e) {
        if (e instanceof Error) console.log('e.message')
        await bot.sendMessage(msg.chat.id, 'Error');
    }
}