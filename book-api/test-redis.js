const redis = require('redis');

async function testRedis() {
    const client = redis.createClient({ url: 'redis://localhost:6379' });
    
    client.on('error', err => console.error('Redis ошибка:', err));
    
    try {
        await client.connect();
        console.log('✅ Подключено к Redis');
        
        await client.set('test-key', 'Hello from Node!');
        console.log('✅ Ключ test-key сохранён');
        
        const value = await client.get('test-key');
        console.log('📦 Значение из Redis:', value);
        
        await client.quit();
        console.log('✅ Соединение закрыто');
    } catch (err) {
        console.error('❌ Ошибка:', err);
    }
}

testRedis();
