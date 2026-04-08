const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Получаем имя файла логов из аргументов командной строки
const logFilePath = process.argv[2];

if (!logFilePath) {
  console.error('Ошибка: Укажите путь к файлу для логирования!');
  console.error('Пример: node game.js logs.json');
  process.exit(1);
}

// Создаём интерфейс для ввода/вывода
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Функция для записи результата в лог
function logGameResult(result) {
  let logs = [];
  
  // Если файл существует, читаем существующие логи
  if (fs.existsSync(logFilePath)) {
    const data = fs.readFileSync(logFilePath, 'utf8');
    logs = JSON.parse(data);
  }
  
  // Добавляем новую запись
  logs.push({
    timestamp: new Date().toISOString(),
    result: result // 'win' или 'lose'
  });
  
  // Записываем обратно в файл
  fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));
}

// Функция для получения случайного числа (1 или 2)
function getRandomChoice() {
  return Math.floor(Math.random() * 2) + 1;
}

// Функция для преобразования числа в текст
function getChoiceText(choice) {
  return choice === 1 ? 'Орёл' : 'Решка';
}

// Основная игровая логика
function playGame() {
  const randomNumber = getRandomChoice();
  
  rl.question('Орёл (1) или Решка (2)? Введите 1 или 2: ', (answer) => {
    const userGuess = parseInt(answer);
    
    // Проверка корректности ввода
    if (userGuess !== 1 && userGuess !== 2) {
      console.log('Пожалуйста, введите 1 (Орёл) или 2 (Решка)!');
      playGame(); // Повторяем попытку
      return;
    }
    
    // Определяем результат
    const isWin = (userGuess === randomNumber);
    const result = isWin ? 'win' : 'lose';
    
    // Выводим результат
    console.log(`\nКомпьютер загадал: ${getChoiceText(randomNumber)}`);
    console.log(`Вы выбрали: ${getChoiceText(userGuess)}`);
    
    if (isWin) {
      console.log('🎉 Поздравляю! Вы угадали!');
    } else {
      console.log('😔 К сожалению, вы не угадали...');
    }
    
    // Логируем результат
    logGameResult(result);
    console.log(`\nРезультат сохранён в файл: ${logFilePath}\n`);
    
    // Спрашиваем, хочет ли пользователь сыграть ещё
    rl.question('Хотите сыграть ещё? (да/нет): ', (again) => {
      if (again.toLowerCase() === 'да' || again.toLowerCase() === 'yes' || again.toLowerCase() === 'y') {
        playGame();
      } else {
        console.log('Спасибо за игру! До свидания!');
        rl.close();
      }
    });
  });
}

// Запускаем игру
console.log('=== Игра "Орёл или решка" ===\n');
playGame();