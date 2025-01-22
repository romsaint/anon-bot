import TelegramBot from "node-telegram-bot-api";
import { anonState, bot, replyState } from "../..";
import { onStart } from "./onStart";

export async function onText(msg: TelegramBot.Message) {
    try {
        const userId = msg.from?.id;
        const text = msg.text;

        if (msg.text === 'Back' && userId) {
            for (const session of anonState[userId]) {
                if (session.chatId === `${userId}-${session.targetUserId}` || session.chatId === `${session.targetUserId}-${userId}`) {
                    session.replyOnly = true
                }
            }
            await onStart(msg, null);
            return;
        }
        if (!userId) {
            return;
        }

        if (msg.reply_to_message?.message_id && msg.reply_to_message.from?.id && replyState[userId]?.length > 0) {
            const targetSession = replyState[userId].find(session =>
                session.chatId === `${userId}-${msg.reply_to_message?.from?.id}`
            );

            for (const session of replyState[userId]) {
                if (!session.replyOnly) {
                    await bot.sendMessage(
                        session.targetUserId,
                        `<b>Новое анонимное сообщение:</b>\n\n${text}\n\n<i>Свайпните для ответа</i>`,
                        {
                            parse_mode: "HTML",
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: "Заблокировать", callback_data: `block-${session.chatId}` }]
                                ]
                            }
                        }
                    );
                    let newChatId = `${userId}-${session.targetUserId}`;
                    if (!replyState[session.targetUserId]) replyState[session.targetUserId] = [];
                    replyState[session.targetUserId].push({
                        targetUserId: userId,
                        chatId: newChatId,
                        replyOnly: false
                    });
                }

                return;
            }
        }
        if (!anonState[userId]?.length) {
            return;
        }


        for (const session of anonState[userId]) {
            if (!session.replyOnly) {
                await bot.sendMessage(
                    session.targetUserId,
                    `<b>Новое анонимное сообщение:</b>\n\n${text}\n\n<i>Свайпните для ответа</i>`,
                    {
                        parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: "Заблокировать", callback_data: `block-${session.chatId}` }]
                            ]
                        }
                    }
                );
                console.log(session)
            }
        }

    } catch (e) {
        if (e instanceof Error) {
            console.log(e.message);
            await bot.sendMessage(msg.chat.id, 'Error :(');
        }
    }
}