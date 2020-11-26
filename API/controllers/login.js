const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwt-secret.json');

router.post('/', (req, res) => {
    const user = req.user;
    const body = {
        username: user.email,
        id: user.idUsers,
        isAdmin: user.isAdmin
    };

    const payload = {
        user: body
    };

    const options = {
        expiresIn: '10m'
    }

    const token = jwt.sign(payload, jwtSecret.secret, options);
    return res.json({ token });
});

module.exports = router;