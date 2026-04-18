class Book {
    name: string;
    author: string;
    constructor(name: string, author: string) {
        this.name = name;
        this.author = author;
    }
    getInfo(): string {
        return `${this.name} — ${this.author}`;
    }
}

class ComicsBook extends Book {
    type: string;
    constructor(type: string, name: string, author: string) {
        super(name, author);
        this.type = type;
    }
    getInfo() {
        const bookInfo: string = super.getInfo();
        return `${bookInfo} — ${this.type}`;
    }
}

const comicsBook: ComicsBook = new ComicsBook('DC', 'Batman Forever', 'Unknown Author');
console.log(comicsBook.getInfo()); // Batman Forever - Unknown Author - DC

