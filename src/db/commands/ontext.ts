import TelegramBot from 'node-telegram-bot-api';
import { bot, chatSessions, rejectState } from '../..';
import { onStart } from './onStart';


export async function onText(msg: TelegramBot.Message) {
    try {
        const userId = msg.from?.id;
        const text = msg.text;

        if (userId) {
            if (text && chatSessions[userId] && userId == chatSessions[chatSessions[userId]]) {
                if (text === 'Quit') {
                    await bot.sendMessage(chatSessions[userId], "*Your interlocutor out of the chat room*", {
                        reply_markup: {
                            keyboard: [[{text: "Start"}]],
                            resize_keyboard: true,
                        },
                        parse_mode: "Markdown"
                    })
                    chatSessions[chatSessions[userId]] = -1
                    chatSessions[userId] = -1
                    await bot.sendMessage(userId, "*You're out of the chat room*", {
                        reply_markup: {
                            keyboard: [[{text: "Start"}]],
                            resize_keyboard: true,
                        },
                        parse_mode: "Markdown"
                    })
                    return
                }

                await bot.sendMessage(chatSessions[userId], text, {
                    parse_mode: "Markdown"
                })
                return
            }

            switch (text) {
                case 'Start':
                    onStart(msg, null)
                    return
                case '/start':
                    return
                case 'back':
                    onStart(msg, null)
                    return
            }

            if(!rejectState[userId]) {
                await bot.deleteMessage(msg.chat.id, msg.message_id)
            }
        }
    } catch (e) {
        if (e instanceof Error) console.log('e.message')
        await bot.sendMessage(msg.chat.id, 'Error');
    }
}