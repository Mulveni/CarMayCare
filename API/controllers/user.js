const express = require('express');
const router = express.Router();
const utils = require('../utils');
const models = require('../models');


router.get('/', async (req, res) => {
    const userId = req.user.id;
    try {
        const userInfo = await utils.getUserInfo(userId);
        const userModel = models.userModel(userInfo);
        console.log(userModel);
        res.status(200).send(userModel);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error while trying to get user info." });
    }

});

router.put('/', (req, res) => {
    res.sendStatus(201);
});

router.delete('/', async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await utils.deleteUser(userId);
        if (result.affectedRows > 0) {
            res.sendStatus(201);
        } else {
            res.status(400).send({ message: "User doesn't exist." })
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error while trying to delete user." });
    }
});

module.exports = router;