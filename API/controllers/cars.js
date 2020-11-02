const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendStatus(200);
});

router.post('/', (req, res) => {
    res.sendStatus(201);
});

router.get('/:carId', (req, res) => {
    res.sendStatus(200);
});

router.put('/:carId', (req, res) => {
    res.sendStatus(201);
});

router.delete('/:carId', (req, res) => {
    res.sendStatus(201);
});

module.exports = router;