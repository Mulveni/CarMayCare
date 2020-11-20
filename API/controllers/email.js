const express = require('express');
const router = express.Router();
const utils = require('../utils');
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');


function generatePassword() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let random = "";
    let password = "";

    for (let i = 0; i < 8; i++) {
        random = Math.floor(Math.random() * characters.length);
        password += characters.substring(random, random + 1);
    }
    return password;
}

function getEmailSubject(lng, mode) {
    if (mode === "forgot") {
        if (lng === "fi") {
            return "Unohtuneen salasanan palautus";
        }
        else if (lng === "en") {
            return "Recovery of forgotten password";
        } else {
            return "Recovery of forgotten password";
        }
    }
    else if (mode === "reset") {
        if (lng === "fi") {
            return "Salasanan nollaus";
        }
        else if (lng === "en") {
            return "Password reset";
        } else {
            return "Password reset";
        }
    } else {
        return "Error";
    }
}

function getEmailHtml(lng, mode, link, password) {
    if (mode === "forgot") {
        if (lng === "fi") {
            return "<p>Olet pyytänyt salasanasi palautusta.</p> <p>Tässä linkki josta pääset nollaamaan salasanasi: " + process.env.WEB_URL + "/resetpassword/" + link + "</p>";
        }
        else if (lng === "en") {
            return "<p>You have asked to reset your password.</p> <p>Here is link where you can reset your password: " + process.env.WEB_URL + "/resetpassword/" + link + "</p>";
        } else {
            return "<p>You have asked to reset your password.</p> <p>Here is link where you can reset your password: " + process.env.WEB_URL + "/resetpassword/" + link + "</p>";
        }
    }
    else if (mode === "reset") {
        if (lng === "fi") {
            return "<p>Salasanasi on nyt nollattu.</p> <p>Tässä uusi salasanasi: " + password + "</p> <p>Suosittelemme vaihtamaan salasanasi kirjauduttua sivulle.</p>";
        }
        else if (lng === "en") {
            return "<p>Your password has been reset.</p> <p>Here is your new password: " + password + "</p> <p>We recommend to change your password after login.</p>";
        } else {
            return "<p>Your password has been reset.</p> <p>Here is your new password: " + password + "</p> <p>We recommend to change your password after login.</p>";
        }
    } else {
        return "<p>Error</p>"
    }
}


async function sendEmail(lng, link, mode, email, password) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const info = await transporter.sendMail({
        from: '"Autohuolto testi" <autohuoltotesti@gmail.com>',
        to: email,
        subject: getEmailSubject(lng, mode),
        html: getEmailHtml(lng, mode, link, password),
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Info:");
    console.log(info);
}

router.get('/', async (req, res) => {
    if ('link' in req.query === false || req.query.link.length < 1) {
        res.status(400).send({ message: "Link missing." });
    } else {
        const d = new Date().getTime();

        if (await utils.findForgotPasswordLink(req.query.link, d) !== false) {
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }

    }
});

router.post('/', async (req, res) => {
    let lng = "en";
    if ('email' in req.body === false || req.body.email.length < 1) {
        res.status(400).send({ message: "Email missing." });
    } else {
        if ('lng' in req.body !== false) {
            lng = req.body.lng;
        }
        try {
            if (await utils.checkEmailAvailability(req.body.email) === false) {
                res.status(404).send({ message: "No user for this email." });
            } else {
                const d = new Date().getTime();
                const link = uuidv4();
                const expireAt = d + (60000 * 15);
                const userId = await utils.findUserIdByEmail(req.body.email);

                // Check if user already have forgotpw-link
                if (await utils.checkIfForgotPasswordLinkExists(userId, d) !== false) {
                    res.status(400).send({ message: "User already has valid link." })
                } else {
                    await utils.addForgotPassword(link, expireAt, userId);
                    // sendEmail
                    await sendEmail(lng, link, "forgot", req.body.email);
                    res.sendStatus(201);
                }


            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }

});

router.post('/reset', async (req, res) => {
    let lng = "en";
    if ('link' in req.body === false || req.body.link.length < 1) {
        res.status(400).send({ message: "Link missing." });
    } else {
        if ('lng' in req.body !== false) {
            lng = req.body.lng;
        }
        const d = new Date().getTime();
        try {
            if (await utils.findForgotPasswordLink(req.body.link, d) !== false) {
                const userId = await utils.findUserIdByLink(req.body.link);
                const email = await utils.findEmailByUserId(userId);
                // reset password
                const newPassword = generatePassword();
                const newPasswordHash = bcrypt.hashSync(newPassword, 6);
                await utils.updatePassword(newPasswordHash, userId);
                // sendEmail
                await utils.removedForgotPasswordLink(userId);
                await sendEmail(lng, req.body.link, "reset", email, newPassword);
                res.sendStatus(201);
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }

    }
});

module.exports = router;