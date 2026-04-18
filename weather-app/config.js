// config.js
const dotenv = require('dotenv');
const path = require('path');

// Загружаем переменные из .env файла
dotenv.config({ path: path.resolve(__dirname, '.env') });

module.exports = {
    // API-ключ для Яндекс Погоды
    apiKey: process.env.YANDEX_WEATHER_API_KEY,
    // Базовый URL для API
    apiUrl: process.env.API_URL || 'https://api.weather.yandex.ru/v2/forecast',
    // Лимит дней прогноза (по умолчанию 1)
    limit: process.env.LIMIT || 1,
    // Часовой пояс (опционально)
    hours: process.env.HOURS || false,
    // База данных городов (можно расширять)
    cities: {
        'moscow': { lat: 55.751244, lon: 37.618423 },
        'spb': { lat: 59.934280, lon: 30.335099 },
        'kazan': { lat: 55.796127, lon: 49.106405 },
        'novosibirsk': { lat: 55.008352, lon: 82.935733 },
        'ekaterinburg': { lat: 56.838926, lon: 60.605702 },
        'sochi': { lat: 43.585525, lon: 39.723062 },
        'vladivostok': { lat: 43.115067, lon: 131.885577 },
    }
};