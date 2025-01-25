import TelegramBot from "node-telegram-bot-api"
import { bot } from "../../../.."
import { client } from "../../../main"

export async function onTextBlocker(text: string, msg: TelegramBot.Message, userId: number, chatSessions1: string) {
    const blocker = (await client.query(`
        SELECT * FRom blocked_users
        WHERE blocked_id = $1 AND blocker_id = $2  
    `, [chatSessions1, userId])).rows

    if (blocker.length == 0) {
        await bot.sendMessage(chatSessions1, text, {
            parse_mode: "Markdown"
        })
    } else {
        await bot.deleteMessage(msg.chat.id, msg.message_id)
    }
}