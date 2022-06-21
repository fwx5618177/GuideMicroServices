"use strict";

var _require = require('http-proxy-middleware'),
    createProxyMiddleware = _require.createProxyMiddleware;

var setupProxies = function setupProxies(app, routes) {
  routes.forEach(function (r) {
    app.use(r.url, createProxyMiddleware(r.proxy));
  });
};

module.exports = setupProxies;