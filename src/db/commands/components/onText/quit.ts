import { bot, redis } from "../../../.."

export async function quit(userId: number, chatSessions1: string, chatSessions2: string) {
    await bot.sendMessage(chatSessions1, "*Your interlocutor out of the chat room*", {
        reply_markup: {
            keyboard: [[{ text: "Search" }]],
            resize_keyboard: true,
        },
        parse_mode: "Markdown"
    })

    await redis.del(chatSessions1)
    await redis.del(chatSessions2)

    await bot.sendMessage(userId, "*You're out of the chat room*", {
        reply_markup: {
            keyboard: [[{ text: "Search" }]],
            resize_keyboard: true,
        },
        parse_mode: "Markdown"
    })

    return
} 