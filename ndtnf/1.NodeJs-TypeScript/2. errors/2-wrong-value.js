"use strict";
const person = {
    name: 'Владимир',
    age: '34'
};
function printInfo(data) {
    console.log(`Имя: ${data.name}, Возраст: ${data.age}`);
}
printInfo(person);
