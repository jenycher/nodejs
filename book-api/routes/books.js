const express = require('express');
const { v4: uuid } = require('uuid');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Хранилище данных
const store = {
    books: []
};

// Вспомогательная функция для поиска книги
const findBookById = (id) => {
    const book = store.books.find(book => book.id === id);
    return { book, index: store.books.findIndex(book => book.id === id) };
};

// GET /api/books - получить все книги
router.get('/', (req, res) => {
    res.json(store.books);
});

// GET /api/books/:id - получить книгу по ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const { book } = findBookById(id);
    
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: "Книга не найдена" });
    }
});

// GET /api/books/:id/download - скачать файл книги
router.get('/:id/download', (req, res) => {
    const { id } = req.params;
    const { book } = findBookById(id);
    
    if (!book || !book.fileBook) {
        return res.status(404).json({ message: "Файл книги не найден" });
    }

    const filePath = path.join(__dirname, '..', 'public', 'books', book.fileBook);
    
    // Проверяем существование файла
    if (fs.existsSync(filePath)) {
        res.download(filePath, book.fileName || 'book.pdf', (err) => {
            if (err) {
                console.error('Ошибка при скачивании:', err);
                res.status(500).json({ message: "Ошибка при скачивании файла" });
            }
        });
    } else {
        res.status(404).json({ message: "Файл не найден на сервере" });
    }
});

// POST /api/books - создать книгу (с загрузкой файлов)
router.post('/', upload.fields([
    { name: 'fileCover', maxCount: 1 },
    { name: 'fileBook', maxCount: 1 }
]), (req, res) => {
    const { title, description, authors, favorite } = req.body;
    
    const newBook = {
        id: uuid(),
        title: title || "",
        description: description || "",
        authors: authors || "",
        favorite: favorite === 'true' || favorite === true || false,
        fileCover: req.files?.fileCover?.[0]?.filename || "",
        fileName: req.files?.fileBook?.[0]?.originalname || "",
        fileBook: req.files?.fileBook?.[0]?.filename || ""
    };
    
    store.books.push(newBook);
    res.status(201).json(newBook);
});

// PUT /api/books/:id - редактировать книгу
router.put('/:id', upload.fields([
    { name: 'fileCover', maxCount: 1 },
    { name: 'fileBook', maxCount: 1 }
]), (req, res) => {
    const { id } = req.params;
    const { book, index } = findBookById(id);
    
    if (book) {
        const { title, description, authors, favorite } = req.body;
        
        store.books[index] = {
            ...book,
            title: title !== undefined ? title : book.title,
            description: description !== undefined ? description : book.description,
            authors: authors !== undefined ? authors : book.authors,
            favorite: favorite !== undefined ? (favorite === 'true' || favorite === true) : book.favorite,
            fileCover: req.files?.fileCover?.[0]?.filename || book.fileCover,
            fileName: req.files?.fileBook?.[0]?.originalname || book.fileName,
            fileBook: req.files?.fileBook?.[0]?.filename || book.fileBook
        };
        
        res.json(store.books[index]);
    } else {
        res.status(404).json({ message: "Книга не найдена" });
    }
});

// DELETE /api/books/:id - удалить книгу
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const { book, index } = findBookById(id);
    
    if (book) {
        // Удаляем файлы книги
        if (book.fileCover) {
            const coverPath = path.join(__dirname, '..', 'public', 'img', book.fileCover);
            if (fs.existsSync(coverPath)) {
                fs.unlinkSync(coverPath);
            }
        }
        if (book.fileBook) {
            const bookPath = path.join(__dirname, '..', 'public', 'books', book.fileBook);
            if (fs.existsSync(bookPath)) {
                fs.unlinkSync(bookPath);
            }
        }
        
        store.books.splice(index, 1);
        res.json('ok');
    } else {
        res.status(404).json({ message: "Книга не найдена" });
    }
});

module.exports = router;