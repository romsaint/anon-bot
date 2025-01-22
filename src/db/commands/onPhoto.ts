// import TelegramBot from "node-telegram-bot-api";
// import { User } from "../entity/user.entity";
// import { anonState, bot } from "../..";
// import { client } from "../main";
// import { onStart } from "./onStart";

// export async function onPhoto(msg: TelegramBot.Message){
//     try{
//         console.log
//         const userId = msg.from?.id
//         if(msg.text === 'Back') {
//             if(msg.from?.id) {
//                 anonState[msg.from?.id] = {uniqueId: ""}
//             }
//             onStart(msg, null)
//             return
//         }
//         if(userId && anonState[userId]?.uniqueId && msg.photo && msg.photo[msg.photo.length - 1]) {
//             const uniqueId = anonState[userId].uniqueId
//             const photo = msg.photo[msg.photo.length - 1]
    
//             const user: User[] = (await client.query(`
//                 SELECT * FROM anon_users
//                 WHERE unique_id = $1
//             `, [uniqueId])).rows
//             if(user.length > 0) {
//                 await bot.sendMessage(msg.chat.id, 'Message sended, please wait')
//                 await bot.sendPhoto(user[0].user_id, photo.file_id, {
//                     caption: `${msg.caption ? msg.caption : ''}`,
//                     parse_mode: "Markdown"
//                 })
                
//             }else{
//                 await bot.sendMessage(msg.chat.id, 'The user has no account')
//                 return
//             }
//         }
//     } catch (e) {
//         if (e instanceof Error) {
//             console.log(e.message)
//             await bot.sendMessage(msg.chat.id, 'Error :(')
//         }
//     }
// }