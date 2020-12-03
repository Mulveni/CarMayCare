const express = require('express');
const router = express.Router();
const utils = require('../utils');
const models = require('../models');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');


router.get('/', async (req, res) => {
    const userId = req.user.id;
    try {
        const userInfo = await utils.getUserInfo(userId);
        if (userInfo === undefined) {
            res.status(400).send({ message: "User doesn't exist." });
        } else {
            const userModel = models.userModel(userInfo);
            res.status(200).send(userModel);
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error while trying to get user info." });
    }

});

router.put('/', [body('email').isEmail()], async (req, res) => {
    const userId = req.user.id;
    const updateModel = models.updateModel();
    const updateUser = req.body;
    const userKeys = Object.keys(updateUser).sort();
    const modelKeys = Object.keys(updateModel).sort();
    const errors = validationResult(req);
    if (JSON.stringify(userKeys) === JSON.stringify(modelKeys) !== true) {
        res.status(400).send({ message: "Missing field or wrong names in model." });
    } else {
        if (!errors.isEmpty()) {
            return res.status(400).send({ message: "Invalid email." });
        }
        // Check email availibility here
        try {
            await utils.updateUser(updateUser, userId);
            res.sendStatus(201);
        } catch (error) {
            if (error.sqlMessage.indexOf("users.email_UNIQUE") > -1) {
                res.status(400).send({ message: "Email already in use." });
            } else {
                res.status(500).send({ message: "Error while trying to update user info." });
            }

        }

    }
});

router.put('/password', [body('password').isLength({ min: 5 })], async (req, res) => {
    const userId = req.user.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ message: "Password missing or is not length of 5 characters." });
    } else {
        try {
            const password = bcrypt.hashSync(req.body.password, 6);
            await utils.updatePassword(password, userId);
            res.sendStatus(201);
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: "Error while trying to update user password." });
        }
    }



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