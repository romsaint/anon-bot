import TelegramBot from "node-telegram-bot-api"
import { bot, redis } from "../../../.."
import { client } from "../../../main"
import { onStart } from "../../onStart"

export async function block(msg: TelegramBot.Message, userId: number, chatSessions1: string, chatSessions2: string) {
    const existsBlock = (await client.query(`
        SELECT * FROM blocked_users
        WHERE blocked_id = $1 AND blocker_id = $2
    `, [userId, chatSessions2])).rows

    if (existsBlock.length === 0) {
        await client.query(`
            INSErT INTO blocked_users (blocked_id, blocker_id)
            VALUES ($1, $2)
        `, [userId, chatSessions2])

        await bot.sendMessage(userId, '*User was blocked!*', { parse_mode: "Markdown" })
        onStart(msg, null)
        
        return
    }
}