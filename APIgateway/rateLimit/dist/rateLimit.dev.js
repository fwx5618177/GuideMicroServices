"use strict";

var rateLimit = require("express-rate-limit");

var setupRateLimit = function setupRateLimit(app, routes) {
  routes.forEach(function (r) {
    if (r.rateLimit) {
      app.use(r.url, rateLimit(r.rateLimit));
    }
  });
};

module.exports = setupRateLimit;