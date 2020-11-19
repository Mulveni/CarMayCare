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

    getCars: (userId) => {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM cars WHERE idUsers = ?', userId).then(results => {

                if (results.length !== 0) {
                    resolve(results);
                    return;
                }
                else {
                    resolve(false);
                    return;
                }

            }).catch(error => {
                reject(error);
            });
        });
    },

    getCar: (userId, carId) => {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM cars WHERE idUsers = ? AND idCars = ?', [userId, carId]).then(results => {

                if (results.length !== 0) {
                    resolve(results);
                    return;
                }
                else {
                    resolve(false);
                    return;
                }

            }).catch(error => {
                reject(error);
            });
        });
    },

    deleteCar: (userId, carId) => {
        return new Promise(function (resolve, reject) {
            db.query('DELETE FROM cars WHERE idCars = ? AND idUsers = ?', [carId, userId]).then(results => {

                resolve(results);

            }).catch(error => {
                console.log(error);
                reject(error);
            });
        });
    },

    postCar: (car) => {
        return new Promise(function (resolve, reject) {
            db.query('INSERT INTO cars (brand, model, yearModel, powerType, engineSize, licenseNumber, idUsers) VALUES(?,?,?,?,?,?,?)',
                [car.brand, car.model, car.yearModel, car.powerType, car.engineSize, car.licenseNumber, car.userId]).then(results => {
                    console.log(results);
                    resolve(results);
                }).catch(error => {
                    reject(error);
                });
        });
    },

    updateCar: (userId, carId, car) => {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM cars WHERE idCars = ? AND idUsers = ?', [carId, userId]).then(result => {

                if (result.length !== 0) {
                    if (car.brand === null) {
                        car.brand = result[0].brand;
                    }
                    if (car.model === null) {
                        car.model = result[0].model;
                    }
                    if (car.yearModel === null) {
                        car.yearModel = result[0].yearModel;
                    }
                    if (car.powerType === null) {
                        car.powerType = result[0].powerType;
                    }
                    if (car.engineSize === null) {
                        car.engineSize = result[0].engineSize;
                    }
                    if (car.licenseNumber === null) {
                        car.licenseNumber = result[0].licenseNumber;
                    }

                    resolve(db.query('UPDATE cars SET brand = ?, model= ?, yearModel = ?, powerType = ?, engineSize = ?, licenseNumber = ? WHERE idCars = ? AND idUsers = ?',
                        [car.brand, car.model, car.yearModel, car.powerType, car.engineSize, car.licenseNumber, carId, userId]));
                }

                else {
                    resolve(false);
                }

            }).catch(error => {
                reject(error);
            });
        });
    },

    postNote: (userId, carId, note) => {
        return new Promise(function (resolve, reject) {

            db.query('SELECT * FROM cars WHERE idUsers = ? AND idCars = ?', [userId, carId]).then(results => {

                if (results.length !== 0) {
                    resolve(db.query('INSERT INTO notes (note, idCars) VALUES(?,?)', [note, carId]));
                    return;
                }
                else {
                    resolve(false);
                    return;
                }

            }).catch(error => {
                reject(error);
            });
        });
    },

    getNotes: (userId, carId) => {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM cars WHERE idUsers = ? AND idCars = ?', [userId, carId]).then(results => {

                if (results.length !== 0) {
                    resolve(db.query('SELECT * FROM notes WHERE idCars = ?', carId));
                    return;
                }
                else {
                    resolve(false);
                    return;
                }

            }).catch(error => {
                reject(error);
            });
        });
    },

    updateNote: (userId, noteId, note) => {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM notes WHERE idNotes = ?', noteId).then(results => {
                if (results.length !== 0) {

                    if (db.query('SELECT * FROM cars WHERE idUsers = ? AND idCars = ?', [userId, results[0].idCars]).length !== 0) {
                        resolve(db.query('UPDATE notes SET note = ? WHERE idNotes = ?', [note, noteId]));
                        return;
                    }

                    else {
                        resolve(false);
                        return;
                    }

                }
                else {
                    resolve(false);
                    return;
                }

            }).catch(error => {
                reject(error);
            });
        });
    },

    deleteNote: (userId, noteId) => {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM notes WHERE idNotes = ?', noteId).then(results => {
                if (results.length !== 0) {

                    if (db.query('SELECT * FROM cars WHERE idUsers = ? AND idCars = ?', [userId, results[0].idCars]).length !== 0) {
                        resolve(db.query('DELETE FROM notes WHERE idCars = ? AND idNotes = ?', [results[0].idCars, noteId]));
                        return;
                    }

                    else {
                        resolve(false);
                        return;
                    }

                }
                else {
                    resolve(false);
                    return;
                }

            }).catch(error => {
                reject(error);
            });
        });
    },

    addUser: (firstname, lastname, email, phonenumber, street, city, postcode, country, password) => {
        return new Promise(function (resolve, reject) {
            db.query("INSERT INTO users(firstname, lastname, email, phonenumber, street, city, postcode, country, password) VALUES(?,?,?,?,?,?,?,?,?)",
                [firstname, lastname, email, phonenumber, street, city, postcode, country, password]).then(results => {
                    resolve(results);


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
    },
    updateUser: (updateUser, userId) => {
        return new Promise(function (resolve, reject) {
            db.query('UPDATE users SET firstName = ?, lastName = ?, email = ?, phonenumber = ?, street = ?, city = ?, postcode = ?, country = ? WHERE idUsers = ?',
                [updateUser.firstname, updateUser.lastname, updateUser.email, updateUser.phonenumber, updateUser.address.street, updateUser.address.city, updateUser.address.postcode, updateUser.address.country, userId]).then(results => {
                    resolve(results);
                }).catch(error => {
                    reject(error);
                });
        });
    },
    updatePassword: (password, userId) => {
        return new Promise(function (resolve, reject) {
            db.query('UPDATE users SET password = ? WHERE idUsers = ?',
                [password, userId]).then(results => {
                    resolve(results);
                }).catch(error => {
                    reject(error);
                });
        });
    },
    checkEmailAvailability: (email) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE email = ?', [email]).then(results => {
                if (results.length > 0) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            }).catch(error => {
                reject(error);

            });
        })
    },
    findUserIdByEmail: (email) => {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM users WHERE email = ?', [email]).then(results => {
                if (results.length < 1) {
                    resolve(false);
                } else {
                    resolve(results[0].idUsers);
                }
            }).catch(error => {
                reject(error);
            });
        });
    },
    findEmailByUserId: (userId) => {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM users WHERE idUsers = ?', [userId]).then(results => {
                if (results.length < 1) {
                    resolve(false);
                } else {
                    resolve(results[0].email);
                }
            }).catch(error => {
                reject(error);
            });
        });
    },
    addForgotPassword: (link, expireAt, userId) => {
        return new Promise(function (resolve, reject) {
            db.query('INSERT INTO forgotpasswords (link, expireAt, idUsers) VALUES(?, ?, ?)',
                [link, expireAt, userId]).then(results => {
                    resolve(results);
                }).catch(error => {
                    reject(error);
                });
        });
    },
    checkIfForgotPasswordLinkExists: (userId, d) => {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM forgotpasswords WHERE idUsers = ?', [userId]).then(results => {
                if (results.length < 1) {
                    resolve(false);
                } else {
                    if (parseInt(results[0].expireAt, 10) < d) {
                        db.query('DELETE FROM forgotpasswords WHERE idUsers = ?', [userId]).then(results2 => {
                            resolve(false);
                        }).catch(error2 => {
                            reject(error2);
                        });

                    } else {
                        resolve(results);
                    }


                }
            }).catch(error => {
                reject(error);
            });
        });
    },
    findForgotPasswordLink: (link, d) => {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM forgotpasswords WHERE link = ?', [link]).then(results => {
                if (results.length < 1) {
                    resolve(false);
                } else {
                    if (parseInt(results[0].expireAt, 10) < d) {
                        db.query('DELETE FROM forgotpasswords WHERE link = ?', [link]).then(results2 => {
                            resolve(false);
                        }).catch(error2 => {
                            reject(error2);
                        });

                    } else {
                        resolve(results);
                    }
                }
            }).catch(error => {
                reject(error);
            });
        });
    },
    findUserIdByLink: (link) => {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM forgotpasswords WHERE link = ?', [link]).then(results => {
                if (results.length < 1) {
                    resolve(false);
                } else {
                    resolve(results[0].idUsers);
                }
            }).catch(error => {
                reject(error);
            });
        });
    },
    removedForgotPasswordLink: (userId) => {
        return new Promise(function (resolve, reject) {
            db.query('DELETE FROM forgotpasswords WHERE idUsers = ?', [userId]).then(results => {
                resolve(results);
            }).catch(error => {
                reject(error);
            });
        });
    },
    forgotPasswordCleaningRun: () => {
        const d = new Date().getTime();
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM forgotpasswords').then(results => {
                for (let i = 0; i < results.length; i++) {
                    if (parseInt(results[i].expireAt, 10) < d) {
                        db.query('DELETE FROM forgotpasswords WHERE idForgotpasswords = ?', [results[i].idForgotpasswords]).then(results2 => {
                            console.log("Removed expired forgot password link.");
                        }).catch(error2 => {
                            reject(error2);
                        });

                    }
                }
                resolve(true);
            }).catch(error => {
                reject(error);
            });
        });
    }
}
module.exports = utils;