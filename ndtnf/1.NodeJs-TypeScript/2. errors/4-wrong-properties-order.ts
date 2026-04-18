const person = {
    name: 'Владимир',
    age: 34
};

function printInfo(name: string, age: number) {
    console.log(`Имя: ${name}, Возраст: ${age}`);
}

printInfo(person.age, person.name);
