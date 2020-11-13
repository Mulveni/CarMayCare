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

    addNewService: (idCars, description, mileAge, motorOilChangeDone, motorOilChangelongLifeOilUsed, airConditioningServiceDone, airConditioningServiceDryer, sparkPlugReplacement, airFilterReplacement, cleanAirReplacement, fuelFilterReplacement, brakeFluidReplacement, gearBoxOilReplacement, powerSteeringOilReplacement, timingBeltReplacement, waterPumpReplacement, dieselParticulateFilterReplacement, additionalInformation) => {
        return new Promise(function (resolve, reject) {
            db.query("INSERT INTO services(idCars, description, mileAge, motorOilChangeDone, motorOilChangelongLifeOilUsed, airConditioningServiceDone, airConditioningServiceDryer, sparkPlugReplacement, airFilterReplacement, cleanAirReplacement, fuelFilterReplacement, brakeFluidReplacement, gearBoxOilReplacement, powerSteeringOilReplacement, timingBeltReplacement, waterPumpReplacement, dieselParticulateFilterReplacement, additionalInformation) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [idCars, description, mileAge, motorOilChangeDone, motorOilChangelongLifeOilUsed, airConditioningServiceDone, airConditioningServiceDryer, sparkPlugReplacement, airFilterReplacement, cleanAirReplacement, fuelFilterReplacement, brakeFluidReplacement, gearBoxOilReplacement, powerSteeringOilReplacement, timingBeltReplacement, waterPumpReplacement, dieselParticulateFilterReplacement, additionalInformation])
            .then(results => {
                console.log(results);
                resolve(results);

            }).catch(error => {
                console.log(error);
                reject(error);
            });

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

    editService: (idCars, idServices, service) => {
        return new Promise(function(resolve, reject) {
            db.query('SELECT * FROM services WHERE idCars = ? AND idServices = ?', [idCars, idServices]).then(results => {
                if (results.length !== 0){
                    if (service.motorOilChangeDone === null){
                        service.motorOilChangeDone = results[0].motorOilChangeDone;
                    }
                    if (service.motorOilChangelongLifeOilUsed === null){
                        service.motorOilChangelongLifeOilUsed = results[0].motorOilChangelongLifeOilUsed;
                    }
                    if (results.airConditioningServiceDone === null){
                        service.airConditioningServiceDone = results[0].airConditioningServiceDone;
                    }
                    if (results.airConditioningServiceDryer === null){
                        service.airConditioningServiceDryer = results[0].airConditioningServiceDryer;
                    }
                    if (results.sparkPlugReplacement === null){
                        service.sparkPlugReplacement = results[0].sparkPlugReplacement;
                    }
                    if (results.airFilterReplacement === null){
                        service.airFilterReplacement = results[0].airFilterReplacement;
                    }
                    if (results.cleanAirReplacement === null){
                        service.cleanAirReplacement = results[0].cleanAirReplacement;
                    }
                    if (results.fuelFilterReplacement === null){
                        service.fuelFilterReplacement = results[0].fuelFilterReplacement;
                    }
                    if (results.brakeFluidReplacement === null){
                        service.brakeFluidReplacement = results[0].brakeFluidReplacement;
                    }
                    if (results.gearBoxOilReplacement === null){
                        service.gearBoxOilReplacement = results[0].gearBoxOilReplacement;
                    }
                    if (results.powerSteeringOilReplacement === null){
                        service.powerSteeringOilReplacement = results[0].powerSteeringOilReplacement;
                    }
                    if (results.timingBeltReplacement === null){
                        service.timingBeltReplacement = results[0].timingBeltReplacement;
                    }
                    if (results.waterPumpReplacement === null){
                        service.waterPumpReplacement = results[0].waterPumpReplacement;
                    }
                    if (results.dieselParticulateFilterReplacement === null){
                        service.dieselParticulateFilterReplacement = results[0].dieselParticulateFilterReplacement;
                    }
                    if (results.additionalInformation === null){
                        service.additionalInformation = results[0].additionalInformation;
                    }
                    
                    resolve(db.query('UPDATE services SET motorOilChangeDone = ?, motorOilChangelongLifeOilUsed = ?, airConditioningServiceDone = ?, airConditioningServiceDryer = ?, sparkPlugReplacement = ?, airFilterReplacement = ?, cleanAirReplacement = ?, fuelFilterReplacement = ?, brakeFluidReplacement = ?, gearBoxOilReplacement = ?, powerSteeringOilReplacement = ?, timingBeltReplacement = ?, waterPumpReplacement = ?, dieselParticulateFilterReplacement = ?, additionalInformation = ? WHERE idCars = ? AND idServices = ?',
                    [service.motorOilChangeDone, service.motorOilChangelongLifeOilUsed, service.airConditioningServiceDone, service.airConditioningServiceDryer, service.sparkPlugReplacement, service.airFilterReplacement, service.cleanAirReplacement, service.fuelFilterReplacement, service.brakeFluidReplacement , service.gearBoxOilReplacement , service.powerSteeringOilReplacement, service.timingBeltReplacement , service.waterPumpReplacement, service.dieselParticulateFilterReplacement, service.additionalInformation, idCars, idServices]));
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