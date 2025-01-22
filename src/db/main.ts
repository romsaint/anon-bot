import {Client} from 'pg'
import dotenv from 'dotenv'
dotenv.config()


export const client = new Client({
    user: process.env.PG_USERNAME, // Ваш пользователь PostgreSQL
    host: 'localhost',     // Хост
    database: process.env.PG_DB, // Имя базы данных
    password: process.env.PG_PASSWORD, // Пароль
    port: 5432,            // Порт PostgreSQL
});
async function connect() {
    await client.connect()
}
connect()