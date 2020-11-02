let mysql = require("mysql");
let pool = null;

const db = {
    init: (databaseName) => {
        return new Promise((resolve, reject) => {
            try {
                pool = mysql.createPool({
                    connectionLimit: 10,
                    host: process.env.DATABASE_HOST,
                    user: process.env.DATABASE_USER,
                    password: process.env.DATABASE_PW,
                    database: databaseName
                });
                resolve();
            } catch (error) {
                console.log('Mysql pool create failed');
                console.log(error);
                reject(error)
            }
        });
    },
    query: (query, ...parameters) => {
        let promise = new Promise(function (resolve, reject) {
            pool.query(query, ...parameters, (error, results, fields) => {
                if (error) {
                    reject(error)
                };

                resolve(results);
            })
        });

        return promise;
    },
    closeAll: () => {
        pool.end();
    }
};

module.exports = db;