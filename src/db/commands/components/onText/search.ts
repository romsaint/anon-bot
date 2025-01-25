import { client } from "../../../main"
import { bot, redis } from "../../../.."

export async function search(userId: number) {
    const count = (await client.query(`
        select COUNT(*) from anon_users
    `)).rows[0].count

    if (count && count > 1) {
        let randomIdx = Math.round(Math.random() * count)
        
        let user = (await client.query(`
            select user_id from anon_users
            offset $1
            limit 1  
        `, [randomIdx > 0 ? randomIdx - 1 : randomIdx])).rows
        let k = 0
        while(user[0].user_id == userId) {
            k++
            randomIdx = Math.round(Math.random() * count)
            
            user = (await client.query(`
                select user_id from anon_users
                offset $1
                limit 1  
            `, [randomIdx > 0 ? randomIdx - 1 : randomIdx])).rows
            if(k > 10) {
                await bot.sendMessage(userId, "*Users not found*", {parse_mode: 'Markdown'})
                return
            }
        }

        await redis.set(userId.toString(), user[0].user_id)
        await redis.set(user[0].user_id, userId.toString())

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

        return
    }else{
        await bot.sendMessage(userId, "*Users not found*", {parse_mode: 'Markdown'})
        return
    }
}