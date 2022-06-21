"use strict";

var morgan = require('morgan');

var setupLogging = function setupLogging(app) {
  app.use(morgan('combined'));
};

module.exports = setupLogging;