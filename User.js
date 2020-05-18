const database = require('./dbmanag');

const User = {
    async readPending(req, res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        try {
            const readPendingQuery = 'SELECT * FROM pat_scadenza LIMIT 10';
            const { rows } = await database.query(readPendingQuery);
            return res.send({ rows });
        } catch (error) {
            return res.send(error);
        }
    },
    async readAll(req, res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        try {
            const readAllQuery = 'SELECT * FROM cliente ORDER BY cognome';
            const { rows } = await database.query(readAllQuery);
            return res.send({ rows });
        } catch (error) {
            return res.send(error);
        }
    },
    async readIst(req, res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        try {
            const readAllQuery = 'SELECT * FROM istruttore';
            const { rows } = await database.query(readAllQuery);
            return res.send({ rows });
        } catch (error) {
            return res.send(error);
        }
    }
};

module.exports = User;