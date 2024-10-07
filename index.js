const { Telegraf, Markup } = require('telegraf');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const {startTxt, privateKotaStartTxt, uidRefuse, uidFind, uidChange, educationKotaStartTxt} = require("./textConsts");

// Підключення до бази даних SQLite
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('Помилка підключення до бази даних:', err);
    } else {
        console.log('Підключено до бази даних SQLite');
        // Створення таблиці для користувачів з полями id та username
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                username TEXT
            )
        `);
    }
});

// Функція для збереження користувача в базі даних
function saveUser(telegramId, username) {
    db.run(`
        INSERT OR IGNORE INTO users(id, username) 
        VALUES(?, ?)
    `, [telegramId, username], (err) => {
        if (err) {
            return console.error('Помилка збереження користувача:', err);
        }
        console.log('Користувача збережено:', telegramId);
    });
}

const tgcryptakotaBot = new Telegraf('7965968007:AAGg4TWakrqx4weRqsKSoIFUZivpegBlgzQ');

tgcryptakotaBot.telegram.setMyCommands([
    { command: 'start', description: 'Начать сначала' },
]);
tgcryptakotaBot.start((ctx) => {

    const telegramId = ctx.from.id;
    const username = ctx.from.username || 'Невідомий';
    saveUser(telegramId, username);

    ctx.replyWithHTML(
        startTxt,
        Markup.inlineKeyboard(
            [
                [Markup.button.callback('📈💰Сообщество PRIVATE KOTA', 'btn_privateKota')],
                [Markup.button.callback('🧠👨‍💻Академия EDUCATION KOTA', 'btn_educationKota')],
            ]
        )
    )
})

tgcryptakotaBot.action('btn_educationKota', (ctx) => {
    ctx.replyWithHTML(
        educationKotaStartTxt,
        Markup.inlineKeyboard([
            // [Markup.button.url('🔗Зарегистрироваться', 'https://partner.bybit.com/b/kota')],
            [Markup.button.url('👨‍💻Связаться с поддержкой', 'https://t.me/managerkota')],
        ])
    )
});

tgcryptakotaBot.action('btn_privateKota', (ctx) => {
    ctx.replyWithHTML(
        privateKotaStartTxt,
        Markup.inlineKeyboard([
            [Markup.button.url('🔗Зарегистрироваться', 'https://partner.bybit.com/b/kota')],
            [Markup.button.url('👨‍💻Связаться с поддержкой', 'https://t.me/managerkota')],
        ])
    )
});

// Обробка будь-якого текстового повідомлення від користувача
tgcryptakotaBot.on('text', (ctx) => {
    const message = ctx.message.text;

    // Перевіряємо чи містить повідомлення тільки цифри
    if (/^\d+$/.test(message)) {
        ctx.replyWithHTML(uidRefuse);

        // Використовуємо setTimeout окремо
        setTimeout(() => {
            ctx.replyWithPhoto(
                { source: path.join(__dirname, 'image', 'changeVerif.jpeg') },
                {
                    caption: uidChange,
                    parse_mode: 'HTML'  // Щоб форматування HTML працювало в тексті
                }
            );
        }, 1000); // Час затримки 1 секунда
    }
    // Якщо повідомлення містить і цифри, і букви
    else {
        ctx.replyWithHTML('<b>UID должен быть числом, повторите ввод!</b>');

        // Використовуємо setTimeout окремо
        setTimeout(() => {
            ctx.replyWithPhoto(
                { source: path.join(__dirname, 'image', 'findUID.jpeg') },
                {
                    caption: uidFind,
                    parse_mode: 'HTML'  // Щоб форматування HTML працювало в тексті
                }
            );
        }, 1000); // Час затримки 1 секунда
    }
});

tgcryptakotaBot.launch();