const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const utils = require('../utils');
const { body, validationResult } = require('express-validator');
const bcryptRounds = 5;

router.post('/', [
    
    body('firstname','Firstname cannot be left blank')
    .isLength({ min: 2 }),

    body('lastname','Lastname cannot be left blank')
    .isLength({ min: 2 }),

    body('email')
    .exists()
    .isLength({ min: 6, max: 100 })
    .isEmail()
    .normalizeEmail()
    .trim()
    /*.custom(async email => {
        const value = await utils.checkEmailAvailability(email);
        if (value) {
            throw new Error('Email is already exists!!!');
        }
    })*/,

    body("phonenumber").isMobilePhone(),

    body("address.street",'Street cannot be left blank')
    .isLength({ min: 1 }),

    body('address.postcode','Postcode cannot be left blank')
    .isLength({ min: 1 }),

    body('address.city','Country cannot be left blank')
    .isLength({ min: 1 }),

    body('address.country','Country cannot be left blank')
    .isLength({ min: 1 }),

    body('password')
    .isLength({ min: 5 }).withMessage('Password must be at least 5 chars long')
  ], (req, res) => {
      
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const {user_name, user_pass, user_email} = req.body;
    const validation_result = validationResult(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
        console.log("----->START USER REGISTRATION");
        const firstname = req.body.firstname;
        const lastname = req.body.mentionName;
        const email = req.body.email;
        const phonenumber = req.body.phonenumber;
        const street = req.body.address.street
        const city = req.body.address.city;
        const postcode = req.body.address.postcode;
        const country = req.body.address.country;
        const password = req.body.password;
        bcrypt.hash(password, bcryptRounds, function(err, hash) {
            console.log("HASH PASS : "+hash);
        });
    }
})
module.exports = router;