const express = require('express');
const router = express.Router();

// POST /api/user/login - авторизация пользователя
router.post('/login', (req, res) => {
    res.status(201).json({ id: 1, mail: "test@mail.ru" });
});

module.exports = router;