const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require('uuid') // npm install uuid

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'public/img')
    },
    filename(req, file, cb) {
        // Получаем расширение файла
        const ext = path.extname(file.originalname)
        // Генерируем уникальное имя
        const uniqueName = `${Date.now()}-${uuidv4()}${ext}`
        
        cb(null, uniqueName)
    }
})

module.exports = multer({ storage })