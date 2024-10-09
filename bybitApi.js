const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();
// Вставьте свои API ключи
const apiKey = 'dPiwSdiThs46y9cbGD';
const apiSecret = '-----BEGIN PRIVATE KEY-----\n' +
    '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\n' +
    'jAJGeUd7sLzQHUyyyom2mxzcLiBO\n' +
    '-----END PRIVATE KEY-----';
const endpoint = 'https://api.bybit.com/v2/private/referral';

// Время на момент запроса (timestamp)
const timestamp = Date.now();

// Функция для создания подписи
function createSignature(queryString, secret) {
    return crypto.createHmac('sha256', secret).update(queryString).digest('hex');
}

// Параметры запроса
const params = {
    api_key: apiKey,
    timestamp: timestamp,
};

// Создаем строку запроса
const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');

// Генерируем подпись
params.sign = createSignature(queryString, apiSecret);

// Выполняем запрос
axios.get(endpoint, { params })
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error(error);
    });

// Експортуємо функції та змінні
module.exports = {
    getReferralData,
    apiKey,
    apiSecret,
    endpoint,
    createSignature,
};