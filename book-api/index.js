const express = require('express');
const { v4: uuid } = require('uuid'); // для генерации ID

const app = express();
app.use(express.json());

// Хранилище данных
const store = {
    books: []
};

// Вспомогательная функция для поиска книги
const findBookById = (id) => {
    const book = store.books.find(book => book.id === id);
    return { book, index: store.books.findIndex(book => book.id === id) };
};

// 1. POST /api/user/login - авторизация пользователя
app.post('/api/user/login', (req, res) => {
    res.status(201).json({ id: 1, mail: "test@mail.ru" });
});

// 2. GET /api/books - получить все книги
app.get('/api/books', (req, res) => {
    res.json(store.books);
});

// 3. GET /api/books/:id - получить книгу по ID
app.get('/api/books/:id', (req, res) => {
    const { id } = req.params;
    const { book } = findBookById(id);
    
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: "Книга не найдена" });
    }
});

// 4. POST /api/books - создать книгу
app.post('/api/books', (req, res) => {
    const { title, description, authors, favorite, fileCover, fileName } = req.body;
    
    const newBook = {
        id: uuid(),
        title: title || "",
        description: description || "",
        authors: authors || "",
        favorite: favorite || "",
        fileCover: fileCover || "",
        fileName: fileName || ""
    };
    
    store.books.push(newBook);
    res.status(201).json(newBook);
});

// 5. PUT /api/books/:id - редактировать книгу по ID
app.put('/api/books/:id', (req, res) => {
    const { id } = req.params;
    const { book, index } = findBookById(id);
    
    if (book) {
        const { title, description, authors, favorite, fileCover, fileName } = req.body;
        
        store.books[index] = {
            ...book,
            title: title !== undefined ? title : book.title,
            description: description !== undefined ? description : book.description,
            authors: authors !== undefined ? authors : book.authors,
            favorite: favorite !== undefined ? favorite : book.favorite,
            fileCover: fileCover !== undefined ? fileCover : book.fileCover,
            fileName: fileName !== undefined ? fileName : book.fileName
        };
        
        res.json(store.books[index]);
    } else {
        res.status(404).json({ message: "Книга не найдена" });
    }
});

// 6. DELETE /api/books/:id - удалить книгу по ID
app.delete('/api/books/:id', (req, res) => {
    const { id } = req.params;
    const { book, index } = findBookById(id);
    
    if (book) {
        store.books.splice(index, 1);
        res.json('ok');
    } else {
        res.status(404).json({ message: "Книга не найдена" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});