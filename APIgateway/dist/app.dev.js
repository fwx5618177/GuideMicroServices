"use strict";

var express = require('express');

var path = require('path');

var cookieParser = require('cookie-parser'); // var logger = require('morgan');


var setupLogging = require('./log/log');

var setupProxies = require('./proxy/proxy');

var ROUTES = require('./routes/routes');

var setupAuth = require('./auth/auth');

var setupRateLimit = require('./rateLimit/rateLimit');

var setupCreditCheck = require('./creditCheck/creditCheck'); // var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');


var app = express();
setupLogging(app);
setupRateLimit(app, ROUTES);
setupAuth(app, ROUTES);
setupCreditCheck(app, ROUTES);
setupProxies(app, ROUTES); // app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express["static"](path.join(__dirname, 'public'))); // app.use('/', indexRouter);
// app.use('/users', usersRouter);

module.exports = app;