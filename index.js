const { Telegraf, Markup } = require('telegraf');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const {startTxt, privateKotaStartTxt, uidRefuse, uidFind, uidChange, educationKotaStartTxt, doneRegistration, msg50min, msg2h,    noRegistrationDoneDepNo
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

const userActivityTimers = {};

const users = [
    { id: 160803602, username: 'maspirid' },
    { id: 246647701, username: 'pylaev58' },
    { id: 256622945, username: 'foks25' },
    { id: 258064678, username: 'Epifanov_maxim' },
    { id: 280784553, username: 'whyseven' },
    { id: 280915890, username: 'Buble_W' },
    { id: 284730276, username: 'lEfreml' },
    { id: 298588740, username: 'pidvelinii' },
    { id: 314610762, username: 'MAKOLDIN' },
    { id: 326442521, username: 'AndrewDenver' },
    { id: 326816290, username: 'Невідомий' },
    { id: 328975517, username: 'Andre800' },
    { id: 334100899, username: 'themilkovskyi' },
    { id: 344719670, username: 'Ilyas_bibeza' },
    { id: 354067792, username: 'pavel_sheffcoff' },
    { id: 371264853, username: 'fedorovw' },
    { id: 386159343, username: 'osteopat_shtanchaev' },
    { id: 388641234, username: 'neckola' },
    { id: 401818434, username: 'mariia_kasatkina' },
    { id: 411665223, username: 'Abramitovanna' },
    { id: 412352030, username: 'Tim_abd1' },
    { id: 412614403, username: 'ZhenyaMakoviy' },
    { id: 416820804, username: 'vlad24_m' },
    { id: 427655347, username: 'serygr' },
    { id: 435098733, username: 'poleno04436' },
    { id: 439823217, username: 'edrecords' },
    { id: 451332100, username: 'YuraGranovsky' },
    { id: 455498944, username: 'GYM2735' },
    { id: 459821559, username: 'omof0rr' },
    { id: 477611851, username: 'boss_4444' },
    { id: 483051744, username: 'kirsan333' },
    { id: 486661867, username: 'olehfn' },
    { id: 489521374, username: 'Nik_Mike' },
    { id: 490318679, username: 'sor1k0' },
    { id: 496636184, username: 'ratatabat' },
    { id: 503161446, username: 'NetsStalker' },
    { id: 504118770, username: 'Samson0ff' },
    { id: 509238613, username: 'Aleksandr12305' },
    { id: 516363284, username: 'Lis_333' },
    { id: 517578058, username: 'Невідомий' },
    { id: 528725445, username: 'igorBGMU' },
    { id: 576522718, username: 'matviyukvitaliy' },
    { id: 583208928, username: 'cryptoangel090' },
    { id: 586700113, username: 'denisryz' },
    { id: 626888499, username: 'Lokamel' },
    { id: 639920575, username: 'ParfCoast23' },
    { id: 643581598, username: 'IGOR00001k' },
    { id: 661638035, username: 'S_t_a_m_e' },
    { id: 693346297, username: 'Vlad_argus_PMD' },
    { id: 713625008, username: 'Davay_sdelaem_Zaslavl' },
    { id: 728999043, username: 'Apmop1' },
    { id: 737275335, username: 'dagger89' },
    { id: 744791632, username: 'Невідомий' },
    { id: 756114714, username: 'Nekhaiev' },
    { id: 757097180, username: 'Lanokee' },
    { id: 758452970, username: 'Невідомий' },
    { id: 776685477, username: 'pirojokcgovnom' },
    { id: 777884095, username: 'vasal_invest' },
    { id: 779254453, username: 'artem_invest8' },
    { id: 783282565, username: 'vladuk97' },
    { id: 790531485, username: 'maxim3737' },
    { id: 792565089, username: 'getsuga_jujisho' },
    { id: 800956269, username: 'strannik28111979' },
    { id: 828852559, username: 'ajyh12' },
    { id: 837988034, username: 'Sergeevich_dp' },
    { id: 867133829, username: 'Mavr342' },
    { id: 870460953, username: 'nikita_fb' },
    { id: 880358827, username: 'bodibilder777' },
    { id: 882042674, username: 'Dexter1276' },
    { id: 911811887, username: 'Rusticity' },
    { id: 923480732, username: 'krdmvmax' },
    { id: 951459743, username: 'Mikaskiy' },
    { id: 953919548, username: 'shortnamik' },
    { id: 967245748, username: 'bohdan_jpeg' },
    { id: 991690714, username: 'Tema_2323' },
    { id: 1000912738, username: 'Zakovryazhind' },
    { id: 1009204685, username: 'Onnn17' },
    { id: 1013308225, username: 'Ruslan4ik_1' },
    { id: 1054992728, username: 'klass1rus' },
    { id: 1064206994, username: 'Prorok_16' },
    { id: 1065171138, username: 'Immortal1x' },
    { id: 1076348056, username: 'IhorShV' },
    { id: 1081948969, username: 'denis_tacrypta' },
    { id: 1113496134, username: 'Sh1frrr' },
    { id: 1128107821, username: 'Dmitry10041987' },
    { id: 1168727546, username: 'Невідомий' },
    { id: 1284755906, username: 'Sergey0397' },
    { id: 1307379316, username: 'Невідомий' },
    { id: 1309419958, username: 'GrihaE' },
    { id: 1343956638, username: 'viktorya_w' },
    { id: 1349002706, username: 'viktorgajdar' },
    { id: 1448477453, username: 'cchernega' },
    { id: 1471728127, username: 'PANTEONNNN' },
    { id: 1536609720, username: 'lars179' },
    { id: 1600955953, username: 'Pavel950505' },
    { id: 1609819557, username: 'Misha301974' },
    { id: 1609988725, username: 'Невідомий' },
    { id: 1781477831, username: 'evg_marchuk87' },
    { id: 1851094978, username: 'Vladislav7miller' },
    { id: 1966620115, username: 'Skyline787' },
    { id: 2022715242, username: 'NikitaKazantcev' },
    { id: 2023860808, username: 'managerkota' },
    { id: 2029319579, username: 'C57589' },
    { id: 2096508260, username: 'Невідомий' },
    { id: 2115659883, username: 'rabidze' },
    { id: 5250624640, username: 'Vadik5621' },
    { id: 5535151272, username: 'kinwyyys' },
    { id: 5583908503, username: 'christian_li_sonet' },
    { id: 5683859276, username: 'bmal993' },
    { id: 5709930626, username: 'Jeka_000_1' },
    { id: 5892265279, username: 'BrazilianRio' },
    { id: 5909009504, username: 'Aleks221bak' },
    { id: 6010586884, username: 'Uwaldemar' },
    { id: 6249847467, username: 'Vladius100' },
    { id: 6496048220, username: 'Crypto_oneplus' },
    { id: 6532761765, username: 'stan_crpt' },
    { id: 6602736553, username: 'Snowfal01' },
    { id: 6726747404, username: 'Osyabender' },
    { id: 6769615494, username: 'talerdurden' },
    { id: 6808376800, username: 'Vypezdric' },
    { id: 7003472902, username: 'herroess' },
    { id: 7155183903, username: 'Daoplane' },
    { id: 7224896147, username: 'Невідомий' }
];


function sendMessagesToUsers() {
    users.forEach((user) => {
        tgcryptakotaBot.telegram.sendMessage(user.id, msg2h, { parse_mode: 'HTML' })
            .then(() => {
                console.log(`Повідомлення успішно надіслано користувачу ${user.username}`);
            })
            .catch((error) => {
                console.error(`Не вдалося надіслати повідомлення користувачу ${user.username}:`, error);
            });
    });
}
// Функція для скидання таймерів користувача
function resetUserTimer(ctx) {
    const telegramId = ctx.from.id;

    // Якщо попередні таймери існують, очищаємо їх
    if (userActivityTimers[telegramId]) {
        clearTimeout(userActivityTimers[telegramId].timer5min);
        clearTimeout(userActivityTimers[telegramId].timer50min);
        clearTimeout(userActivityTimers[telegramId].timer2h);
        clearTimeout(userActivityTimers[telegramId].timer4h);
        clearTimeout(userActivityTimers[telegramId].timer24h);
    }

    // Створюємо новий таймер на 5 хвилин
    const timer5min = setTimeout(() => {
        ctx.replyWithPhoto(
            { source: path.join(__dirname, 'image', 'findUID.jpeg') },
            {
                caption: uidFind,
                parse_mode: 'HTML'
            }
        );
    }, 300000); // 5 хвилин

    // Створюємо новий таймер на 50 хвилин
    const timer50min = setTimeout(() => {
        ctx.replyWithPhoto(
            { source: path.join(__dirname, 'image', 'trade50min.jpg') },
            {
                caption: msg50min,
                parse_mode: 'HTML'
            }
        );
    }, 3000000); // 50 хвилин

    // Створюємо новий таймер на 2 години
    const timer2h = setTimeout(() => {
        ctx.replyWithPhoto(
            { source: path.join(__dirname, 'image', 'strkShort.jpg') },
            {
                caption: msg2h,
                parse_mode: 'HTML'
            }
        );
    }, 7200000); // 2 години (2 * 60 * 60 * 1000 мс)


    // Створюємо новий таймер на 24 години
    const timer24h = setTimeout(() => {
        ctx.replyWithPhoto(
            { source: path.join(__dirname, 'image', 'trade50min.jpg') },
            {
                caption: msg50min,
                parse_mode: 'HTML'
            }
        );
    }, 86400000); // 24 години (24 * 60 * 60 * 1000 мс)

    // Зберігаємо всі таймери для користувача
    userActivityTimers[telegramId] = { timer5min, timer50min, timer2h, timer24h };
}



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
    resetUserTimer(ctx);
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
    resetUserTimer(ctx);
    ctx.replyWithHTML(
        educationKotaStartTxt,
        Markup.inlineKeyboard([
            // [Markup.button.url('🔗Зарегистрироваться', 'https://partner.bybit.com/b/kota')],
            [Markup.button.url('👨‍💻Связаться с поддержкой', 'https://t.me/managerkota')],
        ])
    )
});

tgcryptakotaBot.action('btn_privateKota', (ctx) => {
    resetUserTimer(ctx);
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
    resetUserTimer(ctx);
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

sendMessagesToUsers();

tgcryptakotaBot.launch();

