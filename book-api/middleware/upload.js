const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuid } = require('uuid');

// Создаем папки, если их нет
const createDirIfNotExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Настройка хранилища для файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'public/img';
        
        // Определяем папку назначения в зависимости от типа файла
        if (file.fieldname === 'fileBook') {
            uploadPath = 'public/books';
        }
        
        const fullPath = path.join(__dirname, '..', uploadPath);
        createDirIfNotExists(fullPath);
        cb(null, fullPath);
    },
    filename: (req, file, cb) => {
        // Генерируем уникальное имя файла
        const fileExt = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${uuid()}${fileExt}`;
        cb(null, uniqueName);
    }
});

// Фильтр для проверки типов файлов
const fileFilter = (req, file, cb) => {
    // Для обложек разрешаем только изображения
    if (file.fieldname === 'fileCover') {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            cb(null, true);
        } else {
            cb(new Error('Для обложки разрешены только изображения!'));
        }
    } 
    // Для файлов книг разрешаем PDF и документы
    else if (file.fieldname === 'fileBook') {
        const allowedTypes = /pdf|doc|docx|txt|fb2|epub/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        
        if (extname) {
            cb(null, true);
        } else {
            cb(new Error('Неподдерживаемый формат файла книги!'));
        }
    } else {
        cb(null, true);
    }
};

// Конфигурация multer
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB для книг
    }
});

module.exports = upload;