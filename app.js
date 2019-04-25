const express = require('express');
const app = express();

app.use(express.static('public'));
var routes = require("./api/routes");
routes(app);

module.exports = app;