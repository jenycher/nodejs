#!/usr/bin/env node

const readline = require('readline')

// Настройка интерфейса для чтения из stdin и вывода в stdout
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

// Загадываем число от 0 до 100
const secretNumber = Math.floor(Math.random() * 101)
let attempts = 0

console.log('🎮 Игра "Угадай число"')
console.log('Загадано число в диапазоне от 0 до 100')
console.log('Для выхода введите "exit" или "quit"')

// Функция для проверки числа
function checkGuess(guess) {
    attempts++
    
    if (isNaN(guess)) {
        console.log('❌ Пожалуйста, введите число!')
        return false
    }
    
    if (guess < 0 || guess > 100) {
        console.log('❌ Число должно быть в диапазоне от 0 до 100!')
        return false
    }
    
    if (guess === secretNumber) {
        console.log(`🎉 Отгадано число ${secretNumber}!`)
        console.log(`Количество попыток: ${attempts}`)
        return true
    }
    
    if (guess < secretNumber) {
        console.log('⬆️ Больше')
    } else {
        console.log('⬇️ Меньше')
    }
    
    return false
}

// Основной игровой цикл
function askQuestion() {
    rl.question('Ваше предположение: ', (input) => {
        // Проверка на выход
        if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
            console.log(`👋 Выход из игры. Загаданное число было ${secretNumber}`)
            rl.close()
            return
        }
        
        // Преобразуем ввод в число
        const guess = parseInt(input)
        
        // Проверяем и продолжаем игру
        if (checkGuess(guess)) {
            rl.close()
        } else {
            askQuestion()
        }
    })
}

// Запускаем игру
askQuestion()

// Обработка закрытия
rl.on('close', () => {
    console.log('Спасибо за игру!')
    process.exit(0)
})