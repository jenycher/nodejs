const fs = require('fs');
const path = require('path');

// Получаем путь к файлу логов из аргументов командной строки
const logFilePath = process.argv[2];

if (!logFilePath) {
  console.error('Ошибка: Укажите путь к файлу логов!');
  console.error('Пример: node analyzer.js logs.json');
  process.exit(1);
}

// Проверяем существование файла
if (!fs.existsSync(logFilePath)) {
  console.error(`Ошибка: Файл "${logFilePath}" не найден!`);
  process.exit(1);
}

try {
  // Читаем и парсим лог-файл
  const data = fs.readFileSync(logFilePath, 'utf8');
  const logs = JSON.parse(data);
  
  // Общее количество партий
  const totalGames = logs.length;
  
  if (totalGames === 0) {
    console.log('Нет данных для анализа. Сыграйте хотя бы одну партию!');
    process.exit(0);
  }
  
  // Количество выигранных и проигранных партий
  const wins = logs.filter(log => log.result === 'win').length;
  const losses = logs.filter(log => log.result === 'lose').length;
  
  // Процентное соотношение выигранных партий
  const winPercentage = (wins / totalGames) * 100;
  
  // Вывод результатов анализа
  console.log('\n========== АНАЛИЗ ИГРОВЫХ ЛОГОВ ==========');
  console.log(`📁 Файл логов: ${logFilePath}`);
  console.log(`🎲 Общее количество партий: ${totalGames}`);
  console.log(`✅ Выигранных партий: ${wins}`);
  console.log(`❌ Проигранных партий: ${losses}`);
  console.log(`📊 Процент выигрышей: ${winPercentage.toFixed(2)}%`);
  console.log('==========================================\n');
  
  // Дополнительная информация (для наглядности)
  console.log('📈 Статистика по сессиям:');
  console.log(`   ${'█'.repeat(Math.round(winPercentage / 2))} ${winPercentage.toFixed(1)}% побед`);
  console.log(`   ${'░'.repeat(Math.round((100 - winPercentage) / 2))} ${(100 - winPercentage).toFixed(1)}% поражений\n`);
  
} catch (error) {
  console.error(`Ошибка при чтении или парсинге файла: ${error.message}`);
  process.exit(1);
}