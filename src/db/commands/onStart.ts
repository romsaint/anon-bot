import TelegramBot from "node-telegram-bot-api";
import { client } from "../main";
import { User } from "../entity/user.entity";
import randomstring from 'randomstring';
import { bot, chatSessions, rejectState } from "../..";

export async function onStart(msg: TelegramBot.Message, match: RegExpExecArray | null) {
    try {
        let link;
        const userId = msg.from?.id;

        if (!userId) {
            console.error("User ID is empty or undefined");
            return;
        }
        if (chatSessions[userId] && userId == chatSessions[chatSessions[userId]]) {
            return
        }
        if (match && match['input'] && match['input'].split('/start ')[1]) {
            const uniqueId = match['input'].split('/start ')[1];

            const user: User[] | null = (await client.query(`
                SELECT * FROM anon_users
                WHERE unique_id = $1  
            `, [uniqueId])).rows;
                // 5989250590
            if (user.length > 0) {
                if (user[0].user_id == userId) {
                    await bot.sendMessage(userId, `You can't send messages to yourself`);
                    return
                }
                chatSessions[userId] = user[0].user_id;
                chatSessions[user[0].user_id] = userId;

                await bot.sendMessage(userId, 'You are in chat!', {
                    reply_markup: {
                        keyboard: [[{ text: "Quit" }]],
                        resize_keyboard: true,
                    }
                });
                await bot.sendMessage(user[0].user_id, "There's a new companion joining you!", {
                    reply_markup: {
                        keyboard: [[{ text: "Quit" }]],
                        resize_keyboard: true,
                    }
                });

            }
            else {
                rejectState[userId] = true
                await bot.sendMessage(userId, `User doesn't exist`);
            }

        } else {
            const user: User[] | null = (await client.query(`
                SELECT * FROM anon_users
                WHERE user_id = $1
            `, [userId])).rows;

            if (user.length === 0) {
                const uniqueId = randomstring.generate({ length: 8 });
                link = `http://t.me/wi3_anon_bot?start=${uniqueId}`;
                await client.query(`
                    INSERT INTO anon_users (unique_id, user_id)
                    VALUES ($1, $2)
                `, [uniqueId, userId]);
            } else {
                link = `http://t.me/wi3_anon_bot?start=${user[0].unique_id}`;
            }

            const text = `This bot designed to exchange anonymous messages with other people. \`Send what you want!\` *Any videos, text, voice messages* don't limit yourself!\n*Here's your link:* \n[${link}](${link})`;

            await bot.sendMessage(userId, text, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "Share link", switch_inline_query: link }]
                    ]
                }
            });
        }
    } catch (e) {
        if (e instanceof Error) {
            console.log(e.message);
            if (msg.from?.id) {
                await bot.sendMessage(msg.from?.id, 'Error :(');
            }
        }
    }
}