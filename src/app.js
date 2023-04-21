const express = require('express');
const cors = require('cors');
const app = express();

//settings
app.set('port', process.env.PORT || '0.0.0.0');
app.set('host',process.env.HOST || '0.0.0.0');

//Middlewares cors sin opcions
app.use(cors());
app.use(express.json());

//rutes
app.use('/api/test',require('./routes/Test'));

module.exports = app;
