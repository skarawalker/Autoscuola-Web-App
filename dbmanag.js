const { Pool } = require('pg');
// DB user credentials
//DATABASE_URL = 'postgres://starkiller:74hryq@127.0.0.1:5432/autoscuola';
DATABASE_URL = 'postgres://kjcwgesn:FNwUBZh-r4U841PCweB3c3qx_kh3B5Is@manny.db.elephantsql.com:5432/kjcwgesn'

const pool = new Pool({
    connectionString: DATABASE_URL
});

// a generic query, that executes all queries you send to it
function query(text) {
    return new Promise((resolve, reject) => {
        pool
            .query(text)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                console.error(error)
                reject(err);
            });
    });
}

module.exports = {
    query
};