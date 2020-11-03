const express = require('express');
const app = express();
require('dotenv').config();
port = process.env.API_PORT;
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const utils = require('./utils');
const db = require('./database');
let server = null;

// API DOCS
const swaggerUi = require('swagger-ui-express');
const openApiDocumentation = require('./ServiceManual.v1.json');

// Controllers
const registerController = require('./controllers/register');
const loginController = require('./controllers/login');
const userController = require('./controllers/user');
const carsController = require('./controllers/cars');
const servicesController = require('./controllers/services');

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy, ExtractJwt = require('passport-jwt').ExtractJwt;
const BasicStrategy = require('passport-http').BasicStrategy;
const jwtSecret = require('./jwt-secret.json');

// Passport Basic Strategy for checking user login
passport.use(new BasicStrategy(async (username, password, done) => {
    try {
        let user;
        try {
            user = await utils.checkUserLogin(username, password);
        } catch (error) {
            return done("error");
        }
        if (user === false) {
            return done(null, false, { message: "HTTP Basic username or password not found" });
        } else {
            return done(null, user);
        }
    } catch (error) {
        return done("error");
    }
}));

// JWT options
let options = {}
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = jwtSecret.secret;

// Passport Jwt Strategy for checking if token is valid
passport.use(new JwtStrategy(options, function (jwt_payload, done) {
    const now = Date.now() / 1000;
    if (jwt_payload.exp > now) {
        done(null, jwt_payload.user);
    }
    else {
        done(null, false);
    }
}));

// Endpoints
app.use('/register', registerController);
app.use('/login', passport.authenticate('basic', { session: false }), loginController);
app.use('/user', passport.authenticate('jwt', { session: false }), userController);
app.use('/cars', passport.authenticate('jwt', { session: false }), carsController);
app.use('/services', passport.authenticate('jwt', { session: false }), servicesController);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

app.get('/', (req, res) => {
    res.send('Car Service Manual API');
});

module.exports = {
    close: function () {
        server.close();
        console.log("Server closed.");
    },
    start: function (mode) {
        let databaseName = 'servicemanual';
        if (mode == "test") {
            databaseName = 'servicemanual-test';
        }
        db.init(databaseName).then(result => {
            server = app.listen(port, () => {
                console.log(`Listening on http://localhost:${port}\n`);
            });
        })
            .catch(error => {
                console.log("DB init error");
                console.log(error);
            })
    }
}