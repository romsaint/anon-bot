import TelegramBot from "node-telegram-bot-api";
import { client } from "../../../main";
import { User } from "../../../entity/user.entity";
import randomstring from 'randomstring';
import { bot, redis } from "../../../..";


export async function noMatch(userId: number) {
    const user: User[] | null = (await client.query(`
        SELECT * FROM anon_users
        WHERE user_id = $1
    `, [userId])).rows;

    let link

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
                [{ text: "Share link", switch_inline_query: link }],
            ],
        },
    });
    
    await bot.sendMessage(userId, "Choose action:", {
        reply_markup: {
            keyboard: [[{ text: "Search" }], [{ text: "Delete account" }]],
            resize_keyboard: true,
        },
    });
}