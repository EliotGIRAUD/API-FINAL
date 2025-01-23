const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

function sqlQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        pool.getConnection((ConnectionError, Connection) => {
            if (ConnectionError) {
                reject(ConnectionError);
                return;
            }

            Connection.query(query, params, (queryError, Results) => {
                if (queryError) {
                    reject(queryError);
                } else {
                    resolve(Results);
                }
                Connection.release();
            });
        });
    });
}

module.exports = {
    query: sqlQuery,
};
