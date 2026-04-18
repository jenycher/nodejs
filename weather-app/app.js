// app.js
const https = require('https');
const config = require('./config');

// Функция для получения координат города
function getCityCoordinates(cityName) {
    const normalizedCity = cityName.toLowerCase().trim();
    
    // Проверяем наличие города в нашей базе
    if (config.cities[normalizedCity]) {
        return config.cities[normalizedCity];
    }
    
    // Если город не найден, возвращаем null
    return null;
}

// Функция для форматирования вывода погоды
function displayWeather(weatherData, cityName) {
    console.log('\n✅ Погода найдена!');
    console.log(`📍 Город: ${cityName}`);
    console.log(`🌡️ Текущая температура: ${weatherData.fact.temp}°C`);
    console.log(`🤔 Ощущается как: ${weatherData.fact.feels_like}°C`);
    console.log(`☁️ Описание: ${weatherData.fact.condition}`);
    console.log(`💧 Влажность: ${weatherData.fact.humidity}%`);
    console.log(`💨 Ветер: ${weatherData.fact.wind_speed} м/с`);
    console.log(`📊 Давление: ${weatherData.fact.pressure_mm} мм рт. ст.`);
    
    // Если есть прогноз на день
    if (weatherData.forecast && weatherData.forecast.length > 0) {
        const todayForecast = weatherData.forecast[0];
        console.log(`\n📅 Прогноз на сегодня:`);
        console.log(`🌡️ Днем: ${todayForecast.parts.day_short.temp}°C`);
        console.log(`🌙 Ночью: ${todayForecast.parts.night_short.temp}°C`);
        console.log(`☁️ ${todayForecast.parts.day_short.condition}`);
    }
}

// Функция для получения погоды
function getWeather(cityName) {
    // Проверяем наличие API ключа
    if (!config.apiKey) {
        console.error('❌ API-ключ не найден!');
        console.log('Убедитесь, что вы создали файл .env и добавили в него YANDEX_WEATHER_API_KEY');
        process.exit(1);
    }
    
    // Получаем координаты города
    const coordinates = getCityCoordinates(cityName);
    if (!coordinates) {
        console.error(`❌ Город "${cityName}" не найден в базе!`);
        console.log('Доступные города:');
        Object.keys(config.cities).forEach(city => {
            console.log(`  - ${city}`);
        });
        console.log('\n💡 Подсказка: Вы можете добавить новые города в config.js');
        process.exit(1);
    }
    
    // Формируем URL с параметрами
    const url = `${config.apiUrl}?lat=${coordinates.lat}&lon=${coordinates.lon}&limit=${config.limit}${config.hours ? '&hours=true' : ''}`;
    
    console.log(`⏳ Запрашиваем погоду для города "${cityName}"...`);
    
    // Настройки для HTTPS запроса
    const options = {
        headers: {
            'X-Yandex-Weather-Key': config.apiKey
        }
    };
    
    // Выполняем запрос
    https.get(url, options, (response) => {
        let data = '';
        
        response.on('data', (chunk) => {
            data += chunk;
        });
        
        response.on('end', () => {
            if (response.statusCode === 200) {
                try {
                    const weatherData = JSON.parse(data);
                    displayWeather(weatherData, cityName);
                } catch (error) {
                    console.error('❌ Ошибка при обработке данных от сервера:', error.message);
                }
            } else {
                // Обрабатываем ошибки API
                try {
                    const errorData = JSON.parse(data);
                    console.error(`❌ Ошибка API (${response.statusCode}): ${errorData.message || 'Неизвестная ошибка'}`);
                } catch (e) {
                    console.error(`❌ Ошибка HTTP: ${response.statusCode}`);
                    console.log('Ответ сервера:', data);
                }
            }
        });
    }).on('error', (error) => {
        console.error('❌ Ошибка сети:', error.message);
        console.log('Проверьте интернет-соединение и URL API');
    });
}

// Получаем название города из аргументов командной строки
const city = process.argv[2];

if (!city) {
    console.error('❌ Укажите название города!');
    console.log('Пример использования: node app.js moscow');
    console.log('\nДоступные города:');
    Object.keys(config.cities).forEach(city => {
        console.log(`  - ${city}`);
    });
    process.exit(1);
}

// Запускаем получение погоды
getWeather(city);