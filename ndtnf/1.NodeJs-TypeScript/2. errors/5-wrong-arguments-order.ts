const person = {
    name: 'Владимир',
    age: 34
};

function printInfo(age: number, name: string) {
    console.log(`Имя: ${name}, Возраст: ${age}`);
}

printInfo(person.name, person.age);
