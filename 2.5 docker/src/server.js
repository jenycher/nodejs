const express = require("express")
const redis = require("redis")

const app = express()

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost'
const client = redis.createClient({ url: REDIS_URL });

client.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
    await client.connect()
    console.log('Redis connected')
})()

const PORT = process.env.PORT || 3000

app.get("/:name", async (req, res) => {
    const { name } = req.params
    
    let cnt;  // 👈 ОБЪЯВЛЯЕМ СНАРУЖИ
    try {
        cnt = await client.incr(name)  
    } catch (err) {
        return res.status(500).json({ 
            ercode: 500, 
            errmsg: `redis error: ${err.message}` 
        })
    }
    
    res.json({ message: `Hello, ${name}!!!`, cnt })  
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`)
})