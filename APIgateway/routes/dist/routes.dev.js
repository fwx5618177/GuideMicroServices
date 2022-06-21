"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ROUTES = [{
  url: '/free',
  auth: false,
  creditCheck: true,
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 5
  },
  proxy: {
    target: "https://www.baidu.com",
    changeOrigin: true,
    pathRewrite: _defineProperty({}, "^/free", '')
  }
}, {
  url: '/premium',
  auth: true,
  creditCheck: true,
  proxy: {
    target: "https://www.baidu.com",
    changeOrigin: true,
    pathRewrite: _defineProperty({}, "^/premium", '')
  }
}, {
  url: '/credit',
  auth: false,
  creditCheck: true,
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 5
  },
  proxy: {
    target: "https://www.baidu.com",
    changeOrigin: true,
    pathRewrite: _defineProperty({}, "^/free", '')
  }
}];
module.exports = ROUTES;