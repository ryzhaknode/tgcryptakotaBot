const { Telegraf, Markup } = require('telegraf');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const {startTxtNew, startTxt, tradingPrivate, scalpingPrivate, privateKotaStartTxt, uidRefuse, uidFind, uidChange, educationKotaStartTxt, doneRegistration, msg50min, msg2h,    noRegistrationDoneDepNo,
    getPrivateKotaTxt,
    backTxt,
    notYourRef,
    addToTeam,
    transferKyc
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
    { id: 35680192, username: "GoshaGo" },
    { id: 160803602, username: "maspirid" },
    { id: 165171580, username: "pesterb" },
    { id: 238937174, username: "nazariys7" },
    { id: 240974840, username: "BluckOGQ" },
    { id: 246647701, username: "pylaev58" },
    { id: 256622945, username: "foks25" },
    { id: 257754638, username: "afanasiyev_v" },
    { id: 258064678, username: "Epifanov_maxim" },
    { id: 260961130, username: "Svvvan" },
    { id: 263243200, username: "i_sundukoff" },
    { id: 270522667, username: "powerthbcdrr1" },
    { id: 275783269, username: "Rvi26" },
    { id: 278715858, username: "Baton4ik99" },
    { id: 280784553, username: "whyseven" },
    { id: 280915890, username: "Buble_W" },
    { id: 284730276, username: "lEfreml" },
    { id: 285394426, username: "Невідомий" },
    { id: 290203724, username: "romanzaika" },
    { id: 298588740, username: "pidvelinii" },
    { id: 303073894, username: "Alex_ey12" },
    { id: 305658910, username: "stepanenkokolya" },
    { id: 307754555, username: "yason399" },
    { id: 308485344, username: "VudvudB" },
    { id: 309528917, username: "Mtvchk6828" },
    { id: 309792248, username: "Alex_helmet" },
    { id: 310303508, username: "nshitikova" },
    { id: 314610762, username: "MAKOLDIN" },
    { id: 317403536, username: "Bybaika" },
    { id: 319146567, username: "ilux3n3x3" },
    { id: 326442521, username: "AndrewDenver" },
    { id: 326816290, username: "Невідомий" },
    { id: 328003473, username: "RBizza" },
    { id: 328829805, username: "vin0me" },
    { id: 328975517, username: "Andre800" },
    { id: 329596881, username: "SoulsBorneUA" },
    { id: 331527058, username: "d111666" },
    { id: 334100899, username: "themilkovskyi" },
    { id: 338626074, username: "trabulbek" },
    { id: 343790087, username: "Anatolio1985" },
    { id: 344719670, username: "Ilyas_bibeza" },
    { id: 349700520, username: "timaartikov" },
    { id: 351817106, username: "Ivan_4466" },
    { id: 354067792, username: "pavel_sheffcoff" },
    { id: 354152517, username: "ostrovskiyar" },
    { id: 354540538, username: "feducat1" },
    { id: 360310846, username: "alex60yx" },
    { id: 368112005, username: "NikNikNik74" },
    { id: 370331722, username: "VladislavGorbunov" },
    { id: 371264853, username: "fedorovw" },
    { id: 374916656, username: "Невідомий" },
    { id: 380184642, username: "Trumenok" },
    { id: 386159343, username: "osteopat_shtanchaev" },
    { id: 386412364, username: "likeawind21" },
    { id: 388641234, username: "neckola" },
    { id: 394937278, username: "man_999" },
    { id: 396945792, username: "cryptopeshka" },
    { id: 401818434, username: "mariia_kasatkina" },
    { id: 407022143, username: "kabanstrongman" },
    { id: 408867983, username: "Exitoso0" },
    { id: 409305199, username: "pasha097" },
    { id: 410165263, username: "maradini" },
    { id: 411665223, username: "Abramitovanna" },
    { id: 412352030, username: "Tim_abd1" },
    { id: 412614403, username: "ZhenyaMakoviy" },
    { id: 413192153, username: "AN45473" },
    { id: 414906465, username: "ilya72396" },
    { id: 415598486, username: "iamkarpenko" },
    { id: 415988754, username: "Voinzolo" },
    { id: 416374977, username: "antonfest63" },
    { id: 416820804, username: "vlad24_m" },
    { id: 422820777, username: "alexey_121" },
    { id: 427655347, username: "serygr" },
    { id: 428245893, username: "draiverokk" },
    { id: 429036231, username: "eazyyz" },
    { id: 429271073, username: "siamlive" },
    { id: 430596753, username: "maxgolub97" },
    { id: 435098733, username: "poleno04436" },
    { id: 439823217, username: "edrecords" },
    { id: 444471243, username: "Nechik1990" },
    { id: 451332100, username: "YuraGranovsky" },
    { id: 454058553, username: "g000cha" },
    { id: 455498944, username: "GYM2735" },
    { id: 459821559, username: "omof0rr" },
    { id: 460197072, username: "nikx5m" },
    { id: 467001250, username: "vissefy" },
    { id: 468518171, username: "MaxTV11" },
    { id: 469796642, username: "dr_vasya17" },
    { id: 471107102, username: "Salemantoris" },
    { id: 477359887, username: "Gervasimo" },
    { id: 477611851, username: "boss_4444" },
    { id: 477641248, username: "h0mme" },
    { id: 478497346, username: "Oberhauser" },
    { id: 478585203, username: "x_sss_x" },
    { id: 479410805, username: "Koshubskiy" },
    { id: 483051744, username: "kirsan333" },
    { id: 483870943, username: "plakhotnyk7878" },
    { id: 486344378, username: "Kholboevmubin" },
    { id: 486661867, username: "olehfn" },
    { id: 489521374, username: "Nik_Mike" },
    { id: 490318679, username: "sor1k0" },
    { id: 492772254, username: "AndriyKachkalda" },
    { id: 494949864, username: "Taloxa" },
    { id: 495320558, username: "ps_iwm" },
    { id: 496636184, username: "ratatabat" },
    { id: 503161446, username: "NetsStalker" },
    { id: 504118770, username: "Samson0ff" },
    { id: 509238613, username: "Aleksandr12305" },
    { id: 513171486, username: "SlavicAryan" },
    { id: 516363284, username: "Lis_333" },
    { id: 517578058, username: "Невідомий" },
    { id: 523894225, username: "SalamatMukhamediyev" },
    { id: 528725445, username: "igorBGMU" },
    { id: 530260610, username: "zepphh" },
    { id: 531512789, username: "alex_kubinskiy" },
    { id: 545638912, username: "Rombel83" },
    { id: 547282447, username: "vet47" },
    { id: 552288622, username: "heaveens" },
    { id: 552553409, username: "talgattatarin" },
    { id: 576522718, username: "matviyukvitaliy" },
    { id: 579291137, username: "Ae_Grek" },
    { id: 583208928, username: "cryptoangel090" },
    { id: 583436897, username: "Danvikk" },
    { id: 586700113, username: "denisryz" },
    { id: 595537833, username: "yaroslav_yt" },
    { id: 598629202, username: "yozh14k" },
    { id: 598730640, username: "nixisar" },
    { id: 609909902, username: "alexmrkv" },
    { id: 611753453, username: "Dmitriy177197" },
    { id: 618328252, username: "Igorrtyh" },
    { id: 619947262, username: "Dmitrym_88" },
    { id: 626888499, username: "Lokamel" },
    { id: 631459624, username: "bugrolev" },
    { id: 639920575, username: "ParfCoast23" },
    { id: 643581598, username: "IGOR00001k" },
    { id: 646745502, username: "espect2" },
    { id: 656220662, username: "bogdanister" },
    { id: 657419160, username: "architurkmen" },
    { id: 661638035, username: "S_t_a_m_e" },
    { id: 681539773, username: "Невідомий" },
    { id: 693346297, username: "Vlad_argus_PMD" },
    { id: 701298968, username: "projonkalas" },
    { id: 709390152, username: "KASemenov" },
    { id: 713625008, username: "Davay_sdelaem_Zaslavl" },
    { id: 715327021, username: "orest50" },
    { id: 716353021, username: "Krapi4" },
    { id: 717749573, username: "demorssez" },
    { id: 721926882, username: "totsamiy_name" },
    { id: 728999043, username: "Apmop1" },
    { id: 734086220, username: "Black_Overlord" },
    { id: 735457370, username: "Kurwa_bober8356" },
    { id: 737275335, username: "dagger89" },
    { id: 739469670, username: "aab8383" },
    { id: 744791632, username: "Невідомий" },
    { id: 751011433, username: "vlad4139" },
    { id: 756114714, username: "Nekhaiev" },
    { id: 757097180, username: "Lanokee" },
    { id: 757475513, username: "valeriimatvievich" },
    { id: 758452970, username: "Невідомий" },
    { id: 763292018, username: "DeputatEdik" },
    { id: 772682432, username: "Dima1253" },
    { id: 772767053, username: "sochi_mikhail" },
    { id: 776685477, username: "pirojokcgovnom" },
    { id: 777884095, username: "vasal_invest" },
    { id: 779254453, username: "artem_invest8" },
    { id: 783282565, username: "vladuk97" },
    { id: 787766745, username: "Quadcopter228" },
    { id: 790531485, username: "maxim3737" },
    { id: 792565089, username: "getsuga_jujisho" },
    { id: 795163353, username: "Johndr2106" },
    { id: 795728900, username: "Невідомий" },
    { id: 800956269, username: "strannik28111979" },
    { id: 802644705, username: "muromet_s" },
    { id: 808169890, username: "VRyabovich" },
    { id: 816833264, username: "mashkovlord" },
    { id: 820426385, username: "ImConcrete" },
    { id: 821443267, username: "maikataisona" },
    { id: 824461088, username: "Noluk_02" },
    { id: 827004655, username: "neyr4n" },
    { id: 828395036, username: "OOO_Mariarti" },
    { id: 828852559, username: "ajyh12" },
    { id: 836205033, username: "usenov_samar" },
    { id: 837988034, username: "Sergeevich_dp" },
    { id: 843998810, username: "Andriigru" },
    { id: 852148326, username: "b_r_d_c_h" },
    { id: 856929051, username: "ValeraMRG" },
    { id: 857192229, username: "Q3BLAD" },
    { id: 859844504, username: "Its_Berkis" },
    { id: 863169819, username: "Zimar01" },
    { id: 863422218, username: "sds88_vl" },
    { id: 863957061, username: "newuss" },
    { id: 867133829, username: "Mavr342" },
    { id: 870460953, username: "nikita_fb" },
    { id: 878005469, username: "killllllllllll1" },
    { id: 880358827, username: "bodibilder777" },
    { id: 882042674, username: "Dexter1276" },
    { id: 887267284, username: "dimedrol724" },
    { id: 888716194, username: "major_kokanda" },
    { id: 892631684, username: "mc4653" },
    { id: 907132835, username: "ilyaz_ag" },
    { id: 909211390, username: "prosto_leva2" },
    { id: 911811887, username: "Rusticity" },
    { id: 914936375, username: "bnbua" },
    { id: 917276581, username: "ashpenkov" },
    { id: 923480732, username: "krdmvmax" },
    { id: 931827914, username: "YoungSeaman" },
    { id: 951459743, username: "Mikaskiy" },
    { id: 953919548, username: "shortnamik" },
    { id: 958093159, username: "Carpediem1105" },
    { id: 962711857, username: "Невідомий" },
    { id: 967245748, username: "bohdan_jpeg" },
    { id: 970027730, username: "Demon010701" },
    { id: 970275330, username: "pahan_tut_ya1" },
    { id: 985520076, username: "yakki1i" },
    { id: 991690714, username: "Tema_2323" },
    { id: 993029430, username: "kanek_bratan" },
    { id: 1000912738, username: "Zakovryazhind" },
    { id: 1008139103, username: "maikl060" },
    { id: 1009204685, username: "Onnn17" },
    { id: 1013308225, username: "Ruslan4ik_1" },
    { id: 1022128484, username: "Vladmt9" },
    { id: 1041350745, username: "DonKarleone5" },
    { id: 1051239065, username: "Rustik_hroostik" },
    { id: 1052513127, username: "Eth_3100" },
    { id: 1054992728, username: "klass1rus" },
    { id: 1055854958, username: "DOICHLANDP" },
    { id: 1064206994, username: "Prorok_16" },
    { id: 1065171138, username: "Immortal1x" },
    { id: 1067729830, username: "deinega1" },
    { id: 1069218096, username: "artois64" },
    { id: 1074242783, username: "AquaDire" },
    { id: 1076348056, username: "IhorShV" },
    { id: 1080819350, username: "Alextunkul" },
    { id: 1081912781, username: "Andrnkp" },
    { id: 1081948969, username: "denis_tacrypta" },
    { id: 1083004594, username: "egor_soft" },
    { id: 1102953646, username: "zhasulankamarov" },
    { id: 1113496134, username: "Sh1frrr" },
    { id: 1128107821, username: "Dmitry10041987" },
    { id: 1129780067, username: "dolphin138" },
    { id: 1133355377, username: "skufeushiy" },
    { id: 1168727546, username: "Невідомий" },
    { id: 1169021183, username: "vilk_off" },
    { id: 1172472203, username: "stabyoureyes" },
    { id: 1176843862, username: "hardobasser" },
    { id: 1189261898, username: "nezoox2000" },
    { id: 1196104196, username: "Rusneolan" },
    { id: 1200587060, username: "GANTOGE" },
    { id: 1205308312, username: "Sand_lyy" },
    { id: 1219555183, username: "Temnota887" },
    { id: 1243952140, username: "vipankratov" },
    { id: 1251925494, username: "swetlan_64" },
    { id: 1262649684, username: "Невідомий" },
    { id: 1284755906, username: "Sergey0397" },
    { id: 1307379316, username: "Невідомий" },
    { id: 1309419958, username: "GrihaE" },
    { id: 1332950163, username: "VGG_Romani_Chumachenko" },
    { id: 1336728811, username: "Невідомий" },
    { id: 1343956638, username: "viktorya_w" },
    { id: 1349002706, username: "viktorgajdar" },
    { id: 1357240248, username: "Niktoblogg" },
    { id: 1376502931, username: "Sikarka" },
    { id: 1378631644, username: "AlexerBmgo" },
    { id: 1387302970, username: "Igromancer" },
    { id: 1394480053, username: "dyorDYORovich" },
    { id: 1396209346, username: "stonyloh" },
    { id: 1403184912, username: "digen_29" },
    { id: 1404594148, username: "SlivCryptomoon" },
    { id: 1442920612, username: "GibloeDelooo" },
    { id: 1443110737, username: "fant0m85" },
    { id: 1448477453, username: "cchernega" },
    { id: 1459170494, username: "Akun0v" },
    { id: 1464681438, username: "artur09099" },
    { id: 1471728127, username: "PANTEONNNN" },
    { id: 1505734159, username: "kantroman" },
    { id: 1536609720, username: "lars179" },
    { id: 1543884791, username: "BaIldr" },
    { id: 1565352459, username: "Eduardtih92" },
    { id: 1581669012, username: "Sidl123" },
    { id: 1594741274, username: "Roman0719" },
    { id: 1600955953, username: "Pavel950505" },
    { id: 1607022032, username: "I_n_v_e_s_t_o_r24" },
    { id: 1609819557, username: "Misha301974" },
    { id: 1609988725, username: "Невідомий" },
    { id: 1621143252, username: "B_A_T_I_S_H_T_A" },
    { id: 1650663160, username: "BOOLIKS2" },
    { id: 1759252684, username: "VovaCripto" },
    { id: 1781477831, username: "evg_marchuk87" },
    { id: 1851094978, username: "Vladislav7miller" },
    { id: 1866342208, username: "ANONIMFORYOU" },
    { id: 1874456600, username: "Невідомий" },
    { id: 1885720794, username: "Sanfordbruks" },
    { id: 1889085025, username: "Ballinol" },
    { id: 1893498683, username: "GPT_112" },
    { id: 1895872439, username: "UriyIvan" },
    { id: 1923949564, username: "artemfoxssss" },
    { id: 1935689880, username: "Fasatronn" },
    { id: 1942973478, username: "dollar1337" },
    { id: 1959999475, username: "kiorion" },
    { id: 1966620115, username: "Skyline787" },
    { id: 1993883088, username: "niko_gx81" },
    { id: 2015759100, username: "Octobar_777" },
    { id: 2022715242, username: "NikitaKazantcev" },
    { id: 2023860808, username: "managerkota" },
    { id: 2024373080, username: "metaversinfinity" },
    { id: 2029319579, username: "C57589" },
    { id: 2035179452, username: "Vuk_Top" },
    { id: 2065157173, username: "BPATA_B_BPATA" },
    { id: 2096508260, username: "Невідомий" },
    { id: 2115659883, username: "rabidze" },
    { id: 5042415903, username: "bogdanop" },
    { id: 5123571564, username: "Beregss" },
    { id: 5135006815, username: "Soreslavka" },
    { id: 5152388542, username: "evgeniy11090" },
    { id: 5156682334, username: "Невідомий" },
    { id: 5161501153, username: "Невідомий" },
    { id: 5169572432, username: "Trololo6565" },
    { id: 5185292998, username: "Невідомий" },
    { id: 5191012573, username: "D_Said_S" },
    { id: 5204086962, username: "Maksantonenko1985" },
    { id: 5210185173, username: "deni_ozz" },
    { id: 5228951912, username: "qntmlp" },
    { id: 5240685035, username: "Mihail_otec" },
    { id: 5250624640, username: "Vadik5621" },
    { id: 5266129832, username: "Gerakrut" },
    { id: 5268901076, username: "Maxim7739" },
    { id: 5322787905, username: "Xandr19" },
    { id: 5449332316, username: "Viaktiv" },
    { id: 5507600599, username: "cryptoo_bro" },
    { id: 5535151272, username: "kinwyyys" },
    { id: 5583908503, username: "christian_li_sonet" },
    { id: 5590378239, username: "im1ca" },
    { id: 5618553144, username: "Khatamov2512" },
    { id: 5634969942, username: "misha_ultra" },
    { id: 5668788845, username: "tmmolody" },
    { id: 5683859276, username: "bmal993" },
    { id: 5709930626, username: "Jeka_000_1" },
    { id: 5729659403, username: "Sergej6747" },
    { id: 5740480520, username: "beleevavd" },
    { id: 5760938187, username: "bad_wolf29" },
    { id: 5761214611, username: "danielbogolubsky" },
    { id: 5892265279, username: "BrazilianRio" },
    { id: 5905000230, username: "xpycmuk_trader" },
    { id: 5909009504, username: "Aleks221bak" },
    { id: 6010586884, username: "Uwaldemar" },
    { id: 6023459673, username: "Невідомий" },
    { id: 6107545384, username: "integritycapital" },
    { id: 6163468982, username: "PSGemer" },
    { id: 6199597999, username: "Furcorsa777" },
    { id: 6213009825, username: "isss93" },
    { id: 6230934340, username: "ducksm1" },
    { id: 6249847467, username: "Vladius100" },
    { id: 6255928056, username: "artemmorozov1996" },
    { id: 6383235694, username: "Hodlmanycoin" },
    { id: 6401042480, username: "yakub_alishikhov" },
    { id: 6465378864, username: "Vvvvv21w" },
    { id: 6496048220, username: "Crypto_oneplus" },
    { id: 6532761765, username: "stan_crpt" },
    { id: 6563080986, username: "alextkaciov" },
    { id: 6601012003, username: "Evgenilq" },
    { id: 6602736553, username: "Snowfal01" },
    { id: 6643470963, username: "KtoNadoTot" },
    { id: 6726747404, username: "Osyabender" },
    { id: 6734297490, username: "famitok" },
    { id: 6745061927, username: "igoreek01" },
    { id: 6769615494, username: "talerdurden" },
    { id: 6808376800, username: "Vypezdric" },
    { id: 6812814290, username: "Невідомий" },
    { id: 6856315820, username: "kupitm5" },
    { id: 6935449455, username: "pinksky123123" },
    { id: 6970647071, username: "arzhepetskiy" },
    { id: 7003472902, username: "herroess" },
    { id: 7055091086, username: "Andriymts" },
    { id: 7155183903, username: "Daoplane" },
    { id: 7196258466, username: "Fominkrisz" },
    { id: 7211965793, username: "Vanhruker" },
    { id: 7224896147, username: "Невідомий" },
    { id: 7298843520, username: "varisloy" },
    { id: 7385152606, username: "Невідомий" },
    { id: 7492283449, username: "Невідомий" },
    { id: 7526011785, username: "Невідомий" }
];



function sendMessagesToUsers() {
    users.forEach((user) => {
        // Определяем путь к изображению
        const photoPath = path.join(__dirname, 'image', 'scalpingPrivate.jpg');

        // Отправка сообщения с фото и инлайн-кнопками
        tgcryptakotaBot.telegram.sendPhoto(
            user.id,
            { source: photoPath }, // Путь к изображению
            {
                caption: scalpingPrivate,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '➡️Получить доступ PRIVATE KOTA🧠', callback_data: 'btn_getPrivateKota' }],
                        [{ text: 'Я уже зарегистрирован, но не Ваш реферал', callback_data: 'btn_transferKyc' }],
                        [{ text: 'Стать рефералом', callback_data: 'btn_becomeRef' }],
                        [{ text: '👨‍💻Связаться с поддержкой', url: 'https://t.me/managerkota' }]
                    ]
                }
            }
        )
            .then(() => {
                console.log(`Сообщение с фото успешно отправлено пользователю ${user.username}`);
            })
            .catch((error) => {
                console.error(`Не удалось отправить сообщение с фото пользователю ${user.username}:`, error);
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
        clearTimeout(userActivityTimers[telegramId].timer24h);
    }

    // Створюємо новий таймер на 5 хвилин
    const timer5min = setTimeout(() => {
        ctx.replyWithPhoto(
            { source: path.join(__dirname, 'image', 'scalpingPrivate.jpg') },
            {
                caption: scalpingPrivate,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '➡️Получить доступ PRIVATE KOTA🧠', callback_data: 'btn_getPrivateKota' }],
                        [{ text: 'Я уже зарегистрирован, но не Ваш реферал', callback_data: 'btn_transferKyc' }],
                        [{ text: 'Стать рефералом', callback_data: 'btn_becomeRef'}],
                        [{ text: '👨‍💻Связаться с поддержкой', callback_data: 'https://t.me/managerkota' }]
                    ]
                }
            }
        );
    }, 300000); // 5 хвилин

    // Створюємо новий таймер на 50 хвилин
    const timer50min = setTimeout(() => {
        ctx.replyWithPhoto(
            { source: path.join(__dirname, 'image', 'tradePrivate.jpg') },
            {
                caption: tradingPrivate,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '➡️Получить доступ PRIVATE KOTA🧠', callback_data: 'btn_getPrivateKota' }],
                        [{ text: 'Я уже зарегистрирован, но не Ваш реферал', callback_data: 'btn_transferKyc' }],
                        [{ text: 'Стать рефералом', callback_data: 'btn_becomeRef'}],
                        [{ text: '👨‍💻Связаться с поддержкой', callback_data: 'https://t.me/managerkota' }]
                    ]
                }
            }
        );
    }, 3000000); // 50 хвилин

    // Створюємо новий таймер на 2 години
    const timer2h = setTimeout(() => {
        ctx.replyWithPhoto(
            { source: path.join(__dirname, 'image', 'strkShort.jpg') },
            {
                caption: msg2h,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🔙Главное меню', callback_data: 'btn_mainMenu' }]
                    ]
                }
            }
        );
    }, 7200000); // 2 години (2 * 60 * 60 * 1000 мс)


    // Створюємо новий таймер на 24 години
    const timer24h = setTimeout(() => {
        ctx.replyWithPhoto(
            { source: path.join(__dirname, 'image', 'trade50min.jpg') },
            {
                caption: msg50min,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🔙Главное меню', callback_data: 'btn_mainMenu' }]
                    ]
                }
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
        startTxtNew,
        Markup.inlineKeyboard(
            [
                [Markup.button.callback('➡️Получить доступ PRIVATE KOTA🧠', 'btn_getPrivateKota')],
                [Markup.button.callback('Я уже зарегистрирован, но не Ваш реферал', 'btn_transferKyc')],
                [Markup.button.callback('Стать рефералом', 'btn_becomeRef')],
                [Markup.button.url('👨‍💻Связаться с поддержкой', 'https://t.me/managerkota')],
                // [Markup.button.callback('Экслюзивный материал', 'btn_giftMaterial')],
            ]
        )
    )
})

tgcryptakotaBot.action('btn_mainMenu', (ctx) => {
    resetUserTimer(ctx);
    ctx.replyWithHTML(
        startTxtNew,
        Markup.inlineKeyboard(
            [
                [Markup.button.callback('➡️Получить доступ PRIVATE KOTA🧠', 'btn_getPrivateKota')],
                [Markup.button.callback('Я уже зарегистрирован, но не Ваш реферал', 'btn_notYourRef')],
                [Markup.button.callback('Стать рефералом', 'btn_becomeRef')],
                [Markup.button.url('👨‍💻Связаться с поддержкой', 'https://t.me/managerkota')],
                // [Markup.button.callback('Экслюзивный материал', 'btn_giftMaterial')],
            ]
        )
    )
});


tgcryptakotaBot.action('btn_getPrivateKota', (ctx) => {
    resetUserTimer(ctx);
    ctx.replyWithHTML(
        getPrivateKotaTxt,
        Markup.inlineKeyboard(
            [
                [Markup.button.callback('Я не знаю, что такое UID', 'btn_uidDont')],
                [Markup.button.callback('🔙Назад', 'btn_becomeRef')],
                [Markup.button.callback('Главное меню', 'btn_mainMenu')],
                [Markup.button.url('👨‍💻Связаться с поддержкой', 'https://t.me/managerkota')],
            ]
        )
    );
    setTimeout(() => {
        ctx.reply("Ввести UID⬇⁣")
    }, 1000);
});
tgcryptakotaBot.action('btn_notYourRef', (ctx) => {
    resetUserTimer(ctx);
    ctx.replyWithHTML(
        notYourRef,
        Markup.inlineKeyboard(
            [
                [Markup.button.callback('1️⃣Подать заявку в мою команду', 'btn_addToTeam')],
                [Markup.button.callback('️Способ с переносом KYC', 'btn_transferKyc')],
                [Markup.button.callback('Главное меню', 'btn_mainMenu')],
                [Markup.button.callback('У меня не получается🥲', 'btn_haveProblem')],
            ]
        )
    );
});

tgcryptakotaBot.action('btn_haveProblem', (ctx) => {
    resetUserTimer(ctx);
    ctx.reply( "Сообщить @managerkota о проблеме 💌",
        Markup.inlineKeyboard(
            [
                [Markup.button.callback('🔙Назад', 'btn_transferKyc')],
                [Markup.button.callback('Главное меню', 'btn_mainMenu')],
            ]
        )
    );
});

tgcryptakotaBot.action('btn_addToTeam', (ctx) => {
    resetUserTimer(ctx);
    ctx.replyWithPhoto(
        { source: path.join(__dirname, 'image', 'addToTeam.jpeg') },
        {
            caption: addToTeam,
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🔙Главное меню', callback_data: 'btn_mainMenu' }]
                ]
            }
        }
    );
    setTimeout(() => {
        ctx.reply("После заполнения формы, введите свой UID⬇⁣")
    }, 1500);
});

tgcryptakotaBot.action('btn_transferKyc', (ctx) => {
    resetUserTimer(ctx);
    ctx.replyWithHTML(
        transferKyc,
        Markup.inlineKeyboard(
            [
                [Markup.button.callback('📹Видеоинструкция по переносу аккаунта', 'btn_videoIntruction')],
                [Markup.button.callback('У меня не получается🥲', 'btn_haveProblem')],
                [Markup.button.callback('Я все сделал✅', 'btn_getPrivateKota')],
                [Markup.button.callback('Главное меню', 'btn_mainMenu')],
            ]
        )
    );

});

tgcryptakotaBot.action('btn_videoIntruction', (ctx) => {
    resetUserTimer(ctx);
    ctx.reply(
        "Выберите вариант видеинструкции:",
        Markup.inlineKeyboard(
            [
                [Markup.button.callback('🖥Видеинструкция в WEB-версии', 'btn_videoWeb')],
                [Markup.button.callback('📱Видеинструкция в мобильной-версии', 'btn_videoPhone')],
            ]
        )
    );

});

tgcryptakotaBot.action('btn_videoWeb', (ctx) => {
    resetUserTimer(ctx);

    ctx.sendVideo({ source: path.join(__dirname, 'image', 'webVersion.mp4') }, {
        caption: '🖥Это видеоинструкция для WEB-версии.',
    });

    ctx.reply(
        "Видеоинструкция по переносу аккаунта в WEB-версии.\n" +
        "Загрузка видео может занять пару минут.\n" +
        "Ждем-с🤔",
        Markup.inlineKeyboard(
            [
                [Markup.button.callback('🔙Назад', 'btn_transferKyc')],
            ]
        )
    );

});

tgcryptakotaBot.action('btn_videoPhone', (ctx) => {
    resetUserTimer(ctx);

    ctx.sendVideo({ source: path.join(__dirname, 'image', 'telVersio.mp4') }, {
        caption: '📱Это видеоинструкция для мобильной-версии',
    });

    ctx.reply(
        "Видеоинструкция по переносу аккаунта в мобильной-версии.\n" +
        "Загрузка видео может занять пару минут.\n" +
        "Ждем-с🤔",
        Markup.inlineKeyboard(
            [
                [Markup.button.callback('🔙Назад', 'btn_transferKyc')],
            ]
        )
    );

});

tgcryptakotaBot.action('btn_uidDont', (ctx) => {
    resetUserTimer(ctx);
    ctx.replyWithPhoto(
        { source: path.join(__dirname, 'image', 'findUID.jpeg') },
        {
            caption: uidFind,
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🔙Главное меню', callback_data: 'btn_mainMenu' }]
                ]
            }
        }
    );
    setTimeout(() => {
        ctx.reply("Ввести UID⬇⁣")
    }, 1500);
});


tgcryptakotaBot.action('btn_becomeRef', (ctx) => {
    resetUserTimer(ctx);
    ctx.replyWithHTML(
        backTxt,
        Markup.inlineKeyboard(
            [
                [Markup.button.url('🔗Зарегистрироваться', 'https://partner.bybit.com/b/kota')],
                [Markup.button.url('Я не знаю, как добавить код партнера', 'https://www.bybit.com/ru-RU/help-center/article/How-to-Add-and-Check-Registered-Affiliate-Code#C')],
                [Markup.button.url('Я не знаю, как верифицировать аккаунт', 'https://www.bybit.com/ru-RU/help-center/article/How-to-Complete-Individual-KYC-Verification')],
                [Markup.button.callback('➡️Получить доступ PRIVATE KOTA🧠', 'btn_getPrivateKota')],
                [Markup.button.url('👨‍💻Связаться с поддержкой', 'https://t.me/managerkota')],
                [Markup.button.callback('🔙Назад, в главное меню', 'btn_mainMenu')],
            ]
        )
    );
});

tgcryptakotaBot.action('btn_privateKota2', (ctx) => {
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
            ctx.replyWithHTML(
                uidRefuse,
                Markup.inlineKeyboard([
                    [Markup.button.callback('Я уже зарегистрирован, но не Ваш реферал', 'btn_transferKyc')],
                    [Markup.button.url('👨‍💻Связаться с поддержкой', 'https://t.me/managerkota')],
                ])
            );
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
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🔙Главное меню', callback_data: 'btn_mainMenu' }]
                        ]
                    }
                }
            );
        }, 1000); // Затримка 1 секунда
    }
});

sendMessagesToUsers();

tgcryptakotaBot.launch();

