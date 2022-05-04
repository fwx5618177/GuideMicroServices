"use strict";

var Config = function Config() {};

var Protocol = 'http';
var ServiceList = {
  users: {
    name: 'users',
    port: 3001
  },
  roles: {
    name: 'roles',
    port: 3002
  },
  articles: {
    name: 'articles',
    port: 3003
  },
  store: {
    name: 'store',
    port: 3004
  }
};
Config.prototype.Protocol = Protocol;
Config.prototype.ServiceList = ServiceList;
module.exports = new Config();