const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');

const expect = chai.expect;
const assert = require('assert').strict;
const apiUrl = 'http://localhost:3000';

const testemail = "testemail@testemail.fi";
const testpassword = "test123";
let testJwt = null;
let carId = null;
let serviceId = null;

// "testemail@testemail.fi"

function createTestUser(email, phonenumber, password) {
    const testUser = {
        firstname: "testfirstname",
        lastname: "testlastname",
        email: email,
        phonenumber: phonenumber,
        address: {
            street: "testaddress 1",
            city: "Oulu",
            postcode: "90100",
            country: "FI"
        },
        password: password
    }
    return testUser;
}

function createEditedUser(email) {
    const editedUser = {
        firstname: "testfirstname",
        lastname: "testlastname",
        email: email,
        phonenumber: "0401234567",
        address: {
            street: "testaddress 1",
            city: "Oulu",
            postcode: "90100",
            country: "FI"
        }
    }
    return editedUser;
}

function createTestCar(brand) {
    const testCar = {
        brand: brand,
        model: "testModel",
        yearModel: "2001",
        powerType: "testPowerType",
        engineSize: "testEngine",
        licenseNumber: "xxx-111"
    }
    return testCar;
}

function createTestService(description) {
    const testService = {
        description: description,
        mileAge: "1000km",
        motorOilChange: {
            done: true,
            longLifeOilUsed: true
        },
        airConditioningService: {
            done: true,
            dryer: true
        },
        additionalServices: {
            sparkPlugReplacement: true,
            airFilterReplacement: true,
            cleanAirReplacement: true,
            fuelFilterReplacement: true,
            brakeFluidReplacement: true,
            gearBoxOilReplacement: true,
            powerSteeringOilReplacement: true,
            timingBeltReplacement: true,
            waterPumpReplacement: true,
            dieselParticulateFilterReplacement: true
        },
        additionalInformation: "test"
    }
    return testService;
}

describe('Car Service Manual API operations', () => {

    before(() => {
        server.start("test");
    });

    after(() => {
        server.close();

    });



    describe('Register user', () => {
        it('Should fail with missing information', async () => {
            await chai.request(apiUrl)
                .post('/register')
                .send()
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(400);
                }).catch(error => {
                    expect.fail(error);
                });
        });

        it('Should fail with username already in use', async () => {
            const testUser = createTestUser("test@test.fi", "0401234567", "test123");
            await chai.request(apiUrl)
                .post('/register')
                .send(testUser)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(400);
                    expect(response.text).to.equal('{"message":"E-mail already in use"}');
                }).catch(error => {
                    expect.fail(error);
                });
        });

        it('Should fail with email in wrong format', async () => {
            const testUser = createTestUser("testemail.fi", "0401234567", "test123");
            await chai.request(apiUrl)
                .post('/register')
                .send(testUser)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(400);
                    expect(response.text).to.equal('{"message":"Email cannot be left blank"}');
                }).catch(error => {
                    expect.fail(error);
                });
        });

        it('Should fail with password being too short', async () => {
            const testUser = createTestUser(testemail, "+358401234567", "pw");
            await chai.request(apiUrl)
                .post('/register')
                .send(testUser)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(400);
                    expect(response.text).to.equal('{"message":"Password must be at least 5 chars long"}');
                }).catch(error => {
                    expect.fail(error);
                });
        });

        it('Should create new user', async () => {
            const testUser = createTestUser(testemail, "+358401234567", testpassword);
            await chai.request(apiUrl)
                .post('/register')
                .send(testUser)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(201);
                }).catch(error => {
                    expect.fail(error);
                });
        });


    });



    describe('Login user', () => {
        it('Should fail with wrong username', async () => {
            await chai.request(apiUrl)
                .post('/login')
                .auth("testwrong", testpassword)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(401);
                }).catch(error => {
                    expect.fail(error);
                });
        });

        it('Should fail with wrong password', async () => {
            await chai.request(apiUrl)
                .post('/login')
                .auth(testemail, "testwrong")
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(401);
                }).catch(error => {
                    expect.fail(error);
                });
        });

        it('Should fail login with missing auth', async () => {
            await chai.request(apiUrl)
                .post('/login')
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(401);
                }).catch(error => {
                    expect.fail(error)
                });
        });

        it('Should login user', async () => {
            await chai.request(apiUrl)
                .post('/login')
                .auth(testemail, testpassword)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                    expect(response.body).to.have.property('token');
                    testJwt = response.body.token;
                }).catch(error => {
                    expect.fail(error);
                });
        });

    });




    describe('User info', () => {
        it('Should get user info', async () => {
            await chai.request(apiUrl)
                .get('/user')
                .set('Authorization', `Bearer ${testJwt}`)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                    expect(response.body).to.have.property('id');
                    expect(response.body).to.have.property('firstname');
                    expect(response.body).to.have.property('lastname');
                    expect(response.body).to.have.property('email');
                    expect(response.body).to.have.property('phonenumber');
                    expect(response.body.address).to.have.property('street');
                    expect(response.body.address).to.have.property('city');
                    expect(response.body.address).to.have.property('postcode');
                    expect(response.body.address).to.have.property('country');
                    expect(response.body).to.have.property('registerDate');
                    expect(response.body).to.have.property('password');
                }).catch(error => {
                    expect.fail(error);
                });
        });

    });



    describe('Edit user info', () => {
        it('Should fail to edit user info with missing data', async () => {
            await chai.request(apiUrl)
                .put('/user')
                .set('Authorization', `Bearer ${testJwt}`)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(400);
                    expect(response.text).to.equal('{"message":"Missing field or wrong names in model."}');
                }).catch(error => {
                    expect.fail(error);
                });
        });

        it('Should fail to edit user info with email in wrong format', async () => {
            const editUser = createEditedUser("test");
            await chai.request(apiUrl)
                .put('/user')
                .set('Authorization', `Bearer ${testJwt}`)
                .send(editUser)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(400);
                    expect(response.text).to.equal('{"message":"Invalid email."}');
                }).catch(error => {
                    expect.fail(error);
                });
        });

        it('Should fail to edit user info with email already in use', async () => {
            const editUser = createEditedUser("test@test.fi");
            await chai.request(apiUrl)
                .put('/user')
                .set('Authorization', `Bearer ${testJwt}`)
                .send(editUser)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(400);
                    expect(response.text).to.equal('{"message":"Email already in use."}');
                }).catch(error => {
                    expect.fail(error);
                });
        });

        it('Should edit user info', async () => {
            const editUser = createEditedUser("testedited@test.fi");
            await chai.request(apiUrl)
                .put('/user')
                .set('Authorization', `Bearer ${testJwt}`)
                .send(editUser)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(201);
                }).catch(error => {
                    expect.fail(error);
                });
        });

    });



    describe('Create new car', () => {
        it('Should fail with empty body', async () => {
            await chai.request(apiUrl)
                .post('/cars')
                .set('Authorization', `Bearer ${testJwt}`)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(400);
                    expect(response.text).to.equal('{"message":"Missing brand from body"}');
                }).catch(error => {
                    expect.fail(error);
                });
        });

        it('Should create new car', async () => {
            const testCar = createTestCar("testBrand");
            await chai.request(apiUrl)
                .post('/cars')
                .set('Authorization', `Bearer ${testJwt}`)
                .send(testCar)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(201);
                }).catch(error => {
                    expect.fail(error);
                });
        });
    });



    describe('Get cars', () => {
        it('Should get all cars of user', async () => {
            await chai.request(apiUrl)
                .get('/cars')
                .set('Authorization', `Bearer ${testJwt}`)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                    expect(response.body[0]).to.have.property('idCars');
                    expect(response.body[0]).to.have.property('brand');
                    expect(response.body[0]).to.have.property('model');
                    expect(response.body[0]).to.have.property('yearModel');
                    expect(response.body[0]).to.have.property('powerType');
                    expect(response.body[0]).to.have.property('licenseNumber');
                    carId = response.body[0].idCars;
                }).catch(error => {
                    expect.fail(error);
                });
        });

        it('Should get car with id', async () => {
            await chai.request(apiUrl)
                .get(`/cars/${carId}`)
                .set('Authorization', `Bearer ${testJwt}`)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                    expect(response.body[0]).to.have.property('idCars');
                    expect(response.body[0]).to.have.property('brand');
                    expect(response.body[0]).to.have.property('model');
                    expect(response.body[0]).to.have.property('yearModel');
                    expect(response.body[0]).to.have.property('powerType');
                    expect(response.body[0]).to.have.property('licenseNumber');
                }).catch(error => {
                    expect.fail(error);
                });
        });

        it('Should not get car info that does not belong to user', async () => {
            await chai.request(apiUrl)
                .get('/cars/37')
                .set('Authorization', `Bearer ${testJwt}`)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                    expect(response.text).to.equal('{"message":"No results with given id"}');
                }).catch(error => {
                    expect.fail(error);
                });
        });

        it('Should not get car info that does not exists', async () => {
            await chai.request(apiUrl)
                .get('/cars/doesntexists')
                .set('Authorization', `Bearer ${testJwt}`)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                    expect(response.text).to.equal('{"message":"No results with given id"}');
                }).catch(error => {
                    expect.fail(error);
                });
        });

    });


    describe('Edit car', () => {
        it('Should get car with id', async () => {
            const testCar = createTestCar("editedBrand");
            await chai.request(apiUrl)
                .put(`/cars/${carId}`)
                .set('Authorization', `Bearer ${testJwt}`)
                .send(testCar)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(201);
                }).catch(error => {
                    expect.fail(error);
                });
        });

        it('Should get car with id and should match edited fields', async () => {
            await chai.request(apiUrl)
                .get(`/cars/${carId}`)
                .set('Authorization', `Bearer ${testJwt}`)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                    expect(response.body[0].brand).to.equal('editedBrand')
                }).catch(error => {
                    expect.fail(error);
                });
        });

    });



    describe('Create new service', () => {
        it('Should fail with empty body', async () => {
            await chai.request(apiUrl)
                .post(`/services/${carId}`)
                .set('Authorization', `Bearer ${testJwt}`)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(400);
                    expect(response.text).to.equal('{"message":"Mileage is missing, please enter the mileage"}');
                }).catch(error => {
                    expect.fail(error);
                });
        });

        it('Should create new service', async () => {
            const testService = createTestService("test");
            await chai.request(apiUrl)
                .post(`/services/${carId}`)
                .set('Authorization', `Bearer ${testJwt}`)
                .send(testService)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(201);
                }).catch(error => {
                    expect.fail(error);
                });
        });

    });



    describe('Get services', () => {
        it('Should fail with id that does not exists', async () => {
            await chai.request(apiUrl)
                .get(`/services/wrongId`)
                .set('Authorization', `Bearer ${testJwt}`)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(404);
                    expect(response.text).to.equal(`{"message":"No services found for the car. Either services are not there or you don't have proper authorization!"}`);
                }).catch(error => {
                    expect.fail(error);
                });
        });

        it('Should get all services of users car', async () => {
            await chai.request(apiUrl)
                .get(`/services/${carId}`)
                .set('Authorization', `Bearer ${testJwt}`)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                    expect(response.body[0]).to.have.property('idServices');
                    expect(response.body[0]).to.have.property('description');
                    expect(response.body[0]).to.have.property('dateOfService');
                    expect(response.body[0]).to.have.property('mileAge');
                    expect(response.body[0].motorOilChange).to.have.property('done');
                    expect(response.body[0].motorOilChange).to.have.property('longLifeOilUsed');
                    expect(response.body[0].airConditioningService).to.have.property('done');
                    expect(response.body[0].airConditioningService).to.have.property('dryer');
                    expect(response.body[0].additionalServices).to.have.property('sparkPlugReplacement');
                    expect(response.body[0].additionalServices).to.have.property('airFilterReplacement');
                    expect(response.body[0].additionalServices).to.have.property('cleanAirReplacement');
                    expect(response.body[0].additionalServices).to.have.property('fuelFilterReplacement');
                    expect(response.body[0].additionalServices).to.have.property('brakeFluidReplacement');
                    expect(response.body[0].additionalServices).to.have.property('gearBoxOilReplacement');
                    expect(response.body[0].additionalServices).to.have.property('powerSteeringOilReplacement');
                    expect(response.body[0].additionalServices).to.have.property('timingBeltReplacement');
                    expect(response.body[0].additionalServices).to.have.property('waterPumpReplacement');
                    expect(response.body[0].additionalServices).to.have.property('dieselParticulateFilterReplacement');
                    expect(response.body[0]).to.have.property('additionalInformation');
                    serviceId = response.body[0].idServices;
                }).catch(error => {
                    expect.fail(error);
                });
        });

        it('Should get service with id', async () => {
            await chai.request(apiUrl)
                .get(`/services/${carId}/${serviceId}`)
                .set('Authorization', `Bearer ${testJwt}`)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                    expect(response.body[0]).to.have.property('idServices');
                    expect(response.body[0]).to.have.property('description');
                    expect(response.body[0]).to.have.property('dateOfService');
                    expect(response.body[0]).to.have.property('mileAge');
                    expect(response.body[0].motorOilChange).to.have.property('done');
                    expect(response.body[0].motorOilChange).to.have.property('longLifeOilUsed');
                    expect(response.body[0].airConditioningService).to.have.property('done');
                    expect(response.body[0].airConditioningService).to.have.property('dryer');
                    expect(response.body[0].additionalServices).to.have.property('sparkPlugReplacement');
                    expect(response.body[0].additionalServices).to.have.property('airFilterReplacement');
                    expect(response.body[0].additionalServices).to.have.property('cleanAirReplacement');
                    expect(response.body[0].additionalServices).to.have.property('fuelFilterReplacement');
                    expect(response.body[0].additionalServices).to.have.property('brakeFluidReplacement');
                    expect(response.body[0].additionalServices).to.have.property('gearBoxOilReplacement');
                    expect(response.body[0].additionalServices).to.have.property('powerSteeringOilReplacement');
                    expect(response.body[0].additionalServices).to.have.property('timingBeltReplacement');
                    expect(response.body[0].additionalServices).to.have.property('waterPumpReplacement');
                    expect(response.body[0].additionalServices).to.have.property('dieselParticulateFilterReplacement');
                    expect(response.body[0]).to.have.property('additionalInformation');
                }).catch(error => {
                    expect.fail(error);
                });
        });
    });



    describe('Edit service', () => {
        it('Should edit service', async () => {
            const testService = createTestService("editedDescription");
            await chai.request(apiUrl)
                .put(`/services/${carId}/${serviceId}`)
                .set('Authorization', `Bearer ${testJwt}`)
                .send(testService)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(201);
                }).catch(error => {
                    expect.fail(error);
                });
        });

        it('Should get service with id and should match edited fields', async () => {
            await chai.request(apiUrl)
                .get(`/services/${carId}/${serviceId}`)
                .set('Authorization', `Bearer ${testJwt}`)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                    expect(response.body[0].description).to.equal('editedDescription')
                }).catch(error => {
                    expect.fail(error);
                });
        });
    });



    describe('Delete service', () => {
        it('Should delete service', async () => {
            await chai.request(apiUrl)
                .delete(`/services/${carId}/${serviceId}`)
                .set('Authorization', `Bearer ${testJwt}`)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(201);
                }).catch(error => {
                    expect.fail(error);
                });
        });
    });



    describe('Delete car', () => {
        it('Should delete car', async () => {
            await chai.request(apiUrl)
                .delete(`/cars/${carId}`)
                .set('Authorization', `Bearer ${testJwt}`)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(201);
                }).catch(error => {
                    expect.fail(error);
                });
        });
    });



    describe('Delete user', () => {
        it('Should delete user', async () => {
            await chai.request(apiUrl)
                .delete('/user')
                .set('Authorization', `Bearer ${testJwt}`)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(201);
                }).catch(error => {
                    expect.fail(error);
                });
        });
    });

});