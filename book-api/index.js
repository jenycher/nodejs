const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статические файлы
app.use('/public', express.static(path.join(__dirname, 'public')));

// Подключаем роуты
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');

app.use('/api/user', authRoutes);
app.use('/api/books', bookRoutes);

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'Файл слишком большой' });
        }
    }
    
    res.status(500).json({ message: err.message || 'Что-то пошло не так' });
});

// Обработка 404
app.use((req, res) => {
    res.status(404).json({ message: 'Маршрут не найден' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});