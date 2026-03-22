const express = require('express');
const { v4: uuid } = require('uuid');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');
const storage = require('../storage');

const router = express.Router();

// GET /api/books - получить все книги
router.get('/', (req, res) => {
    res.json(storage.getBooks());
});

// GET /api/books/:id - получить книгу по ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const book = storage.getBookById(id);
    
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: "Книга не найдена" });
    }
});

// GET /api/books/:id/download - скачать файл книги
router.get('/:id/download', (req, res) => {
    const { id } = req.params;
    const book = storage.getBookById(id);
    
    if (!book || !book.fileBook) {
        return res.status(404).json({ message: "Файл книги не найден" });
    }

    const filePath = path.join(__dirname, '..', 'public', 'books', book.fileBook);
    
    if (fs.existsSync(filePath)) {
        let fileName = book.fileName || book.fileBook;
        try {
            fileName = decodeURIComponent(escape(fileName));
        } catch (e) {
            try {
                fileName = decodeURIComponent(fileName);
            } catch (e2) {}
        }
        
        res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`);
        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error('Ошибка при скачивании:', err);
                res.status(500).json({ message: "Ошибка при скачивании файла" });
            }
        });
    } else {
        res.status(404).json({ message: "Файл не найден на сервере" });
    }
});

// POST /api/books - создать книгу
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
    
    storage.addBook(newBook);
    res.status(201).json(newBook);
});

// PUT /api/books/:id - обновить книгу
router.put('/:id', upload.fields([
    { name: 'fileCover', maxCount: 1 },
    { name: 'fileBook', maxCount: 1 }
]), (req, res) => {
    const { id } = req.params;
    const book = storage.getBookById(id);
    
    if (book) {
        const { title, description, authors, favorite } = req.body;
        
        // Удаляем старые файлы, если загружены новые
        if (req.files?.fileCover?.[0] && book.fileCover) {
            const oldCoverPath = path.join(__dirname, '..', 'public', 'img', book.fileCover);
            if (fs.existsSync(oldCoverPath)) {
                fs.unlinkSync(oldCoverPath);
            }
        }
        
        if (req.files?.fileBook?.[0] && book.fileBook) {
            const oldBookPath = path.join(__dirname, '..', 'public', 'books', book.fileBook);
            if (fs.existsSync(oldBookPath)) {
                fs.unlinkSync(oldBookPath);
            }
        }
        
        const updatedBook = storage.updateBook(id, {
            title: title !== undefined ? title : book.title,
            description: description !== undefined ? description : book.description,
            authors: authors !== undefined ? authors : book.authors,
            favorite: favorite !== undefined ? (favorite === 'true' || favorite === true) : book.favorite,
            fileCover: req.files?.fileCover?.[0]?.filename || book.fileCover,
            fileName: req.files?.fileBook?.[0]?.originalname || book.fileName,
            fileBook: req.files?.fileBook?.[0]?.filename || book.fileBook
        });
        
        res.json(updatedBook);
    } else {
        res.status(404).json({ message: "Книга не найдена" });
    }
});

// DELETE /api/books/:id - удалить книгу
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const book = storage.getBookById(id);
    
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
        
        storage.deleteBook(id);
        res.json('ok');
    } else {
        res.status(404).json({ message: "Книга не найдена" });
    }
});

module.exports = router;