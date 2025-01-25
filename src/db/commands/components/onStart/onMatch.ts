import TelegramBot from "node-telegram-bot-api";
import { client } from "../../../main";
import { User } from "../../../entity/user.entity";
import randomstring from 'randomstring';
import { bot, redis } from "../../../..";


export async function onMatch(userId: number, match: RegExpExecArray) {
    const uniqueId = match['input'].split('/start ')[1];
    let userExists: User[] | null = (await client.query(`
                SELECT * FROM anon_users
                WHERE user_id = $1
            `, [userId])).rows;

    if (userExists.length === 0) {
        const uniqueId = randomstring.generate({ length: 8 });
        await client.query(`
                    INSERT INTO anon_users (unique_id, user_id)
                    VALUES ($1, $2)
                `, [uniqueId, userId]);
    }

    const user: User[] | null = (await client.query(`
                SELECT * FROM anon_users
                WHERE unique_id = $1  
            `, [uniqueId])).rows;

    if (user.length > 0) {
        // if (user[0].user_id == userId) {
        //     await bot.sendMessage(userId, `You can't send messages to yourself`);
        //     return
        // }

        const blocker = (await client.query(`
            SELECT * FRom blocked_users
            WHERE blocked_id = $1 AND blocker_id = $2  
        `, [user[0].user_id, userId])).rows

        if (blocker.length > 0) {
            await bot.sendMessage(userId, '*You have blocked this user*', {
                parse_mode: "Markdown",
                reply_markup: {
                    keyboard: [[{ text: "Unblock" }]],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }

            })
            return
        }

        const blocked = (await client.query(`
            SELECT * FRom blocked_users
            WHERE blocked_id = $1 AND blocker_id = $2  
        `, [userId, user[0].user_id])).rows

        if (blocked.length > 0) {
            await bot.sendMessage(userId, '*A user has blocked you*', { parse_mode: "Markdown" })
            return
        }

        await redis.set(userId.toString(), user[0].user_id)
        await redis.set(user[0].user_id.toString(), userId)

        await bot.sendMessage(userId, 'You are in chat!', {
            reply_markup: {
                keyboard: [[{ text: "Quit" }, { text: "Block" }]],
                resize_keyboard: true,
            }
        });
        await bot.sendMessage(user[0].user_id, "There's a new companion joining you!", {
            reply_markup: {
                keyboard: [[{ text: "Quit" }, { text: "Block" }]],
                resize_keyboard: true,
            }
        });
    }
    else {
        await bot.sendMessage(userId, `User doesn't exist`);
    }

}