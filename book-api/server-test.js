const express = require('express');
const app = express();
const PORT = 3000;

// Самый простой маршрут
app.get('/test-simple', (req, res) => {
    console.log('✅ /test-simple вызван');
    res.json({ message: 'Simple test works!' });
});

// Ещё один простой маршрут
app.get('/ping', (req, res) => {
    console.log('✅ /ping вызван');
    res.send('pong');
});

app.listen(PORT, () => {
    console.log(`🚀 Тестовый сервер запущен на порту ${PORT}`);
    console.log(`  - http://localhost:${PORT}/test-simple`);
    console.log(`  - http://localhost:${PORT}/ping`);
});