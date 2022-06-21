"use strict";

var Keycloak = require('keycloak-connect');

var session = require('express-session');

var setupAuth = function setupAuth(app, routes) {
  var memoryStore = new session.MemoryStore();
  var keycloak = new Keycloak({
    store: memoryStore
  });
  app.use(session({
    secret: '<RANDOM GENERATED TOKEN>',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
  }));
  app.use(keycloak.middleware());
  routes.forEach(function (r) {
    if (r.auth) {
      app.use(r.url, keycloak.protect(), function (req, res, next) {
        next();
      });
    }
  });
};

module.exports = setupAuth;