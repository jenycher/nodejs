#!/usr/bin/env node

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

// Текущая дата
yargs(hideBin(process.argv))
    .command(
        'current',
        'Текущая дата и время',
        (yargs) => {
            return yargs
                .option('year', {
                    alias: 'y',
                    type: 'boolean',
                    description: 'Показать текущий год'
                })
                .option('month', {
                    alias: 'm',
                    type: 'boolean',
                    description: 'Показать текущий месяц'
                })
                .option('date', {
                    alias: 'd',
                    type: 'boolean',
                    description: 'Показать текущее число'
                })
        },
        (argv) => {
            const now = new Date()
            if (argv.year) {
                console.log(now.getFullYear())
            } else if (argv.month) {
                console.log(now.getMonth() + 1) // месяцы с 0
            } else if (argv.date) {
                console.log(now.getDate())
            } else {
                console.log(now.toISOString())
            }
        }
    )
    .command(
        'add',
        'Добавить время к текущему моменту',
        (yargs) => {
            return yargs
                .option('year', {
                    alias: 'y',
                    type: 'number',
                    description: 'Добавить лет'
                })
                .option('month', {
                    alias: 'm',
                    type: 'number',
                    description: 'Добавить месяцев'
                })
                .option('day', {
                    alias: 'd',
                    type: 'number',
                    description: 'Добавить дней'
                })
                .option('hour', {
                    alias: 'h',
                    type: 'number',
                    description: 'Добавить часов'
                })
                .option('minute', {
                    alias: 'min',
                    type: 'number',
                    description: 'Добавить минут'
                })
                .demandCommand(0, 'Укажите хотя бы одну опцию (например, -d 2)')
                .help()
        },
        (argv) => {
            const now = new Date()
            const newDate = new Date(now)

            if (argv.year) newDate.setFullYear(newDate.getFullYear() + argv.year)
            if (argv.month) newDate.setMonth(newDate.getMonth() + argv.month)
            if (argv.day) newDate.setDate(newDate.getDate() + argv.day)
            if (argv.hour) newDate.setHours(newDate.getHours() + argv.hour)
            if (argv.minute) newDate.setMinutes(newDate.getMinutes() + argv.minute)

            console.log(newDate.toISOString())
        }
    )
    .command(
        'sub',
        'Вычесть время из текущего момента',
        (yargs) => {
            return yargs
                .option('year', {
                    alias: 'y',
                    type: 'number',
                    description: 'Вычесть лет'
                })
                .option('month', {
                    alias: 'm',
                    type: 'number',
                    description: 'Вычесть месяцев'
                })
                .option('day', {
                    alias: 'd',
                    type: 'number',
                    description: 'Вычесть дней'
                })
                .option('hour', {
                    alias: 'h',
                    type: 'number',
                    description: 'Вычесть часов'
                })
                .option('minute', {
                    alias: 'min',
                    type: 'number',
                    description: 'Вычесть минут'
                })
                .demandCommand(0, 'Укажите хотя бы одну опцию (например, -d 2)')
                .help()
        },
        (argv) => {
            const now = new Date()
            const newDate = new Date(now)

            if (argv.year) newDate.setFullYear(newDate.getFullYear() - argv.year)
            if (argv.month) newDate.setMonth(newDate.getMonth() - argv.month)
            if (argv.day) newDate.setDate(newDate.getDate() - argv.day)
            if (argv.hour) newDate.setHours(newDate.getHours() - argv.hour)
            if (argv.minute) newDate.setMinutes(newDate.getMinutes() - argv.minute)

            console.log(newDate.toISOString())
        }
    )
    .demandCommand(1, 'Укажите команду: current, add или sub')
    .help()
    .argv