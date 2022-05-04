"use strict";

var seneca = require('seneca')();

var Express = require('express');

var adapter = require('seneca-web-adapter-express');

var SenecaWeb = require('seneca-web');

var parseBody = require('body-parser');

var Config = require('./config/config');

var Router = Express.Router;
var context = new Router();
var senecaWebConfig = {
  context: context,
  adapter: adapter,
  options: {
    parseBody: false
  }
};
var app = Express();
app.use(parseBody.json());
app.use(context);
app.listen(3000); // 微服务

seneca.use(SenecaWeb, senecaWebConfig).use('./plugins/test').use('./plugins/ui').client({
  type: Config.Protocol,
  pin: "service:".concat(Config.ServiceList.users.name),
  port: Config.ServiceList.users.port
}).client({
  type: Config.Protocol,
  pin: "service:".concat(Config.ServiceList.roles.name),
  port: Config.ServiceList.roles.port
}).client({
  type: Config.Protocol,
  pin: "service:".concat(Config.ServiceList.articles.name),
  port: Config.ServiceList.articles.port
}).client({
  type: Config.Protocol,
  pin: "service:".concat(Config.ServiceList.store.name),
  port: Config.ServiceList.store.port
});