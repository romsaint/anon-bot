import TelegramBot from 'node-telegram-bot-api';
import { bot, redis } from '../..';
import { onStart } from './onStart';
import { client } from '../main';


export async function onText(msg: TelegramBot.Message) {
    try {
        const userId = msg.from?.id;
        const text = msg.text;

        if (userId) {
            const chatSessions1 = await redis.get(userId.toString())
            const chatSessions2 = await redis.get(chatSessions1 || '-1')

            if (text && chatSessions2 && chatSessions1 && userId.toString() == await redis.get(chatSessions1)) {
                if (text === 'Unblock') {
                    const existsBlock = (await client.query(`
                        SELECT * FROM blocked_users
                        WHERE blocked_id = $1 AND blocker_id = $2
                    `, [chatSessions2, userId])).rows
                    if (existsBlock.length > 0) {
                        await client.query(`
                            DELETE FROM blocked_users
                            WHERE blocked_id = $1 AND blocker_id = $2
                        `, [chatSessions2, userId])

                        await redis.del(chatSessions1)
                        await redis.del(chatSessions2)

                        await bot.sendMessage(userId, '*User was unblocked!*', { parse_mode: "Markdown" })
                        onStart(msg, null)
                        return
                    }

                }
                if (text === 'Block') {
                    const existsBlock = (await client.query(`
                        SELECT * FROM blocked_users
                        WHERE blocked_id = $1 AND blocker_id = $2
                    `, [userId, chatSessions2])).rows

                    if (existsBlock.length === 0) {
                        await client.query(`
                            INSErT INTO blocked_users (blocked_id, blocker_id)
                            VALUES ($1, $2)
                        `, [userId, chatSessions2])

                        await redis.del(chatSessions1)
                        await redis.del(chatSessions2)

                        await bot.sendMessage(userId, '*User was blocked!*', { parse_mode: "Markdown" })
                        onStart(msg, null)
                        return
                    }

                }
                if (text === 'Quit') {
                    await bot.sendMessage(chatSessions1, "*Your interlocutor out of the chat room*", {
                        reply_markup: {
                            keyboard: [[{ text: "Start" }]],
                            resize_keyboard: true,
                        },
                        parse_mode: "Markdown"
                    })
                    await redis.del(chatSessions1)
                    await redis.del(chatSessions2)

                    await bot.sendMessage(userId, "*You're out of the chat room*", {
                        reply_markup: {
                            keyboard: [[{ text: "Start" }]],
                            resize_keyboard: true,
                        },
                        parse_mode: "Markdown"
                    })

                    return
                }
                const blocker = (await client.query(`
                    SELECT * FRom blocked_users
                    WHERE blocked_id = $1 AND blocker_id = $2  
                `, [chatSessions2, userId])).rows

                if (blocker.length == 0) {
                    await bot.sendChatAction(msg.chat.id, 'typing')
                    await bot.sendMessage(chatSessions2, text, {
                        parse_mode: "Markdown"
                    })
                    return
                }else{
                    await bot.deleteMessage(msg.chat.id, msg.message_id)
                    return
                }

            }

            switch (text) {
                case 'Start':
                    onStart(msg, null)
                    return
                case 'back':
                    onStart(msg, null)
                    return
            }

            if (!text?.startsWith('/start')) await bot.deleteMessage(msg.chat.id, msg.message_id)
        }
    } catch (e) {
        if (e instanceof Error) console.log(e.message)
        await bot.sendMessage(msg.chat.id, 'Error');
    }
}