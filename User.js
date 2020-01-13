const database = require('./dbmanag');

const User = {
  async readPending(req, res) {
    try {
      const readPendingQuery = 'SELECT nome,cognome,data_scadenza FROM cliente JOIN r2 ON cliente.cod_fis=r2.cliente_2 ORDER BY data_scadenza LIMIT 10';
      const { rows } = await database.query(readPendingQuery);
      return res.send({ rows });
    } catch (error) {
      return res.send(error);
    }
  },
  async readAll(req, res) {
    try {
      const readAllQuery = 'SELECT * FROM cliente ';
      const { rows } = await database.query(readAllQuery);
      return res.send({ rows });
    } catch (error) {
      return res.send(error);
    }
  },
  async read(req,res) {
    try {
      const read = "SELECT * FROM cliente WHERE nome = 'ANDREA' AND cognome = 'COSTALONGA' ;";
      const { rows } = await database.query(read);
      return res.send({ rows });
    } catch (error) {
      return res.send(error);
    }
  }
};

module.exports = User;
