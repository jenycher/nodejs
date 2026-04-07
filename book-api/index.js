const express = require('express');
const path = require('path');
const multer = require('multer');
const upload = require('./middleware/upload');

const app = express();
const PORT = process.env.PORT || 3000;
const COUNTER_SERVICE_URL = process.env.COUNTER_SERVICE_URL || 'http://localhost:3001';

// ============== ФУНКЦИЯ ДЛЯ ВЫЗОВА МИКРОСЕРВИСА СЧЁТЧИКА ==============
async function callCounter(bookId, method = 'GET') {
    const fetch = (await import('node-fetch')).default;
    const url = method === 'POST' 
        ? `${COUNTER_SERVICE_URL}/counter/${bookId}/incr`
        : `${COUNTER_SERVICE_URL}/counter/${bookId}`;
    
    const response = await fetch(url, { method });
    return response.json();
}

// ============== ТЕСТОВЫЕ МАРШРУТЫ ==============
app.get('/test-simple', (req, res) => {
    res.json({ message: 'Simple test works!' });
});

app.get('/api/test-counter/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const views = await callCounter(id, 'POST');
        res.json({ bookId: id, views: views.count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============== ПРЯМЫЕ МАРШРУТЫ К МИКРОСЕРВИСУ СЧЁТЧИКА (ПРОКСИ) ==============
// Получить значение счётчика
app.get('/counter/:bookId', async (req, res) => {
    const { bookId } = req.params;
    try {
        const result = await callCounter(bookId, 'GET');
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Увеличить счётчик
app.post('/counter/:bookId/incr', async (req, res) => {
    const { bookId } = req.params;
    try {
        const result = await callCounter(bookId, 'POST');
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============== ПОДКЛЮЧЕНИЕ РОУТЕРОВ ==============
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const webRoutes = require('./routes/web');

// Настройка EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

// ============== API МАРШРУТЫ ==============
app.use('/api/user', authRoutes);
app.use('/api/books', bookRoutes({ 
    getCounter: (id) => callCounter(id), 
    incrementCounter: (id) => callCounter(id, 'POST') 
}));

// ============== ВЕБ МАРШРУТЫ ==============
app.use('/', webRoutes);

// ============== ОБРАБОТКА ОШИБОК ==============
app.use((err, req, res, next) => {
    console.error('❌ Ошибка:', err.stack);
    
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            if (req.path.startsWith('/api/')) {
                return res.status(400).json({ message: 'Файл слишком большой. Максимальный размер 50MB.' });
            }
            return res.status(400).render('error', { 
                title: 'Ошибка', 
                message: 'Файл слишком большой. Максимальный размер 50MB.' 
            });
        }
    }
    
    if (req.path.startsWith('/api/')) {
        return res.status(500).json({ message: err.message || 'Что-то пошло не так' });
    }
    
    res.status(500).render('error', { 
        title: 'Ошибка', 
        message: err.message || 'Что-то пошло не так' 
    });
});

// Обработка 404
app.use((req, res) => {
    console.log('⚠️ 404 для пути:', req.path);
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ message: 'API маршрут не найден' });
    }
    
    res.status(404).render('error', { 
        title: '404', 
        message: 'Страница не найдена' 
    });
});

// ============== ЗАПУСК СЕРВЕРА ==============
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                    🚀 СЕРВЕР ЗАПУЩЕН 🚀                          ║
╚══════════════════════════════════════════════════════════════════╝

📡 ПОРТ: ${PORT}
🔄 Counter service: ${COUNTER_SERVICE_URL}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧪 ТЕСТОВЫЕ МАРШРУТЫ:
  ┌─────────────────────────────────────────────────────────────┐
  │ GET  /test-simple                                           │
  │ GET  /api/test-counter/:id                                  │
  └─────────────────────────────────────────────────────────────┘

📊 МАРШРУТЫ СЧЁТЧИКА (прямой доступ к микросервису):
  ┌─────────────────────────────────────────────────────────────┐
  │ GET    /counter/:bookId          - получить значение        │
  │ POST   /counter/:bookId/incr     - увеличить на 1           │
  └─────────────────────────────────────────────────────────────┘

📚 API МАРШРУТЫ (основное приложение):
  ┌─────────────────────────────────────────────────────────────┐
  │ GET    /api/books                - список всех книг         │
  │ GET    /api/books/:id            - просмотр книги (+1 view) │
  │ POST   /api/books                - создать книгу            │
  │ PUT    /api/books/:id            - обновить книгу           │
  │ DELETE /api/books/:id            - удалить книгу            │
  │ GET    /api/books/:id/download   - скачать файл книги       │
  └─────────────────────────────────────────────────────────────┘

🔐 АУТЕНТИФИКАЦИЯ:
  ┌─────────────────────────────────────────────────────────────┐
  │ POST   /api/user/login           - вход в систему           │
  └─────────────────────────────────────────────────────────────┘

🌐 ВЕБ-ИНТЕРФЕЙС:
  ┌─────────────────────────────────────────────────────────────┐
  │ GET    /                         - главная страница         │
  │ GET    /books                    - список книг              │
  │ GET    /books/create             - добавить книгу           │
  │ GET    /books/:id                - просмотр книги (+1 view) │
  │ GET    /books/:id/edit           - редактировать книгу      │
  │ POST   /books/:id/update         - обновить книгу           │
  │ POST   /books/:id/delete         - удалить книгу            │
  │ GET    /books/:id/download       - скачать книгу            │
  └─────────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 ПРИМЕРЫ ЗАПРОСОВ:

  # Получить список книг
  curl.exe http://localhost:${PORT}/api/books

  # Просмотреть книгу (увеличит счётчик)
  curl.exe http://localhost:${PORT}/api/books/9df5c501-429c-4549-8cf4-3a2fb0a1a6ef

  # Получить значение счётчика
  curl.exe http://localhost:${PORT}/counter/9df5c501-429c-4549-8cf4-3a2fb0a1a6ef

  # Увеличить счётчик
  curl.exe -X POST http://localhost:${PORT}/counter/9df5c501-429c-4549-8cf4-3a2fb0a1a6ef/incr

  # Открыть в браузере
  http://localhost:${PORT}/books/9df5c501-429c-4549-8cf4-3a2fb0a1a6ef

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
});