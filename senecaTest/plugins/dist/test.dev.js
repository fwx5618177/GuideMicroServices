"use strict";

/**
 * 测试各个微服务
 */
var Config = require('../config/config');

var ServiceList = Config.ServiceList;
/**
 * 测试各个微服务
 */

var test = function test(options) {
  var _this = this;

  this.add('service:test, path:ping', function (msg, res) {
    var service = msg.args.params.service;
    var data = msg.args.query.data;

    if (!ServiceList[service]) {
      res(new Error('service is not access:' + service + ', ' + ServiceList[service]), null);
      return;
    }

    _this.act("service:".concat(service, ", cmd:ping"), {
      service: service,
      data: data
    }, function (err, data, meta) {
      if (err) console.error(err);
      console.log(data);
      return res(err, data, meta);
    });
  });
  this.add('init:test', function (msg, res) {
    _this.act('role:web', {
      routes: {
        prefix: '/test',
        pin: 'service:test,path:*',
        map: {
          ping: {
            GET: true,
            suffix: '/:service'
          }
        }
      }
    }, res);
  });
};

module.exports = test;