import TelegramBot from "node-telegram-bot-api";
import { User } from "../entity/user.entity";
import { anonState, bot } from "../..";
import { client } from "../main";
import { onStart } from "./onStart";

export async function onSticker(msg: TelegramBot.Message){
    try{
        if(msg.sticker?.file_id) {
            const stickerId = msg.sticker.file_id
            await bot.sendSticker(msg.chat.id, stickerId)
        }
        
    } catch (e) {
        if (e instanceof Error) {
            console.log(e.message)
            await bot.sendMessage(msg.chat.id, 'Error :(')
        }
    }
}