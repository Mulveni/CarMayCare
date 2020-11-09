const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const utils = require('../utils');
const { body, validationResult } = require('express-validator');


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
    .trim(),

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
  ],async (req, res) => {
    var result = [];
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const phonenumber = req.body.phonenumber;
    const street = req.body.address.street;
    const city = req.body.address.city;
    const postcode = req.body.address.postcode;
    const country = req.body.address.country;
    const password = bcrypt.hashSync(req.body.password, 5);
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const validation_result = validationResult(req);
    const errors = validationResult(req);
    const errorArray = errors.array();
    const value = await utils.checkEmailAvailability(email);
    if (value) {
        return res.status(400).json({ message:"Email already exists"});
    }
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errorArray[0].msg});
    } else {
        try {          
            result = await utils.addUser(firstname,lastname,email,phonenumber,street,city,postcode,country,password);
            res.sendStatus(201);           
        } catch (error) {
            res.sendStatus(500);
        }
    }
})
module.exports = router;