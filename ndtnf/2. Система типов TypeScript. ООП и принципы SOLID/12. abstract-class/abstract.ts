abstract class Figure {
    abstract getArea(): number;
}

class Rectangle extends Figure {
    width: number;
    height: number;
    constructor(width: number, height: number) {
        super();
        this.width = width;
        this.height = height;
    }
    getArea(): number {
        return this.width * this.height;
    }
}

const figure = new Rectangle(20, 80);
console.log(figure.getArea());