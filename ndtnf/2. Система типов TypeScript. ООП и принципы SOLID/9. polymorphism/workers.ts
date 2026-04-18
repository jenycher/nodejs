class HumanWorker {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    doWork(): void {
        console.log('Some work');
    }
}

class Lumberjack extends HumanWorker {
    doWork(): void {
        console.log('Рублю лес');
    }
}

class Hunter extends HumanWorker {
    doWork(): void {
        console.log('Охочусь');
    }
}

const worker1 = new Hunter('Human 1');
worker1.doWork(); // Охочусь

const worker2 = new Lumberjack('Human 2');
worker2.doWork(); // Рублю лес