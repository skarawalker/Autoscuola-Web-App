const express = require('express');
// new: import User
const User = require('./User');  
const app = express();
const PORT = 8080;
require('json-response')
// new: route to users, that runs readAll()
app.get('/users', User.readAll(req,res));
app.listen(PORT, () => {
});

//<script src="angular.js"></script>