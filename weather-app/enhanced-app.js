// enhanced-app.js - улучшенная версия
const https = require('https');
const config = require('./config');

// Функция для поиска города по частичному совпадению
function findCity(query) {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Прямое совпадение
    if (config.cities[normalizedQuery]) {
        return { name: normalizedQuery, coordinates: config.cities[normalizedQuery] };
    }
    
    // Частичное совпадение
    const matches = [];
    for (const [cityName, coordinates] of Object.entries(config.cities)) {
        if (cityName.includes(normalizedQuery) || normalizedQuery.includes(cityName)) {
            matches.push({ name: cityName, coordinates });
        }
    }
    
    if (matches.length === 1) {
        return matches[0];
    } else if (matches.length > 1) {
        console.log(`🔍 Найдено несколько городов, подходящих под "${query}":`);
        matches.forEach(match => console.log(`  - ${match.name}`));
        console.log('💡 Уточните запрос или используйте полное название города');
        return null;
    }
    
    return null;
}

// Функция для отображения расширенной информации о погоде
function displayDetailedWeather(weatherData, cityName) {
    console.log('\n' + '='.repeat(50));
    console.log(`🌍 Погода в городе: ${cityName.toUpperCase()}`);
    console.log('='.repeat(50));
    
    // Текущая погода
    console.log('\n🔴 ТЕКУЩАЯ ПОГОДА:');
    console.log(`  🌡️ Температура: ${weatherData.fact.temp}°C (ощущается как ${weatherData.fact.feels_like}°C)`);
    console.log(`  ☁️ Состояние: ${getWeatherDescription(weatherData.fact.condition)}`);
    console.log(`  💧 Влажность: ${weatherData.fact.humidity}%`);
    console.log(`  💨 Ветер: ${weatherData.fact.wind_speed} м/с`);
    console.log(`  📊 Давление: ${weatherData.fact.pressure_mm} мм рт. ст.`);
    
    if (weatherData.forecast && weatherData.forecast.length > 0) {
        console.log('\n📅 ПРОГНОЗ НА СЕГОДНЯ:');
        const today = weatherData.forecast[0];
        
        if (today.parts.morning) {
            console.log(`  ☀️ Утро: ${today.parts.morning.temp}°C, ${getWeatherDescription(today.parts.morning.condition)}`);
        }
        if (today.parts.day) {
            console.log(`  🌤️ День: ${today.parts.day.temp}°C, ${getWeatherDescription(today.parts.day.condition)}`);
        }
        if (today.parts.evening) {
            console.log(`  🌙 Вечер: ${today.parts.evening.temp}°C, ${getWeatherDescription(today.parts.evening.condition)}`);
        }
        if (today.parts.night) {
            console.log(`  🌃 Ночь: ${today.parts.night.temp}°C, ${getWeatherDescription(today.parts.night.condition)}`);
        }
    }
    
    console.log('\n' + '='.repeat(50));
}

// Функция для перевода кодов погоды в человекочитаемый формат
function getWeatherDescription(code) {
    const descriptions = {
        'clear': 'Ясно',
        'partly-cloudy': 'Малооблачно',
        'cloudy': 'Облачно с прояснениями',
        'overcast': 'Пасмурно',
        'drizzle': 'Морось',
        'light-rain': 'Небольшой дождь',
        'rain': 'Дождь',
        'heavy-rain': 'Сильный дождь',
        'showers': 'Ливень',
        'wet-snow': 'Дождь со снегом',
        'light-snow': 'Небольшой снег',
        'snow': 'Снег',
        'heavy-snow': 'Сильный снег',
        'sleet': 'Ледяной дождь',
        'thunderstorm': 'Гроза',
        'thunderstorm-with-rain': 'Гроза с дождем',
        'thunderstorm-with-hail': 'Гроза с градом'
    };
    
    return descriptions[code] || code;
}

// Основная функция получения погоды
function getWeather(cityName) {
    if (!config.apiKey) {
        console.error('❌ API-ключ не найден! Проверьте файл .env');
        process.exit(1);
    }
    
    const city = findCity(cityName);
    if (!city) {
        console.error(`❌ Город "${cityName}" не найден!`);
        console.log('\n📋 Доступные города:');
        Object.keys(config.cities).forEach(city => {
            console.log(`  • ${city}`);
        });
        process.exit(1);
    }
    
    const url = `${config.apiUrl}?lat=${city.coordinates.lat}&lon=${city.coordinates.lon}&limit=${config.limit}`;
    
    console.log(`🔍 Ищем погоду для города "${city.name}"...`);
    
    const options = {
        headers: {
            'X-Yandex-Weather-Key': config.apiKey
        }
    };
    
    https.get(url, options, (response) => {
        let data = '';
        
        response.on('data', (chunk) => {
            data += chunk;
        });
        
        response.on('end', () => {
            if (response.statusCode === 200) {
                try {
                    const weatherData = JSON.parse(data);
                    displayDetailedWeather(weatherData, city.name);
                } catch (error) {
                    console.error('❌ Ошибка парсинга данных:', error.message);
                }
            } else {
                console.error(`❌ Ошибка HTTP ${response.statusCode}`);
                if (response.statusCode === 401) {
                    console.log('Неверный API-ключ. Проверьте YANDEX_WEATHER_API_KEY в .env файле');
                }
            }
        });
    }).on('error', (error) => {
        console.error('❌ Ошибка соединения:', error.message);
    });
}

// Парсинг аргументов командной строки
const city = process.argv[2];
if (!city) {
    console.log('🌤️ Консольное приложение для получения погоды');
    console.log('\n📖 Использование:');
    console.log('  node app.js <название_города>');
    console.log('\n✨ Примеры:');
    console.log('  node app.js moscow');
    console.log('  node app.js spb');
    console.log('  node enhanced-app.js moscow');
    process.exit(0);
}

getWeather(city);