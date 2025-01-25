import TelegramBot from "node-telegram-bot-api"
import { bot, redis } from "../../../.."
import { client } from "../../../main"
import { onStart } from "../../onStart"

export async function unblock(msg: TelegramBot.Message, userId: number, chatSessions1: string, chatSessions2: string) {
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