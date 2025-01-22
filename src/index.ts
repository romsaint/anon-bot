import TgBot from 'node-telegram-bot-api'
import dotenv from 'dotenv'

import { onStart } from './db/commands/onStart';
import { onText } from './db/commands/ontext';
// import { onPhoto } from './db/commands/onPhoto';
import { onSticker } from './db/commands/onSticker';
dotenv.config()

const token = process.env.API_KEY_BOT
if (!token) {
    throw new Error('TOKEN!')
}
export const bot = new TgBot(token, {
    polling: true
})
bot.setMyCommands([{ command: 'start', description: 'Start bot' }])

export interface ChatSession {
    targetUserId: number;
    chatId: string;
    replyOnly: boolean
}

export const anonState: Record<number, ChatSession[]> = {};
export const replyState: Record<number, ChatSession[]> = {};
// Теперь anonState хранит массив активных диалогов для каждого пользователя

bot.onText(/\/start/, onStart)
bot.on('text', onText)
// bot.on('photo', onPhoto)
bot.on('callback_query', async query => {
    if (!query.data || !query.message) return;

    const [action, chatId] = query.data.split('-');
    const userId = query.from.id;

    if (action === 'block') {
        // Удаляем диалог из anonState
        if (anonState[userId]) {
            anonState[userId] = anonState[userId].filter(
                session => session.chatId !== chatId
            );
        }
        
        await bot.sendMessage(
            query.message.chat.id, 
            "Диалог заблокирован. Вы больше не получите сообщения от этого пользователя."
        );
    }
});
bot.on('sticker', onSticker)
// Обработчик ответов на сообщения
