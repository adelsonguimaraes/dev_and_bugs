"use strict";
const express = require('express');
const router = express.Router();
const path = require('path');
router.get('/', (req, res) => {
    res.sendFile(path.resolve('./index.html'));
});
router.get('/game', (req, res) => {
    res.sendFile(path.resolve('./app/game.html'));
});
router.get('/canvas', (req, res) => {
    res.sendFile(path.resolve('./canvas.html'));
});
module.exports = router;
