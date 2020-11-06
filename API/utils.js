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
    getUserInfo: (userId) => {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM users WHERE idUsers = ?', [userId]).then(results => {
                resolve(results[0]);
            }).catch(error => {
                reject(error);
            });
        });
    },
    deleteUser: (userId) => {
        return new Promise(function (resolve, reject) {
            db.query('DELETE FROM users WHERE idUsers = ?', [userId]).then(results => {
                resolve(results);
            }).catch(error => {
                reject(error);
            });
        });
    }
}

module.exports = utils;