const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = process.env.DATA_DIR || '/app/data';

app.use(express.json());

// Убедимся, что папка для данных существует
async function ensureDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

// Получить путь к файлу счётчика
function getCounterPath(bookId) {
    return path.join(DATA_DIR, `${bookId}.json`);
}

// GET /counter/:bookId - получить значение счётчика
app.get('/counter/:bookId', async (req, res) => {
    const { bookId } = req.params;
    const filePath = getCounterPath(bookId);
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        const count = JSON.parse(data).count;
        res.json({ bookId, count });
    } catch {
        res.json({ bookId, count: 0 });
    }
});

// POST /counter/:bookId/incr - увеличить счётчик
app.post('/counter/:bookId/incr', async (req, res) => {
    const { bookId } = req.params;
    const filePath = getCounterPath(bookId);
    
    let currentCount = 0;
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        currentCount = JSON.parse(data).count;
    } catch {}
    
    const newCount = currentCount + 1;
    await fs.writeFile(filePath, JSON.stringify({ count: newCount }));
    res.json({ bookId, count: newCount });
});

// Запуск сервера
ensureDataDir().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Counter service listening on port ${PORT}`);
        console.log(`   GET  /counter/:bookId`);
        console.log(`   POST /counter/:bookId/incr`);
    });
});