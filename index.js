const { Telegraf, Markup } = require('telegraf');
const path = require('path');
const {startTxt, privateKotaStartTxt, uidRefuse, uidFind, uidChange, educationKotaStartTxt} = require("./textConsts");


const tgcryptakotaBot = new Telegraf('7965968007:AAGg4TWakrqx4weRqsKSoIFUZivpegBlgzQ');

tgcryptakotaBot.telegram.setMyCommands([
    { command: 'start', description: 'Начать сначала' },
]);
tgcryptakotaBot.start((ctx) => {
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