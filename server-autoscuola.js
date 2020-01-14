const fs = require('fs');
const pg = require('pg');
const express = require('express');
const app = express();
const User = require('./User');
const bodyParser = require("body-parser");

//Database access token
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

// Carica index.html sul server
const fileHTML = fs.readFileSync('public/index.html');
app.get('/', function(req, res) {
    res.end(fileHTML);
});

// Lists next expiring driving licenses
app.get('/getNextExpirations', User.readPending);

// Lists all guests
app.get('/readall', User.readAll);

// Search users
app.get('/search', function(req, res) {
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
    console.log(req.query)
    pool.query("SELECT * FROM cliente WHERE (nome=$1::varchar OR $1::varchar IS NULL) AND (cognome=$2::varchar OR $2::varchar IS NULL) AND (data_nascita=$3::date OR $3::DATE is null) AND (cod_fis=$4::char OR $4::char IS NULL)", [request["nome"], request["cognome"], request["dn"], request["cf"]], function(err, result) {
        if (err) {
            console.error(err)
        }
        res.json(result);
    });
});

//Inserimento Utente
app.post('/ins', function(req, res) {
    const request = {
        "nome": null,
        "cognome": null,
        "dn": null,
        "cf": null,
        "ln": null,
        "di": new Date().toDateString(),
        "telefono": null,
        "email": null,
    };
    if (req.body.nome1 == null || req.body.cognome1 == null || req.body.dn1 == null || req.body.cf1 == null || req.body.ln1 == null || req.body.telefono1 == null) {
        res.status(500).send('Dato Obbligatorio Mancante!');
    }
    if (req.body.nome1 != "") request["nome"] = req.body.nome1.toUpperCase();
    if (req.body.cognome1 != "") request["cognome"] = req.body.cognome1.toUpperCase();
    if (req.body.cf1.length != 16) res.status(500).send('Codice Fiscale non valido!');
    else request["cf"] = req.body.cf1.toUpperCase();
    request["dn"] = req.body.dn1.toUpperCase();
    request["ln"] = req.body.ln1.toUpperCase();
    request["telefono"] = req.body.telefono1.toUpperCase();
    request["email"] = req.body.email1.toUpperCase();
    console.log(req.body)
    pool.query("INSERT INTO cliente (cod_fis, nome, cognome, data_nascita, data_iscrizione, luogo_nascita, telefono, e_mail) VALUES ($1::varchar, $2::varchar, $3::varchar, $4::date, $5::date, $6::varchar, $7::varchar, $8::varchar)", [request["cf"], request["nome"], request["cognome"], request["dn"], request["di"], request["ln"], request["telefono"], request["email"]], function(err, result) {
        if (err) {
            console.log(err)
            res.status(500).send(err)
        } else
            res.status(200).send('Utente Inserito!')
    });
});

app.listen(8000, function() {
    console.log('Server listening on port 8000!');
});