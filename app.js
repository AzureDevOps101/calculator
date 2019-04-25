const express = require('express');
const app = express();

app.use(express.static('public'));
app.use('/', require('./api/routes'));

module.exports = app;