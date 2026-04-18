class Book {
  constructor(name, author) {
    this.name = name;
    this.author = author;
  }
}

class ComicsBook extends Book {
  constructor(type, name, author) {
    super(name, author);
    this.type = type;
  }
}
