class Book {
    name: string;
    author: string;
    constructor(name: string, author: string) {
        this.name = name;
        this.author = author;
    }
}

class ComicsBook extends Book {
    type: string;
    constructor(type: string, name: string, author: string) {
        super(name, author);
        this.type = type;
    }
}

