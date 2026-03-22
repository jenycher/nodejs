const path = require('path');
const fs = require('fs');

// Путь к файлу для сохранения данных
const DATA_FILE = path.join(__dirname, 'data', 'books.json');

// Хранилище данных
let books = [];

// Функция для корректного декодирования строк
const fixEncoding = (str) => {
    if (!str) return str;
    try {
        // Пробуем декодировать, если это строка с escape-последовательностями
        return decodeURIComponent(escape(str));
    } catch (e) {
        try {
            return decodeURIComponent(str);
        } catch (e2) {
            return str;
        }
    }
};

// Загрузка данных из файла
const loadBooks = () => {
    try {
        if (fs.existsSync(DATA_FILE)) {
            // Читаем файл в кодировке UTF-8
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            books = JSON.parse(data);
            
            // Исправляем кодировку для каждого поля
            books = books.map(book => ({
                ...book,
                title: fixEncoding(book.title),
                description: fixEncoding(book.description),
                authors: fixEncoding(book.authors),
                fileName: fixEncoding(book.fileName),
                fileCover: fixEncoding(book.fileCover)
            }));
            
            console.log(`📚 Загружено ${books.length} книг из файла`);
        } else {
            // Добавляем тестовые книги с корректной кодировкой
            const { v4: uuid } = require('uuid');
            books = [
                {
                    id: uuid(),
                    title: "Война и мир",
                    description: "Роман-эпопея Льва Толстого о жизни русского общества в эпоху наполеоновских войн.",
                    authors: "Лев Толстой",
                    favorite: true,
                    fileCover: "obl1.jpg",
                    fileName: "book1.txt",
                    fileBook: "book1.txt"
                },
                {
                    id: uuid(),
                    title: "Преступление и наказание",
                    description: "Роман Федора Достоевского о моральных дилеммах и психологии преступника.",
                    authors: "Федор Достоевский",
                    favorite: false,
                    fileCover: "obl2.jpg",
                    fileName: "book2.txt",
                    fileBook: "book2.txt"
                },
                {
                    id: uuid(),
                    title: "Мастер и Маргарита",
                    description: "Роман Михаила Булгакова, сочетающий сатиру, философию и мистику.",
                    authors: "Михаил Булгаков",
                    favorite: true,
                    fileCover: "obl3.jpg",
                    fileName: "book3.txt",
                    fileBook: "book3.txt"
                }
            ];
            saveBooks();
            console.log(`✨ Создано ${books.length} тестовых книг`);
        }
    } catch (err) {
        console.error('❌ Ошибка загрузки книг:', err);
        // Если файл поврежден, создаем новый
        const { v4: uuid } = require('uuid');
        books = [
            {
                id: uuid(),
                title: "Война и мир",
                description: "Роман-эпопея Льва Толстого",
                authors: "Лев Толстой",
                favorite: true,
                fileCover: "",
                fileName: "",
                fileBook: ""
            }
        ];
        saveBooks();
    }
};

// Сохранение данных в файл с правильной кодировкой
const saveBooks = () => {
    try {
        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        // Сохраняем с кодировкой UTF-8 без BOM
        const data = JSON.stringify(books, null, 2);
        fs.writeFileSync(DATA_FILE, data, 'utf8');
        console.log('💾 Книги сохранены в файл');
    } catch (err) {
        console.error('❌ Ошибка сохранения книг:', err);
    }
};

// Функции для работы с хранилищем
const getBooks = () => books;

const getBookById = (id) => books.find(book => book.id === id);

const addBook = (book) => {
    // Обеспечиваем корректную кодировку
    const newBook = {
        ...book,
        title: book.title || "",
        description: book.description || "",
        authors: book.authors || "",
        fileName: book.fileName || "",
        fileCover: book.fileCover || "",
        fileBook: book.fileBook || ""
    };
    books.push(newBook);
    saveBooks();
    return newBook;
};

const updateBook = (id, updatedData) => {
    const index = books.findIndex(book => book.id === id);
    if (index !== -1) {
        // Обновляем книгу, сохраняя существующие поля
        books[index] = { 
            ...books[index], 
            ...updatedData,
            // Убеждаемся, что строковые поля не undefined
            title: updatedData.title !== undefined ? updatedData.title : books[index].title,
            description: updatedData.description !== undefined ? updatedData.description : books[index].description,
            authors: updatedData.authors !== undefined ? updatedData.authors : books[index].authors,
            fileName: updatedData.fileName !== undefined ? updatedData.fileName : books[index].fileName,
            fileCover: updatedData.fileCover !== undefined ? updatedData.fileCover : books[index].fileCover,
            fileBook: updatedData.fileBook !== undefined ? updatedData.fileBook : books[index].fileBook
        };
        saveBooks();
        return books[index];
    }
    return null;
};

const deleteBook = (id) => {
    const index = books.findIndex(book => book.id === id);
    if (index !== -1) {
        const deleted = books.splice(index, 1)[0];
        saveBooks();
        return deleted;
    }
    return null;
};

// Очистка всех книг (для отладки)
const clearBooks = () => {
    books = [];
    saveBooks();
    console.log('🗑️ Все книги удалены');
};

// Загружаем данные при старте
loadBooks();

module.exports = {
    getBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook,
    clearBooks,
    saveBooks
};