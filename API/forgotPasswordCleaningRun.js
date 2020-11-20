const utils = require('./utils');

setInterval(() => {
    console.log("STARTING - Cleaning run for forgot passwords");
    utils.forgotPasswordCleaningRun();

    // Run every 2 hours
}, 1000 * 60 * 60 * 2);