const { Telegraf, Markup } = require('telegraf');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const {startTxt, privateKotaStartTxt, uidRefuse, uidFind, uidChange, educationKotaStartTxt, doneRegistration,
    noRegistrationDoneDepNo
} = require("./textConsts");
const { RestClientV5 } = require('bybit-api');
require('dotenv').config();
// API ключи бота
const mainBotToken = process.env.mainBotTOKEN;
const testBotToken = process.env.testBotTOKEN;
// API ключи byibt
const apiKey = process.env.apiPublic;
const apiSecret = process.env.apiSecretApi;


const client = new RestClientV5({
    testnet: false,
    key: apiKey,
    secret: apiSecret,
});

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


const tgcryptakotaBot = new Telegraf(mainBotToken);
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

async function fetchUserData(uid) {
    try {
        const response = await client.getAffiliateUserInfo({ uid });
        console.log(response);
        return response; // Повертаємо отримані дані
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null; // Повертаємо null у випадку помилки
    }
}
// Обробка будь-якого текстового повідомлення від користувача
tgcryptakotaBot.on('text', async (ctx) => {
    const message = ctx.message.text;

    // Перевірка чи містить повідомлення тільки цифри
    if (/^\d+$/.test(message)) {
        const userData = await fetchUserData(message)
        const {result} = userData
        if (Object.keys(result).length === 0) {
            ctx.replyWithHTML(uidRefuse);
            setTimeout(() => {
                ctx.replyWithPhoto(
                    { source: path.join(__dirname, 'image', 'changeVerif.jpeg') },
                    {
                        caption: uidChange,
                        parse_mode: 'HTML'
                    }
                );
            }, 1000); // Затримка 1 секунда
        } else {
            console.log(userData)
            if (result.KycLevel >= 1 && Number(result.depositAmount30Day) >= 100) {
                ctx.replyWithHTML(doneRegistration);
            } else if (result.KycLevel >= 1 && result.depositAmount30Day <= 100) {
                // Верифікація є (KycLevel >= 1) але депозит менше або дорівнює 100
                ctx.replyWithHTML("<b>Отлично, вы уже наш партнёр и успешно прошли KYC-верификацию✅</b>\n" +
                    "\n" +
                    "<u>Я уже забронировал вам место в PRIVATE KOTA.</u> 🤖\n" +
                    "\n" +
                    `Ваш текущий баланс: ${result.depositAmount30Day} \n` +
                    "\n" +
                    "2️⃣Вам осталось только <b>пополнить ваш баланс</b> на бирже Bybit <b>на сумму от 100$</b> и после этого снова отправьте мне ваш <b>UID</b>, и я предоставлю вам доступ в закрытое сообщество \"PRIVATE KOTA\"📈💰.");
            } else {
                // Інші випадки, якщо немає верифікації і депозит менше або дорівнює 100
                ctx.replyWithHTML(noRegistrationDoneDepNo);
            }
        }
    }
    // Якщо повідомлення містить букви або інші символи
    else {
        ctx.replyWithHTML('<b>UID должен быть числом, повторите ввод!</b>');

        setTimeout(() => {
            ctx.replyWithPhoto(
                { source: path.join(__dirname, 'image', 'findUID.jpeg') },
                {
                    caption: uidFind,
                    parse_mode: 'HTML'
                }
            );
        }, 1000); // Затримка 1 секунда
    }
});

tgcryptakotaBot.launch();

