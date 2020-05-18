const fs = require('fs');
const pg = require('pg');
const express = require('express');
const app = express();
const helmet = require('helmet');
const opn = require('opn');
const User = require('./User');
var config = require('./config');
const bodyParser = require("body-parser");
const pool = new pg.Pool(config);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
app.use('/favicon.ico', express.static('/public/images/favicon.ico'));
app.use('/', express.static(__dirname + '/public'));

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
    res.setHeader('Access-Control-Allow-Origin', '*');
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
    res.setHeader('Access-Control-Allow-Origin', '*');
    const date = new Date();
    pool.query("SELECT * FROM ricerca_guide WHERE date = $1 ", [date], function(err, result) {
        if (err) {
            console.log(err.message)
            res.status(500).send(err.message)
        } else {
            res.send(result)
        }
    });
});

//Get the amount of people for license
app.get('/getPatNum', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    pool.query("SELECT r1.patente_1 AS patente, COUNT(*) AS numero FROM cliente AS c JOIN R1 on c.cod_fis=r1.cliente_1 GROUP BY r1.patente_1 ORDER BY r1.patente_1", function(err, result) {
        if (err) {
            console.log(err.message)
            res.status(500).send(err.message)
        } else {
            res.send(result)
            
        }
    });
});

// Search users
app.get('/search_user', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
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
    pool.query("SELECT * FROM cliente WHERE (nome=$1::varchar OR $1::varchar IS NULL)" +
        " AND (cognome=$2::varchar OR $2::varchar IS NULL) AND (data_nascita=$3::date OR" +
        " $3::DATE is null) AND (cod_fis=$4::varchar OR $4::varchar IS NULL)", [request["nome"], request["cognome"], request["dn"], request["cf"]],
        function(err, result) {
            if (err) {
                console.error(err)
            }
            res.json(result);
        });
});

//Inserimento Utente
app.post('/user_add', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
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

    if (req.body.nome1 == null || req.body.cognome1 == null || req.body.cf1.length != 16 ||
        req.body.dn1 == null || req.body.cf1 == null || req.body.patente == null || req.body.ln1 == null || req.body.telefono1 == null) {
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
        pool.query("INSERT INTO cliente (cod_fis, nome, cognome, data_nascita, data_iscrizione, luogo_nascita, telefono, e_mail)" +
            " VALUES ($1::varchar, $2::varchar, $3::varchar, $4::date, $5::date, $6::varchar, $7::varchar, $8::varchar)", [request["cf"], request["nome"], request["cognome"], request["dn"], request["di"], request["ln"], request["telefono"], request["email"]],
            function(err, result) {
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

//Inserimento Guide
app.post('/guide', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const request = {
        "cod_fis":null,
        "date": null,
        "time": null,
        "patente": null,
        "durata": null,
        "istruttore": null
    };
    const costo_mezzora = 20; //quasy dato query 3
    if (req.body.cod_fis=="" || req.body.patente == "" || req.body.dt == "" || req.body.istruttore == "") {
        res.status(500).send('Dato Obbligatorio Mancante!');
    } else {
        console.log(req.body);
        request["date"] = req.body.dt.substring(0, 10);
        request["cod_fis"] = req.body.cod_fis.toUpperCase();
        request["time"] = req.body.dt.substr(11) + ":00";
        request["patente"] = req.body.patente.toUpperCase(); //dato query 6
        request["durata"] = req.body.durata.toUpperCase(); //dato query 4
        request["istruttore"] = req.body.istruttore.toUpperCase(); //dato query 7
        console.log(request)
        pool.query("INSERT INTO guida VALUES ($1::date, $2::time, $3::float, $4::float, $5::varchar, $6::varchar, $7::varchar)", [new Date(request["date"]), request["time"], costo_mezzora * request["durata"], request["durata"] * 30, request["cod_fis"], request["patente"], request["istruttore"]], function(err) {
                    if (err) {
                        console.log(err)
                        res.status(500).send(err.message)
                    } else
                        res.status(200).send('Guida Inserita!')
            });
    }

});

//Ricerca Guide
app.get('/g_search', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const request = {
        "nome": null,
        "cognome": null,
        "data": null
    };
    if (req.query.nome1 != "") request["nome"] = req.query.nome.toUpperCase();
    if (req.query.cognome1 != "") request["cognome"] = req.query.cognome.toUpperCase();
    if (req.query.data != null && req.query.data != "") request["data"] = req.query.data.toUpperCase();
    console.log(request)
    pool.query("SELECT * FROM ricerca_guide WHERE (name= $1  AND surname = $2 ) OR date = $3", [request["nome"], request["cognome"], request["data"]],
        function(err, result) {
            if (err) {
                console.log(err)
                res.status(500).send(err.message)
            } else
                res.json(result)
        });
});

//Richiesta Acconti
app.get('/acconti', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const request = {
        "nome": null,
        "cognome": null,
        "cf": null,
    }
    
    if (req.query.nome2 != null) request["nome"] = req.query.nome2.toUpperCase();
    if (req.query.cognome2 != null) request["cognome"] = req.query.cognome2.toUpperCase();
    if (req.query.cf2 != null) request["cf"] = req.query.cf2.toUpperCase();
    pool.query("SELECT * FROM CLIENTE JOIN R1 ON cliente.cod_fis = r1.cliente_1 JOIN PATENTE ON r1.patente_1 = patente.nome_p" +
        " WHERE (cliente.nome= $1 OR $1 IS NULL) AND (cliente.cognome = $2 OR $2='')  AND ( cliente.cod_fis= $3 OR $3='')", [request["nome"], request["cognome"], request["cf"]],
        function(err, result) {
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
    res.setHeader('Access-Control-Allow-Origin', '*');
    request = {
        "cod_fis": null,
        "patente": null,
        "acc1_new": null,
        "acc2_new": null
    }
    console.log("sono qui");
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

//Inserimento Esami
app.post('/esami', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const request = {
        "codfis": null,
        "patente": null,
        "tipo": null,
        "date": null,
        "time": null,
    };
    if (req.body.codfis == "" || req.body.patente == "" || req.body.tipo == "" || req.body.dt == "") {
        res.status(500).send('Dato Obbligatorio Mancante!');
    } else {
        request["codfis"] = req.body.codfis.toUpperCase();
        request["tipo"] = req.body.tipo.toLowerCase();
        request["date"] = req.body.dt.substring(0, 10);
        request["time"] = req.body.dt.substr(11) + ":00";
        request["patente"] = req.body.patente.toUpperCase(); //dato query 6
        console.log(request["date"], request["time"])
        var domande = [];
        var i = 0;
        var n = 0;
        if (request["tipo"] == "teorico") {
            n = 20;
        }
        for (i = 0; i < n; i++) {
            domande[i] = Math.floor(Math.random() * 60 + 1);
            var j = 0;
            for (j = 0; j < i; j++) {
                if (domande[j] == domande[i]) {
                    i--;
                    break;
                }
            }
        }
        //INSERT INTO esame VALUES (DEFAULT, 'teorico', '10/03/21', 'B', '69EADDC7840A1D9E')
        pool.query("INSERT INTO esame VALUES (DEFAULT, $1::varchar, $2::date, $3::varchar, $4::varchar) RETURNING id", [request["tipo"], new Date(request["date"]), request["patente"], request["codfis"]], function(err, result) {
            if (err) {
                console.log(err)
                res.status(500).send(err.message)
            } else {
                var esameId = result.rows[0].id;
                var insert = "INSERT INTO r8 VALUES";
                var stringQuery = "";
                var j = 0;
                for (j = 0; j < n; j++) {
                    var rispostaNum = Math.floor(Math.random() * 10 + 1);
                    var rispostaString;
                    if (rispostaNum > 5) rispostaString = "true";
                    else rispostaString = "false";
                    stringQuery = stringQuery + insert + " (" + (rispostaString == "true") + ", " + domande[j] + ", " + esameId + "); ";
                }
                pool.query(stringQuery, function(err, result) {
                    if (err) {
                        console.log(err)
                        res.status(500).send(err.message)
                    } else {
                        res.status(200).send('Esame Inserito!')
                    }
                });
            }
        });
    }

});


//Ricerca Esami
app.get('/e_search', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const request = {
        "codfis": null,
        "patente": null,
        "data": null,
        "tipo": null
    };
    console.log(req.query)
    if (req.query.codfis != "") request["codfis"] = req.query.codfis.toUpperCase();
    if (req.query.patente != "" && req.query.patente != null && req.query.patente != "null") request["patente"] = req.query.patente.toUpperCase();
    if (req.query.data != null && req.query.data != "") request["data"] = req.query.data.toUpperCase();
    if (req.query.tipo != "" && req.query.tipo != null && req.query.tipo != "null") request["tipo"] = req.query.tipo.toLowerCase();
    console.log(request)
    pool.query("SELECT c.nome AS name, c.cognome AS surname, e.tipo AS type, e.data_e AS date, e.patente AS license," +
        " e.id AS idesame, c.cod_fis AS cod_fis FROM esame AS e JOIN cliente AS c ON c.cod_fis = e.cliente WHERE (e.cliente = $1 OR $1 IS NULL)" +
        " AND (e.tipo = $2 OR $2 IS NULL) AND (e.patente = $3 OR $3 IS NULL) AND (e.data_e = $4 OR $4 IS NULL)", [request["codfis"], request["tipo"], request["patente"], request["data"]],
        function(err, result) {
            if (err) {
                console.log(err)
                res.status(500).send(err.message)
            } else
                res.json(result)
        });
});


//Mostra domande
app.get('/domande', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const request = {
        "esame": null
    };
    if (req.query.id == null || req.query.id == "") {
        res.status(500).send('Dato Obbligatorio Mancante!');
    } else {
        request["esame"] = req.query.id;

        pool.query("SELECT d.testo AS text, d.risposta AS answer, r8.risposta_data AS canswer FROM domanda AS d JOIN r8 ON r8.domanda_8 = d.id_domanda WHERE r8.esame_8 = $1", [request["esame"]], function(err, result) {
            if (err) {
                console.log(err)
                res.status(500).send(err.message)
            } else
                res.json(result)
        });
    }
});


app.listen(8000, function() {
    opn("http://localhost:8000");
    console.log('Server listening on port 8000!');
});