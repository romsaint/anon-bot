import TelegramBot from "node-telegram-bot-api";
import { client } from "../main";
import { User } from "../entity/user.entity";
import { anonState, bot, replyState } from "../..";
import randomstring from 'randomstring';

export async function onStart(msg: TelegramBot.Message, match: RegExpExecArray | null) {
    try {
        let link;
        const userId = msg.from?.id

      
        if (match && match['input'].split('/start ')[1] && userId) {
            const uniqueId = match['input'].split('/start ')[1]
 
            const user: User[] | null = (await client.query(`
                SELECT * FROM anon_users
                WHERE unique_id = $1  
            `, [uniqueId])).rows
 
            if (user[0].user_id === userId) {
                await bot.sendMessage(msg.chat.id, "You can't write a message to yourself")
                return
            } else if (user.length > 0) {
                // Создаем новый диалог
                const newChatId = `${userId}-${user[0].user_id}`;

                if (!anonState[userId]) anonState[userId] = [];
                anonState[userId].push({
                    targetUserId: user[0].user_id,
                    chatId: newChatId,
                    replyOnly: false
                });
                if (!replyState[user[0].user_id]) replyState[user[0].user_id] = [];
                replyState[user[0].user_id].push({
                    targetUserId: userId,
                    chatId: newChatId,
                    replyOnly: false
                });

                await bot.sendMessage(msg.chat.id, 'Write anonymous message: ', {
                    reply_markup: {
                        keyboard: [[{ text: "Back" }]],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
                return;
            }
            else {
                await bot.sendMessage(msg.chat.id, 'User not found :(')
                return
            }
        }


        const user: User[] | null = (await client.query(`
            SELECT * FROM anon_users
            WHERE user_id = $1  
        `, [userId])).rows

        if (user.length === 0) {
            const uniqueId = randomstring.generate({ length: 8 })
            link = `http://t.me/wi3_anon_bot?start=${uniqueId}`
            await client.query(`
                INSERT INTO anon_users (unique_id, user_id)
                VALUES ($1, $2)
            `, [uniqueId, userId])
        } else {
            link = `http://t.me/wi3_anon_bot?start=${user[0].unique_id}`
        }

        const text = `This bot designed to exchange anonymous messages with other people. \`Send what you want!\` *Any videos, text, voice messages* don't limit yourself!\n*Here's your link:* \n[${link}](${link})`
        await bot.sendMessage(msg.chat.id, text, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Share link", switch_inline_query: link }]
                ]
            }
        })
    } catch (e) {
        if (e instanceof Error) {
            console.log(e.message)
            await bot.sendMessage(msg.chat.id, 'Error :(')
        }
    }
}