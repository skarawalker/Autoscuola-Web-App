const database = require('./dbmanag');

const User = {
  async readAll(req, res) {
    try {
      const readAllQuery = 'SELECT * FROM cliente ORDER BY data_nascita LIMIT 10';
      const { rows } = await database.query(readAllQuery);
      return res.send({ rows });
    } catch (error) {
      return res.send(error);
    }
  }
};

module.exports = User;
