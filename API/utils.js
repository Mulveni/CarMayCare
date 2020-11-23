const db = require('./database');
const bcrypt = require('bcryptjs');
const { serializeUser } = require('passport');

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

    getCarServices: (idCars) => {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM services WHERE idCars = ?', idCars).then(results => {
                    if (results.length !== 0) {
                        console.log(results);
                        resolve(results);
                        return;

                    } else {
                        resolve(false);
                        return;
                    }

            }).catch(error => {
                console.log(error);
                reject(error);
            });
        });
    },

    addNewService: (service, idUsers, idCars) => {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM cars WHERE idUsers = ? AND idCars = ?', [idUsers, idCars])
            .then(results => {
                if(results !== 0){
                    db.query("INSERT INTO services(idCars, description, mileAge, motorOilChangeDone, motorOilChangelongLifeOilUsed, airConditioningServiceDone, airConditioningServiceDryer, sparkPlugReplacement, airFilterReplacement, cleanAirReplacement, fuelFilterReplacement, brakeFluidReplacement, gearBoxOilReplacement, powerSteeringOilReplacement, timingBeltReplacement, waterPumpReplacement, dieselParticulateFilterReplacement, additionalInformation) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    [service.idCars, service.description, service.mileAge, service.motorOilChange.done, service.motorOilChange.longLifeOilUsed, 
                        service.airConditioningService.done, service.airConditioningService.dryer, service.additionalServices.sparkPlugReplacement, 
                        service.additionalServices.airFilterReplacement, service.additionalServices.cleanAirReplacement, 
                        service.additionalServices.fuelFilterReplacement, service.additionalServices.brakeFluidReplacement, 
                        service.additionalServices.gearBoxOilReplacement, service.additionalServices.powerSteeringOilReplacement, 
                        service.additionalServices.timingBeltReplacement, service.additionalServices.waterPumpReplacement, 
                        service.additionalServices.dieselParticulateFilterReplacement, service.additionalInformation])
                    .then(results => {
                        console.log(results);
                        resolve(results);

                    }).catch(error => {
                        console.log(error);
                        reject(error);
                    });

                } else {
                    console.log("No results found");
                    resolve(false);
                }
            }).catch(error => {
                console.log(error);
                reject(error);
            })


        });
    },

    getService: (idCars, idServices) => {
        return new Promise(function(resolve, reject) {
            db.query('SELECT * FROM services WHERE idCars = ? AND idServices = ?', [idCars, idServices]).then(results => {
                if (results.length !== 0) {
                    console.log(results);
                    resolve(results);
                } else {
                    resolve(false);
                }
            }).catch(error => {
                console.log(error);
                reject(error);
            });
        });
    },

    editService: (idUsers, idCars, idServices, service) => {
        return new Promise(function(resolve, rejetct) {

            db.query('SELECT * FROM cars WHERE idUsers = ? AND idCars = ?', [idUsers, idCars])
            .then(results => {
                if (results.length !== 0){

                    db.query('SELECT * FROM services WHERE idCars = ? AND idServices = ?', [idCars, idServices])
                    .then(results => {
                        if (results !== 0){

                            db.query('UPDATE services SET description = ?, mileage = ?, motorOilChangeDone = ?, motorOilChangelongLifeOilUsed = ?, airConditioningServiceDone = ?, airConditioningServiceDryer = ?, sparkPlugReplacement = ?, airFilterReplacement = ?, cleanAirReplacement = ?, fuelFilterReplacement = ?, brakeFluidReplacement = ?, gearBoxOilReplacement = ?, powerSteeringOilReplacement = ?, timingBeltReplacement = ?, waterPumpReplacement = ?, dieselParticulateFilterReplacement = ?, additionalInformation = ? WHERE idCars = ? AND idServices = ?',
                            [service.description, service.mileAge, service.motorOilChange.done, service.motorOilChange.longLifeOilUsed, 
                                service.airConditioningService.done, service.airConditioningService.dryer, service.additionalServices.sparkPlugReplacement,
                                service.additionalServices.airFilterReplacement, service.additionalServices.cleanAirReplacement, 
                                service.additionalServices.fuelFilterReplacement, service.additionalServices.brakeFluidReplacement , 
                                service.additionalServices.gearBoxOilReplacement , service.additionalServices.powerSteeringOilReplacement, 
                                service.additionalServices.timingBeltReplacement , service.additionalServices.waterPumpReplacement, 
                                service.additionalServices.dieselParticulateFilterReplacement, service.additionalInformation, idCars, idServices])
                                .then(results => {

                                    console.log(results);
                                    resolve(results);
                                }).catch (error => {

                                    console.log(error);
                                    reject(error);
                                });
                        } else {

                            resolve(false);
                        }
                    }).catch(error => {

                        console.log(error);
                        resolve(error);
                    });
                } else {

                    resolve(false);
                }
                
            }).catch(error => {
                
                console.log(error);
                reject(error);
            });
        });
    },

    deleteService: (idCars, idServices) => {
        return new Promise(function(resolve, reject) {
            db.query('DELETE FROM services WHERE idCars = ? AND idServices = ?', [idCars, idServices]).then(results => {
                console.log("Results are: ");
                console.log(results);
                resolve(results);

            }).catch(error => {
                console.log(error);
                reject(error);
            });
        });
    }

}

module.exports = utils;