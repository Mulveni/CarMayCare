const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');

const expect = chai.expect;
const assert = require('assert').strict;
const apiUrl = 'http://localhost:3000';

describe('Car Service Manual API operations', () => {

    before(function () {
        server.start("test");
    });

    after(function () {
        server.close();

    });

});