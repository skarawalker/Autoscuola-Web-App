const fs = require('fs');
const pg = require('pg');
const express = require('express');
const app = express();
const User = require('./User');
const bodyParser = require("body-parser");

//Database access token
/*const config = {
    user: 'starkiller',
    database: 'autoscuola',
    password: '7574hryq',
    port: 5432
};*/

const config = {
    host: 'manny.db.elephantsql.com',
    user: 'kjcwgesn',
    database: 'kjcwgesn',
    password: 'FNwUBZh-r4U841PCweB3c3qx_kh3B5Is',
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

//List all instructors
app.get('/getInstructor', User.readIst);

//Get all licenses
app.get('/getLicense', function(req, res) {
    pool.query("SELECT * FROM patente", function(err, result) {
        if (err) {
            res.status(500).send(err.message)
        } else {
            res.send(result)
        }
    });
});

//Get todays driving lessons
app.get('/getGuideOggi', function(req, res) {
    const date = new Date()
    pool.query("SELECT * FROM guida JOIN cliente ON guida.cliente_g = cliente.cod_fis WHERE guida.data_guida = $1 ", [date], function(err, result) {
        if (err) {
            console.log(err.message)
            res.status(500).send(err.message)
        } else {
            res.send(result)
        }
    });
});
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
    pool.query("SELECT * FROM cliente WHERE (nome=$1::varchar OR $1::varchar IS NULL) AND (cognome=$2::varchar OR $2::varchar IS NULL) AND (data_nascita=$3::date OR $3::DATE is null) AND (cod_fis=$4::char OR $4::char IS NULL)", [request["nome"], request["cognome"], request["dn"], request["cf"]], function(err, result) {
        if (err) {
            console.error(err)
        }
        res.json(result);
    });
});

//Inserimento Guide
app.post('/guide', function(req, res) {
    const request = {
        "nome": null,
        "cognome": null,
        "dn": null,
        "date": null,
        "time": null,
        "patente": null,
        "durata": null,
        "istruttore": null
    };
    var cf = null;
    const costo_mezzora = 20; //quasy dato query 3
    if (req.body.nome == "" || req.body.cognome == "" || req.body.patente == "" || req.body.dt == "" || req.body.istruttore == "") {
        res.status(500).send('Dato Obbligatorio Mancante!');
    } else {
        request["nome"] = req.body.nome.toUpperCase();
        request["cognome"] = req.body.cognome.toUpperCase();
        if (req.body.dn != null && req.body.dn != "") request["dn"] = req.body.dn.toUpperCase();
        request["date"] = req.body.dt.substring(0, 10);
        request["time"] = req.body.dt.substr(11) + ":00";
        request["patente"] = req.body.patente.toUpperCase(); //dato query 6
        request["durata"] = req.body.durata.toUpperCase(); //dato query 4
        request["istruttore"] = req.body.istruttore.toUpperCase(); //dato query 7
        console.log(request["date"], request["time"])
        pool.query("SELECT cliente.cod_fis FROM cliente JOIN r1 ON cliente.cod_fis=r1.cliente_1 WHERE cliente.nome=$1::varchar AND cliente.cognome=$2 AND (cliente.data_nascita=$3::date OR $3::varchar IS NULL ) AND r1.patente_1=$4::varchar", [request["nome"], request["cognome"], request["dn"], request["patente"]], function(err, result) {
            if (err) {
                console.log(err.message)
                res.status(500).send(err.message)
            } else {
                cf = result.rows[0].cod_fis; //dato query 5
                console.log(cf)
                pool.query("INSERT INTO guida VALUES ($1::date, $2::time, $3::float, $4::float, $5::varchar, $6::varchar, $7::varchar)", [new Date(request["date"]), request["time"], costo_mezzora * request["durata"], request["durata"] * 30, cf, request["patente"], request["istruttore"]], function(err) {
                    if (err) {
                        console.log(err)
                        res.status(500).send(err.message)
                    } else
                        res.status(200).send('Guida Inserita!')
                });
            }
        });
    }

});

//Ricerca Guide
app.get('/g_search', function(req, res) {
    const request = {
        "nome": null,
        "cognome": null,
        "data": null
    };
    if (req.query.nome1 != "") request["nome"] = req.query.nome.toUpperCase();
    if (req.query.cognome1 != "") request["cognome"] = req.query.cognome.toUpperCase();
    if (req.query.data != null && req.query.data != "") request["data"] = req.query.data.toUpperCase();
    console.log(request)
    pool.query("SELECT c.nome AS name, c.cognome AS surname, i.nome AS i_name, i.cognome AS i_surname, g.data_guida AS date, g.ora_guida AS time FROM guida AS g JOIN istruttore AS i ON g.istruttore = i.cf JOIN cliente as c ON c.cod_fis = g.cliente_g WHERE (c.nome= $1  AND c.cognome = $2 ) OR g.data_guida = $3", [request["nome"], request["cognome"], request["data"]], function(err, result) {
        if (err) {
            console.log(err)
            res.status(500).send(err.message)
        } else
            res.json(result)
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
        "patente": null
    };

    if (req.body.nome1 == null || req.body.cognome1 == null || req.body.cf1.length != 16 || req.body.dn1 == null || req.body.cf1 == null || req.body.patente == null || req.body.ln1 == null || req.body.telefono1 == null) {
        res.status(500).send('Dato Obbligatorio Mancante!');
    } else {
        if (req.body.nome1 != "") request["nome"] = req.body.nome1.toUpperCase();
        if (req.body.cognome1 != "") request["cognome"] = req.body.cognome1.toUpperCase();
        request["cf"] = req.body.cf1.toUpperCase();
        request["dn"] = req.body.dn1.toUpperCase();
        request["ln"] = req.body.ln1.toUpperCase();
        request["telefono"] = req.body.telefono1.toUpperCase();
        request["email"] = req.body.email1.toUpperCase();
        request["patente"] = req.body.patente.toUpperCase();
        console.log(request["patente"])
        pool.query("INSERT INTO cliente (cod_fis, nome, cognome, data_nascita, data_iscrizione, luogo_nascita, telefono, e_mail) VALUES ($1::varchar, $2::varchar, $3::varchar, $4::date, $5::date, $6::varchar, $7::varchar, $8::varchar)", [request["cf"], request["nome"], request["cognome"], request["dn"], request["di"], request["ln"], request["telefono"], request["email"]], function(err, result) {
            pool.query("INSERT INTO r1 VALUES (0,0, $1::varchar, $2::varchar)", [request["patente"], request["cf"]], function(err1, res1) {
                if (err) {
                    res.status(500).send(err.message)
                } else if (err1) {
                    res.status(500).send(err1.message)
                } else
                    res.status(200).send('Utente inserito con successo!')
            });

        });
    }
});

//Richiesta Acconti
app.get('/acconti', function(req, res) {
    const request = {
        "nome": null,
        "cognome": null,
        "cf": null,
    }
    if (req.query.nome2 != null) request["nome"] = req.query.nome2.toUpperCase();
    if (req.query.cognome2 != null) request["cognome"] = req.query.cognome2.toUpperCase();
    if (req.query.cf2 != null) request["cf"] = req.query.cf2.toUpperCase();
    pool.query("SELECT * FROM CLIENTE JOIN R1 ON cliente.cod_fis = r1.cliente_1 JOIN PATENTE ON r1.patente_1 = patente.nome_p WHERE (cliente.nome= $1 OR $1 IS NULL) AND (cliente.cognome = $2 OR $2='')  AND ( cliente.cod_fis= $3 OR $3='')", [request["nome"], request["cognome"], request["cf"]], function(err, result) {
        if (err) {
            console.log(err.message)
            res.status(500).send(err.message)
        } else {
            res.json(result)
        }
    })
});

//Modifica Acconti
app.post("/acc_mod", function(req, res) {
    request = {
        "cod_fis": null,
        "patente": null,
        "acc1_new": null,
        "acc2_new": null
    }
    if (req.body.acc1 == null || req.body.acc1 == '') request["acc1_new"] = req.body.acconto1
    else request["acc1_new"] = req.body.acc1
    if (req.body.acc2 == null || req.body.acc2 == '') request["acc2_new"] = req.body.acconto2
    else request["acc2_new"] = req.body.acc2
    request["cod_fis"] = req.body.cod_fis
    request["patente"] = req.body.patente_1
    console.log(request)
    pool.query("UPDATE r1  SET acconto1 = $1::float, acconto2= $2::float WHERE patente_1 = $3::varchar AND cliente_1 = $4::varchar", [request["acc1_new"], request["acc2_new"], request["patente"], request["cod_fis"]], function(err, result) {
        if (err) {
            console.log(err.message)
            res.status(500).send(err.message)
        } else {
            res.status(200).send('Acconto aggiornato!')
        }
    });
});

app.listen(8000, function() {
    console.log('Server listening on port 8000!');
});