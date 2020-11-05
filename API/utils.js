const db = require('./database');
const bcrypt = require('bcryptjs');

const utils = {
    checkUserLogin: (username, password) => {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM users').then(results => {
                for (let i = 0; i < results.length; i++) {
                    if (username === results[i].email && bcrypt.compareSync(password, results[i].password) == true) {
                        resolve(results[i]);
                        return;
                    }
                }
                resolve(false);
            }).catch(error => {
                reject(error);
            });
        });
    },

    addUser: (userInfo) => {
        return new Promise(function (resolve, reject) {
            db.query("INSERT INTO users(firstname, lastname, email, phonenumber, street, city, postcode, country, password) VALUES(?,?,?,?,?,?,?,?,?)"),
            [userInfo.firstname, 
            userInfo.lastname, 
            userInfo.email, 
            userInfo.phonenumber, 
            userInfo.address.street, 
            userInfo.address.city, 
            userInfo.address.postcode, 
            userInfo.address.country, 
            userInfo.password].then(results =>{
            resolve(results[i]);

            }).catch(error =>{
                reject(error);
            });
        });
    },
    checkEmailAvailability: (email) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * AS total FROM users WHERE email = ?', [email], function (error, results, fields) {
                if(!error){
                    console.log("EMAIL COUNT : "+results[0].total);
                    return resolve(results[0].total > 0);
                } else {
                    return reject(new Error('Database error!!'));
                }
            })
         })
}
}  
module.exports = utils;