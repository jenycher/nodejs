class Book {
  constructor(name, author) {
    this.name = name;
    this.author = author;
  }
  getInfo() {
    return `${this.name} — ${this.author}`;
  }
}

class ComicsBook extends Book {
  constructor(type, name, author) {
    super(name, author);
    this.type = type;
  }

  getInfo() {
    const bookInfo = super.getInfo();
    return `${bookInfo} - ${this.type}`;
  }
}
