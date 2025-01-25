import TelegramBot from 'node-telegram-bot-api';
import { bot, redis } from '../..';


export async function onVoice(msg: TelegramBot.Message) {
    try {
        const userId = msg.from?.id;
        
        if (userId) {
            const chatSessions1 = await redis.get(userId.toString())
            const chatSessions2 = await redis.get(chatSessions1 || '-1')

            if (chatSessions1 && userId.toString() === chatSessions2 && msg.voice) {
                await bot.sendChatAction(chatSessions1, 'record_voice')
                await bot.sendChatAction(chatSessions1, 'upload_voice')
                await bot.sendVoice(chatSessions1, msg.voice.file_id)
                return
            }
        }
    } catch (e) {
        if (e instanceof Error) console.log('e.message')
        await bot.sendMessage(msg.chat.id, 'Error');
    }
}