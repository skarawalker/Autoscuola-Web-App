const express = require('express');
const User = require('./User');  
const app = express();
const PORT = 8000;
app.get('/users.json', User.readAll);
app.listen(PORT, () => {
});
//<script src="angular.js"></script>
