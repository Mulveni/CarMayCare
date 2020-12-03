const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');

const expect = chai.expect;
const assert = require('assert').strict;
const apiUrl = 'http://localhost:3000';

const testemail = "testemail@testemail.fi";
const testpassword = "test123";

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

        // Fix response message
        /*
        it('Should fail with phonenumber in wrong format', async () => {
            const testUser = createTestUser(testemail, "0000000", testpassword);
            await chai.request(apiUrl)
                .post('/register')
                .send(testUser)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(400);
                    //expect(response.text).to.equal('{"message":"message here"}');
                }).catch(error => {
                    expect.fail(error);
                });
        });
        */

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

    let testJwt = null;

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
                }).catch(error => {
                    expect.fail(error);
                });
        });

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