const express = require('express');
const app = express();
require('dotenv').config();
port = process.env.API_PORT;
const bodyParser = require('body-parser');
app.use(bodyParser.json());

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

// Endpoints
app.use('/register', registerController);
app.use('/login', loginController);
app.use('/user', userController);
app.use('/cars', carsController);
app.use('/services', servicesController);
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