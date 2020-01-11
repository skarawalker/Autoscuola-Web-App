const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const express = require('express');
const app = express();
const User = require('./User');  

app.use('/favicon.ico', express.static('/public/favicon.ico'));
app.use(express.static(__dirname + '/public'));
app.use(express.static('/home/starkiller/node_modules/jquery/src'));
app.get('/users.json', User.readAll);


const fileHTML = fs.readFileSync('public/index.html');

app.get('/index.html', function (req, res) {
  res.end(fileHTML);
});

app.listen(8000, function () {
  console.log('Example app listening on port 8000!');
});
