import TelegramBot from "node-telegram-bot-api";
import { bot, redis } from "../..";
import { onMatch } from "./components/onStart/onMatch";
import { noMatch } from "./components/onStart/noMatch";



export async function onStart(msg: TelegramBot.Message, match: RegExpExecArray | null) {
    try {
        const userId = msg.from?.id;

        if (!userId) {
            return;
        }
        const chatSessions1 = await redis.get(userId.toString())

        if (chatSessions1 && chatSessions1 == await redis.get(chatSessions1)) {
            return
        }

        if (match && match['input'] && match['input'].split('/start ')[1]) {
            await onMatch(userId, match)
        } else {
            await noMatch(userId)
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