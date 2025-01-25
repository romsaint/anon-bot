import TelegramBot from 'node-telegram-bot-api';
import { bot, redis } from '../..';
import { onStart } from './onStart';
import { client } from '../main';
import { quit } from './components/onText/quit';
import { block } from './components/onText/block';
import { unblock } from './components/onText/unblock';
import { onTextBlocker } from './components/onText/onTextBlocker';
import { search } from './components/onText/search';


export async function onText(msg: TelegramBot.Message) {
    try {
        const userId = msg.from?.id;
        const text = msg.text;

        if (userId) {
            const chatSessions1 = await redis.get(userId.toString())
            const chatSessions2 = await redis.get(chatSessions1 || '-1')

            if (text && chatSessions2 && chatSessions1 && userId.toString() == await redis.get(chatSessions1)) {
                if (text === 'Block') {
                    await block(msg, userId, chatSessions1, chatSessions2)
                    return
                }
                if (text === 'Quit') {
                    await quit(userId, chatSessions1, chatSessions2)
                    return
                }
                if (text === 'Unblock') {
                    await unblock(msg, userId, chatSessions1, chatSessions2)
                    return
                }
                await onTextBlocker(text, msg, userId, chatSessions1)
                return
            }
            if (text === 'Search') {
                await search(userId)
                return
            }

            switch (text) {
                case 'Start':
                    onStart(msg, null)
                    return
                case 'Search':
                    return
                case 'back':
                    onStart(msg, null)
                    return
            }
   
            if (!text?.startsWith('/start')) await bot.deleteMessage(msg.chat.id, msg.message_id)
            
            return
        }
    } catch (e) {
        if (e instanceof Error) console.log(e.message)
        await bot.sendMessage(msg.chat.id, 'Error');
    }
}