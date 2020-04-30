var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');

var serialController = require('./controller/serial');

var app = express();

app.use('*', cors({
  origin: '*',
  allowedHeaders: '*',
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE']
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

function onlyLocalRequestsFilter(req, res, next) {
  const LOCAL_REMOTE_ADDRESS = ['::1', '::ffff:127.0.0.1'];
  if (LOCAL_REMOTE_ADDRESS.indexOf(req.connection.remoteAddress) !== -1) {
    next();
  } else {
    res.send(401);
  }
}

app.use('/onity', onlyLocalRequestsFilter, express.static(path.join(__dirname, '..', 'public')));
app.use('/api/serial', serialController);

app.get('/', function (req, res) {
  res.redirect('/onity');
});

app.get('/favicon.ico', function (req, res) {
  res.send(null);
});


module.exports = app;
