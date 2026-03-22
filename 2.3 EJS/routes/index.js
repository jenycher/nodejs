const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.render('index', {
        title: 'Главная',
    })
});

module.exports = router;