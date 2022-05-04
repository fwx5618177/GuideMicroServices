"use strict";

var seneca = require('seneca')();

var users = require('./plugins/users');

seneca.use(users).listen({
  port: 3001,
  type: 'http'
});