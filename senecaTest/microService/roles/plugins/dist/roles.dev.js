"use strict";

var Roles = function Roles(options) {
  this.add({
    service: 'roles',
    cmd: 'ping'
  }, function (msg, res) {
    console.log('>>>>>>>>Roles received!');
    res(null, {
      response: ' micro service roles: reponse, ',
      data: msg.data + ','
    });
  });
};

module.exports = Roles;