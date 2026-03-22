const express = require('express');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Настройка EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статические файлы
app.use('/public', express.static(path.join(__dirname, 'public')));

// ============== API МАРШРУТЫ ==============
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');

// API маршруты (должны быть доступны по /api/*)
app.use('/api/user', authRoutes);
app.use('/api/books', bookRoutes);

// ============== ВЕБ МАРШРУТЫ ==============
const webRoutes = require('./routes/web');

// Веб-маршруты (должны быть доступны по /*)
app.use('/', webRoutes);

// ============== ОБРАБОТКА ОШИБОК ==============
// Обработка ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            // Для API запросов
            if (req.path.startsWith('/api/')) {
                return res.status(400).json({ message: 'Файл слишком большой' });
            }
            // Для веб-запросов
            return res.status(400).render('error', { 
                title: 'Ошибка', 
                message: 'Файл слишком большой. Максимальный размер 50MB.' 
            });
        }
    }
    
    // Для API запросов
    if (req.path.startsWith('/api/')) {
        return res.status(500).json({ message: err.message || 'Что-то пошло не так' });
    }
    
    // Для веб-запросов
    res.status(500).render('error', { 
        title: 'Ошибка', 
        message: err.message || 'Что-то пошло не так' 
    });
});

// Обработка 404
app.use((req, res) => {
    // Для API запросов
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ message: 'API маршрут не найден' });
    }
    
    // Для веб-запросов
    res.status(404).render('error', { 
        title: '404', 
        message: 'Страница не найдена' 
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`=================================`);
    console.log(`Веб-интерфейс:`);
    console.log(`  - Главная: http://localhost:${PORT}/`);
    console.log(`  - Список книг: http://localhost:${PORT}/books`);
    console.log(`  - Добавить книгу: http://localhost:${PORT}/books/create`);
    console.log(`=================================`);
    console.log(`API Endpoints:`);
    console.log(`  - GET    /api/books`);
    console.log(`  - GET    /api/books/:id`);
    console.log(`  - POST   /api/books`);
    console.log(`  - PUT    /api/books/:id`);
    console.log(`  - DELETE /api/books/:id`);
    console.log(`  - GET    /api/books/:id/download`);
    console.log(`  - POST   /api/user/login`);
    console.log(`=================================`);
});