"use strict";

var users = function users(options) {
  this.add({
    service: 'users',
    cmd: 'ping'
  }, function (msg, res) {
    console.log('>>>>>>>>Users received!');
    res(null, {
      response: ' micro service users: reponse, ',
      data: msg.data + ','
    });
  });
};

module.exports = users;