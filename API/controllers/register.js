const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    res.sendStatus(201);
});

module.exports = router;