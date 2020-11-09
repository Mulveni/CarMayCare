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

    addUser: (firstname,lastname,email,phonenumber,street,city,postcode,country,password) => {
        return new Promise(function (resolve, reject) {
            db.query("INSERT INTO users(firstname, lastname, email, phonenumber, street, city, postcode, country, password) VALUES(?,?,?,?,?,?,?,?,?)",
            [firstname,lastname,email,phonenumber,street,city,postcode,country,password]).then(results =>{
            resolve(results);

            }).catch(error =>{
                reject(error);
            });
        });
    },
    checkEmailAvailability: (email) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE email = ?',[email]).then(results => {
                console.log(results.length);
               // console.log("EMAIL COUNT : "+results[0].length);
                resolve(results.length);
                if(results.length > 0){ 
                resolve (true);
                }
                else{
                resolve (false);
                }                 
            }).catch(error =>{
                console.log("error:"+ error);
                reject(error);
                
            });
         })
}
}  
module.exports = utils;