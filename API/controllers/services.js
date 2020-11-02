const express = require('express');
const router = express.Router();

router.get('/:carId', (req, res) => {
    res.sendStatus(200);
});

router.post('/:carId', (req, res) => {
    res.sendStatus(201);
});

router.get('/:carId/:serviceId', (req, res) => {
    res.sendStatus(200);
});

router.put('/:carId/:serviceId', (req, res) => {
    res.sendStatus(201);
});

router.delete('/:carId/:serviceId', (req, res) => {
    res.sendStatus(201);
});

module.exports = router;