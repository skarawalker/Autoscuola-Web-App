const http = require('http');
const fs = require('fs');
var pg = require('pg');
var removeRoute = require('express-remove-route');
const express = require('express');
const app = express();
const User = require('./User'); 
var bodyParser = require("body-parser"); 
var router = express.Router();
//

const config = {
  user: 'starkiller',
  database: 'autoscuola',
  password: '7574hryq',
  port: 5432                  //Default port, change it if needed
};

const pool = new pg.Pool(config);
//
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json()); 
app.use('/favicon.ico', express.static('/public/images/favicon.ico'));
app.use(express.static(__dirname + '/'));
app.get('/pending.json', User.readPending);


const fileHTML = fs.readFileSync('index.html');

app.get('/index.html', function (req, res) {
  res.end(fileHTML);
});

app.post("/", function(req,res){
  console.log("Ricevuto una richiesta POST");
  // contenuto della richiesta
  var request ={
    "nome":null,
    "cognome":null,
    "dn":null,
    "cf":null
  };
  console.log(req.body);
  if(req.body.nome!="") request["nome"]=req.body.nome.toUpperCase();
  if(req.body.cognome!="") request["cognome"]=req.body.cognome.toUpperCase();
  if(req.body.dn!="") request["dn"]=req.body.dn.toUpperCase();
  if(req.body.cf!="") request["cf"]=req.body.cf.toUpperCase();
  pool.query("SELECT * FROM cliente WHERE nome=$1::varchar OR cognome=$2::varchar OR data_nascita=$3::date OR cod_fis=$4::char",[request["nome"],request["cognome"],request["dn"],request["cf"]],function(err, result){
    app.get('/temp.json', function (req, res) {
      res.json(result);
    });
  });
  res.end(fs.readFileSync(__dirname+ '/public/client_search.html'))

});

app.listen(8000, function () {
  console.log('Example app listening on port 8000!');
});
