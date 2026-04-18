interface Person {
    name: string;
    age: number;
}

const person: Person = {
    name: 'Владимир',
    age: '34'
};

function printInfo(data: Person) {
    console.log(`Имя: ${data.name}, Возраст: ${data.age}`);
}

printInfo(person);
