const express = require('express');
const { v4: uuid } = require('uuid');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');
const storage = require('../storage');

// Фабрика, принимающая зависимости
module.exports = ({ getCounter, incrementCounter }) => {
    const router = express.Router();

    // GET /api/books/:id - получить книгу по ID (увеличивает счётчик)
    router.get('/:id', async (req, res) => {
        const { id } = req.params;
        const book = storage.getBookById(id);
        
        if (book) {
            try {
                const counter = await incrementCounter(id);
                res.json({ ...book, views: counter.count });
            } catch (err) {
                res.json({ ...book, views: 0 });
            }
        } else {
            res.status(404).json({ message: "Книга не найдена" });
        }
    });

    // GET /api/books/:id - получить книгу по ID (увеличивает счётчик)
// Страница просмотра книги
router.get('/books/:id', async (req, res) => {
    const { id } = req.params;
    const book = storage.getBookById(id);
    
    if (book) {
        // Получаем счётчик (увеличиваем и читаем)
        let views = 0;
        try {
            await callCounter(id, 'POST');  // увеличиваем
            const counter = await callCounter(id);  // читаем
            views = counter.count;
        } catch (err) {
            console.error('Counter error:', err.message);
        }
        
        // Декодируем имя файла книги
        let decodedFileName = '';
        if (book.fileName) {
            try {
                decodedFileName = decodeURIComponent(escape(book.fileName));
            } catch (e) {
                try {
                    decodedFileName = decodeURIComponent(book.fileName);
                } catch (e2) {
                    decodedFileName = book.fileName;
                }
            }
        }
        
        // Декодируем имя файла обложки
        let decodedCoverName = '';
        if (book.fileCover) {
            try {
                decodedCoverName = decodeURIComponent(escape(book.fileCover));
            } catch (e) {
                try {
                    decodedCoverName = decodeURIComponent(book.fileCover);
                } catch (e2) {
                    decodedCoverName = book.fileCover;
                }
            }
        }
        
        // Получаем информацию о файле книги
        let fileInfo = {
            exists: false,
            size: '',
            date: '',
            extension: '',
            originalName: decodedFileName || book.fileName || ''
        };
        
        if (book.fileBook) {
            const bookPath = path.join(__dirname, '..', 'public', 'books', book.fileBook);
            if (fs.existsSync(bookPath)) {
                const stats = fs.statSync(bookPath);
                const bytes = stats.size;
                
                let fileSize = '';
                if (bytes < 1024) fileSize = bytes + ' B';
                else if (bytes < 1048576) fileSize = (bytes / 1024).toFixed(1) + ' KB';
                else fileSize = (bytes / 1048576).toFixed(1) + ' MB';
                
                const date = new Date(stats.mtime);
                const fileDate = date.toLocaleDateString('ru-RU') + ' в ' + date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
                
                const fileName = decodedFileName || book.fileName || book.fileBook;
                const ext = fileName.split('.').pop().toUpperCase();
                const iconMap = {
                    'PDF': '📕 PDF',
                    'DOC': '📘 DOC',
                    'DOCX': '📘 DOCX',
                    'TXT': '📄 TXT',
                    'FB2': '📗 FB2',
                    'EPUB': '📙 EPUB'
                };
                const extension = iconMap[ext] || `📄 ${ext}`;
                
                fileInfo = {
                    exists: true,
                    size: fileSize,
                    date: fileDate,
                    extension: extension,
                    originalName: decodedFileName || book.fileName || book.fileBook
                };
            }
        }
        
        // Определяем дату добавления из ID
        let addedDate = 'Неизвестно';
        if (book.id && book.id.includes('-')) {
            const parts = book.id.split('-');
            if (parts[0] && !isNaN(parts[0]) && parts[0].length > 10) {
                const timestamp = parseInt(parts[0]);
                if (!isNaN(timestamp)) {
                    const date = new Date(timestamp);
                    addedDate = date.toLocaleDateString('ru-RU') + ' в ' + date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
                }
            }
        }
        
        res.render('books/view', { 
            title: book.title,
            book: {
                ...book,
                views: views,  // ← добавляем views
                displayFileName: decodedFileName,
                displayCoverName: decodedCoverName
            },
            fileInfo: fileInfo,
            addedDate: addedDate,
            message: null
        });
    } else {
        res.render('error', { 
            title: 'Книга не найдена',
            message: 'Книга с указанным ID не найдена'
        });
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

    // Опционально: отдельный маршрут для получения только счётчика
    router.get('/:id/counter', async (req, res) => {
        const { id } = req.params;
        try {
            const views = await getCounter(id);
            res.json({ bookId: id, views });
        } catch (err) {
            res.status(500).json({ error: 'Ошибка получения счётчика' });
        }
    });

    return router;
};

