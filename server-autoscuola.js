const fs = require('fs');
const pg = require('pg');
const express = require('express');
const app = express();
const User = require('./User');
const bodyParser = require("body-parser");

const config = {
  user: 'starkiller',
  database: 'autoscuola',
  password: '7574hryq',
  port: 5432
};

const pool = new pg.Pool(config);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use('/favicon.ico', express.static('/public/images/favicon.ico'));
app.use(express.static(__dirname + '/'));

// Lists next expiring driving licenses
app.get('/getNextExpirations', User.readPending);

// Lists all guests
app.get('/readall', User.readAll);

const fileHTML = fs.readFileSync('public/index.html');

app.get('/', function (req, res) {
  res.end(fileHTML);
});

app.post("/public", function (req, res) {
  res.end(fs.readFileSync(__dirname + '/public/client_search.html'))
});

// Search users
app.get('/search', function (req, res) {
  // contenuto della richiesta
  const request = {
    "nome": null,
    "cognome": null,
    "dn": null,
    "cf": null
  };

  if (req.query.nome == null && req.query.cognome == null && req.query.dn == null && req.query.cf == null) {
    console.warn('Missing paramters') // should throw error?
  }
  
  if (req.query.nome != "") request["nome"] = req.query.nome.toUpperCase();
  if (req.query.cognome != "") request["cognome"] = req.query.cognome.toUpperCase();
  if (req.query.dn != "") request["dn"] = req.query.dn.toUpperCase();
  if (req.query.cf != "") request["cf"] = req.query.cf.toUpperCase();

  pool.query("SELECT * FROM cliente WHERE (nome=$1::varchar OR $1::varchar IS NULL) AND (cognome=$2::varchar OR $2::varchar IS NULL) AND (data_nascita=$3::date OR $3::DATE is null) AND (cod_fis=$4::char OR $4::char IS NULL)", [request["nome"], request["cognome"], request["dn"], request["cf"]], function (err, result) {
    if (err) {
      console.error(err)
    }
    res.json(result);
  });
});

app.listen(8000, function () {
  console.log('Server listening on port 8000!');
});
